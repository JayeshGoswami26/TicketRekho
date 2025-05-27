import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

interface TheatreFormData {
  _id?: string; // Include id for updates
  name: string;
  location: string;
  isActive: boolean;
  isGrabABite: boolean;
}

interface ModalFormProps {
  theatreData: TheatreFormData | null; // Pass existing data for updates
  onSubmitSuccess?: (data: any) => void;
  onClose?: () => void; // Optional close handler
}

const UpdateTheatreModal: React.FC<ModalFormProps> = ({
  theatreData,
  onSubmitSuccess,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const currentUser = useSelector((state: any) => state.user.currentUser?.data);

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TheatreFormData>();

  // Populate form with existing data
  useEffect(() => {
    if (theatreData) {
      Object.keys(theatreData).forEach((key) => {
        setValue(key as keyof TheatreFormData, (theatreData as any)[key]);
      });
    }
  }, [theatreData, setValue]);

const onSubmit = async (data: TheatreFormData) => {
  setLoading(true);
  setError(null);
  setSuccess(false);

  // Map form data to match the desired structure
  const payload = {
    name: data.name, // Rename 'name' to 'theatreName'
    location: data.location, // Rename 'location' to 'theatreLocation'
    isActive: data.isActive, // Convert string 'true'/'false' to boolean
    isGrabABite: data.isGrabABite, // Convert string 'true'/'false' to boolean
    theatreId: data._id, // Include the _id for updating
  };

  try {
    const response = await axios.post(`${urls.updateTheatre}`, payload, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });

    setSuccess(true);
    toast.success('Theatre updated successfully!');
    if (onSubmitSuccess) {
      onSubmitSuccess(response.data);
    }
    reset();
  } catch (err: any) {
    toast.error('Oops! Something went wrong.');
    setError(err.response?.data?.message || 'An error occurred.');
  } finally {
    setLoading(false);
  }
};


  return (
    

    <div className="fixed inset-0 bg-gray-800 flex items-center justify-center bg-black bg-opacity-50 z-999">
      <div
        onClick={stopPropagation}
        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full max-w-md lg:max-w-3xl overflow-y-auto transform translate-x-30 translate-y-10"
      >
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Update Theatre
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
                {...register('isActive', { required: true })}
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              {errors.isActive && (
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
              onClick={onClose}
            >
              Cancel
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-[#865BFF] hover:bg-[#6a48c9] p-3 font-medium text-gray hover:bg-opacity-90 mb-2"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>

            {error && <p className="text-red-500">{error}</p>}
            {success && (
              <p className="text-green-500">Theatre updated successfully!</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};


export default UpdateTheatreModal;
