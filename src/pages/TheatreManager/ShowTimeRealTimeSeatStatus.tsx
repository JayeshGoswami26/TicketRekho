import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import urls from '../../networking/app_urls';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

type SeatRow = {
  label: string; // Row label (e.g., A, B, C)
  seats: (number | '')[]; // Seats in the row, including spaces
  type: string; // Row type ('Recliner', 'Silver', 'Gold', 'Diamond')
};

interface TManager {
  _id: string;
  appUserId:{
    name: string;
    mobileNumber: string;
    email: string;
  }
  isScanned: boolean;
  totalPrice: number;
  paymentStatus: string;
  grabABiteList:[{
    name: string;
    qty: number;
  }]
  seatsFormatted: string;
}


interface TShowTimeDetail {
  movie: { name: string };
  screen: { name: string };
  theatre: { name: string };
  state: { name: string };
  city: { name: string };
  startTime: string;
}


const ShowTimeRealTimeSeatStatus: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

     
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

  const socketRef = useRef<any>(null); // keep socket reference
  const [seatData, setSeatData] = useState<any[]>([]);
  const [showTime, setShowTime] = useState<TShowTimeDetail | null>(null);

  const currentUser = useSelector((state: any) => state.user.currentUser?.data);
 
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

 // 1. Declare the function FIRST
const getSeatCounts = () => {
  let booked = 0;
  let available = 0;

  seatData.forEach((plan: any) => {
    plan.rows.forEach((row: any) => {
      row.seats.forEach((seat: any) => {
        if (seat.seatNumber !== '') {
          if (seat.status === 'booked') booked++;
          else if (seat.status === 'available') available++;
        }
      });
    });
  });

  return { booked, available };
};

// 2. Then use it
const { booked, available } = getSeatCounts();

  

