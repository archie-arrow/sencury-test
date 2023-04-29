export interface UserInterface {
  id: string;
  userName: string;
  email: string;
  password: string;
  givenName?: string;
  familyName?: string;
  userRoles: UserRole[];
}

export enum UserRole {
  User = 'User',
  Manager = 'Manager',
  Admin = 'Admin'
}
