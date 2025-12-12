import { UserRepository } from '~/server/repository/user-repository';
import { useDB } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    // Get user ID from route params
    const userId = getRouterParam(event, 'id');

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required',
      });
    }

    const db = useDB();
    const userRepository = new UserRepository(db);

    // Get the current user
    const user = await userRepository.findById(userId);

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      });
    }

    // Toggle the disabled status
    const newDisabledStatus = !user.disabled;

    // Update the user
    await userRepository.update(userId, {
      disabled: newDisabledStatus,
    });

    return {
      success: true,
      message: `User ${newDisabledStatus ? 'disabled' : 'enabled'} successfully`,
      disabled: newDisabledStatus,
    };
  } catch (error: any) {
    console.error('Error toggling user disabled status:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to toggle user disabled status',
    });
  }
});
