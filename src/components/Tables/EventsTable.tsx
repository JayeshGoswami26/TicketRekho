import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrashAlt,
  faHamburger,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import EventModalForm from '../Modals/CreateEventModal';
import UpdateEvent from '../Modals/UpdateEvent';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface Events {
  _id: string;
  name: string;
  artist: string;
  eventImage: string;
  genre: [];
  language: [];
  eventType: string;
  eventCategory: string;
  eventDate: Date;
  state: string;
  city: string;
  id: string;
  totalEarnings: Number;
  isActive: boolean;
  isBanner?: boolean;
  isAds?: boolean;
  bannerImage?: string;
  advertisementImage?: string;
}

interface Banner {
  id: string;
  title: string;
  image: string;
  isActive: boolean;
}

interface Advertisement {
  id: string;
  title: string;
  image: string;
  isActive: boolean;
}

type TabType = 'events' | 'banners' | 'advertisements';

const EventsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [sellers, setSellers] = useState<Events[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Events | null;
    direction: string;
  }>({
    key: null,
    direction: 'ascending',
  });
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<{
    title: string;
    url: string;
  } | null>(null);

  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser.data);
  const roleName = currentUser.role;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const formatUTCDate = (date: string | Date) => {
    try {
      const utcDate = new Date(date); // Parse the UTC date string

      // Adjust the date to your desired local timezone (in this case Asia/Kolkata)
      const localDate = new Date(
        utcDate.getTime() + utcDate.getTimezoneOffset() * 60000,
      );

      // Format the local date to "yyyy-MM-dd HH:mm"
      return format(localDate, 'yyyy-MM-dd HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return ''; // Return an empty string in case of an error
    }
  };

  const handleEditClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleImagePreview = (title: string, imageUrl: string) => {
    setPreviewImage({ title, url: imageUrl });
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const formatName = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
      .split(' ') // Split into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join words back
  };

  const fetchEvents = async (page: number, limit: number, search: string) => {
    try {
      setLoading(true);

      // Convert 'Active'/'Inactive' search to boolean
      let searchQuery = search;
      if (search.toLowerCase() === 'released') {
        searchQuery = 'true';
      } else if (search.toLowerCase() === 'unreleased') {
        searchQuery = 'false';
      }

      // Fetch data from API
      const response = await axios.get(
        `${
          Urls.getAllEventsByManagerId
        }?page=${page}&limit=${limit}&search=${encodeURIComponent(
          searchQuery,
        )}`,
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        },
      );

      const { status, data } = response.data;

      if (status && data && Array.isArray(data.eventData)) {
        const eventData = data.eventData.map((event: any) => ({
          id: event._id,
          name: event.name,
          artist: event.artist,
          eventType: formatName(event.eventType),
          state: event.state.name,
          city: event.city.name,
          eventCategory: event.eventCategory,
          genre: event.genre?.join(', ') || 'N/A',
          language: event.language?.join(', ') || 'N/A',
          eventDate: formatUTCDate(event.eventDate),
          eventImage: `${Urls.Image_url}${event.eventImage}`,
          totalEarnings: event.totalEarnings,
          isActive: event.isActive,
          isBanner: event.isBanner || false,
          isAds: event.isAds || false,
          bannerImage: event.bannerImage
            ? `${Urls.Image_url}${event.bannerImage}`
            : '',
          advertisementImage: event.advImage
            ? `${Urls.Image_url}${event.advImage}`
            : '',
        }));

        setSellers(eventData);
        setTotalPages(response.data.data.pagination?.totalPages || 1);
      } else {
        console.warn('Unexpected API response structure or missing data');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    fetchEvents(currentPage, itemsPerPage, searchTerm);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEvents(currentPage, itemsPerPage, searchTerm);
    }, 400); // Add debounce delay

    return () => clearTimeout(delayDebounce);
  }, [currentPage, itemsPerPage, searchTerm, activeTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to first page on new search
  };

  const handleSort = (key: keyof Events) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedSellers = [...sellers].sort((a : any, b : any) => {
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

  const handleGrabaBiteClick = (id: string) => {
    navigate(`/eventGrabABites/${id}`);
  };

  const toggleStatus = (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;

    axios
      .post(
        `${Urls.changeEventStatus}`,
        { id, isActive: updatedStatus ? true : false },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      )
      .then((response) => {
        if (response.data.status) {
          setSellers((prevEvents) =>
            prevEvents.map((event) =>
              event.id === id ? { ...event, isActive: updatedStatus } : event,
            ),
          );
          // Show success toast
          toast.success('Event status changed successfully!');
        } else {
          // Show error toast if the status is false
          toast.error('Failed to change the event status.');
        }
      })
      .catch((error) => {
        console.error('Error changing the event status:', error);
        // Show error toast for network or server issues
        toast.error('Error changing the event status. Please try again.');
      });
  };

  const MySwal = withReactContent(Swal);
  const handleDelete = (eventId: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this event? This action cannot be undone.',
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
        deleteEvent(eventId);
      }
    });
  };

  const deleteEvent = (id: string) => {
    axios
      .post(
        `${Urls.deleteEvent}`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      )
      .then((response) => {
        if (response.data.status) {
          setSellers((prevEvents) =>
            prevEvents.filter((event) => event.id !== id),
          );

          // Show success toast
          toast.success('Event deleted successfully!');
        } else {
          // Show error toast if the status is false
          toast.error('Failed to delete the event.');
        }
      })
      .catch((error: any) => {
        console.error('Error:', error);

        const errorMessage =
          error?.response?.data?.message ||
          'Oops! Something went wrong while deleting the event. Please try again later.';

        toast.error(errorMessage);
      });
  };

  const filteredEvents = sellers.filter((seller) => {
    const search = searchTerm.toLowerCase();
    const isActiveString = seller.isActive ? 'released' : 'unreleased';
    return (
      seller.name?.toLowerCase().includes(search) ||
      seller.city?.toLowerCase().includes(search) ||
      seller.eventType?.toLowerCase().includes(search) ||
      seller.eventDate?.toString().includes(search) ||
      seller.totalEarnings?.toString().toLowerCase().includes(search) ||
      isActiveString.includes(search)
    );
  });

  const filteredBanners = sellers.filter((seller) => {
    const search = searchTerm.toLowerCase();
    const isBanner = seller.isBanner ? 'active' : 'inactive';

    if (seller.isBanner) {
      return (
        seller.name?.toLowerCase().includes(search) ||
        (seller.bannerImage &&
          seller.bannerImage.toLowerCase().includes(search)) ||
        isBanner.includes(search)
      );
    }
    return false;
  });

  const filteredAdvertisements = sellers.filter((seller) => {
    const search = searchTerm.toLowerCase();
    const isAds = seller.isAds ? 'active' : 'inactive';

    if (seller.isAds) {
      return (
        seller.name?.toLowerCase().includes(search) ||
        (seller.advertisementImage &&
          seller.advertisementImage.toLowerCase().includes(search)) ||
        isAds.includes(search)
      );
    }
    return false;
  });

  const renderSortIcon = (key: keyof Events) => {
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
    fetchEvents(currentPage, itemsPerPage, searchTerm);
  };

  const handleEventTicketClick = (id: string) => {
    navigate(`/eventtickets/${id}`);
  };

  const handleSittingClick = (id: string) => {
    navigate(`/event-realtime-sitting-seat-status/${id}`);
  };

  const handleNonSittingClick = (id: string) => {
    navigate(`/event-realtime-nonsitting-seat-status/${id}`);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* Tabs */}
      <div className="flex border-b border-stroke mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'events'
              ? 'text-primary border-b-2 border-primary'
              : 'text-black dark:text-white'
          }`}
          onClick={() => handleTabChange('events')}
        >
          Events
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'banners'
              ? 'text-primary border-b-2 border-primary'
              : 'text-black dark:text-white'
          }`}
          onClick={() => handleTabChange('banners')}
        >
          Banners
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'advertisements'
              ? 'text-primary border-b-2 border-primary'
              : 'text-black dark:text-white'
          }`}
          onClick={() => handleTabChange('advertisements')}
        >
          Advertisements
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 w-full p-2 border border-gray-300 rounded dark:bg-boxdark"
          onChange={handleSearch}
          value={searchTerm}
        />
        {activeTab === 'events' && roleName !== 'admin' && (
          <EventModalForm onSubmitSuccess={handleModalFormSubmit} />
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black dark:text-white">
                {previewImage.title}
              </h3>
              <button
                onClick={closeImagePreview}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={previewImage.url || '/placeholder.svg'}
                alt={previewImage.title}
                className="max-w-full max-h-[70vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    '../../../public/Image/Fallback Image/default-fallback-image.png';
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        {activeTab === 'events' && (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th
                  className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                  onClick={() => handleSort('name')}
                >
                  Event {renderSortIcon('name')}
                </th>
                <th
                  className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                  onClick={() => handleSort('city')}
                >
                  City {renderSortIcon('city')}
                </th>
                <th
                  className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                  onClick={() => handleSort('eventType')}
                >
                  Type {renderSortIcon('eventType')}
                </th>
                <th
                  className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11 cursor-pointer text-center"
                  onClick={() => handleSort('eventDate')}
                >
                  Date {renderSortIcon('eventDate')}
                </th>
                <th
                  className="min-w-[150px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                  onClick={() => handleSort('totalEarnings')}
                >
                  Earnings {renderSortIcon('totalEarnings')}
                </th>
                <th
                  className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center"
                  onClick={() => handleSort('isActive')}
                >
                  Launch {renderSortIcon('isActive')}
                </th>
                <th className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white cursor-pointer text-center">
                  Actions
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
                            <div className="h-12.5 w-15 rounded-md bg-slate-200 dark:bg-slate-300 "></div>
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
                        <td className="py-4 px-4">
                          <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-4 bg-slate-200 dark:bg-slate-300 rounded w-full animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                : filteredEvents.map((event, index) => (
                    <tr
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();

                        if (event.eventType === 'Sitting') {
                          handleSittingClick(event.id);
                        } else if (event.eventType === 'Non Sitting') {
                          handleNonSittingClick(event.id);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark flex items-center text-center">
                        <img
                          src={
                            event.eventImage ||
                            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010'
                          }
                          alt={event.name}
                          className="h-12.5 w-15 rounded-md mr-4"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010';
                          }}
                        />

                        <h5 className="font-medium text-black dark:text-white ">
                          {event.name}
                        </h5>
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                        <p className="text-black dark:text-white">
                          {event.city}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                        <p className="text-black dark:text-white">
                          {event.eventType}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                        <p className="text-black dark:text-white">
                          {new Date(event.eventDate).toLocaleString(undefined, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                        <p className="text-black dark:text-white">
                          ₹{Number(event.totalEarnings).toLocaleString()}
                        </p>
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus(
                              event.id,
                              event.isActive ? true : false,
                            );
                          }}
                          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                            event.isActive == true
                              ? 'bg-success text-success'
                              : 'bg-danger text-danger'
                          }`}
                        >
                          {event.isActive ? 'Released' : 'Unreleased'}
                        </button>
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(event.id);
                            }}
                            className="p-2 text-sm font-medium rounded-md focus:outline-none hover:text-[#472DA9]"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGrabaBiteClick(event.id);
                            }}
                            className="p-2 text-sm font-medium rounded-md focus:outline-none hover:text-[#472DA9]"
                          >
                            <FontAwesomeIcon icon={faHamburger} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(event.id);
                            }}
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
        )}

        {activeTab === 'banners' && (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white text-center">
                  Banner
                </th>
                <th className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white text-center">
                  Title
                </th>
                <th className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="py-4 px-4">
                        <div className="animate-pulse flex justify-center">
                          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-300 rounded"></div>
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
              ) : filteredBanners.length > 0 ? (
                filteredBanners.map((banner, index) => (
                  <tr key={index} className="cursor-pointer">
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() =>
                            handleImagePreview(
                              banner.name,
                              banner.bannerImage || '',
                            )
                          }
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 p-2 rounded-md"
                        >
                          <FontAwesomeIcon icon={faImage} className="mr-2" />
                          View Image
                        </button>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {banner.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <div>
                        <button className="p-2 text-sm font-medium rounded-md hover:text-[#d43232] focus:outline-none">
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No banner data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'advertisements' && (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white text-center">
                  Advertisement
                </th>
                <th className="min-w-[220px] py-4 px-4 font-bold text-black dark:text-white text-center">
                  Title
                </th>
                <th className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="py-4 px-4">
                        <div className="animate-pulse flex justify-center">
                          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-300 rounded"></div>
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
              ) : filteredAdvertisements.length > 0 ? (
                filteredAdvertisements.map((ad, index) => (
                  <tr key={index} className="cursor-pointer">
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() =>
                            handleImagePreview(
                              ad.name,
                              ad.advertisementImage || '',
                            )
                          }
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 p-2 rounded-md"
                        >
                          <FontAwesomeIcon icon={faImage} className="mr-2" />
                          View Image
                        </button>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">{ad.name}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                      <div>
                        <button className="p-2 text-sm font-medium rounded-md hover:text-[#d43232] focus:outline-none">
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No advertisement data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {isModalOpen && selectedEventId && (
          <UpdateEvent
            eventId={selectedEventId}
            onClose={handleCloseModal}
            onSubmitSuccess={handleUpdateSuccess}
          />
        )}

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
              <option value={10}>10</option>
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

export default EventsTable;
