import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import {motion} from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';

import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CityTable from '../components/Tables/CityTable';
import url from '../networking/app_urls';

import statesData from '../common/States&City/States&City.json';
import { Building2 } from 'lucide-react';
const City: React.FC = () => {
  const { id } = useParams();
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const currentUser = useSelector((state: any) => state.user.currentUser?.data);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await axios.get(`${url.getSingleState}?id=${id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setStateName(res.data.data.name);
      } catch (err) {
        console.error('Error fetching state:', err);
      }
    };
    if (id) fetchState();
  }, [id, currentUser.token]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setPreviewImage(URL.createObjectURL(selected));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!city) return setErrorMessage('City name is required.');
    if (!file) return setErrorMessage('Please upload an image.');

    setErrorMessage(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('name', city);
    formData.append('state', id as string);
    formData.append('cityImage', file);

    try {
      await axios.post(url.CreateCities, formData, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('City added successfully!');
      setCity('');
      setFile(null);
      setPreviewImage(null);
      setReload((prev) => !prev);
    } catch (error) {
      console.error('Error submitting city:', error);
      toast.error('Something went wrong while adding the city.');
      setErrorMessage('Failed to add city. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb
        pageName={`${stateName} → City`}
        parentName="States"
        parentPath="/state"
      />

      <div className="flex flex-col gap-9 mb-9">
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-transparent bg-clip-text bg-indigo-purple">
              Add City
            </h3>
          </div> */}
           <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-6.5 pt-6.5"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Building2 size={28} className="mr-2 text-indigo-600" />
               
                City Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage the city of your application. You can add, edit, or
                delete city as needed.
              </p>
            </div>
          </motion.div>


          <form onSubmit={handleSubmit}>
            <div className="p-6.5 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Select City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:text-white dark:border-form-strokedark dark:bg-form-input transition focus:border-primary dark:focus:border-primary"
                >
                  <option value="" disabled>
                    Choose a City
                  </option>
                  {statesData[stateName]?.map((cityName: string) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Upload Image
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-400 dark:border-form-strokedark'
                  }`}
                >
                  <input {...getInputProps()} />
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mx-auto h-48 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setPreviewImage(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FontAwesomeIcon
                        icon={faUpload}
                        className="text-gray-400 text-3xl mx-auto"
                      />
                      <p className="text-gray-600 dark:text-gray-300">
                        {isDragActive
                          ? 'Drop the image here'
                          : 'Drag & drop or click to upload'}
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={loading || !city || !file}
                className={`w-full py-3 px-4 rounded-xl text-white font-medium transition ${
                  city && file
                    ? 'bg-indigo-purple hover:bg-indigo-purple-dark'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? 'Submitting...' : 'Add City'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <CityTable stateName={stateName} reload={reload} />
    </div>
  );
};

export default City;
