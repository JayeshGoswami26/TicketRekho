// import React, { useState, ChangeEvent } from 'react';

// // Define the role and permission types
// type Permission = 'create' | 'edit' | 'delete' | 'view';

// interface Role {
//   id: number;
//   roleName: string;
//   permissions: Permission[];
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   permissions: Permission[];
// }

// // Sample data for roles
// const roles: Role[] = [
//   { id: 1, roleName: 'Admin', permissions: ['create', 'edit', 'delete'] },
//   { id: 2, roleName: 'User', permissions: ['view'] },
// ];

// const permissionsList: Permission[] = ['create', 'edit', 'delete', 'view'];

// // Initial user data
// const initialUsers: User[] = [
//   {
//     id: 1,
//     name: 'John Doe',
//     email: 'john@example.com',
//     role: 'Admin',
//     permissions: ['create', 'edit', 'delete'],
//   },
//   {
//     id: 2,
//     name: 'Jane Doe',
//     email: 'jane@example.com',
//     role: 'User',
//     permissions: ['view'],
//   },
// ];

// const UserManager: React.FC = () => {
//   const [users, setUsers] = useState<User[]>(initialUsers);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [newUser, setNewUser] = useState<User>({
//     id: 0,
//     name: '',
//     email: '',
//     role: '',
//     permissions: [],
//   });

//   // Handle input change for text and email fields
//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setNewUser({ ...newUser, [name]: value });
//   };

//   // Handle role change and update permissions
//   const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const selectedRole = roles.find((role) => role.roleName === e.target.value);
//     if (selectedRole) {
//       setNewUser({
//         ...newUser,
//         role: selectedRole.roleName,
//         permissions: selectedRole.permissions,
//       });
//     }
//   };

//   // Handle form submit for creating a new user
//   const handleSubmit = () => {
//     if (newUser.name && newUser.email && newUser.role) {
//       setUsers([...users, { ...newUser, id: users.length + 1 }]);
//       setNewUser({ id: 0, name: '', email: '', role: '', permissions: [] });
//     }
//   };

//   // Handle editing an existing user
//   const handleEdit = (user: User) => {
//     setSelectedUser(user);
//     setNewUser(user);
//   };

//   // Handle updating a user
//   const handleUpdate = () => {
//     setUsers(
//       users.map((user) => (user.id === selectedUser?.id ? newUser : user)),
//     );
//     setSelectedUser(null);
//     setNewUser({ id: 0, name: '', email: '', role: '', permissions: [] });
//   };

//   // Handle permission toggle for users
//   const handlePermissionToggle = (permission: Permission) => {
//     const updatedPermissions = newUser.permissions.includes(permission)
//       ? newUser.permissions.filter((perm) => perm !== permission)
//       : [...newUser.permissions, permission];
//     setNewUser({ ...newUser, permissions: updatedPermissions });
//   };

//   return (
//     <div>
//       {/* Form for creating or editing a user */}
//       <form>
//         <div className="flex flex-col gap-9">
//           {/* <!-- Contact Form --> */}
//           <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//             <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
//               <h3 className="font-medium text-black dark:text-white">
//                 User Management
//               </h3>
//             </div>
//             <div className="p-6.5">
//               <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
//                 <div className="w-full xl:w-1/2">
//                   <label className="mb-2.5 block text-black dark:text-white">
//                     Full name
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter your first name"
//                     className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                     value={newUser.name}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="w-full xl:w-1/2">
//                   <label className="mb-2.5 block text-black dark:text-white">
//                     Email <span className="text-meta-1">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     placeholder="Enter your email address"
//                     className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                   />
//                 </div>
//               </div>

//               <div className="mb-4.5">
//                 <label className="mb-2.5 block text-black dark:text-white">
//                   Role
//                 </label>

//                 <div className="relative z-20 bg-transparent dark:bg-form-input">
//                   <select
//                     name="role"
//                     value={newUser.role}
//                     onChange={handleRoleChange}
//                     className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary `}

//                     // ${
//                     //   isOptionSelected ? 'text-black dark:text-white' : ''
//                     // }
//                   >
//                     <option
//                       value=""
//                       disabled
//                       className="text-body dark:text-bodydark"
//                     >
//                       Select Role
//                     </option>
//                     {roles.map((role) => (
//                       <option key={role.id} value={role.roleName}>
//                         {role.roleName}
//                       </option>
//                     ))}
//                   </select>

//                   <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
//                     <svg
//                       className="fill-current"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <g opacity="0.8">
//                         <path
//                           fillRule="evenodd"
//                           clipRule="evenodd"
//                           d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
//                           fill=""
//                         ></path>
//                       </g>
//                     </svg>
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={newUser.name}
//           onChange={handleInputChange}
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={newUser.email}
//           onChange={handleInputChange}
//         /> */}
//         {/* <select name="role" value={newUser.role} onChange={handleRoleChange}>
//           <option value="">Select Role</option>
//           {roles.map((role) => (
//             <option key={role.id} value={role.roleName}>
//               {role.roleName}
//             </option>
//           ))}
//         </select> */}

