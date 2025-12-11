import { getUserService } from '~/server/service';
import { hash } from 'bcrypt';

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.params?.id;

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required',
      });
    }

    const body = await readBody(event);
    const { name, email, password } = body;

    const userService = getUserService();

    // Build update data
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    // Hash password if provided
    if (password && password.length > 0) {
      if (password.length < 8) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Password must be at least 8 characters',
        });
      }
      updateData.password = await hash(password, 10);
    }

    // Update user
    await userService.updateUser(userId, updateData);

    // Fetch updated user
    const updatedUser = await userService.findUserById(userId);

    if (!updatedUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    return {
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    // Check for unique constraint violations
    if (error.message?.includes('unique') || error.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email already exists',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update user',
    });
  }
});
