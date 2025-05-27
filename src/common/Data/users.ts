export type User = {
  id: string;
  name: string;
  contact: string;
  email: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  avatar: string;
};

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    contact: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    registrationDate: '2024-01-15',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '2',
    name: 'Jane Smith',
    contact: '+1 (555) 234-5678',
    email: 'jane.smith@example.com',
    registrationDate: '2024-02-01',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    contact: '+1 (555) 345-6789',
    email: 'michael.j@example.com',
    registrationDate: '2024-02-15',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '4',
    name: 'Emily Davis',
    contact: '+1 (555) 456-7890',
    email: 'emily.davis@example.com',
    registrationDate: '2024-03-03',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '5',
    name: 'Chris Lee',
    contact: '+1 (555) 567-8901',
    email: 'chris.lee@example.com',
    registrationDate: '2024-03-18',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '6',
    name: 'Olivia Brown',
    contact: '+1 (555) 678-9012',
    email: 'olivia.brown@example.com',
    registrationDate: '2024-03-27',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '7',
    name: 'Daniel Wilson',
    contact: '+1 (555) 789-0123',
    email: 'daniel.wilson@example.com',
    registrationDate: '2024-04-04',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '8',
    name: 'Sophia Taylor',
    contact: '+1 (555) 890-1234',
    email: 'sophia.taylor@example.com',
    registrationDate: '2024-04-10',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '9',
    name: 'David Martinez',
    contact: '+1 (555) 901-2345',
    email: 'david.m@example.com',
    registrationDate: '2024-04-21',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '10',
    name: 'Lily Anderson',
    contact: '+1 (555) 012-3456',
    email: 'lily.a@example.com',
    registrationDate: '2024-05-01',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '11',
    name: 'Ethan Thomas',
    contact: '+1 (555) 111-2222',
    email: 'ethan.t@example.com',
    registrationDate: '2024-05-05',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '12',
    name: 'Ava Moore',
    contact: '+1 (555) 222-3333',
    email: 'ava.moore@example.com',
    registrationDate: '2024-05-10',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '13',
    name: 'Logan Jackson',
    contact: '+1 (555) 333-4444',
    email: 'logan.j@example.com',
    registrationDate: '2024-05-14',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '14',
    name: 'Mia White',
    contact: '+1 (555) 444-5555',
    email: 'mia.white@example.com',
    registrationDate: '2024-05-15',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '15',
    name: 'Lucas Harris',
    contact: '+1 (555) 555-6666',
    email: 'lucas.h@example.com',
    registrationDate: '2024-05-16',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '16',
    name: 'Charlotte Martin',
    contact: '+1 (555) 666-7777',
    email: 'charlotte.m@example.com',
    registrationDate: '2024-05-17',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '17',
    name: 'Benjamin Thompson',
    contact: '+1 (555) 777-8888',
    email: 'ben.thompson@example.com',
    registrationDate: '2024-05-18',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '18',
    name: 'Amelia Garcia',
    contact: '+1 (555) 888-9999',
    email: 'amelia.g@example.com',
    registrationDate: '2024-05-19',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '19',
    name: 'Henry Clark',
    contact: '+1 (555) 999-0000',
    email: 'henry.c@example.com',
    registrationDate: '2024-05-20',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '20',
    name: 'Ella Rodriguez',
    contact: '+1 (555) 000-1111',
    email: 'ella.r@example.com',
    registrationDate: '2024-05-21',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '21',
    name: 'Nathan Lewis',
    contact: '+1 (555) 111-3333',
    email: 'nathan.l@example.com',
    registrationDate: '2024-05-22',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '22',
    name: 'Zoe Walker',
    contact: '+1 (555) 222-4444',
    email: 'zoe.w@example.com',
    registrationDate: '2024-05-23',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '23',
    name: 'Jack Hall',
    contact: '+1 (555) 333-5555',
    email: 'jack.h@example.com',
    registrationDate: '2024-05-23',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '24',
    name: 'Aria Allen',
    contact: '+1 (555) 444-6666',
    email: 'aria.a@example.com',
    registrationDate: '2024-05-23',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '25',
    name: 'Leo Young',
    contact: '+1 (555) 555-7777',
    email: 'leo.y@example.com',
    registrationDate: '2024-05-23',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '26',
    name: 'Scarlett King',
    contact: '+1 (555) 666-8888',
    email: 'scarlett.k@example.com',
    registrationDate: '2024-05-23',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '27',
    name: 'Owen Scott',
    contact: '+1 (555) 777-9999',
    email: 'owen.s@example.com',
    registrationDate: '2024-05-23',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '28',
    name: 'Chloe Green',
    contact: '+1 (555) 888-0000',
    email: 'chloe.g@example.com',
    registrationDate: '2024-05-23',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '29',
    name: 'Sebastian Adams',
    contact: '+1 (555) 999-1111',
    email: 'sebastian.a@example.com',
    registrationDate: '2024-05-23',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '30',
    name: 'Grace Nelson',
    contact: '+1 (555) 000-2222',
    email: 'grace.n@example.com',
    registrationDate: '2024-05-23',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];
