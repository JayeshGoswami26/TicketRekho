import React, { useState } from 'react';

interface ScreenConfigurationProps {
  onSave: (screen: { size: string; screenType: string }) => void;
}

const ScreenConfiguration: React.FC<ScreenConfigurationProps> = ({
  onSave,
}) => {
  const [size, setSize] = useState('');
  const [screenType, setScreenType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ size, screenType });
    setSize('');
    setScreenType('');
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full max-w-md lg:max-w-xl  overflow-y-auto">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h2 className="font-medium text-black dark:text-white">
          Configure Screen
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6.5 grid gap-y-4">
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Screen Size
          </label>
          <input
            type="text"
            placeholder="Screen Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Screen Type
          </label>
          <input
            type="text"
            placeholder="Screen Type"
            value={screenType}
            onChange={(e) => setScreenType(e.target.value)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        >
          Save Screen
        </button>
      </form>
    </div>
  );
};

export default ScreenConfiguration;
