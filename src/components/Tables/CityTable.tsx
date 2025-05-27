import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import EditCityModal from '../Modals/EditCityModal';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CityCard from '../Cards/CityCard';

interface cities {
  _id: string;
  name: string;
  cityImage: string;
  // state: State;
}

const CityTable: React.FC<{ stateName: string; reload: boolean }> = ({
  stateName,
  reload,
}) => {
  const { id } = useParams();
  const [cityy, setCityy] = useState<cities[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof cities | null;
    direction: string;
  }>({
    key: null,
    direction: 'ascending',
  });
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state: any) => state.user.currentUser.data);
  const [editCity, setEditCity] = useState<cities | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCity = (page: number, limit: number) => {
    setLoading(true);

    const formData = {
      state: id,
    };

    axios
      .post(`${Urls.getCitiesByState}`, formData, {
        // params: { page, limit }, // Append query parameters
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => {
        if (response.data.data) {
          // console.log("response.data.data",response.data.data);
          const ticketData = response.data.data;
          //const stateData: cities[] = response.data.data;
          // const stateName = stateData.find((city) => city.state)?.state.name;
          // console.log("stateName",stateName);
          setCityy(ticketData);
          setTotalPages(response.data.pagination?.totalPages || 1);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleEditClick = (city: cities) => {
    console.log('🧠 Opening modal for city:', city);
    setEditCity(city);
    setIsModalOpen(true);
  };

  const handleEditClose = () => {
    setEditCity(null);
    setIsModalOpen(false);
  };

  // Parent component - updated onSubmit function signature
  const handleEditSubmit = (
    updatedCity: cities,
    cityImageFile: File | null,
  ) => {
    if (!updatedCity._id) {
      console.error('❌ No _id provided. Cannot update city.');
      return;
    }

    const formData = new FormData();
    formData.append('_id', updatedCity._id);
    formData.append('name', updatedCity.name);

    if (cityImageFile) {
      formData.append('cityImage', cityImageFile);
    }

    console.log('🧠 Final FormData:');
    for (let [key, val] of formData.entries()) {
      console.log(`${key}:`, val);
    }

    axios
      .post(`${Urls.UpdateCity}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then(() => {
        toast.success('City updated successfully!');
        handleEditClose();
        fetchCity(currentPage, itemsPerPage);
      })
      .catch((error) => {
        console.error('❌ Error updating city:', error);
        toast.error('Failed to update city.');
      });
  };

  useEffect(() => {
    fetchCity(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, reload]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof cities) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedTickets = [...cityy].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setCityy(sortedTickets);
    setSortConfig({ key, direction });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };

  const MySwal = withReactContent(Swal);

  const handleDelete = (cityId: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this city? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      position: 'center', // Ensure modal is centered
      customClass: {
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCity(cityId);
      }
    });
  };

  const deleteCity = (id: string) => {
    axios
      .post(
        `${Urls.deleteCity}`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      )
      .then((response) => {
        if (response.data.status) {
          setCityy((prevCity) => prevCity.filter((city) => city._id !== id));

          // Show success toast
          toast.success('City deleted successfully!');
        } else {
          // Show error toast if the status is false
          toast.error('Failed to delete the city.');
        }
      })
      .catch((error: any) => {
        console.error('Error:', error);

        const errorMessage =
          error?.response?.data?.message ||
          'Oops! Something went wrong while deleting the city. Please try again later.';

        toast.error(errorMessage);
      });
  };

  const filteredCities = cityy.filter((city) =>
    `${city.name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderSortIcon = (key: keyof cities) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <FontAwesomeIcon icon={faArrowUp} className="ml-2" />
      ) : (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" />
      );
    }
    return null;
  };

  if (filteredCities.length === 0) {
    return (
      <>
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 bg-clip-text text-transparent">
            No cities added yet
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add a city to start seeing the details here.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="rounded-xl border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:text-white dark:border-form-strokedark dark:bg-form-input transition focus:border-primary dark:focus:border-primary"
          onChange={handleSearch}
        />
      </div>
      {/* <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('name')}
              >
                City Name {renderSortIcon('name')}
              </th>
              <th
                className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('cityImage')}
              >
                Image {renderSortIcon('cityImage')}
              </th>
              <th className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center">
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
                          <div className="rounded-full bg-slate-200 dark:bg-slate-300 h-10 w-10"></div>
                          <div className="flex-1 space-y-4 py-1 items-center flex ">
                            <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full"></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              : filteredCities.map((item, index) => (
                  <tr key={index} className="cursor-pointer">
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark text-center">
                    
                      <h5 className="font-medium text-black dark:text-white h-12 flex items-center justify-center cursor-pointer hover:text-blue-600">
                        {item.name}
                      </h5>
                    </td>

                     <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark w-32 text-center align-middle">
                                      <a
                                        href={`${Urls.Image_url}${item.cityImage}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block w-full"
                                      >
                                        <img
                                          src={`${Urls.Image_url}${item.cityImage}`}
                                          alt="State"
                                          className="h-12 mx-auto object-contain"
                                        />
                                      </a>
                                    </td>
                  
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <div >
                        
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-sm font-medium rounded-md focus:outline-none hover:text-[#472DA9]"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                       <button
                                                                                           onClick={(e) =>{
                                                                                              e.stopPropagation();
                                                                                            handleDelete(item._id)}}
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
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 animate-pulse-custom"
                >
                  <div className="relative h-48 bg-slate-200 shimmer rounded-t-xl" />

                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 w-24 bg-slate-200 rounded shimmer"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 w-8 bg-slate-200 rounded-full shimmer"></div>
                        <div className="h-8 w-8 bg-slate-200 rounded-full shimmer"></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-4 w-full bg-slate-200 rounded shimmer"></div>
                      <div className="h-4 w-3/4 bg-slate-200 rounded shimmer"></div>
                      <div className="h-4 w-5/6 bg-slate-200 rounded shimmer"></div>
                    </div>
                  </div>
                </div>
              ))
          : filteredCities.map((state, index) => (
              <CityCard
                key={index}
                state={state}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            ))}

        {isModalOpen && editCity && (
          <EditCityModal
            city={editCity}
            onClose={handleEditClose}
            onSubmit={handleEditSubmit}
            stateName={stateName}
          />
        )}
      </div>
    </div>
  );
};

export default CityTable;
