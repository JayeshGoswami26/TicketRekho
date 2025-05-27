import React from 'react';
import { motion } from 'framer-motion';
import { ManagerCategory, ManagerStatus } from '../../types/manager';
import { Theater, Calendar, Check, X } from 'lucide-react';
import CreateManModal from '../Modals/CreateManModal';
import axios from 'axios';

import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import AddManagerModal from '../Modals/AddManagerModal';

interface FilterOptionsProps {
  selectedCategories: ManagerCategory[];
  setSelectedCategories: (categories: ManagerCategory[]) => void;
  selectedStatuses: ManagerStatus[];
  setSelectedStatuses: (statuses: ManagerStatus[]) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  selectedCategories,
  setSelectedCategories,
  selectedStatuses,
  setSelectedStatuses,
}) => {
  const toggleCategory = (category: ManagerCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleStatus = (status: ManagerStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // const currentUser = useSelector((state: any) => state.user.currentUser.data);

  // const fetchSellers = (page: number, limit: number, search: string) => {
  //   let searchQuery = search;
  //   if (search.toLowerCase() === 'active') {
  //     searchQuery = 'true';
  //   } else if (search.toLowerCase() === 'inactive') {
  //     searchQuery = 'false';
  //   }
  //   axios
  //     .get(
  //       `${
  //         Urls.getManagers
  //       }?page=${page}&limit=${limit}&search=${encodeURIComponent(
  //         searchQuery,
  //       )}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${currentUser.token}`,
  //         },
  //       },
  //     )
  //     .then((response) => {
  //       if (
  //         response.data.status &&
  //         response.data.data.userList &&
  //         Array.isArray(response.data.data.userList)
  //       ) {
  //         const managerData = response.data.data.userList.map(
  //           (manager: any) => ({
  //             ...manager,
  //             image: `${Urls.Image_url}${manager.profileImage}`,
  //             phoneNumber: manager.phoneNumber,
  //             email: manager.email,
  //             password: manager.password,
  //             status: manager.active,
  //             role: formatRoleName(manager.role),
  //           }),
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('There was an error fetching the data!', error);
  //       // setLoading(false);
  //     });
  // };

  // const formatRoleName = (str: string) => {
  //   return str
  //     .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
  //     .split(' ') // Split into words
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
  //     .join(' '); // Join words back
  // };
  // const handleModalFormSubmit = () => {
  //   fetchSellers();
  // };

  const handleModalFormSubmit = () => {
    console.log(`Form submitted successfully`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full item-center">
      <div className="w-full md:w-1/2">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            isActive={selectedCategories.includes('Theatre Manager')}
            onClick={() => toggleCategory('Theatre Manager')}
            icon={<Theater size={16} />}
            label="Theatre Manager"
            activeClasses="bg-indigo-100 text-indigo-800 border-indigo-200"
          />
          <FilterButton
            isActive={selectedCategories.includes('Theatre Employee')}
            onClick={() => toggleCategory('Theatre Employee')}
            icon={<Theater size={16} />}
            label="Theatre Employee"
            activeClasses="bg-indigo-100 text-indigo-800 border-indigo-200"
          />
          <FilterButton
            isActive={selectedCategories.includes('Event Manager')}
            onClick={() => toggleCategory('Event Manager')}
            icon={<Calendar size={16} />}
            label="Event Manager"
            activeClasses="bg-purple-100 text-purple-800 border-purple-200"
          />
          <FilterButton
            isActive={selectedCategories.includes('Event Employee')}
            onClick={() => toggleCategory('Event Employee')}
            icon={<Theater size={16} />}
            label="Event Employee"
            activeClasses="bg-indigo-100 text-indigo-800 border-indigo-200"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            isActive={selectedStatuses.includes('Active')}
            onClick={() => toggleStatus('Active')}
            icon={<Check size={16} />}
            label="Active"
            activeClasses="bg-green-100 text-green-800 border-green-200"
          />
          <FilterButton
            isActive={selectedStatuses.includes('Inactive')}
            onClick={() => toggleStatus('Inactive')}
            icon={<X size={16} />}
            label="Inactive"
            activeClasses="bg-red-100 text-red-800 border-red-200"
          />
        </div>
      </div>

      <div className="w-full md:w-1/3">
        {/* <h3 className="text-sm font-medium text-gray-700 mb-2">Add</h3> */}
        <div className="flex flex-wrap gap-2">
          {/* <button
            type="submit"
            // disabled={loading || !state || !file}
            className={`w-[10rem] bg-indigo-purple hover:bg-indigo-purple-dark py-3 px-4 rounded-xl text-white font-medium transition-colors duration-500 `}
          >
            Add Manager
          </button> */}
          {/* <CreateManModal onSubmitSuccess={handleModalFormSubmit} /> */}
          <AddManagerModal/>
        </div>
      </div>
    </div>
  );
};

interface FilterButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  activeClasses: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  isActive,
  onClick,
  icon,
  label,
  activeClasses,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
        isActive
          ? activeClasses
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </motion.button>
  );
};

export default FilterOptions;
