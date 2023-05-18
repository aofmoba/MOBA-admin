export type RoleType = '' | '*' | 'admin' | 'user' | 'guest';
export interface UserState {
  avatar: string;
  permissions: Array<RoleType>;
  username: string;
}
