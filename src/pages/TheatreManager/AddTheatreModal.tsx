import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

interface TheatreFormData {
  name: string;
  location: string;
  isOperational: boolean;
  isGrabABite: boolean;
}

interface ModalformProps {
  onSubmitSuccess?: (data: any) => void;
}

const AddTheatreModal: React.FC<ModalformProps> = ({ onSubmitSuccess }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const currentUser = useSelector((state: any) => state.user.currentUser?.data);

  const handleOpen = () => {
    setOpen((cur) => !cur);

    if (open) {
      reset();
      setError(null); // Clear error message
      setSuccess(false); // Clear success message
      setLoading(false); // Reset loading state
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
  } = useForm<TheatreFormData>();

  const onSubmit = async (data: TheatreFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(urls.addTheatre, data, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setSuccess(true);
      setOpen(false); // Close modal after successful submission
      reset();
      toast.success(
        'Theatre added successfully! Your new theatre is now available.',
      );
      setTimeout(() => setSuccess(false), 5000);
      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
    } catch (err: any) {
      console.error('API Error:', err.response?.data || err.message);
      toast.error(
        'Oops! Something went wrong while adding the theatre. Please try again later.',
      );
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-[#865BFF] hover:bg-[#6a48c9] text-white px-7 rounded mb-4"
      >
        Add
      </button>

      {open && (
        <div className="fixed inset-0 bg-gray-800 flex items-center justify-center bg-black bg-opacity-50 z-999">
          <div
            onClick={stopPropagation}
            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full max-w-md lg:max-w-3xl overflow-y-auto transform translate-x-30 translate-y-10"
          >
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Add Theatre
              </h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6.5 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                {/* Name */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Name
                  </label>
                  <input
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="text"
                    placeholder="Theatre name"
                    {...register('name', { required: true })}
                  />
                  {errors.name && (
                    <span className="text-red-500">Name is required</span>
                  )}
                </div>

                {/* Location */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Location
                  </label>
                  <input
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="text"
                    placeholder="Theatre location"
                    {...register('location', { required: true })}
                  />
                  {errors.location && (
                    <span className="text-red-500">Location is required</span>
                  )}
                </div>

                {/* Is Operational */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                  Status
                  </label>
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    {...register('isOperational', { required: true })}
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  {errors.isOperational && (
                    <span className="text-red-500">
                      Status is required
                    </span>
                  )}
                </div>

                {/* Is Grab A Bite */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Is Grab A Bite
                  </label>
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    {...register('isGrabABite', { required: true })}
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  {errors.isGrabABite && (
                    <span className="text-red-500">
                      Grab-a-bite status is required
                    </span>
                  )}
                </div>

                {/* Cancel Button */}
                <button
                  type="button"
                  className="flex w-full justify-center rounded bg-slate-300 p-3 font-medium text-black hover:bg-opacity-90 mb-2"
                  onClick={handleOpen}
                >
                  Cancel
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-[#865BFF] hover:bg-[#6a48c9] p-3 font-medium text-gray hover:bg-opacity-90 mb-2"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>

                {error && <p className="text-red-500">{error}</p>}
                {success && (
                  <p className="text-green-500">
                    Theatre created successfully!
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

export default AddTheatreModal;
