  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
  import Modalform from '../Modalform';
  import Urls from '../../networking/app_urls';
  import { useSelector } from 'react-redux';

  interface Manager {
    _id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    company: {
      name: string;
    };
    profileImage: string;
    image: string;
    salesToday: number;
    salespersons: number;
    todaysTarget: number;
    status: boolean;
  }

  const TableThree: React.FC = () => {
    const [managers, setManagers] = useState<Manager[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1); // Total pages from API
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

    const fetchManagers = (page: number, limit: number) => {
      setLoading(true);
      axios
        .get(`${Urls.managersUrl}?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        })
        .then((response) => {
          if (
            response.data.status &&
            response.data.data &&
            Array.isArray(response.data.data.managers)
          ) {
            const managerData = response.data.data.managers.map(
              (manager: any) => ({
                ...manager,
                image: `${Urls.Image_url}${manager.profileImage}`,
                salesToday: manager.todayAchievedTarget,
                salespersons: manager.sellerCount,
                status: manager.active,
              }),
            );

            setManagers(managerData);
            setTotalPages(response.data.data.pagination.totalPages); // Set total pages from API
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('There was an error fetching the data!', error);
          setLoading(false);
        });
    };

    useEffect(() => {
      fetchManagers(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };

    const handleSort = (key: keyof Manager) => {
      let direction = 'ascending';
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
      const sortedManagers = [...managers].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setManagers(sortedManagers);
      setSortConfig({ key, direction });
    };

    const handleItemsPerPageChange = (
      e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
      setItemsPerPage(parseInt(e.target.value, 10));
      setCurrentPage(1); // Reset to first page when changing items per page
    };

    const handleManagerClick = (id: number) => {
      navigate(`/managerDetail/${id}`);
    };

    // const toggleStatus = (id: number, currentStatus: boolean) => {
    //   const updatedStatus = !currentStatus;

    //   axios
    //     .post(
    //       `${Urls.managerStatus}`,
    //       { status: updatedStatus },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${currentUser.token}`,
    //         },
    //       },
    //     )
    //     .then((response) => {
    //       if (response.data.status) {
    //         setManagers((prevManagers) =>
    //           prevManagers.map((manager) =>
    //             manager.id === id
    //               ? { ...manager, status: updatedStatus }
    //               : manager,
    //           ),
    //         );
    //       } else {
    //         console.error('Failed to update the status.');
    //       }
    //     })
    //     .catch((error) => {
    //       console.error('Error updating the status:', error);
    //     });
    // };

    const toggleStatus = (id: number, currentStatus: boolean) => {
      const updatedStatus = !currentStatus;

      console.log(id,"manager id")

      axios
        .post(
          `${Urls.managerStatusUrl}`,
          {
            managerId: id,
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
            setManagers((prevManagers) =>
              prevManagers.map((manager) =>
                manager._id === id
                  ? { ...manager, status: updatedStatus }
                  : manager,
              ),
            );
          }
        })
        .catch((error) => {
          console.error('Error updating seller status:', error);
        });
    };

    const filteredManagers = managers.filter((manager) =>
      manager.name.toLowerCase().includes(searchTerm.toLowerCase()),
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

    const handleModalFormSubmit = () => {
      fetchManagers(currentPage, itemsPerPage);
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
          <Modalform onSubmitSuccess={handleModalFormSubmit} />
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th
                  className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Manager {renderSortIcon('name')}
                </th>
                <th
                  className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('salesToday')}
                >
                  Today's Sales {renderSortIcon('salesToday')}
                </th>
                <th
                  className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('salespersons')}
                >
                  Salesperson {renderSortIcon('salespersons')}
                </th>
                <th
                  className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
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
                      </tr>
                    ))
                : filteredManagers.map((manager, index) => (
                    <tr
                      key={index}
                      onClick={() => handleManagerClick(manager._id)}
                      className="cursor-pointer"
                    >
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
                          {manager.name}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {manager.salesToday}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {manager.salespersons}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus(manager._id, manager.status);
                          }}
                          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                            manager.status
                              ? 'bg-success text-success'
                              : 'bg-danger text-danger'
                          }`}
                        >
                          {manager.status ? 'Active' : 'Inactive'}
                        </button> */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus(manager._id, manager.status);
                          }}
                          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                            manager.status
                              ? 'bg-success text-success'
                              : 'bg-danger text-danger'
                          }`}
                        >
                          {manager.status ? 'Active' : 'Inactive'}
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

  export default TableThree;


  // import React, { useState, useEffect } from 'react';
  // import { useNavigate } from 'react-router-dom';
  // import axios from 'axios';
  // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  // import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
  // import Modalform from '../Modalform'; // Adjust this import based on actual file path
  // import Urls from '../../networking/app_urls';
  // import { useSelector } from 'react-redux';

  // interface Manager {
  //   _id: number;
  //   name: string;
  //   email: string;
  //   phone: string;
  //   website: string;
  //   company: {
  //     name: string;
  //   };
  //   profileImage: string;
  //   image: string;
  //   salesToday: number;
  //   salespersons: number;
  //   todaysTarget: number;
  //   status: boolean;
  // }

  // const TableThree: React.FC = () => {
  //   const [managers, setManagers] = useState<Manager[]>([]);
  //   const [currentPage, setCurrentPage] = useState(1);
  //   const [itemsPerPage, setItemsPerPage] = useState(15);
  //   const [searchTerm, setSearchTerm] = useState('');
  //   const [totalPages, setTotalPages] = useState(1);
  //   const [sortConfig, setSortConfig] = useState<{
  //     key: keyof Manager | null;
  //     direction: string;
  //   }>({
  //     key: null,
  //     direction: 'ascending',
  //   });
  //   const [loading, setLoading] = useState(true);

  //   const navigate = useNavigate();
  //   const currentUser = useSelector(
  //     (state: any) => state.user.currentUser.data,
  //   );

  //   const fetchManagers = (page: number, limit: number) => {
  //     setLoading(true);
  //     axios
  //       .get(`${Urls.managersUrl}?page=${page}&limit=${limit}`, {
  //         headers: {
  //           Authorization: `Bearer ${currentUser.token}`,
  //         },
  //       })
  //       .then((response) => {
  //         if (
  //           response.data.status &&
  //           response.data.data &&
  //           Array.isArray(response.data.data.managers)
  //         ) {
  //           const managerData = response.data.data.managers.map(
  //             (manager: any) => ({
  //               ...manager,
  //               image: `${Urls.Image_url}${manager.profileImage}`,
  //               salesToday: manager.todayAchievedTarget,
  //               salespersons: manager.sellerCount,
  //               status: manager.active,
  //             }),
  //           );

  //           setManagers(managerData);
  //           setTotalPages(response.data.data.pagination.totalPages);
  //           setLoading(false);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('There was an error fetching the data!', error);
  //         setLoading(false);
  //       });
  //   };

  //   useEffect(() => {
  //     fetchManagers(currentPage, itemsPerPage);
  //   }, [currentPage, itemsPerPage]);

  //   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setSearchTerm(e.target.value);
  //   };

  //   const handleSort = (key: keyof Manager) => {
  //     let direction = 'ascending';
  //     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
  //       direction = 'descending';
  //     }
  //     const sortedManagers = [...managers].sort((a, b) => {
  //       if (a[key] < b[key]) {
  //         return direction === 'ascending' ? -1 : 1;
  //       }
  //       if (a[key] > b[key]) {
  //         return direction === 'ascending' ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //     setManagers(sortedManagers);
  //     setSortConfig({ key, direction });
  //   };

  //   const handleItemsPerPageChange = (
  //     e: React.ChangeEvent<HTMLSelectElement>,
  //   ) => {
  //     setItemsPerPage(parseInt(e.target.value, 10));
  //     setCurrentPage(1);
  //   };

  //   const handleManagerClick = (id: number) => {
  //     navigate(`/managerDetail/${id}`);
  //   };

  //   const toggleStatus = (id: number, currentStatus: boolean) => {
  //     const updatedStatus = !currentStatus;
  //     axios
  //       .post(
  //         `${Urls.managerStatusUrl}`,
  //         {
  //           managerId: id,
  //           active: updatedStatus,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${currentUser.token}`,
  //           },
  //         },
  //       )
  //       .then((response) => {
  //         if (response.data.status) {
  //           setManagers((prevManagers) =>
  //             prevManagers.map((manager) =>
  //               manager._id === id
  //                 ? { ...manager, status: updatedStatus }
  //                 : manager,
  //             ),
  //           );
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error updating seller status:', error);
  //       });
  //   };

  //   const filteredManagers = managers.filter((manager) =>
  //     manager.name.toLowerCase().includes(searchTerm.toLowerCase()),
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

  //   const handleModalFormSubmit = () => {
  //     // Refresh the list by calling fetchManagers
  //     fetchManagers(currentPage, itemsPerPage);
  //   };

  //   return (
  //     <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
  //       <div className="flex gap-4">
  //         <input
  //           type="text"
  //           placeholder="Search..."
  //           className="mb-4 w-full p-2 border border-gray-300 rounded dark:bg-boxdark"
  //           onChange={handleSearch}
  //         />
  //         <Modalform onSubmitSuccess={handleModalFormSubmit} />
  //       </div>

  //       {/* Table structure remains the same */}
  //       {/* Add Pagination logic and manager rendering here */}
  //     </div>
  //   );
  // };

  // export default TableThree;
