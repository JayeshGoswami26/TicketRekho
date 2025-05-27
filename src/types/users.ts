export interface User {
  id: string;
  name: string;
  contact: string;
  email: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  avatar: string;
}