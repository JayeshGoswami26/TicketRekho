import React, { useState,useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { CSVLink } from 'react-csv';

interface AppUser {
  _id: string;
  appUserId:{
    name: string;
    mobileNumber: string;
    email: string;
  }
  seats: [];
  isScanned: boolean;
  totalPrice: number;
  paymentStatus: string;
  grabABiteList:[{
    name: string;
    qty: number;
  }]
  seatsFormatted: string;
}

const TheatreReportTable: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);

  const [theatres, setTheatres] = useState<{ _id: string; name: string }[]>([]); // To store Theatre from API
   const [selectedTheatreId, setSelectedTheatreId] = useState<string>(''); // Store selected theatre's ID
  const [periods, setPeriods] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AppUser | null;
    direction: string;
  }>({
    key: null,
    direction: 'ascending',
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

 
  const handleTheatreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
     const selectedTheatreId = event.target.value;
     setSelectedTheatreId(selectedTheatreId);
   };
  
    const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const period = event.target.value;
      setPeriods(period);
    };

   // Fetch movies from API on component mount
 useEffect(() => {
  
  const fetchTheatres = async () => {
    try {
      const response = await axios.get(`${Urls.getActiveTheatres}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }); 
     // console.log(response.data.data)
      setTheatres(response.data.data); 
    } catch (error) {
      console.error('Error fetching theatres:', error);
    }
  };
  
  
 
  fetchTheatres();
  
  }, []);
 
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    if (!selectedTheatreId) {
      toast.error(
        'Oops! Please select theatre.',
      );
      return;
    }

    if (!periods) {
      toast.error(
        'Oops! Please select periods.',
      );
      return;
    }
    
    // console.log("periods",periods);
    // console.log("selectedTheatreId",selectedTheatreId);
    // console.log("startDate",startDate);
    // console.log("endDate",endDate);
    // Call fetchUsers with the selected filters
  fetchUsers(currentPage, itemsPerPage, periods, selectedTheatreId, startDate, endDate);

  };
  const fetchUsers = (page: number, limit: number, periods?: string, theatreId?: string, startDate?: string, endDate?: string) => {
 // const fetchUsers = (page: number, limit: number) => {
   // Construct the query parameters
   const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (periods) queryParams.append("period", periods);
  if (theatreId) queryParams.append("theatreId", theatreId);
  if (startDate) queryParams.append("customStartDate", startDate);
  if (endDate) queryParams.append("customEndDate", endDate);

    setLoading(true);
    axios
      .get(`${Urls.getThreatreReport}?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => {
        if (
          response.data.status &&
          response.data.data.bookingTickets &&
          Array.isArray(response.data.data.bookingTickets)
        ) {
         // const managerData = response.data.data.bookingTickets;
          const managerData = response.data.data.bookingTickets.map((manager: any) => ({
            ...manager,
            grabABiteList: manager.grabABiteList.map((grab: any) => ({
              name: grab.grabABiteId ? grab.grabABiteId.name : 'N/A',
              qty: grab.qty,
            })),
            seatsFormatted: manager.seats.map((seat: any) => seat.seatNumber).join(', '),
          }));
      
          console.log("managerData",managerData);
          setUsers(managerData);
          setTotalPages(response.data.data.pagination?.totalPages || 1); //response.data.data.pagination.totalPages
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
        setLoading(false);
      });
  };


  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: keyof AppUser) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedSellers = [...users].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setUsers(sortedSellers);
    setSortConfig({ key, direction });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };



  const filteredManagers = users.filter((user) =>
    user.appUserId.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

     const csvHeaders = [
    { label: 'User Name', key: 'name' },
    { label: 'Mobile Number', key: 'mobileNumber' },
    { label: 'Email', key: 'email' },
    { label: 'Grab A Bite', key: 'grabABiteList' },
    { label: 'Seats', key: 'mappedSeats' },
    { label: 'Total Price', key: 'totalPrice' },
    { label: 'Ticket Scanned', key: 'isScanned' },
     { label: 'Payment Status', key: 'paymentStatus' },
  ];

  const csvData = filteredManagers.map((user) => ({
    name: user.appUserId.name,
    mobileNumber:user.appUserId.mobileNumber,
    email: user.appUserId.email,
    grabABiteList: user.grabABiteList,
    mappedSeats: user.seatsFormatted,
    totalPrice: user.totalPrice,
    isScanned: user.isScanned ? 'Yes' : 'No',
    paymentStatus: user.paymentStatus,
  }));


  const renderSortIcon = (key: keyof AppUser) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <FontAwesomeIcon icon={faArrowUp} className="ml-2" />
      ) : (
        <FontAwesomeIcon icon={faArrowDown} className="ml-2" />
      );
    }
    return null;
  };

  // const handleModalFormSubmit = () => {
  //   fetchUsers(currentPage, itemsPerPage);
  // };

  return (
<div className="mx-auto max-w-270">

    <div className="flex flex-col gap-9 mb-9">
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Add States
        </h3>
      </div> */}
      <form onSubmit={handleSubmit}>
      <div className="p-6.5 grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-4">
                  <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">Select Theatre</label>
                <select
                  id="theatre"
                  value={selectedTheatreId}
                  onChange={handleTheatreChange}
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                >
                  <option value="" disabled>Select Theatre</option>
                  {theatres.map((theatre) => (
                    <option key={theatre._id} value={theatre._id} className="capitalize">{theatre.name}</option>
                  ))}
                </select>
              </div>
        
                  <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Period 
                  </label>
                  <select
                    id="event"
                    value={periods}
                    onChange={handlePeriodChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="" disabled>
                      Select Period
                    </option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                 
                </div>

              <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
             
              />
            </div>

           <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
            />
          </div>

          {/* {errorMessage && (
            <p className="text-red-500 col-span-2">{errorMessage}</p>
          )} */}
           <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded bg-[#865BFF] hover:bg-[#6a48c9] p-3 font-medium text-gray md:col-start-2"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          </div>
        </div>
      </form>
    </div>
  </div>


    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 w-full p-2 border border-gray-300 rounded dark:bg-boxdark"
          onChange={handleSearch}
        />
        {/* <CreateManModal onSubmitSuccess={handleModalFormSubmit} /> */}
         <CSVLink
                  data={csvData}
                  headers={csvHeaders}
                  filename="theatre_report.csv"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded h-10"
                >
                  CSV
                </CSVLink>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4">
              <th
                className="w-[220px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('appUserId')}
              >
                Name {renderSortIcon('appUserId')}
              </th>
             
              {/* <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                onClick={() => handleSort('appUserId')}
              >
                Email {renderSortIcon('appUserId')}
              </th> */}
              <th
                className="w-[150px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                onClick={() => handleSort('appUserId')}
              >
                Mobile {renderSortIcon('appUserId')}
              </th>
              <th
                className="w-[150px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center whitespace-nowrap"
                onClick={() => handleSort('appUserId')}
              >
                Grab a Bite {renderSortIcon('appUserId')}
              </th>
              <th
                className="w-[150px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
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
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center whitespace-nowrap"
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
              : filteredManagers.map((user, index) => (
                  <tr
                    key={index}
                   // onClick={() => handleManagerClick(manager._id)}
                    className="cursor-pointer"
                  >
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center whitespace-nowrap">
                     
                      <h5 className="text-black dark:text-white">
                        {user.appUserId.name || 'N/A'}
                      </h5>
                    </td>
                   
                    {/* <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {user.appUserId.email}
                      </p>
                    </td> */}
                    
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {user.appUserId.mobileNumber || 'N/A'}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                    {user.grabABiteList && user.grabABiteList.length > 0 ? (
                      user.grabABiteList.map((grab, i) => (
                        <div key={i} className="text-black dark:text-white">
                          {grab.name} ({grab.qty})
                        </div>
                      ))
                    ) : (
                      <span className="text-black dark:text-white">N/A</span>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {user.seatsFormatted}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {user.totalPrice}
                      </p>
                    </td>
                    
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                    <p
                      className={`${
                        user.isScanned ? 'text-green-500' : 'text-red-500'
                      } dark:text-white`}
                    >
                      {user.isScanned ? 'Yes' : 'No'}
                    </p>
                  </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                    <p
                    className={`${
                      user.paymentStatus === 'Completed'
                        ? 'text-green-500'
                        : 'text-red-500'
                    } dark:text-white`}
                  >
                    {user.paymentStatus}
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
  );
};

export default TheatreReportTable;
