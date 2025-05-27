import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import url from '../networking/app_urls';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ProfileManager = () => {
  const currentUser = useSelector(
    (state: any) => state.user.currentUser.data,
  );

  // Initialize state with empty strings or with currentUser values once loaded.
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState<boolean>(false);

  // Set state values when currentUser is available or updated.
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPhoneNumber(currentUser.phoneNumber || "");
      setEmail(currentUser.email || "");
      // For password, usually you wouldn't set it this way
      setPassword("");
    }
  }, [currentUser, reload]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setErrorMessage(null);
    setLoading(true);
  
    const formData = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
    };
  
    try {
      await axios.post(url.updateSubUserProfile, formData, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Profile updated successfully!');
      setReload((prev) => !prev);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        'Oops! Something went wrong while updating your profile. Please try again later.',
      );
      setErrorMessage('Oops! Something went wrong while updating your profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Breadcrumb pageName="Profile" />
      <div className="flex flex-col gap-9 mb-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Profile
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5 grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  value={name} // Use state variable
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Mobile
                </label>
                <input
                  type="text"
                  value={phoneNumber} // Use state variable
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter Mobile"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email
                </label>
                <input
                  type="text"
                  value={email} // Use state variable
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  value={password} // Use state variable
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
  
              {errorMessage && (
                <p className="text-red-500 col-span-2">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded bg-[#865BFF] hover:bg-[#6a48c9] p-3 font-medium text-gray md:col-start-2"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileManager;
