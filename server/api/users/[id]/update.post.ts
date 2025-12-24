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
    const { name, username, email, password } = body;

    const userService = getUserService();

    // Build update data
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (username !== undefined) {
      if (username.length < 3) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Username must be at least 3 characters',
        });
      }
      updateData.username = username;
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
      const errorMessage = error.message?.toLowerCase() || '';
      if (errorMessage.includes('username')) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Username already exists',
        });
      } else if (errorMessage.includes('email')) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Email already exists',
        });
      } else {
        throw createError({
          statusCode: 409,
          statusMessage: 'A user with these details already exists',
        });
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update user',
    });
  }
});
