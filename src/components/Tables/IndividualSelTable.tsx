import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import Sellerform from '../Sellerform';

interface Manager {
  _id: number;
  name: string;
  email: string;
  phoneNumber: string;
  image: string;
  salesToday: number;
  totalTarget: number;
  status: boolean;
  todaysTarget: number;
}

interface SellersTableProps {
  managerId: string;
  onFilteredSellersChange: (count: number) => void; // New prop
}

const IndividualSelTable: React.FC<SellersTableProps> = ({
  managerId,
  onFilteredSellersChange,
}) => {
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

  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  const fetchSellers = (page: number, limit: number) => {
    setLoading(true);
    axios
      .get(
        `${Urls.sellersUrl}?page=${page}&limit=${limit}&managerId=${managerId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      )
      .then((response) => {
        if (
          response.data.status &&
          response.data.data &&
          Array.isArray(response.data.data.sellers)
        ) {
          const managerData = response.data.data.sellers.map(
            (manager: any) => ({
              ...manager,
              image: `${Urls.Image_url}${manager.profileImage}`,
              salesToday: manager.todayAchievedCount,
              totalTarget: manager.sellerTotalTarget,
              status: manager.active,
              todaysTarget: manager.sellerTotalTarget,
            }),
          );

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
  }, [currentPage, itemsPerPage, managerId]);

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
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    onFilteredSellersChange(filteredManagers.length);
  }, [filteredManagers, onFilteredSellersChange]);

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
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 w-full p-2 border border-gray-300 rounded dark:bg-boxdark"
          onChange={handleSearch}
        />
        <Sellerform />
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Sellers {renderSortIcon('name')}
              </th>
              <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                onClick={() => handleSort('phoneNumber')}
              >
                Contact {renderSortIcon('phoneNumber')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('salesToday')}
              >
                Today's Sales {renderSortIcon('salesToday')}
              </th>
              <th
                className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('totalTarget')}
              >
                Total Target {renderSortIcon('totalTarget')}
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
              : filteredManagers.map((seller) => (
                  <tr
                    key={seller._id}
                    onClick={() => handleManagerClick(seller._id)}
                    className="cursor-pointer"
                  >
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 flex items-center">
                      <img
                        src={
                          seller.image ||
                          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010'
                        }
                        alt={seller.name}
                        className="w-12 h-12 rounded-full mr-4"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010';
                        }}
                      />
                      <h5 className="font-medium text-black dark:text-white">
                        {seller.name}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {seller.phoneNumber}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {seller.salesToday}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {seller.totalTarget}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents the row click from firing when toggling the status
                          toggleStatus(seller._id, seller.status);
                        }}
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          seller.status
                            ? 'bg-success text-success'
                            : 'bg-danger text-danger'
                        }`}
                      >
                        {seller.status ? 'Active' : 'Inactive'}
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
      {/* <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <label>Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border p-2 rounded"
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
            className="px-4 py-2 border rounded"
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded"
          >
            Next
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default IndividualSelTable;
