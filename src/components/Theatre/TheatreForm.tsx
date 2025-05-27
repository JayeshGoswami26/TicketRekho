import React, { useState } from 'react';

interface TheatreFormProps {
  onSave: (theatre: {
    name: string;
    location: string;
    contact: string;
  }) => void;
}

const TheatreForm: React.FC<TheatreFormProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, location, contact });
    setName('');
    setLocation('');
    setContact('');
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full max-w-md lg:max-w-xl  overflow-y-auto">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h2 className="font-medium text-black dark:text-white">
          Add/Edit Theatre
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6.5 grid gap-y-4">
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Theatre Name
          </label>
          <input
            type="text"
            placeholder="Theatre Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Location
          </label>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Contact Info
          </label>
          <input
            type="text"
            placeholder="Contact Info"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        >
          Save Theatre
        </button>
      </form>
    </div>
  );
};

export default TheatreForm;
