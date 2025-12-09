import { getUserService } from '~/server/service';
import { hash } from 'bcrypt';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, username, email, password } = body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, username, email, and password are required',
      });
    }

    // Validate password length
    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters',
      });
    }

    const userService = getUserService();

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await userService.createUser({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
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
        statusMessage: 'Username or email already exists',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create user',
    });
  }
});
