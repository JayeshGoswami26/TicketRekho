import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import Sellerform from '../Sellerform';

interface TManager {
  _id: string;
  appUserId:{
    name: string;
    mobileNumber: string;
    email: string;
  }
  totalPrice: number;
  paymentStatus: string;
  grabABiteList:[{
    name: string;
    qty: number;
  }]
  name: string;
  image: string;
  seatsFormatted: string;
  type: string;
  
}

interface SellersTableProps {
  userId: string;
  onFilteredSellersChange: (count: number) => void; // New prop
}

const UserTicketsTable: React.FC<SellersTableProps> = ({
  userId,
  onFilteredSellersChange,
}) => {

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

  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  const fetchSellers = (page: number, limit: number) => {
    setLoading(true);
    axios
      .get(`${Urls.getUserBookingTicketes}?appUserId=${userId}&page=${page}&limit=${limit}`, {
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

          const managerData = response.data.data.map((manager: any) => ({
            ...manager,
            grabABiteList: manager.grabABiteList.map((grab: any) => ({
              name: grab.grabABiteId ? grab.grabABiteId.name : 'N/A',
              qty: grab.qty,
            })),

          // Assign common 'name' from either movie or event
          name:
          manager.type === 'movie'
            ? manager.showtime?.movie?.name || 'N/A'
            : manager.type === 'event'
            ? manager.eventId?.name || 'N/A'
            : 'N/A',

            // Common image from movieImage or eventImage
          image:
          manager.type === 'movie'
            ? manager.showtime?.movie?.movieImage || ''
            : manager.type === 'event'
            ? manager.eventId?.eventImage || ''
            : '',
            
            ...(manager.type === 'movie' && {
              seatsFormatted: manager.seats.map((seat: any) => seat.seatNumber).join(', '),
            }),
            ...(manager.type === 'event' && manager.eventId?.eventType === 'sitting' && {
              seatsFormatted: (manager.venueId?.sittingSeats || [])
                .map((seat: any) => seat.seatNumber)
                .join(', '),
            }),
            ...(manager.type === 'event' && manager.eventId?.eventType === 'nonSitting' && {
              seatsFormatted: (manager.venueId?.nonSittingSeats || [])
                .map((seat: any) => seat.name)
                .join(', '),
            }),
          }));

       console.log("managerData",managerData);

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
  }, [currentPage, itemsPerPage, userId]);

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

    const formatName = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')         // Add space before capital letters
    .split(' ')                                   // Split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ');                                   // Join words back
};

  const filteredManagers = sellers.filter((seller) =>
    seller.appUserId.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    onFilteredSellersChange(filteredManagers.length);
  }, [filteredManagers, onFilteredSellersChange]);

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

  return (
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
                onClick={() => handleSort('image')}
              >
                Image {renderSortIcon('image')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('name')}
              >
                Name {renderSortIcon('name')}
              </th>

              {/* <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                onClick={() => handleSort('appUserId')}
              >
                Mobile {renderSortIcon('appUserId')}
              </th> */}
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('type')}
              >
                Type {renderSortIcon('type')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('appUserId')}
              >
                Grab a Bite {renderSortIcon('appUserId')}
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

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                                          <a
                                            href={`${Urls.Image_url}${manager.image}`}
                                            target="_blank"
                                          >
                                            <img
                                              className="h-12 w-full object-contain"
                                              src={`${Urls.Image_url}${manager.image}`}
                                              alt=""
                                            />
                                          </a>
                                        </td>     
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark text-center">
                    
                      <h5 className="font-medium text-black dark:text-white">
                        {manager.name}
                      </h5>
                    </td>

                   
{/*                     
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {manager.appUserId.mobileNumber}
                      </p>
                    </td> */}

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {formatName(manager.type)}
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
  );
};

export default UserTicketsTable;
