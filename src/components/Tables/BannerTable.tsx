import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
//import BannerForm from '../BannerForm';

interface Banner {
  _id: string;
  name: string;
  type: string;
  bannerImage: string;
  isBanner: boolean;
}

const BannerTable: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Banner | null;
    direction: string;
  }>({
    key: null,
    direction: 'ascending',
  });
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  const fetchManagers = (page: number, limit: number) => {
    setLoading(true);
    axios
      .get(`${Urls.getAdminBanners}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => {
        if (
          response.data.status &&
          response.data.data.result &&
          Array.isArray(response.data.data.result)
        ) {
          const managerData = response.data.data.result;

          setBanners(managerData);
          setTotalPages(response.data.data.pagination?.totalPages || 1); // Set total pages from API
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
        setLoading(false);
      });
  };

  const formatName = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
      .split(' ') // Split into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join words back
  };

  useEffect(() => {
    fetchManagers(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof Banner) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedManagers = [...banners].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setBanners(sortedManagers);
    setSortConfig({ key, direction });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleChangeStatus = (id: string, type: string) => {
    axios
      .post(
        `${Urls.changeBannerStatus}`,
        { type, id },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      )
      .then((response) => {
        if (response.data.status) {
          setBanners((prevBanners) =>
            prevBanners.filter((banner) => banner._id !== id),
          );
        }
      })
      .catch((error) => {
        console.error('Error deleting banner:', error);
      });
  };

  const filteredManagers = banners.filter((manager) =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderSortIcon = (key: keyof Banner) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <FontAwesomeIcon icon={faArrowUp} className="ml-2" />
      ) : (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" />
      );
    }
    return null;
  };

  const handleModalFormSubmit = () => {
    setShowModal(false);
    setSelectedBanner(null);
    fetchManagers(currentPage, itemsPerPage);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 w-full p-2 border border-gray-300 rounded dark:bg-boxdark"
          onChange={handleSearch}
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('bannerImage')}
              >
                Image {renderSortIcon('bannerImage')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('name')}
              >
                Title {renderSortIcon('name')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('type')}
              >
                Banner Type {renderSortIcon('type')}
              </th>

              <th className="font-bold text-black dark:text-white cursor-pointer">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="py-4 px-4">
                        <div className="animate-pulse flex space-x-4">
                          {/* <div className="rounded-full bg-slate-200 dark:bg-slate-300 h-10 w-10"></div> */}
                          <div className="flex-1 space-y-4 py-1 items-center flex ">
                            <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full"></div>
                            {/* <div className="h-4 bg-gray-300 dark:bg-slate-300 rounded w-1/2"></div> */}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              : filteredManagers.map((banner, index) => (
                  <tr key={index} className="cursor-pointer">
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark w-32 text-center">
                      <a
                        href={`${Urls.Image_url}${banner.bannerImage}`}
                        target="_blank"
                      >
                        <img
                          className="h-12 w-full object-contain"
                          src={`${Urls.Image_url}${banner.bannerImage}`}
                          alt=""
                          onError={(e: any) => {
                            e.target.onerror = null; // Prevents looping in case fallback also fails
                            e.target.src =
                              '../../../public/Image/Fallback Image/fallback-1.jpg'; // Your fallback image path
                          }}
                        />
                      </a>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4  dark:border-strokedark text-center">
                      <h5 className="font-medium text-black dark:text-white">
                        {banner.name}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {formatName(banner.type)}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleChangeStatus(banner._id, banner.type)
                          }
                          className="p-2 text-sm font-medium rounded-md hover:text-[#d43232] focus:outline-none "
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between mt-4">
          <div>
            <label htmlFor="itemsPerPage" className="mr-2">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-1 border border-gray-300 rounded dark:bg-boxdark"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mr-2 p-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="ml-2 p-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerTable;
