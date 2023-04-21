export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  avatar: string;
  permissions: Array<RoleType>;
  username: string;
}
