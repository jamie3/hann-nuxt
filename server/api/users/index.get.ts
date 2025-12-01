import { getUserService } from '../../service';

export default defineEventHandler(async () => {
  const userService = getUserService();
  const users = await userService.getAllUsers();

  return {
    success: true,
    users,
  };
});
