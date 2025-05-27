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
import toast from 'react-hot-toast';
import AddScreenModal from './AddScreenModal';
import UpdateScreenModal from './UpdateScreenModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface TManager {
  _id: string;
  name: string;
  seatingCapacity: number;
  screenType: string;
  isActive: boolean;
  status: string;
  theatre: string;
}

const ScreensTable: React.FC = () => {
  const { id } = useParams(); 
  const [sellers, setSellers] = useState<TManager[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TManager | null;
    direction: string;
  }>({
    key: null,
    direction: 'ascending',
  });
  const [loading, setLoading] = useState(true);
  const [theatreName, setTheatreName] = useState<string>('');
  const [selectedTheatre, setSelectedTheatre] = useState<TManager | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);


  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);
  const roleName = currentUser.role;
  const fetchSellers = (page: number, limit: number) => {
    setLoading(true);
    axios
      .get(`${Urls.getScreens}?theatre=${id}&page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => {
        if (
          response.data.status &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          const managerData = response.data.data;
          setSellers(managerData);
          setTotalPages(response.data.data.pagination.totalPages);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSellers(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);


  useEffect(() => {
    const fetchTheatreName = async () => {
      try {
        const res = await axios.get(`${Urls.getScreensDetailWithTheatre}?id=${id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setTheatreName(res.data.data.name); 
        // console.log("res.data.data.name",res.data.data.name);
        // console.log("stateName",stateName);

      } catch (err) {
        console.error('Error fetching state:', err);
      }
    };
  
    if (id) fetchTheatreName();
  }, [id, currentUser.token]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof TManager) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedSellers = [...sellers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setSellers(sortedSellers);
    setSortConfig({ key, direction });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };

  const handleManagerClick = (id: string) => {
    navigate(`/seat-layout/${id}`);
  };

  

  // Open the modal with selected theatre data for updating
  const handleEdit = (theatre: TManager) => {
    setSelectedTheatre(theatre);
    setModalOpen(true);
  };

  // Handle adding/updating theatres
  const handleFormSubmitSuccess = (updatedTheatre: TManager) => {
    if (selectedTheatre) {
      // Update existing theatre in the list
      setSellers((prev) =>
        prev.map((t) => (t._id === updatedTheatre._id ? updatedTheatre : t)),
      );
    } else {
      // Add new theatre to the list
      setSellers((prev) => [...prev, updatedTheatre]);
    }
    setModalOpen(false);
    setSelectedTheatre(null);
     fetchSellers(currentPage, itemsPerPage);
  };

  // Close the modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTheatre(null);
  };

  const filteredManagers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderSortIcon = (key: keyof TManager) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <FontAwesomeIcon icon={faArrowUp} className="ml-2" />
      ) : (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" />
      );
    }
    return null;
  };

  
  const toggleStatus = (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;

    setLoading(true); // Optional: set a loading state if you have one

    axios
      .post(
        `${Urls.changeScreenStatus}`,
        {
          id: id,
          isActive: updatedStatus ? true : false, // Adjust according to your API requirements
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Ensure correct string interpolation
          },
        },
      )
      .then((response) => {
        console.log('Response:', response); // Log response for debugging
        if (response.data && response.data.status) {
          toast.success(
            'Screen status changed successfully!',
          );
          // Update the status locally after a successful API response

          

          setSellers((prevTheatre) =>
            prevTheatre.map((theatre) =>
              theatre._id === id // Use the correct id parameter here
                ? { ...theatre, isActive: updatedStatus }
                : theatre,
            ),
          );
        } else {
          toast.error(
            response?.data?.message
          );
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        toast.error(
         'An error occured.'
        );
        console.error('Error updating user status:', error);
      })
      .finally(() => {
        setLoading(false); // Optional: reset loading state
      });
  };


   const MySwal = withReactContent(Swal);
  
  const handleDelete = (screenId: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this screen? This action cannot be undone.',
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
        deleteScreen(screenId);
      }
    });
  };
  

   const deleteScreen = (id: string) => {
    
    setLoading(true); // Optional: set a loading state if you have one

    axios
      .post(
        `${Urls.deleteScreen}`,
        {
          id: id    
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Ensure correct string interpolation
          },
        },
      )
      .then((response) => {
        console.log('Response:', response); // Log response for debugging
        if (response.data && response.data.status) {
          toast.success(
            'Screen deleted successfully!',
          );
          // Update the status locally after a successful API response

              setSellers((prevTheatre) =>
            prevTheatre.filter((theatre) => theatre._id !== id),
          );


          // setSellers((prevTheatre) =>
          //   prevTheatre.map((theatre) =>
          //     theatre._id === id // Use the correct id parameter here
          //       ? { ...theatre, isActive: updatedStatus }
          //       : theatre,
          //   ),
          // );


        } else {
          toast.error(
            response?.data?.message
          );
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error: any) => {
     
       console.error('Error:', error);

  const errorMessage =
    error?.response?.data?.message ||
     'Oops! Something went wrong while deleting the screen. Please try again later.';

  toast.error(errorMessage);

      })
      .finally(() => {
        setLoading(false); // Optional: reset loading state
      });
  };


  const handleModalFormSubmit = () => {
    fetchSellers(currentPage, itemsPerPage);
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
        {roleName !== 'admin' && (
        <AddScreenModal onSubmitSuccess={handleModalFormSubmit} />
      )}
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('name')}
              >
                Name {renderSortIcon('name')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('seatingCapacity')}
              >
                Seating Capacity {renderSortIcon('seatingCapacity')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('screenType')}
              >
                Screen Type {renderSortIcon('screenType')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('isActive')}
              >
                Status {renderSortIcon('isActive')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('status')}
              >
                Actions {renderSortIcon('status')}
              </th>
              {/* <th
                className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {renderSortIcon('status')}
              </th> */}
              {/* <th
                className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {renderSortIcon('status')}
              </th> */}
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
              : filteredManagers.map((manager, index) => (
                  <tr
                    key={index}
                    onClick={() => handleManagerClick(manager._id)}
                    className="cursor-pointer"
                  >
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 text-center">
                      {/* <img
                        src={
                          manager.profileImage ||
                          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010'
                        }
                        alt={manager.profileImage}
                        className="w-12 h-12 rounded-full mr-4"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010';
                        }}
                      /> */}
                      <h5 className="font-medium text-black dark:text-white text-center">
                        {manager.name}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {manager.seatingCapacity}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {manager.screenType}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(manager._id,manager.isActive ? true : false);
                        }}
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          manager.isActive == true
                            ? 'bg-success text-success'
                            : 'bg-danger text-danger'
                        }`}
                      >
                        {manager.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <div>
                        {/* className="flex gap-2" */}
                        <button
                          // onClick={() => editBanner(banner)}
                          onClick={(e) =>{
                            e.stopPropagation(); 
                             handleEdit(manager)}}
                          className="p-2 text-sm font-medium rounded-md focus:outline-none hover:text-[#472DA9]"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                          <button
                                                 onClick={(e) =>{
                                                 e.stopPropagation();
                                                handleDelete(manager._id)}}
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
        {isModalOpen && (
          <UpdateScreenModal
            screenData={selectedTheatre}
            onSubmitSuccess={handleFormSubmitSuccess}
            onClose={handleCloseModal}
          />
        )}
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

export default ScreensTable;
