


import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import urls from '../networking/app_urls';
import { useSelector } from 'react-redux';

interface Banner {
  _id: string;
  title: string;
  bannerType: string;
  url: string;
  bannerImage?: string;
}

interface ModalformProps {
  banner?: Banner | null; // Make this consistent
  onSubmitSuccess?: (data: Banner) => void; // Specify the expected type for data
  onCancel?: () => void; // Include the onCancel prop for the cancel action
}

const BannerForm: React.FC<ModalformProps> = ({
  banner,
  onSubmitSuccess,
  onCancel,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const currentUser = useSelector((state: any) => state.user.currentUser?.data);

  const clearFormState = () => {
    reset();
    setSelectedImage(null);
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  const handleOpen = () => {
    if (open) {
      clearFormState();
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (banner) {
      reset({
        title: banner.title,
        bannerType: banner.bannerType,
        url: banner.url,
      });
      setSelectedImage(null);
    }
  }, [banner, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('bannerType', data.bannerType);
      formData.append('url', data.url);

      if (selectedImage) {
        formData.append('bannerImage', selectedImage);
      }

      const requestUrl = banner ? urls.updateBannerUrl : urls.createBannerUrl;
      if (banner) formData.append('id', banner._id);

      const response = await axios.post(requestUrl, formData, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      clearFormState();
      setOpen(false);

      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
    } catch (err) {
      setError(
        banner
          ? 'Failed to update banner. Please try again.'
          : 'Failed to create banner. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleCancel = () => {
    clearFormState(); // Reset the form state
    if (onCancel) {
      onCancel(); // Call the onCancel function to notify parent component
    }
    setOpen(false); // Close the form modal
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-[#865BFF] hover:bg-[#6a48c9] text-white px-7 rounded hover:bg-opacity-90 mb-4"
      >
        {banner ? 'Edit' : 'Add'}
      </button>

      {open && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full max-w-md lg:max-w-xl overflow-y-auto"
          >
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {banner ? 'Edit' : 'Add'}
              </h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6.5 grid grid-cols-1 gap-x-6">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    {...register('title', { required: true })}
                  />
                  {errors.title && (
                    <span className="text-red-500">Title is required</span>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Banner Type
                  </label>
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    {...register('bannerType', { required: true })}
                  >
                    <option value="" disabled>
                      Select Banner Type
                    </option>
                    <option value="home">Home</option>
                    <option value="event">Event</option>
                    <option value="movie">Movie</option>
                  </select>
                  {errors.bannerType && (
                    <span className="text-red-500">
                      Banner Type is required
                    </span>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    URL
                  </label>
                  <input
                    type="text"
                    placeholder="URL"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    {...register('url', { required: true })}
                  />
                  {errors.url && (
                    <span className="text-red-500">URL is required</span>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Upload Banner Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex w-full justify-center rounded bg-slate-300 p-3 font-medium text-black hover:bg-opacity-90"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-[#865BFF] hover:bg-[#6a48c9] p-3 font-medium text-gray hover:bg-opacity-90"
                    disabled={loading}
                  >
                    {loading
                      ? banner
                        ? 'Updating...'
                        : 'Creating...'
                      : banner
                      ? 'Update'
                      : 'Create'}
                  </button>
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {success && (
                  <p className="text-green-500">
                    Banner {banner ? 'updated' : 'created'} successfully!
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

export default BannerForm;