//         <div>
//           <h4>Permissions</h4>
//           <ul>
//             {permissionsList.map((perm) => (
//               <li key={perm}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={newUser.permissions.includes(perm)}
//                     onChange={() => handlePermissionToggle(perm)}
//                   />
//                   {perm}
//                 </label>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {selectedUser ? (
//           //   <button type="button" onClick={handleUpdate}>
//           //     Update User
//           //   </button>
//           <button
//             type="button"
//             onClick={handleUpdate}
//             className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
//           >
//             Create User
//           </button>
//         ) : (
//           //   <button type="button" onClick={handleSubmit}>
//           //     Create User
//           //   </button>
//           <button
//             type="button"
//             onClick={handleSubmit}
//             className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
//           >
//             Create User
//           </button>
//         )}
//       </form>

//       <h3>Users List</h3>
//       <ul>
//         {users.map((user) => (
//           <li key={user.id}>
//             {user.name} - {user.email} - {user.role}
//             <button onClick={() => handleEdit(user)}>Edit</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UserManager;


import React, { useState, ChangeEvent } from 'react';

// Define the role and permission types
type Permission = 'create' | 'edit' | 'delete' | 'view';

interface Role {
  id: number;
  roleName: string;
  permissions: Permission[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: Permission[];
}

// Sample data for roles
const roles: Role[] = [
  { id: 1, roleName: 'Theatre Manager', permissions: ['create', 'edit', 'delete'] },
  { id: 2, roleName: 'Event Manager', permissions: ['view'] },
];

const permissionsList: Permission[] = ['create', 'edit', 'delete', 'view'];

// Initial user data
const initialUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Event Manager',
    permissions: ['create', 'edit', 'delete'],
  },
  {
    id: 2,
    name: 'Carla Grey',
    email: 'carla@example.com',
    role: 'Theatre Manager',
    permissions: ['view'],
  },
];

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    name: '',
    email: '',
    role: '',
    permissions: [],
  });

  // Handle input change for text and email fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Handle role change and update permissions
  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = roles.find((role) => role.roleName === e.target.value);
    if (selectedRole) {
      setNewUser({
        ...newUser,
        role: selectedRole.roleName,
        permissions: selectedRole.permissions,
      });
    }
  };

  // Handle form submit for creating a new user
  const handleSubmit = () => {
    if (newUser.name && newUser.email && newUser.role) {
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
      setNewUser({ id: 0, name: '', email: '', role: '', permissions: [] });
    }
  };

  // Handle editing an existing user
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setNewUser(user);
  };

  // Handle updating a user
  const handleUpdate = () => {
    setUsers(
      users.map((user) => (user.id === selectedUser?.id ? newUser : user)),
    );
    setSelectedUser(null);
    setNewUser({ id: 0, name: '', email: '', role: '', permissions: [] });
  };

  // Handle permission toggle for users
  const handlePermissionToggle = (permission: Permission) => {
    const updatedPermissions = newUser.permissions.includes(permission)
      ? newUser.permissions.filter((perm) => perm !== permission)
      : [...newUser.permissions, permission];
    setNewUser({ ...newUser, permissions: updatedPermissions });
  };

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            User Management
          </h3>
        </div>

        {/* Form for creating or editing a user */}
        <form className="p-6 space-y-6">
          <div className="flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="block text-black dark:text-white">
                Full name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={newUser.name}
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary focus:border-primary"
              />
            </div>
            <div className="w-full xl:w-1/2">
              <label className="block text-black dark:text-white">
                Email <span className="text-meta-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={newUser.email}
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-black dark:text-white">Role</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleRoleChange}
              className="w-full rounded border border-stroke bg-transparent py-3 px-5 dark:border-form-strokedark dark:bg-form-input dark:text-white focus:border-primary"
            >
              <option value="" disabled>
                Select Role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.roleName}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>

          {/* <div>
            <h4 className="text-black dark:text-white">Permissions</h4>
            <ul className="space-y-2 flex justify-between items-center">
              {permissionsList.map((perm) => (
                <li key={perm}>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.includes(perm)}
                      onChange={() => handlePermissionToggle(perm)}
                      className="form-checkbox"
                    />
                    <span>{perm}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div> */}

          <div className="flex justify-end space-x-4">
            {selectedUser ? (
              <button
                type="button"
                onClick={handleUpdate}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Update User
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Create User
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Users List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Users List
        </h3>
        <ul className="mt-4 space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between">
              <div>
                {user.name} - {user.email} - {user.role}
              </div>
              <button
                onClick={() => handleEdit(user)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManager;

