export interface User {
  id: string;
  username: string;
  password: string;
  name: string | null;
  email: string | null;
  locked: boolean;
  disabled: boolean;
  failed_login_attempts: number;
  last_login_at: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewUser {
  username: string;
  password: string;
  name?: string;
  email?: string;
}

export interface UpdateUser {
  username?: string;
  password?: string;
  name?: string | null;
  email?: string | null;
  locked?: boolean;
  disabled?: boolean;
  failed_login_attempts?: number;
  last_login_at?: string | null;
}
