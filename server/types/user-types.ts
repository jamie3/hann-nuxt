export interface User {
  id: string;
  username: string;
  password: string;
  last_login_at: Date | null;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface NewUser {
  username: string;
  password: string;
}

export interface UpdateUser {
  username?: string;
  password?: string;
  last_login_at?: Date | null;
}
