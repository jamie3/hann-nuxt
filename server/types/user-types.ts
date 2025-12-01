export interface User {
  id: string;
  username: string;
  password: string;
  name: string | null;
  locked: boolean;
  disabled: boolean;
  failed_login_attempts: number;
  last_login_at: Date | null;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface NewUser {
  username: string;
  password: string;
  name?: string;
}

export interface UpdateUser {
  username?: string;
  password?: string;
  name?: string | null;
  locked?: boolean;
  disabled?: boolean;
  failed_login_attempts?: number;
  last_login_at?: Date | null;
}
