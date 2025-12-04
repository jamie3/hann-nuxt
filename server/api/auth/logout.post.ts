import { withErrorHandler } from '../../utils/error-handler';

export default defineEventHandler(
  withErrorHandler(async (event) => {
    // Clear the user session
    await clearUserSession(event);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }, 'Logout')
);