useEffect(() => {
  const fetchShowTimeDetail = async () => {
    try {
      const res = await axios.get(`${urls.getMovieShowtimeFullDetailById}?showtimeId=${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

   
      const data = res.data.data;

    const result: TShowTimeDetail = {
      movie: { name: data.movie.name },
      screen: { name: data.screen.name },
      theatre: { name: data.theatre.name },
      state: { name: data.state.name },
      city: { name: data.city.name },
      startTime: formatUTCDate(data.startTime),
    };

    setShowTime(result);


    } catch (err) {
      console.error('Error fetching state:', err);
    }
  };

  if (id) fetchShowTimeDetail();
}, [id, currentUser.token]);


  useEffect(() => {

    socketRef.current = io(urls.Socket_url);
      // Emit to join room
      socketRef.current.emit('movieBookingSeatLayout', { showId: id });

      // Listen for updates
      socketRef.current.on('movieSeatLayout', (data:any) => {
        console.log('data', data);
        if (data?.status && Array.isArray(data.data)) {
          setSeatData(data.data); 
        } else {
          console.error("Invalid data format from socket:", data);
        }
      });
  
      // Clean up
      return () => {
        socketRef.current.disconnect();
      };
    }, []);

    const handleViewBooking = () => {
      navigate(`/moviestickets/${id}`); // make sure `id` is defined
    };

    const renderSocketSeats = () => {
      return seatData.map((plan: any) => (
        <div key={plan.PlanName} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{plan.PlanName}</h2>
          {plan.rows.map((row: any) => (
            <div key={row.row} className="mb-3">
              <div className="flex items-center mb-1">
                <span className="text-lg font-semibold mr-4 w-6">{row.row}</span>
                <div className="flex flex-wrap gap-2">
                  {row.seats.map((seat: any) => {
                    let baseClass =
                      'w-10 h-10 text-sm flex items-center justify-center rounded border transition-all';
    
                    // If seatNumber is blank, style it as disabled/empty
                    if (seat.seatNumber === '') {
                      return (
                        <div
                          key={seat._id}
                          className={`${baseClass} bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed`}
                          title="No seat"
                        >
                          —
                        </div>
                      );
                    }
    
                    // If booked
                    if (seat.status === 'booked') {
                      return (
                        <div
                          key={seat._id}
                          className={`${baseClass} bg-red-500 text-white border-red-600 cursor-not-allowed`}
                          title="Booked"
                        >
                          {seat.seatNumber}
                        </div>
                      );
                    }
    
                    // Default: available
                    return (
                      <div
                        key={seat._id}
                        className={`${baseClass} bg-green-500 text-white border-green-600 hover:bg-green-600 cursor-pointer`}
                        title="Available"
                      >
                        {seat.seatNumber}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ));
    };
    



    const fetchSellers = (page: number, limit: number) => {
      setLoading(true);
      axios
        .get(`${urls.getUserMovieBookingTicketesByShowTime}?showtime=${id}&page=${page}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        })
        .then((response) => {
          if (
            response.data.status &&
            response.data.data.filteredTickets &&
            Array.isArray(response.data.data.filteredTickets)
          ) {
            const managerData = response.data.data.filteredTickets.map((manager: any) => ({
              ...manager,
              grabABiteList: manager.grabABiteList.map((grab: any) => ({
                name: grab.grabABiteId ? grab.grabABiteId.name : 'N/A',
                qty: grab.qty,
              })),
              seatsFormatted: manager.seats.map((seat: any) => seat.seatNumber).join(', '),
            }));
  
         // console.log("grabABiteId",managerData);
  
            setSellers(managerData);
            setTotalPages(response.data.data.pagination?.totalPages || 1);
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
  
  
    const filteredManagers = sellers.filter((seller) =>
      seller.appUserId.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
  
    const formatDateTime = (isoString: string): string => {
      const date = new Date(isoString);
    
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
    
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
    
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    
 
  return (
    <>
    <Breadcrumb pageName="Showtime Real-Time Seat Status" parentName="Showtimes" parentPath="/showtime" />
    <div className="p-5">
<div className="p-5 space-y-6">

{/* Showtime Info Card */}
{showTime && (
<div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200 p-6">
  <h2 className="text-xl font-bold text-gray-800 mb-4">🎬 Showtime Details</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
    <div><span className="font-semibold">Movie:</span> {showTime?.movie?.name}</div>
    <div><span className="font-semibold">Theatre:</span> {showTime?.theatre?.name}</div>
    <div><span className="font-semibold">Screen:</span> {showTime?.screen?.name}</div>
    <div><span className="font-semibold">State:</span> {showTime?.state?.name}</div>
    <div><span className="font-semibold">City:</span> {showTime?.city?.name}</div>
    <div className="sm:col-span-2"><span className="font-semibold">Start Time:</span> {formatDateTime(showTime.startTime)}</div>
  </div>
</div>
)}

{/* Booking Status */}
<div className="flex justify-center">
  <div className="flex gap-4 bg-white shadow-md p-4 rounded-lg border border-gray-100">
    <div className="bg-red-100 text-red-700 font-semibold text-sm px-4 py-2 rounded border border-red-300">
      🔴 Booked: {booked}
    </div>
    <div className="bg-green-100 text-green-700 font-semibold text-sm px-4 py-2 rounded border border-green-300">
      🟢 Available: {available}
    </div>
  </div>
</div>

</div>


      <div className="bg-white-100 p-5 rounded shadow-lg">
     

        
        {renderSocketSeats()}
        </div>


      <div className="bg-white-100 p-5 rounded shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Booking Ticket History
      </h3>
  
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 w-full p-2 border border-gray-300 rounded dark:bg-boxdark"
          onChange={handleSearch}
        />
         {/* <AddGrabABiteModal onSubmitSuccess={handleModalFormSubmit} />  */}
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('appUserId')}
              >
                Name {renderSortIcon('appUserId')}
              </th>

              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('appUserId')}
              >
                Mobile {renderSortIcon('appUserId')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('appUserId')}
              >
                Grab a bite {renderSortIcon('appUserId')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('appUserId')}
              >
                Seats {renderSortIcon('appUserId')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('totalPrice')}
              >
                Price {renderSortIcon('totalPrice')}
              </th>
                <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('isScanned')}
              >
                Ticket Scanned {renderSortIcon('isScanned')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('paymentStatus')}
              >
                Status {renderSortIcon('paymentStatus')}
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
                  
                    className="cursor-pointer"
                  >
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark text-center">
                    
                      <h5 className="font-medium text-black dark:text-white">
                        {manager.appUserId.name || 'N/A'}
                      </h5>
                    </td>

                   
                    
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {manager.appUserId.mobileNumber || 'N/A'}
                      </p>
                    </td>
   

                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                    {manager.grabABiteList && manager.grabABiteList.length > 0 ? (
                      manager.grabABiteList.map((grab, i) => (
                        <div key={i} className="text-sm text-black dark:text-white">
                          {grab.name} ({grab.qty})
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {manager.seatsFormatted}
                      </p>
                    </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {manager.totalPrice}
                      </p>
                    </td>
                   
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                    <p
                      className={`${
                        manager.isScanned ? 'text-green-500' : 'text-red-500'
                      } dark:text-white`}
                    >
                      {manager.isScanned ? 'Yes' : 'No'}
                    </p>
                  </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                    <p
                    className={`${
                      manager.paymentStatus === 'Completed'
                        ? 'text-green-500'
                        : 'text-red-500'
                    } dark:text-white`}
                  >
                    {manager.paymentStatus}
                  </p>
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


  </div>

    </div>
    </>
  );

  



};




export default ShowTimeRealTimeSeatStatus;
