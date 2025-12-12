import { UserRepository } from '~/server/repository/user-repository';
import { useDB } from '~/server/utils/db';
import { logger } from '~/server/lib/logger';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      });
    }

    const db = useDB();
    const userRepository = new UserRepository(db);

    // Unlock the user account and reset failed login attempts
    await userRepository.update(id, {
      locked: false,
      failed_login_attempts: 0,
    });

    return {
      success: true,
      message: 'User account unlocked successfully',
    };
  } catch (error: any) {
    logger.error('Error unlocking user', { error: error.message });
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to unlock user account',
    });
  }
});
