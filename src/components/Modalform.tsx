import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import urls from '../networking/app_urls';
import { useSelector } from 'react-redux';

interface ModalformProps {
  onSubmitSuccess?: (data: any) => void;
}

const Modalform: React.FC<ModalformProps> = ({ onSubmitSuccess }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Get current user from Redux store
  const currentUser = useSelector((state: any) => state.user.currentUser?.data);

  const handleOpen = () => {
    setOpen((cur) => !cur);

    if (open) {
      reset();
      setSelectedImage(null);
      setError(null);
      setSuccess(false);
      setLoading(false);
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('city', data.city);
      formData.append('pinCode', data.pinCode);
      formData.append('address', data.address);

      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }

      const response = await axios.post(urls.createManagerUrl, formData, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      setOpen(false);
      reset();
      setSelectedImage(null);
      setError(null);
      setSuccess(false);

      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
    } catch (err) {
      setError('Failed to create manager. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-blue-500 text-white px-7 rounded hover:bg-blue-600 mb-4"
      >
        Add
      </button>

      {open && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
          <div
            onClick={stopPropagation}
            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full max-w-md lg:max-w-xl h-[85vh] overflow-y-auto"
          >
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Create Manager
              </h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6.5 grid grid-cols-2 gap-x-6">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Name
                  </label>
                  <input
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="text"
                    placeholder="Full name"
                    {...register('name', { required: true })}
                  />
                  {errors.name && (
                    <span className="text-red-500">Name is required</span>
                  )}
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Phone Number"
                    {...register('phoneNumber', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Phone number must be exactly 10 digits',
                      },
                    })}
                  />
                  {errors.phoneNumber?.type === 'required' && (
                    <span className="text-red-500">
                      Phone number is required
                    </span>
                  )}
                  {errors.phoneNumber?.type === 'pattern' && (
                    <span className="text-red-500">
                      Phone number must be exactly 10 digits
                    </span>
                  )}
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Email"
                    {...register('email', {
                      required: true,
                      pattern: /^\S+@\S+$/i,
                    })}
                  />
                  {errors.email && (
                    <span className="text-red-500">
                      Valid email is required
                    </span>
                  )}
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Password"
                    {...register('password', {
                      required: true,
                      minLength: 6,
                      maxLength: 12,
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-500">Password is required</span>
                  )}
                </div>
                <div className="mb-5.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="City"
                    {...register('city', { required: true })}
                  />
                  {errors.city && (
                    <span className="text-red-500">City is required</span>
                  )}
                </div>
                <div className="mb-5.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Pin Code
                  </label>
                  <input
                    type="text" // Change from number to text to prevent step buttons
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Pin code"
                    {...register('pinCode', {
                      required: 'Pin code is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Pin code must be exactly 6 digits',
                      },
                    })}
                  />
                  {errors.pinCode?.type === 'required' && (
                    <span className="text-red-500">Pin code is required</span>
                  )}
                  {errors.pinCode?.type === 'pattern' && (
                    <span className="text-red-500">
                      Pin code must be exactly 6 digits
                    </span>
                  )}
                </div>
                <div className="mb-5.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Address"
                    {...register('address', { required: true })}
                  />
                  {errors.address && (
                    <span className="text-red-500">Address is required</span>
                  )}
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Upload Profile Image
                  </label>
                  <input
                    type="file"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>

                <button
                  type="button"
                  className="flex w-full justify-center rounded bg-slate-300 p-3 font-medium text-black hover:bg-opacity-90"
                  onClick={handleOpen}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>

                {error && <p className="text-red-500">{error}</p>}
                {success && (
                  <p className="text-green-500">
                    Manager created successfully!
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modalform;
