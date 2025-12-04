import { UserRepository } from '../../repository/user-repository';
import { UserService } from '../../service/user-service';
import { withErrorHandler } from '../../utils/error-handler';

export default defineEventHandler(
  withErrorHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        message: 'Username and password are required',
      });
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

    // Create session
    await setUserSession(event, {
      user: {
        id: user.id,
        username: user.username,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }, 'Login')
);
