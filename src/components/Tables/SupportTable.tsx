import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

interface SupportTicket {
  _id: string;
  appUserId: {
    name: string;
    email: string;
    mobileNumber: string;
    profileImage: string;
  };

  title: string;
  message: string;
  status: any;
}

const SupportTable: React.FC = () => {
  const [sTickets, setsTickets] = useState<SupportTicket[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SupportTicket | null;
    direction: string;
  }>({
    key: null,
    direction: 'ascending',
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);
  
  const fetchSupportTickets = (page: number, limit: number) => {
    setLoading(true);
    

    axios
      .post(`${Urls.supportTickets}?page=${page}&limit=${limit}`, null, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => {
        // console.log('Response:', response.data.data.supportReq);
        if (response.data.data && response.data.data.supportReq) {
          const ticketData = response.data.data.supportReq;
          setsTickets(ticketData);
          //console.log("Total Pages",response.data.data.pagination.totalPages);
          setTotalPages(response.data.data.pagination?.totalPages || 1);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };


  useEffect(() => {
    fetchSupportTickets(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof SupportTicket) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedTickets = [...sTickets].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setsTickets(sortedTickets);
    setSortConfig({ key, direction });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };



  const toggleStatus = (id: string, currentStatus: string) => {
   // let updatedStatus = !currentStatus;

    setLoading(true); // Optional: set a loading state if you have one
    const updatedStatus = currentStatus === "open" ? "closed" : "open";
    //console.log("currentStatus",currentStatus);
   // updatedStatus = currentStatus === "open" ? "closed" : "open";
    axios
      .post(
        `${Urls.updateSupportTicket}`,
        {
          ticketId: id,
          status: updatedStatus, // Adjust according to your API requirements
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
            'Support ticket status changed successfully!',
          );
          // Update the status locally after a successful API response
          setsTickets((prevTicket) =>
            prevTicket.map((ticket) =>
              ticket._id === id // Use the correct id parameter here
                ? { ...ticket, status: updatedStatus }
                : ticket,
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
        console.error('Error updating ticket status:', error);
      })
      .finally(() => {
        setLoading(false); // Optional: reset loading state
      });
  };


    const filteredTickets = sTickets.filter((ticket) => {
      const search = searchTerm.toLowerCase();
      return (
        ticket.appUserId?.name?.toLowerCase().includes(search) ||
        ticket.appUserId?.email?.toLowerCase().includes(search) ||
        ticket.appUserId?.mobileNumber?.toLowerCase().includes(search) ||
        ticket.title?.toLowerCase().includes(search) ||
        ticket.message?.toLowerCase().includes(search)
      );
    });



  const renderSortIcon = (key: keyof SupportTicket) => {
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
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('appUserId')}
              >
                User Name {renderSortIcon('appUserId')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('title')}
              >
                Title {renderSortIcon('title')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('message')}
              >
                Message {renderSortIcon('message')}
              </th>
              <th className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center">
                Status
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
              : filteredTickets.map((ticket, index) => (
                  <tr key={index} className="cursor-pointer">
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 text-center ">
                      {/* <img
                        src={
                          `${Urls.Image_url}${ticket.appUserId.profileImage}` ||
                          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010'
                        }
                        alt={ticket.appUserId.name}
                        className="w-12 h-12 rounded-full space-x-4"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010';
                        }}
                      /> */}
                      <h5 className="font-medium text-black dark:text-white">
                        {ticket.appUserId.name || 'N/A'}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      {ticket.title || 'N/A'}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      {ticket.message || 'N/A'}
                    </td>
                    {/* <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {ticket.status}
                    </td> */}
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(ticket._id, ticket.status);
                        }}
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          ticket.status == 'open'
                            ? 'bg-success text-success'
                            : 'bg-danger text-danger'
                        }`}
                      >
                        {ticket.status == 'open' ? 'Active' : 'Inactive'}
                      </button>
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

export default SupportTable;
