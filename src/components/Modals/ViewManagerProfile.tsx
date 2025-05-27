import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  User,
  Loader2,
  Save,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Urls from '../../networking/app_urls';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FormField from '../Utils/FormField';
import { useForm, Controller } from 'react-hook-form';
import clsx from 'clsx';
import { da } from 'date-fns/locale';

interface Manager {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  profileImage: string | null;
  address: string;
  state: string;
  city: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  active: boolean;
}

interface ViewManagerProfileProps {
  isOpen: boolean;
  managerId: string | null;
  onClose: () => void;
  onUpdate: (updatedManager: Manager) => void;
}

const ViewManagerProfile: React.FC<ViewManagerProfileProps> = ({
  isOpen,
  managerId,
  onClose,
  onUpdate,
}) => {
  const [manager, setManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      role: '',
      state: '',
      active: false,
    },
  });

  useEffect(() => {
    const fetchManagerDetails = async () => {
      if (!isOpen || !managerId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${Urls.getManagerDetails}/${managerId}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const managerData = response.data.data;
        setManager(managerData);
        reset({
          name: managerData.name,
          email: managerData.email,
          phoneNumber: managerData.phoneNumber,
          role: managerData.role,
          active: managerData.active,
        });
      } catch (error) {
        console.error('Error fetching manager details:', error);
        setError('Failed to fetch manager details');
        setManager(null);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerDetails();
  }, [isOpen, managerId, reset, currentUser.token]);

  const onSubmit = async (data: FormData) => {
    if (!manager) return;

    try {
      setIsUpdating(true);
      const response = await axios.post(Urls.editMangerProfile, {
        id: manager._id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        state: data.state,
        active: data.active,
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      const updatedManager = {
        ...manager,
        ...response.data.data,
      };
      setManager(updatedManager);
      onUpdate(updatedManager);
      reset(data);
    } catch (error) {
      console.error('Error updating manager details:', error);
      setError('Failed to update manager details');
    } finally {
      setIsUpdating(false);
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-500">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-slate-200"
              >
                <X size={24} />
              </motion.button>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-500" size={40} />
              </div>
            ) : error ? (
              <div className="h-64 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-red-500 mb-4">⚠️ Error</div>
                <div className="text-slate-600">{error}</div>
              </div>
            ) : manager ? (
              <>
                {/* Profile Image */}
                <div className="relative px-6">
                  <div className="absolute -top-16 left-6">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                      {manager.profileImage ? (
                        <img
                          src={manager.profileImage}
                          alt={manager.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              '../../../public/Image/Fallback Image/default-fallback-image.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <User size={40} className="text-slate-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit(onSubmit)} className="px-6 pt-20 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Name is required' }}
                        render={({ field, fieldState: { error } }) => (
                          <FormField label="Name" name="name" error={error}>
                            <input
                              {...field}
                              type="text"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </FormField>
                        )}
                      />
                    </div>
                    <Controller
                      name="active"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                          />
                          <span className={clsx(
                            'px-3 py-1 rounded-full text-sm font-medium',
                            field.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          )}>
                            {field.value ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{ required: 'Phone number is required' }}
                        render={({ field, fieldState: { error } }) => (
                          <FormField label="Phone Number" name="phoneNumber" error={error}>
                            <div className="flex items-center gap-2">
                              <Phone size={18} className="text-slate-400" />
                              <input
                                {...field}
                                type="text"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              />
                              </div>
                            </FormField>
                          )}
                        />
                      
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: 'Email is required',
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid email address',
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <FormField label="Email" name="email" error={error}>
                            <div className="flex items-center gap-2">
                              <Mail size={18} className="text-slate-400" />
                              <input
                                {...field}
                                type="email"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              />
                              </div>
                            </FormField>
                          )}
                        
                      />
                      <div className="flex items-start gap-2 text-slate-600">
                        <MapPin size={18} className="text-slate-400 mt-1 flex-shrink-0" />
                        <span>{manager.address || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building size={18} className="text-slate-400" />
                        <span>{manager.city || 'N/A'}, {manager.state || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={18} className="text-slate-400" />
                        <span>
                          Joined{' '}
                          {formatDistanceToNow(new Date(manager.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <Controller
                        name="role"
                        control={control}
                        rules={{ required: 'Role is required' }}
                        render={({ field, fieldState: { error } }) => (
                          <FormField label="Role" name="role" error={error}>
                            <select
                              {...field}
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                              <option value="theatreManager">Theatre Manager</option>
                              <option value="theatreEmployee">Theatre Employee</option>
                              <option value="eventManager">Event Manager</option>
                              <option value="eventEmployee">Event Employee</option>
                            </select>
                          </FormField>
                        )}
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!isDirty || isUpdating}   
                    whileHover={{ scale: isDirty && !isUpdating ? 1.05 : 1 }}
                    whileTap={{ scale: isDirty && !isUpdating ? 0.95 : 1 }}
                    className={clsx(
                      'mt-6 w-full py-2 rounded-lg font-medium flex items-center justify-center',
                      isDirty && !isUpdating
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    )}
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin mr-2" size={16} />
                    ) : (
                      <Save size={16} className="mr-2" />
                    )}
                    {isUpdating ? 'Updating...' : 'Update Profile'}
                  </motion.button>
                </form>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-600">
                No manager data available
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViewManagerProfile;