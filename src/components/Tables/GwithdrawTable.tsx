// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import '../../css/style.css';

// interface Manager {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   website: string;
//   company: {
//     name: string;
//   };
//   image: string;
//   salesToday: number;
//   salespersons: number;
//   status: boolean; // Add a status field to track active/inactive status
// }

// const GwithdrawTable: React.FC = () => {
//   const [sellers, setSellers] = useState<Manager[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof Manager | null;
//     direction: string;
//   }>({
//     key: null,
//     direction: 'ascending',
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get('https://jsonplaceholder.typicode.com/users')
//       .then((response) => {
//         const sellerData = response.data.map((seller: any) => ({
//           ...seller,
//           image: `https://robohash.org/${seller.id}?set=set3&size=50x50`, // Dummy image URL
//           salesToday: Math.floor(Math.random() * 100), // Random number of sales today
//           salespersons: Math.floor(Math.random() * 10) + 1, // Random number of salespersons
//         }));
//         setSellers(sellerData);
//         console.log(sellers);
//       })
//       .catch((error) => {
//         console.error('There was an error fetching the data!', error);
//       });
//   }, []);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleSort = (key: keyof Manager) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     const sortedSellers = [...sellers].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });
//     setSellers(sortedSellers);
//     setSortConfig({ key, direction });
//   };

//   const handleItemsPerPageChange = (
//     e: React.ChangeEvent<HTMLSelectElement>,
//   ) => {
//     setItemsPerPage(parseInt(e.target.value, 10));
//   };

//   const handleManagerClick = (id: number) => {
//     navigate(`/sellerDetail/${id}`);
//   };

//   // Toggle status function to switch between Active/Inactive
//   const toggleStatus = (id: number) => {
//     setSellers((prevManagers) =>
//       prevManagers.map((manager) =>
//         manager.id === id ? { ...manager, status: !manager.status } : manager,
//       ),
//     );
//   };

//   const filteredManagers = sellers.filter((seller) =>
//     seller.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredManagers.slice(
//     indexOfFirstItem,
//     indexOfLastItem,
//   );
//   const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);

//   const renderSortIcon = (key: keyof Manager) => {
//     if (sortConfig.key === key) {
//       return sortConfig.direction === 'ascending' ? (
//         <FontAwesomeIcon icon={faArrowUp} className="ml-2" />
//       ) : (
//         <FontAwesomeIcon icon={faArrowDown} className="ml-2" />
//       );
//     }
//     return null;
//   };

//   // Initialize state with Date | null
//  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
//    null,
//    null,
//  ]);
//  const [startDate, endDate] = dateRange;

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       {/* <h2 className='text-2xl font-medium text-black dark:text-white mb-2'>Sellers</h2> */}
//       <div className="flex justify-between md:gap-10 flex-col md:flex-row">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="mb-4  p-2 border border-gray-300 rounded dark:bg-boxdark flex-grow"
//           onChange={handleSearch}
//         />
//         <div>
//           <DatePicker
//             className="w-[77vw] md:w-[32vw] lg:w-[23vw] p-2 mb-4 dark:bg-boxdark border border-gray-300 rounded"
//             selectsRange
//             startDate={startDate || undefined} // Convert null to undefined
//             endDate={endDate || undefined} // Convert null to undefined
//             onChange={(update: [Date | null, Date | null] | null) => {
//               setDateRange(update || [null, null]); // Handle null case
//             }}
//             isClearable
//             placeholderText="Select a date range"
//           />
//         </div>
//         {/* <DateRangePicker placeholder="Select Date Range" /> */}
//       </div>
//       <div className="max-w-full overflow-x-auto">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th
//                 className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
//                 onClick={() => handleSort('name')}
//               >
//                 Username {renderSortIcon('name')}
//               </th>
//               <th
//                 className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
//                 onClick={() => handleSort('phone')}
//               >
//                 Contact {renderSortIcon('phone')}
//               </th>
//               <th
//                 className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
//                 onClick={() => handleSort('salesToday')}
//               >
//                 Amount {renderSortIcon('salesToday')}
//               </th>
//               <th
//                 className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
//                 onClick={() => handleSort('salespersons')}
//               >
//                 Date {renderSortIcon('salespersons')}
//               </th>
//               <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.map((manager) => (
//               <tr
//                 key={manager.id}
//                 // onClick={() => handleManagerClick(manager.id)}
//                 className="cursor-pointer"
//               >
//                 <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 flex items-center">
//                   <img
//                     src={manager.image}
//                     alt={manager.name}
//                     className="w-12 h-12 rounded-full mr-4"
//                   />
//                   <h5 className="font-medium text-black dark:text-white">
//                     {manager.name}
//                   </h5>
//                 </td>
//                 <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                   <p className="text-black dark:text-white">{manager.phone}</p>
//                 </td>
//                 <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                   <p className="text-black dark:text-white">
//                     {manager.salesToday}
//                   </p>
//                 </td>
//                 <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                   <p className="text-black dark:text-white">
//                     {manager.salespersons}
//                   </p>
//                 </td>
//                 <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent triggering the row click
//                       toggleStatus(manager.id);
//                     }}
//                     className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
//                       manager.status
//                         ? 'bg-success text-success'
//                         : 'bg-danger text-danger'
//                     }`}
//                   >
//                     {manager.status ? 'Success' : 'Failed'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="flex items-center justify-between mt-4">
//           <div>
//             <label htmlFor="itemsPerPage" className="mr-2">
//               Items per page:
//             </label>
//             <select
//               id="itemsPerPage"
//               value={itemsPerPage}
//               onChange={handleItemsPerPageChange}
//               className="p-1 border border-gray-300 rounded dark:bg-boxdark"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//             </select>
//           </div>
//           <div>
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="mr-2 p-2 bg-gray-200 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span>
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className="ml-2 p-2 bg-gray-200 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GwithdrawTable;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../css/style.css';
import { useSelector } from 'react-redux';
import Urls from '../../networking/app_urls';

