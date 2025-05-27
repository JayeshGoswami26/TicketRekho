import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from 'react-hot-toast';
import {
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrashAlt,
  faTags,
} from '@fortawesome/free-solid-svg-icons';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import CouponForm from '../CouponForm';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface Coupon {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
  applicableTo: string;
  expirationDate: string;
  description: string;
  couponId: string;
}

const CouponTable: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Coupon | null;
    direction: string;
  }>({
    key: null,
    direction: 'ascending',
  });
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  const formatRoleName = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')         // Add space before capital letters
    .split(' ')                                   // Split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ');                                   // Join words back
};

  const fetchManagers = (page: number, limit: number) => {
    setLoading(true);
    axios
      .get(`${Urls.getCouponsUrl}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      })
      .then((response) => {
        console.log("response.data.data ",response.data.data.coupons);
        if(      
          response.data.status &&
          response.data.data.coupons         
        ) {
          const managerData = response.data.data.coupons
          setCoupons(managerData);
          setTotalPages(response.data.data.pagination?.totalPages || 1); // Set total pages from API
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

  const handleSort = (key: keyof Coupon) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedManagers = [...coupons].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setCoupons(sortedManagers);
    setSortConfig({ key, direction });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

// Function to format date in dd-mm-yyyy format
const formatDate = (date:any) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const year = d.getFullYear();

  return `${year}-${month}-${day}`;
};
  const editCoupon = (coupon: Coupon) => {
   // console.log("editCoupon", coupon);
    // Format the expirationDate before setting it
const formattedCoupon = {
  ...coupon,
  expirationDate: formatDate(coupon.expirationDate)
};
//console.log("formattedCoupon", formattedCoupon);
    setSelectedCoupon(formattedCoupon);
    setShowModal(true);
  };

   const MySwal = withReactContent(Swal);
  
  const handleDelete = (couponId: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this coupon? This action cannot be undone.',
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
        deleteCoupon(couponId);
      }
    });
  };

  const deleteCoupon = (couponId: string) => {
    axios
      .post(
        `${Urls.deleteCouponUrl}`,
        { couponId },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      )
      .then((response) => {
        if (response.data.status) {
          toast.success(
            'Coupon deleted successfully!',
          );
          setCoupons((prevCoupons) =>
            prevCoupons.filter((coupon) => coupon._id !== couponId),
          );
        }
      })
      .catch((error) => {
        console.error('Error deleting coupon:', error);
        toast.error(
          error.response?.data?.message
        );
      });
  };

const filteredManagers = coupons.filter((manager) => {
  const search = searchTerm.toLowerCase();

  return (
    (manager.code?.toLowerCase().includes(search)) ||
    (manager.discountType?.toLowerCase().includes(search)) ||
    (manager.applicableTo?.toLowerCase().includes(search)) ||
    (manager.expirationDate?.toLowerCase().includes(search)) ||
    (manager.description?.toLowerCase().includes(search)) ||
    manager.discountValue.toString().includes(search) // for number, convert to string
  );
});


  const renderSortIcon = (key: keyof Coupon) => {
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
    setSelectedCoupon(null);
    fetchManagers(currentPage, itemsPerPage);
  };


  
  const handleAssignCouponClick = (id: string) => {
    navigate(`/assignCoupon/${id}`);
  };

  const handleCancelEdit = () => {
    // Reset selectedBanner and close the modal
    setSelectedCoupon(null);
    setShowModal(false);
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
         <CouponForm
          coupon={selectedCoupon}
          onSubmitSuccess={handleModalFormSubmit}
          onCancel={handleCancelEdit} // Add this prop to handle canceling edit
        /> 
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('code')}
              >
               Coupon Code {renderSortIcon('code')}
              </th>
              <th
                className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('discountType')}
              >
                Coupon Type {renderSortIcon('discountType')}
              </th>
              <th
                className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('discountValue')}
              >
                Discount Value {renderSortIcon('discountValue')}
              </th>
              <th
                className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('applicableTo')}
              >
                ApplicableTo {renderSortIcon('applicableTo')}
              </th>
              {/* <th
                className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {renderSortIcon('status')}
              </th> */}
              <th
                className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                onClick={() => handleSort('expirationDate')}
              >
                Actions {renderSortIcon('expirationDate')}
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
              : filteredManagers.map((coupon, index) => (
                  <tr key={index}
                  onClick={() => handleAssignCouponClick(coupon._id)}
                   className="cursor-pointer">
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                     
                      <h5  
                       className="font-medium text-black dark:text-white"
                      // title={`Assign coupon code to users`} 
                       >
                        {coupon.code}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {formatRoleName(coupon.discountType)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">{coupon.discountValue}</p>
                    </td>
                   
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">{formatRoleName(coupon.applicableTo)}</p>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <div >
                        {/* className="flex gap-2" */}
                        <button
                          onClick={(e) =>{
                            e.stopPropagation();
                             editCoupon(coupon)}}
                          className="p-2 text-sm font-medium rounded-md focus:outline-none hover:text-[#472DA9]"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={(e) =>{
                            e.stopPropagation();
                             handleDelete(coupon._id)}}
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

export default CouponTable;

