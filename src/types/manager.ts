export type ManagerCategory = 'Event Employee' | 'Theatre Manager' | 'Event Manager' | 'Theatre Employee';
export type ManagerStatus = 'Active' | 'Inactive';

export interface Manager {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: ManagerCategory;
  active: ManagerStatus;
  experience: number;
  avatar: string;
  city: string;
  bio: string;
  skills: string[];
  createdAt: string;
  address: string;
  state: string;
}

export interface ManagerFormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  active: boolean;
  state: string;
  city: string;
  address: string;
  profileImage?: File | null;
}

export interface ModalFormProps {
  onSubmitSuccess?: (data: any) => void;
}