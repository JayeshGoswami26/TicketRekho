// import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faCalendarAlt,
//   faCalendarCheck,
//   faMapMarkerAlt,
//   faMapMarkedAlt,
// } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';
// import Urls from '../../networking/app_urls';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

// interface CardProps {
//   title: string;
//   total: string;
//   icon: any;
//   color: 'blue' | 'green' | 'yellow' | 'purple';
//  path?: string; // 👈 optional path
// }

// // Color utility classes for Tailwind
// const borderColors = {
//   blue: 'border-blue-500',
//   green: 'border-green-500',
//   yellow: 'border-yellow-500',
//   purple: 'border-purple-500',
// };

// const bgColors = {
//   blue: 'bg-blue-100 text-blue-600',
//   green: 'bg-green-100 text-green-600',
//   yellow: 'bg-yellow-100 text-yellow-600',
//   purple: 'bg-purple-100 text-purple-600',
// };

// // Reusable Card Component
// const CardDataStats: React.FC<CardProps> = ({ title, total, icon, color }) => {
//   return (
//     <div className={`p-5 bg-white shadow rounded-xl transition-all border-t-4 ${borderColors[color]} hover:shadow-lg`}>
//       <div className="flex items-center gap-4">
//         <div className={`w-14 h-14 text-xl flex items-center justify-center rounded-full ${bgColors[color]}`}>
//           <FontAwesomeIcon icon={icon} />
//         </div>
//         <div>
//           <p className="text-sm text-gray-500 font-medium">{title}</p>
//           <h4 className="text-2xl font-bold text-gray-800">{total}</h4>
//         </div>
//       </div>
//     </div>
//   );
// };

// const EventManagerDashboard: React.FC = () => {
//   const [data, setData] = useState({
//     totalEvent: 0,
//     totalActivEvent: 0,
//     totalVenue: 0,
//     totalActiveVenue: 0,
//   });

//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const currentUser = useSelector((state: any) => state.user.currentUser.data);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${Urls.eventManagerDashboard}`, {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         });
//         if (response.data.status) {
//           setData(response.data.data);
//         } else {
//           setError(response.data.message || 'Failed to fetch data');
//         }
//       } catch (err) {
//         setError('Error fetching data');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const adminCards: CardProps[] = [
//     {
//       title: 'Total Events',
//       total: data.totalEvent.toString(),
//       icon: faCalendarAlt,
//       color: 'blue',
//       path: '/events',
//     },

//     {
//       title: 'Total Venues',
//       total: data.totalVenue.toString(),
//       icon: faMapMarkerAlt,
//       color: 'purple',
//       path: '/venues',
//     },

//   ];

//   if (loading) return <div className="text-center mt-8 text-lg">Loading...</div>;
//   if (error) return <div className="text-center text-red-600 mt-8">Error: {error}</div>;

//   return (
//     <>
//     <Breadcrumb pageName="Dashboard" />

//     <div className="p-4 md:p-6 lg:p-8">
//       {/* <h2 className="text-2xl font-semibold mb-6 text-gray-700">Event Manager Dashboard</h2> */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {adminCards.map((item, index) => (
//         <Link to={item.path || '#'} key={index}>
//     <CardDataStats
//       title={item.title}
//       total={item.total}
//       icon={item.icon}
//       color={item.color}
//     />
//   </Link>
//         ))}
//       </div>
//     </div>
//     </>
//   );
// };

// export default EventManagerDashboard;

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////

'Event Manager';

import type React from 'react';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faCalendarCheck,
  faMapMarkedAlt,
  faPlus,
  faArrowsRotate,
  faTicketAlt,
  faCalendarDay,
  faUsers,
  faMoneyBill,
  faLocationDot,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

// Types
interface Venue {
  id: number;
  name: string;
  location: string;
  capacity: number;
  status: 'Available' | 'Booked' | 'Maintenance';
}

interface Event {
  id: number;
  venueId: number;
  venueName: string;
  title: string;
  image: string;
  category: string;
  startTime: string;
  endTime: string;
  ticketPrice: number;
  ticketsSold: number;
  totalCapacity: number;
}

interface CardProps {
  title: string;
  total: string;
  icon: any;
  color: 'blue' | 'green' | 'yellow' | 'purple';
  path?: string;
}

// Color utility classes for Tailwind
const borderColors = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  yellow: 'border-yellow-500',
  purple: 'border-purple-500',
};

const bgColors = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  purple: 'bg-purple-100 text-purple-600',
};

const statusColors = {
  Available: 'bg-green-100 text-green-700',
  Booked: 'bg-blue-100 text-blue-700',
  Maintenance: 'bg-yellow-100 text-yellow-700',
};

const categoryColors = {
  Concert: 'bg-purple-100 text-purple-700',
  Conference: 'bg-blue-100 text-blue-700',
  Exhibition: 'bg-green-100 text-green-700',
  Festival: 'bg-yellow-100 text-yellow-700',
  Sports: 'bg-red-100 text-red-700',
  Workshop: 'bg-indigo-100 text-indigo-700',
};

