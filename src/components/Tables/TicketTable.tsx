import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Manager {
  dateCreatedAt: any;
  ticketId: any;
  gameUserName: any;
  _id: number;
  name: string;
  email: string;
  phoneNumber: string;
  image: string;
  salesToday: number;
  salespersons: number;
  status: boolean;
  todaysTarget: number; 
}

const TicketTable: React.FC = () => {
  const [sellers, setSellers] = useState<Manager[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Manager | null;
    direction: string;
  }>({
    key: null,
    direction: 'ascending',
  });
  const [loading, setLoading] = useState(true);
  
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);


  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  

  const fetchSellers = (
    page: number,
    limit: number,
    startDate: string | null,
    endDate: string | null,
  ) => {
    setLoading(true);

   const url = `${Urls.TicketsUrl}?page=${page}&limit=${limit}`  +
      (startDate ? `&startDate=${startDate}` : '') +
      (endDate ? `&endDate=${endDate}` : '');

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => {
        // Check the response structure
        if (
          response.data.status &&
          response.data.data &&
          response.data.data.tickets && // Ensure tickets array exists
          Array.isArray(response.data.data.tickets) // Check if it's an array
        ) {
          const ticketData = response.data.data.tickets.map((ticket: any) => ({
            id: ticket._id,
            ticketId: ticket.ticketId,
            ticketValue: ticket.ticketValue,
            isRedeemed: ticket.isRedeemed,
            dateRedeemed: ticket.dateRedeemed,
            sellerName: ticket.sellerId.name,
            gameUserName: `${ticket.gameUserId.firstName} ${ticket.gameUserId.lastName}`,
            status: ticket.isRedeemed,
            dateCreatedAt: ticket.createdAt,
            image: `${Urls.Image_url}${ticket.gameUserId.profileImage} `,
          }));
          setSellers(ticketData);
          setTotalPages(response.data.data.pagination.totalPages);
        } else {
          console.error('No tickets found in response', response.data);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      })
      .finally(() => {
        setLoading(false); // Always set loading to false, even on error
      });
  };

 useEffect(() => {
   if (dateRange) {
     const startDate = dateRange[0]
       ? dateRange[0].toISOString().split('T')[0]
       : null;
     const endDate = dateRange[1]
       ? dateRange[1].toISOString().split('T')[0]
       : null;

     fetchSellers(currentPage, itemsPerPage, startDate, endDate);
   }
 }, [currentPage, itemsPerPage, dateRange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof Manager) => {
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

  const handleManagerClick = (id: number) => {
    navigate(`/sellerDetail/${id}`);
  };



  const toggleStatus = (id: number, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;

    axios
      .post(
        `${Urls.sellerStatusUrl}`,
        {
          sellerId: id,
          active: updatedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      )
      .then((response) => {
        if (response.data.status) {
          // Update the status locally after a successful API response
          setSellers((prevSellers) =>
            prevSellers.map((seller) =>
              seller._id === id ? { ...seller, status: updatedStatus } : seller,
            ),
          );
        }
      })
      .catch((error) => {
        console.error('Error updating seller status:', error);
      });
  };

  
  const filteredManagers = sellers.filter((seller) =>
    seller.gameUserName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderSortIcon = (key: keyof Manager) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <FontAwesomeIcon icon={faArrowUp} className="ml-2" />
      ) : (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" />
      );
    }
    return null;
  };

   const handleDateChange = (update: [Date | null, Date | null] | null) => {
     setDateRange(update || [null, null]);
   };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 w-full p-2 border border-gray-300 rounded dark:bg-boxdark"
          onChange={handleSearch}
        />
      </div> */}
      <div className="flex justify-between md:gap-10 flex-col md:flex-row">
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 p-2 border border-gray-300 rounded dark:bg-boxdark flex-grow"
          onChange={handleSearch}
        />
        <div>
          <DatePicker
            className="w-[77vw] md:w-[32vw] lg:w-[23vw] p-2 mb-4 dark:bg-boxdark border border-gray-300 rounded"
            selectsRange
            startDate={dateRange[0] || undefined}
            endDate={dateRange[1] || undefined}
            onChange={handleDateChange}
            isClearable
            placeholderText="Select a date range"
          />

          
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                User Name {renderSortIcon('name')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                onClick={() => handleSort('phoneNumber')}
              >
                Ticket Id {renderSortIcon('phoneNumber')}
              </th>

              <th
                className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('salespersons')}
              >
                Date {renderSortIcon('salespersons')}
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
                    </tr>
                  ))
              : filteredManagers.map((manager, index) => (
                  <tr key={index} className="cursor-pointer">
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 flex items-center">
                      <img
                        src={
                          manager.image ||
                          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010'
                        }
                        alt={manager.name}
                        className="w-12 h-12 rounded-full mr-4"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010';
                        }}
                      />
                      <h5 className="font-medium text-black dark:text-white">
                        {manager.gameUserName}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {manager.ticketId}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(manager.dateCreatedAt).toLocaleDateString(
                          'en-GB',
                        )}
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

export default TicketTable;