interface Manager {
  id: number;
  gameUserId: {
    firstName: string;
    lastName: string;
    whatsappNumber: number;
    location: string;
    email: string;
    profileImage: string;
    qrCode: string;
  };
  amount: number;
  createdAt: string;
  status: string;
}

const GwithdrawTable: React.FC = () => {
  const [request, setRequest] = useState<Manager[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
 const [sortConfig, setSortConfig] = useState<{
   key: keyof Manager['gameUserId'] | 'amount' | 'status' | 'createdAt' | null;
   direction: string;
 }>({
   key: null,
   direction: 'ascending',
 });
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  // const [data, setData] = useState<any>(null); // Adjust type as per your data

  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  const fetchRequests = (
    page: number,
    limit: number,
    startDate: string | null,
    endDate: string | null,
  ) => {
    setLoading(true);

    // Construct the URL with optional date parameters
    const url =
      `${Urls.gameWithdrawalUrl}?page=${page}&limit=${limit}` +
      (startDate ? `&startDate=${startDate}` : '') +
      (endDate ? `&endDate=${endDate}` : '');

    axios
      .post(url, null, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => {
        if (response.data.data && response.data.data.withdrawals) {
          const requestData = response.data.data.withdrawals;
          setRequest(requestData);
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
    if (dateRange) {
      const startDate = dateRange[0]
        ? dateRange[0].toISOString().split('T')[0]
        : null;
      const endDate = dateRange[1]
        ? dateRange[1].toISOString().split('T')[0]
        : null;

      fetchRequests(currentPage, itemsPerPage, startDate, endDate);
    }
  }, [currentPage, itemsPerPage, dateRange]);

  // const fetchRequests = (page: number, limit: number) => {
  //   setLoading(true);
  //   axios
  //     .post(`${Urls.RequestUrl}?page=${page}&limit=${limit}`, null, {
  //       headers: {
  //         Authorization: `Bearer ${currentUser.token}`,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.data.data && response.data.data.requests) {
  //         const requestData = response.data.data.requests;
  //         setRequest(requestData);
  //         setTotalPages(response.data.pagination?.totalPages || 1);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   fetchRequests(currentPage, itemsPerPage);
  // }, [currentPage, itemsPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

   const handleSort = (
     key: keyof Manager['gameUserId'] | 'amount' | 'status' | 'createdAt',
   ) => {
     let direction = 'ascending';
     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
       direction = 'descending';
     }

     const sortedRequest = [...request].sort((a, b) => {
       let aValue: any;
       let bValue: any;

       // Handle sorting logic for each type of key
       if (key === 'amount') {
         aValue = a.amount;
         bValue = b.amount;
       } else if (key === 'status') {
         aValue = a.status;
         bValue = b.status;
       } else if (key === 'createdAt') {
         aValue = new Date(a.createdAt);
         bValue = new Date(b.createdAt);
       } else {
         aValue = a.gameUserId[key];
         bValue = b.gameUserId[key];
       }

       if (aValue < bValue) {
         return direction === 'ascending' ? -1 : 1;
       }
       if (aValue > bValue) {
         return direction === 'ascending' ? 1 : -1;
       }
       return 0;
     });

     setRequest(sortedRequest);
     setSortConfig({ key, direction });
   };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };

  const handleCopy = (fullName: string, qrCode: string, index: number) => {
    const copyText = `Full Name: ${fullName}\nQR Code: ${Urls.Image_url}${qrCode}`;

    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch(() => {
        console.error('Failed to copy text.');
      });
  };

  const filteredRequest = request.filter((req) =>
    `${req.gameUserId.firstName} ${req.gameUserId.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

    const renderSortIcon = (
      key: keyof Manager['gameUserId'] | 'amount' | 'status' | 'createdAt',
    ) => {
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

          {/* Render your data here */}
          {/* {data && (
            <div className="h-20 w-60 text-5xl text-red-500">
              {JSON.stringify(data)}{' '}
            </div>
          )} */}
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                onClick={() => handleSort('firstName')}
              >
                Username {renderSortIcon('firstName')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('whatsappNumber')}
              >
                Contact {renderSortIcon('whatsappNumber')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                Amount {renderSortIcon('amount')}
              </th>
              <th
                className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                Date {renderSortIcon('createdAt')}
              </th>
              <th
                className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white"
                onClick={() => handleSort('status')}
              >
                Status {renderSortIcon('status')}
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
                          <div className="flex-1 space-y-4 py-1 items-center flex">
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
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              : filteredRequest.map((req, index) => (
                  <tr key={req.id} className="cursor-pointer">
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 flex items-center">
                      <img
                        src={`${Urls.Image_url}${req.gameUserId.profileImage}`}
                        alt={req.gameUserId.firstName}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <h5 className="font-medium text-black dark:text-white">
                        {req.gameUserId.firstName} {req.gameUserId.lastName}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {req.gameUserId.whatsappNumber}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        ₹ {req.amount}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(req.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          req.status === 'approved'
                            ? 'bg-success text-success'
                            : req.status === 'pending'
                            ? 'bg-warning text-warning'
                            : 'bg-danger text-danger'
                        }`}
                      >
                        {req.status === 'approved'
                          ? 'Approved'
                          : req.status === 'pending'
                          ? 'Pending'
                          : 'Rejected'}
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

export default GwithdrawTable;
