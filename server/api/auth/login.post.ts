import { UserRepository } from '../../repository/user-repository';
import { UserService } from '../../service/user-service';
import { withErrorHandler } from '../../utils/error-handler';
import { env } from '../../utils/env';
import { rateLimit } from '../../utils/rate-limiter';
import { logger } from '../../lib/logger';

export default defineEventHandler(
  withErrorHandler(async (event) => {
    rateLimit(event, { max: 10, windowMs: 60_000, keyPrefix: 'login' });

    const body = await readBody(event);
    const { username, password, turnstileToken } = body;

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        message: 'Username and password are required',
      });
    }

    // Only check Turnstile if it's enabled
    if (env.NUXT_TURNSTILE_ENABLED) {
      if (!turnstileToken) {
        throw createError({
          statusCode: 422,
          statusMessage: 'Token not provided.',
        });
      }

      // Verify Turnstile token
      const { success } = await verifyTurnstileToken(turnstileToken);

      if (!success) {
        throw createError({
          statusCode: 400,
          message: 'Failed to verify CAPTCHA. Please try again.',
        });
      }
    }

    const db = useDB();
    const userRepository = new UserRepository(db);
    const userService = new UserService(userRepository);

    // Authenticate user
    const user = await userService.authenticateUser(username, password);

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid username or password',
      });
    }

    // Load the user's roles for client-side gating of admin features.
    // user.id is a string (mapped from the DB), but user_role.user_id is an
    // integer column, so coerce it explicitly.
    const roleRows = await db
      .selectFrom('user_role')
      .select('role')
      .where('user_id', '=', parseInt(user.id, 10))
      .execute();
    const roles = roleRows.map((r) => r.role);

    logger.info('User logged in', { userId: user.id, roles });

    // Create session
    await setUserSession(event, {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        roles,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    };
  }, 'Login')
);
