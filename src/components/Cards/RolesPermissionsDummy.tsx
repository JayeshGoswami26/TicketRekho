import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import AnimatedCheckbox from '../Checkboxes/AnimatedCheckbox';
import { permissions, defaultRoles } from '../../common/Data/Roles&Permissions';
import type { Role, RoleType } from '../../types/permissions';

const RolesPermissions: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [selectedRole, setSelectedRole] = useState<RoleType>('Admin');

  const currentRole = roles.find(role => role.name === selectedRole)!;

  const togglePermission = (permissionId: string) => {
    setRoles(prevRoles =>
      prevRoles.map(role =>
        role.name === selectedRole
          ? {
              ...role,
              permissions: role.permissions.includes(permissionId)
                ? role.permissions.filter(id => id !== permissionId)
                : [...role.permissions, permissionId],
            }
          : role
      )
    );
  };

  const categories = Array.from(
    new Set(permissions.map(permission => permission.category))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">
              Roles & Permissions
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {roles.map(role => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(role.name)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRole === role.name
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {role.name}
              </motion.button>
            ))}
          </div>

          <div className="space-y-8">
            {categories.map(category => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permissions
                    .filter(permission => permission.category === category)
                    .map(permission => (
                      <AnimatedCheckbox
                        key={permission.id}
                        checked={currentRole.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        label={permission.name}
                      />
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RolesPermissions;