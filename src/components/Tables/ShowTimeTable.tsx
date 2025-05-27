import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrashAlt,
  faTicketAlt,
} from '@fortawesome/free-solid-svg-icons';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
//import ShowTimeForm from '../ShowTimeForm';
import ShowTimeModalForm from '../../components/Modals/CreateShowTimeModal';
import UpdateShowTimeModel from "../Modals/UpdateShowTimeModel";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface ShowTime {
  _id: string;
  startTime: string;
  endTime: string;
  movie:{
    name: string;
    movieImage: string;
  }
  theatre:{
    name: string;
  }
  screen:{
    name: string;
  }
  state:{
    name: string;
  }
  city:{
    name: string;
  }
  totalEarnings: number;
  isActive: boolean;
}

const ShowTimeTable: React.FC = () => {
  const [showtime, setShowtimes] = useState<ShowTime[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ShowTime | null;
    direction: string;
  }>({
    key: null,
    direction: 'ascending',
  });
  const [loading, setLoading] = useState(true);
  const [selectedShowTime, setSelectedShowTime] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);
  const roleName = currentUser.role;

  // Function to format date in a specific timezone
  const formatUTCDate = (date: string | Date) => {
    try {
      const utcDate = new Date(date);  // Parse the UTC date string
  
      // Adjust the date to your desired local timezone (in this case Asia/Kolkata)
      const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  
      // Format the local date to "yyyy-MM-dd HH:mm"
      return format(localDate, 'yyyy-MM-dd HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return ''; // Return an empty string in case of an error
    }
  };
  

  const fetchManagers = (page: number, limit: number) => {
    setLoading(true);
    axios
      .get(`${Urls.getMovieShowtimesbyManager}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => {
        if (
          response.data.status &&
          response.data.data.showtimes &&
          Array.isArray(response.data.data.showtimes)
        ) {
          //const managerData = response.data.data.showtimes;

           const managerData = response.data.data.showtimes.map((manager: any) => ({
                      ...manager,               
                      startTime: formatUTCDate(manager.startTime),
                      endTime: formatUTCDate(manager.endTime),
                    }));
          
         
          setShowtimes(managerData);
          setTotalPages(response.data.data.pagination?.totalPages || 1); // Set total pages from API
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
        setLoading(false);
      });
  };

    const handleUpdateSuccess = () => {
    fetchManagers(currentPage, itemsPerPage);
    setShowModal(false);
  };

  useEffect(() => {
    fetchManagers(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof ShowTime) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedManagers = [...showtime].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setShowtimes(sortedManagers);
    setSortConfig({ key, direction });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

 

  const toggleStatus = (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    axios
      .post(
        `${Urls.changeMovieShowTimeStatus}`,
        { id , isActive: updatedStatus ? true : false,},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      )
      .then((response) => {
        if (response.data.status) {
         
          toast.success(
            'Showtime status changed successfully!',
          );
          setShowtimes((prevShowTimes) =>
            prevShowTimes.map((showtime) =>
              showtime._id === id // Use the correct id parameter here
                ? { ...showtime, isActive: updatedStatus }
                : showtime,
            ),
          );

        }
      })
      .catch((error) => {
        console.error('Error deleting showtime:', error);
        toast.error(
          'Oops! Something went wrong while deleting the showtime. Please try again later.',
        );
      });
  };

     const MySwal = withReactContent(Swal);
  
  const handleDelete = (showtimeId: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this showtime? This action cannot be undone.',
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
        deleteShowTime(showtimeId);
      }
    });
  };

  const deleteShowTime = (id: string) => {
    axios
      .post(
        `${Urls.deleteMovieShowTime}`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      )
      .then((response) => {
        if (response.data.status) {
         
          toast.success(
            'Showtime deleted successfully!',
          );

            setShowtimes((prevShowTimes) =>
            prevShowTimes.filter((showtime) => showtime._id !== id),
          );

          // setShowtimes((prevShowTimes) =>
          //   prevShowTimes.map((showtime) =>
          //     showtime._id === id // Use the correct id parameter here
          //       ? { ...showtime, isActive: updatedStatus }
          //       : showtime,
          //   ),
          // );

        }
      })
      .catch((error: any) => {

         console.error('Error:', error);

  const errorMessage =
    error?.response?.data?.message ||
     'Oops! Something went wrong while deleting the showtime. Please try again later.';

  toast.error(errorMessage);

       
      });
  };

const filteredManagers = showtime.filter((showtime) => {
  const search = searchTerm.toLowerCase();

  return (
    (showtime.movie?.name?.toLowerCase().includes(search)) ||
    (showtime.theatre?.name?.toLowerCase().includes(search)) ||
    (showtime.screen?.name?.toLowerCase().includes(search)) ||
    (showtime.state?.name?.toLowerCase().includes(search)) ||
    (showtime.city?.name?.toLowerCase().includes(search))
  );
});


  const renderSortIcon = (key: keyof ShowTime) => {
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
    setSelectedShowTime(null);
    fetchManagers(currentPage, itemsPerPage);
  };

  const handleCancelEdit = () => {
    // Reset selectedBanner and close the modal
    setSelectedShowTime(null);
    setShowModal(false);
  };

  const handleEditClick = (showtimeId: string) => {
      // Find the full ShowTime object using the ID
 // const foundShowTime = showtimes.find(show => show.id === showtimeId) || null;

 // setSelectedShowTime(foundShowTime); // Set the full object, or null if not found
    setSelectedShowTime(showtimeId); // Set the movie ID
    setShowModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedShowTime(null); // Reset the movie ID
  };

  const handleMovieTicketClick = (id: string) => {
   // navigate(`/moviestickets/${id}`);
    navigate(`/showtime-realtime-seat-status/${id}`);
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

         <ShowTimeModalForm onSubmitSuccess={handleModalFormSubmit}/> 
        )}
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('movie')}
              >
                Movie {renderSortIcon('movie')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('theatre')}
              >
                Theatre {renderSortIcon('theatre')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('screen')}
              >
                Screen {renderSortIcon('screen')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('startTime')}
              >
                Start {renderSortIcon('startTime')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('endTime')}
              >
                End {renderSortIcon('endTime')}
              </th>

              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('totalEarnings')}
              >
                Earnings {renderSortIcon('totalEarnings')}
              </th>

              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('isActive')}
              >
                Launch {renderSortIcon('isActive')}
              </th>
             
              <th
                className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                // onClick={() => handleSort('status')}
              >
                Actions
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
              : filteredManagers.map((showtime, index) => (
                  <tr key={index} 
                   onClick={() => handleMovieTicketClick(showtime._id)} 
                    className="cursor-pointer"
                    >
                    <td className="border-b border-[#eee] py-5 px-4  dark:border-strokedark text-center">
                    

                      <h5 
                      
                      // title={`View Booking Tickets`} // <- This shows the full title on hover
                       className="font-medium text-black dark:text-white"
                       >
                        {showtime.movie.name}
                      </h5>
                     
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {showtime.theatre.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {showtime.screen.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                      {showtime.startTime}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                      {showtime.endTime}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                      ₹{Number(showtime.totalEarnings).toLocaleString()}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(showtime._id,showtime.isActive ? true : false);
                        }}
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          showtime.isActive == true
                            ? 'bg-success text-success'
                            : 'bg-danger text-danger'
                        }`}
                      >
                        {showtime.isActive ? 'Released' : 'Unreleased'}
                      </button>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <div>
                         {/* className="flex gap-2" */}
                        <button
                          onClick={(e) =>{ 
                            e.stopPropagation();
                            handleEditClick(showtime._id)}}
                          className="p-2 text-sm font-medium rounded-md focus:outline-none hover:text-[#472DA9]"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button> 
                       
                         <button
                                                                                            onClick={(e) =>{
                                                                                               e.stopPropagation();
                                                                                             handleDelete(showtime._id)}}
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
        {showModal && selectedShowTime && (
          <UpdateShowTimeModel showtimeId={selectedShowTime} onClose={handleCloseModal} onSubmitSuccess={handleUpdateSuccess} />
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

export default ShowTimeTable;