// Sample data (replace with actual API calls)
const sampleVenues: Venue[] = [
  {
    id: 1,
    name: 'Grand Convention Center',
    location: '123 Main Street, Downtown',
    capacity: 1500,
    status: 'Available',
  },
  {
    id: 2,
    name: 'City Stadium',
    location: '456 Park Avenue, Westside',
    capacity: 5000,
    status: 'Booked',
  },
  {
    id: 3,
    name: 'Exhibition Hall',
    location: '789 Broadway, Eastside',
    capacity: 2000,
    status: 'Available',
  },
  {
    id: 4,
    name: 'Community Center',
    location: '101 Queen Street, Northside',
    capacity: 800,
    status: 'Maintenance',
  },
];

const sampleEvents: Event[] = [
  {
    id: 1,
    venueId: 1,
    venueName: 'Grand Convention Center',
    title: 'Tech Conference 2023',
    image: '/placeholder.svg?height=150&width=100',
    category: 'Conference',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    ticketPrice: 149.99,
    ticketsSold: 1200,
    totalCapacity: 1500,
  },
  {
    id: 2,
    venueId: 1,
    venueName: 'Grand Convention Center',
    title: 'Business Networking Mixer',
    image: '/placeholder.svg?height=150&width=100',
    category: 'Workshop',
    startTime: '06:30 PM',
    endTime: '09:00 PM',
    ticketPrice: 49.99,
    ticketsSold: 300,
    totalCapacity: 500,
  },
  {
    id: 3,
    venueId: 2,
    venueName: 'City Stadium',
    title: 'Summer Music Festival',
    image: '/placeholder.svg?height=150&width=100',
    category: 'Festival',
    startTime: '12:00 PM',
    endTime: '10:00 PM',
    ticketPrice: 89.99,
    ticketsSold: 4500,
    totalCapacity: 5000,
  },
  {
    id: 4,
    venueId: 3,
    venueName: 'Exhibition Hall',
    title: 'Art & Design Expo',
    image: '/placeholder.svg?height=150&width=100',
    category: 'Exhibition',
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    ticketPrice: 25.99,
    ticketsSold: 1200,
    totalCapacity: 2000,
  },
  {
    id: 5,
    venueId: 3,
    venueName: 'Exhibition Hall',
    title: 'Craft Beer Festival',
    image: '/placeholder.svg?height=150&width=100',
    category: 'Festival',
    startTime: '07:00 PM',
    endTime: '11:00 PM',
    ticketPrice: 35.99,
    ticketsSold: 1800,
    totalCapacity: 2000,
  },
];

