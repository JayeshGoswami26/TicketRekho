// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
// import { useSelector } from 'react-redux';
// import Urls from '../../networking/app_urls';

// interface Manager {
//   profileImage: any;
//   depositDate: any;
//   slip: string | undefined;
//   amount: any;
//   userId: any;
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   image: string;
//   salesToday: number;
//   salespersons: number;
//   status: boolean; // Add a status field to track active/inactive status
// }

// const ManagerDepositTable: React.FC = () => {
//   const [deposits, setDeposits] = useState<Manager[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof Manager | null;
//     direction: string;
//   }>({
//     key: null,
//     direction: 'ascending',
//   });
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();
//   const currentUser = useSelector((state: any) => state.user.currentUser.data);

  

//   const fetchSupportTickets = (page: number, limit: number) => {
//     setLoading(true);

//     axios
//       .post(`${Urls.ManagerTDepositUrl}?page=${page}&limit=${limit}`, null, {
//         headers: {
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//       })
//       .then((response) => {
//         // console.log('Response:', response.data.data);
//         if (response.data.data && response.data.data.deposits) {
//           const ticketData = response.data.data.deposits;
//           setDeposits(ticketData);
//           setTotalPages(response.data.data.pagination.totalPages);
//         }
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchSupportTickets(currentPage, itemsPerPage);
//   }, [currentPage, itemsPerPage]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleSort = (key: keyof Manager) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     const sortedSellers = [...deposits].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });
//     setDeposits(sortedSellers);
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
//   const toggleStatus = (id: string) => {
//     setDeposits((prevManagers) =>
//       prevManagers.map((manager) =>
//         manager._id === id ? { ...manager, status: !manager.status } : manager,
//       ),
//     );
//   };

//   // console.log("deposits",deposits)

//   const filteredDeposits = deposits.filter((deposit) =>
//     deposit.userId.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

 

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

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       {/* <h2 className='text-2xl font-medium text-black dark:text-white mb-2'>Sellers</h2> */}
//       <input
//         type="text"
//         placeholder="Search..."
//         className="mb-4 w-full p-2 border border-gray-300 rounded dark:bg-boxdark"
//         onChange={handleSearch}
//       />
//       <div className="max-w-full overflow-x-auto">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th
//                 className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
//                 onClick={() => handleSort('name')}
//               >
//                 Sellers {renderSortIcon('name')}
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
//                 File
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading
//               ? Array(5)
//                   .fill(0)
//                   .map((_, index) => (
//                     <tr key={index}>
//                       <td className="py-4 px-4">
//                         <div className="animate-pulse flex space-x-4">
//                           <div className="rounded-full bg-slate-200 dark:bg-slate-300 h-10 w-10"></div>
//                           <div className="flex-1 space-y-4 py-1 items-center flex ">
//                             <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full"></div>
//                             {/* <div className="h-4 bg-gray-300 dark:bg-slate-300 rounded w-1/2"></div> */}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
//                       </td>
//                     </tr>
//                   ))
//               : filteredDeposits.map((manager) => (
//                   <tr
//                     key={manager._id}
//                     // onClick={() => handleManagerClick(manager.id)}
//                     className="cursor-pointer"
//                   >
//                     <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 flex items-center">
//                       <img
//                         src={`${Urls.Image_url}${manager.userId.profileImage}`}
//                         alt={manager.name}
//                         className="w-12 h-12 rounded-full mr-4"
//                       />
//                       <h5 className="font-medium text-black dark:text-white">
//                         {manager.userId.name}
//                       </h5>
//                     </td>
//                     <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                       <p className="text-black dark:text-white">
//                         {manager.userId.phoneNumber}
//                       </p>
//                     </td>
//                     <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                       <p className="text-black dark:text-white">
//                         {manager.amount}
//                       </p>
//                     </td>
//                     <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                       <p className="text-black dark:text-white">
//                         {new Date(manager.depositDate).toLocaleDateString(
//                           'en-GB',
//                         )}
//                       </p>
//                     </td>
//                     <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                       {/* <button
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
//                   </button> */}
//                       <a
//                         href={`${Urls.Image_url}${manager.slip}`}
//                         target="_blank"
//                       >
//                         <img
//                           className="h-12 w-12"
//                           src={`${Urls.Image_url}${manager.slip}`}
//                           alt=""
//                         />
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
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
//               <option value={15}>15</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
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

// export default ManagerDepositTable;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import Urls from '../../networking/app_urls';

interface Manager {
  profileImage: string | null;
  depositDate: string | null;
  slip: string | undefined;
  amount: number | null;
  userId: {
    name: string | null;
    phoneNumber: string | null;
    profileImage: string | null;
  } | null;
  _id: string;
  status: boolean; // Added status to track active/inactive status
}

const ManagerDepositTable: React.FC = () => {
  const [deposits, setDeposits] = useState<Manager[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
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

  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  const fetchSupportTickets = (page: number, limit: number) => {
    setLoading(true);

    axios
      .post(`${Urls.ManagerTDepositUrl}?page=${page}&limit=${limit}`, null, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => {
        if (response.data.data && response.data.data.deposits) {
          const ticketData = response.data.data.deposits;
          setDeposits(ticketData);
          setTotalPages(response.data.data.pagination.totalPages);
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

  const handleSort = (key: keyof Manager) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedDeposits = [...deposits].sort((a, b) => {
      if (a[key]! < b[key]!) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key]! > b[key]!) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setDeposits(sortedDeposits);
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

  // Toggle status function to switch between Active/Inactive
  const toggleStatus = (id: string) => {
    setDeposits((prevManagers) =>
      prevManagers.map((manager) =>
        manager._id === id ? { ...manager, status: !manager.status } : manager,
      ),
    );
  };

  // Filter deposits based on search term and handle userId possibly being null
  const filteredDeposits = deposits.filter(
    (deposit) =>
      deposit.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false,
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

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 w-full p-2 border border-gray-300 rounded dark:bg-boxdark"
        onChange={handleSearch}
      />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                onClick={() => handleSort('userId')}
              >
                Sellers {renderSortIcon('userId')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                onClick={() => handleSort('userId')}
              >
                Contact {renderSortIcon('userId')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                Amount {renderSortIcon('amount')}
              </th>
              <th
                className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('depositDate')}
              >
                Date {renderSortIcon('depositDate')}
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer">
                File
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
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                      </td>
                    </tr>
                  ))
              : filteredDeposits.map((manager) => (
                  <tr key={manager._id} className="cursor-pointer">
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 flex items-center">
                      <img
                        src={`${Urls.Image_url}${
                          manager.userId?.profileImage || ''
                        }`}
                        alt={manager.userId?.name || 'Unknown'}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <h5 className="font-medium text-black dark:text-white">
                        {manager.userId?.name || 'Unknown'}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {manager.userId?.phoneNumber || 'N/A'}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {manager.amount
                          ? manager.amount.toLocaleString()
                          : 'N/A'}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {manager.depositDate
                          ? new Date(manager.depositDate).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {manager.slip ? (
                        <a
                          href={`${Urls.Image_url}${manager.slip}`}
                          target="_blank"
                          className="text-primary dark:text-white"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        <p className="text-black dark:text-white">N/A</p>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="itemsPerPage"
              className="text-black dark:text-white"
            >
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-2 border border-gray-300 rounded dark:bg-boxdark"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
            >
              Previous
            </button>
            <span className="text-black dark:text-white">{`${currentPage} / ${totalPages}`}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDepositTable;