// Reusable Card Component
const CardDataStats: React.FC<CardProps> = ({ title, total, icon, color }) => {
  return (
    <div
      className={`p-5 bg-white shadow rounded-xl transition-all border-t-4 ${borderColors[color]} hover:shadow-lg`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 text-xl flex items-center justify-center rounded-full ${bgColors[color]}`}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h4 className="text-2xl font-bold text-gray-800">{total}</h4>
        </div>
      </div>
    </div>
  );
};

// Skeleton components
const VenueSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded-full w-1/4"></div>
      </div>
    </div>
  </div>
);

const EventSkeleton: React.FC = () => (
  <div className="flex bg-white rounded-xl shadow-md p-4 mb-4 animate-pulse">
    <div className="w-16 h-24 bg-gray-200 rounded mr-4"></div>
    <div className="flex-1">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="flex flex-wrap gap-2 mt-3">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const EventManagerDashboard: React.FC = () => {
  // States
  const [venues, setVenues] = useState<Venue[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<Event[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [activeVenueFilter, setActiveVenueFilter] = useState<number | null>(
    null,
  );

  // Stats data
  const [stats, setStats] = useState({
    totalVenues: 0,
    totalEvents: 0,
    totalCapacity: 0,
    totalCategories: 0,
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls with setTimeout
        setTimeout(() => {
          setVenues(sampleVenues);
          setLoadingVenues(false);

          // Calculate stats
          setStats({
            totalVenues: sampleVenues.length,
            totalEvents: sampleEvents.length,
            totalCapacity: sampleVenues.reduce(
              (sum, venue) => sum + venue.capacity,
              0,
            ),
            totalCategories: new Set(
              sampleEvents.map((event) => event.category),
            ).size,
          });
        }, 1500);

        setTimeout(() => {
          setEvents(sampleEvents);
          setTodaysEvents(sampleEvents); // In a real app, filter for today's date
          setLoadingEvents(false);
        }, 2000);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter events by venue
  const filteredEvents = activeVenueFilter
    ? todaysEvents.filter((event) => event.venueId === activeVenueFilter)
    : todaysEvents;

  // Refresh functions
  const refreshVenues = () => {
    setLoadingVenues(true);
    setTimeout(() => {
      setVenues(sampleVenues);
      setLoadingVenues(false);
    }, 1500);
  };

  const refreshEvents = () => {
    setLoadingEvents(true);
    setTimeout(() => {
      setEvents(sampleEvents);
      setTodaysEvents(sampleEvents);
      setLoadingEvents(false);
    }, 1500);
  };

  // Stats cards
  const statCards: CardProps[] = [
    {
      title: 'Total Venues',
      total: stats.totalVenues.toString(),
      icon: faMapMarkedAlt,
      color: 'purple',
      path: '/venues',
    },
    {
      title: 'Total Events',
      total: stats.totalEvents.toString(),
      icon: faCalendarAlt,
      color: 'blue',
      path: '/events',
    },
    {
      title: 'Total Capacity',
      total: stats.totalCapacity.toLocaleString(),
      icon: faUsers,
      color: 'green',
      path: '/capacity',
    },
    {
      title: 'Event Categories',
      total: stats.totalCategories.toString(),
      icon: faCalendarCheck,
      color: 'yellow',
      path: '/categories',
    },
  ];

  return (
    <>
      <Breadcrumb pageName="Event Manager Dashboard" />

      {/* Stats Cards */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((item, index) => (
            <Link to={item.path || '#'} key={index}>
              <CardDataStats
                title={item.title}
                total={item.total}
                icon={item.icon}
                color={item.color}
              />
            </Link>
          ))}
        </div>

        {/* Venues Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Venues</h2>
            <div className="flex space-x-2">
              <Link to="/venues/add">
                <button className="p-2 bg-[#472da9] text-white rounded-md hover:bg-[#3a2587] transition-colors">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Venue
                </button>
              </Link>
              <button
                className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                onClick={refreshVenues}
                disabled={loadingVenues}
              >
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  className={loadingVenues ? 'animate-spin' : ''}
                />
              </button>
            </div>
          </div>

          {loadingVenues ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <VenueSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    setActiveVenueFilter(
                      venue.id === activeVenueFilter ? null : venue.id,
                    )
                  }
                >
                  {/* <img
                    src={venue.image || '/placeholder.svg'}
                    alt={venue.name}
                    className="w-full h-40 object-cover"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src =
                        '../../../public/Image/Fallback Image/default-fallback-image.png';
                    }}
                  /> */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      {venue.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="mr-2 text-sm"
                      />
                      <p className="text-sm">{venue.location}</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      <FontAwesomeIcon icon={faUsers} className="mr-2" />
                      Capacity: {venue.capacity.toLocaleString()}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {
                          todaysEvents.filter((e) => e.venueId === venue.id)
                            .length
                        }{' '}
                        Events Today
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          statusColors[venue.status]
                        }`}
                      >
                        {venue.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Events Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeVenueFilter
                ? `Today's Events at ${venues.find(
                    (v) => v.id === activeVenueFilter,
                  )?.name}`
                : "Today's Events"}
            </h2>
            <div className="flex space-x-2">
              <Link to="/events/add">
                <button className="p-2 bg-[#472da9] text-white rounded-md hover:bg-[#3a2587] transition-colors">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Event
                </button>
              </Link>
              <button
                className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                onClick={refreshEvents}
                disabled={loadingEvents}
              >
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  className={loadingEvents ? 'animate-spin' : ''}
                />
              </button>
            </div>
          </div>

          {activeVenueFilter && (
            <div className="mb-4">
              <button
                className="text-[#472da9] hover:underline flex items-center"
                onClick={() => setActiveVenueFilter(null)}
              >
                ← Show all venues
              </button>
            </div>
          )}

          {loadingEvents ? (
            <div>
              {[1, 2, 3, 4].map((i) => (
                <EventSkeleton key={i} />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div>
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={event.image || '/placeholder.svg'}
                    alt={event.title}
                    className="w-16 h-24 object-cover rounded mr-4"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src =
                        '../../../public/Image/Fallback Image/default-fallback-image.png';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {event.title}
                      </h3>
                      {!activeVenueFilter && (
                        <span className="text-sm text-[#472da9] font-medium">
                          {event.venueName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      {event.startTime} - {event.endTime}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          categoryColors[
                            event.category as keyof typeof categoryColors
                          ] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {event.category}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        <FontAwesomeIcon icon={faMoneyBill} className="mr-1" />$
                        {event.ticketPrice.toFixed(2)}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                        <FontAwesomeIcon icon={faTicketAlt} className="mr-1" />
                        {event.ticketsSold} / {event.totalCapacity} tickets
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                        <FontAwesomeIcon
                          icon={faCalendarDay}
                          className="mr-1"
                        />
                        Today
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-4xl text-gray-400 mb-3"
              />
              <h3 className="text-lg font-medium text-gray-700">
                No events found
              </h3>
              <p className="text-gray-500">
                {activeVenueFilter
                  ? 'There are no events scheduled at this venue today.'
                  : 'There are no events scheduled for today.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventManagerDashboard;
