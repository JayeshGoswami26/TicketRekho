import type React from 'react';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faBuilding,
  faPlus,
  faArrowsRotate,
  faTicket,
  faCalendarDay,
  faFilm,
  faChair,
  faMoneyBill,
  faLocationDot,
  faDisplay,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';

// Types
interface Theatre {
  id: string; // Changed to string to match backend _id
  name: string;
  location: string;
  screens: number;
  status: 'Active' | 'Maintenance' | 'Closed';
}

interface Showtime {
  id: string; // Changed to string to match backend _id
  theatreId: string; // Changed to string
  theatreName: string;
  movieId: string; // Changed to string
  movieTitle: string;
  moviePoster: string;
  screenNumber: number;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
}

interface CardProps {
  title: string;
  total: string;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  path?: string;
}

// Utility class mappings for Tailwind safe-list
const borderColors = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  purple: 'border-purple-500',
  yellow: 'border-yellow-500',
};

const bgColors = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  yellow: 'bg-yellow-100 text-yellow-600',
};

const statusColors = {
  Active: 'bg-green-100 text-green-700',
  Maintenance: 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-red-100 text-red-700',
};

// Components
const CardDataStats: React.FC<CardProps> = ({ title, total, icon, color, path }) => {
  return (
    <Link to={path || '#'}>
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
    </Link>
  );
};

// Skeleton components
const TheatreSkeleton: React.FC = () => (
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

const ShowtimeSkeleton: React.FC = () => (
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

const TheatreManagerDashboard: React.FC = () => {
  const [data, setData] = useState({
    totalShowTime: 0,
    totalTheatre: 0,
    theatreScreens: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [todaysShowtimes, setTodaysShowtimes] = useState<Showtime[]>([]);
  const [loadingTheatres, setLoadingTheatres] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const [activeTheatreFilter, setActiveTheatreFilter] = useState<string | null>(null);

  const currentUser = useSelector((state: any) => state.user.currentUser.data);

  // Helper function to check if a showtime is for today
  const isToday = (dateString: string) => {
    const today = new Date(); // Hardcoded for testing; use new Date() in production
    const showtimeDate = new Date(dateString);
    console.log('today:', today);
    // console.log('showtimeDate:', showtimeDate);
    
    return (
      showtimeDate.getUTCFullYear() === today.getUTCFullYear() &&
      showtimeDate.getUTCMonth() === today.getUTCMonth() &&
      showtimeDate.getUTCDate() === today.getUTCDate()
    );
  };

  // Map backend data to Showtime interface
  const mapShowtime = (showtime: any): Showtime => ({
    id: showtime._id,
    theatreId: showtime.theatre._id,
    theatreName: showtime.theatre.name,
    movieId: showtime.movie._id,
    movieTitle: showtime.movie.name,
    moviePoster: showtime.movie.movieImage,
    screenNumber: showtime.screen.name, // Using screen name as a number (e.g., parseInt or adjust backend)
    startTime: new Date(showtime.startTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    endTime: new Date(showtime.endTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    price: showtime.price[0]?.price || 0, // Use first price for simplicity
    availableSeats: showtime.screen.seatingCapacity, // Adjust based on actual booking data
    totalSeats: showtime.screen.seatingCapacity,
  });

  const fetchTheaterData = async () => {
    try {
      const response = await axios.get(`${Urls.theatreManagerDashboard}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      if (response.data.status) {
        const backendData = response.data.data;

        // Map theatres
        const mappedTheatres: Theatre[] = backendData.theaters.map((theatre: any) => ({
          id: theatre._id,
          name: theatre.name,
          location: theatre.location,
          screens: backendData.theatreScreens.filter(
            (screen: any) => screen.theatre === theatre._id
          ).length,
          status: theatre.isActive ? 'Active' : 'Closed',
        }));

        // Map showtimes
        const mappedShowtimes: Showtime[] = backendData.showTimes.map(mapShowtime);

        // Filter today's showtimes
        const todaysShowtimes = mappedShowtimes.filter((showtime) =>
          isToday(showtime.startTime)
        );

        setData(backendData);
        setTheatres(mappedTheatres);
        setShowtimes(mappedShowtimes);
        setTodaysShowtimes(todaysShowtimes);
        setLoadingTheatres(false);
        setLoadingShowtimes(false);
      } else {
        setError(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Error fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaterData();
  }, []);

  // Filter showtimes by theatre
  const filteredShowtimes = activeTheatreFilter
    ? todaysShowtimes.filter((showtime) => showtime.theatreId === activeTheatreFilter)
    : todaysShowtimes;

  // Refresh functions
  const refreshTheatres = () => {
    setLoadingTheatres(true);
    fetchTheaterData();
  };

  const refreshShowtimes = () => {
    setLoadingShowtimes(true);
    fetchTheaterData();
  };

  const adminCards: CardProps[] = [
    {
      title: 'Total ShowTimes',
      total: data.totalShowTime.toString(),
      icon: faClock,
      color: 'blue',
      path: '/showtime',
    },
    {
      title: 'Total Theatres',
      total: data.totalTheatre.toString(),
      icon: faBuilding,
      color: 'purple',
      path: '/theatres',
    },
    {
      title: 'Total Theatres Screens',
      total: data.theatreScreens.length.toString(),
      icon: faDisplay,
      color: 'green',
      path: '/theatres',
    },
  ];

  return (
    <>
      <Breadcrumb pageName="Theatre Manager Dashboard" />

      {/* Stats Cards */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminCards.map((item, index) => (
            <CardDataStats
              key={index}
              title={item.title}
              total={item.total}
              icon={item.icon}
              color={item.color}
              path={item.path}
            />
          ))}
        </div>

        {/* Theatres Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Theatres</h2>
            <div className="flex space-x-2">
              <Link to="/theatres">
                <button className="p-2 bg-[#472da9] text-white rounded-md hover:bg-[#3a2587] transition-colors">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Theatre
                </button>
              </Link>
              <button
                className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                onClick={refreshTheatres}
                disabled={loadingTheatres}
              >
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  className={loadingTheatres ? 'animate-spin' : ''}
                />
              </button>
            </div>
          </div>

          {loadingTheatres ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <TheatreSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {theatres.map((theatre) => (
                <div
                  key={theatre.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    setActiveTheatreFilter(
                      theatre.id === activeTheatreFilter ? null : theatre.id
                    )
                  }
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      {theatre.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-sm" />
                      <p className="text-sm">{theatre.location}</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      <FontAwesomeIcon icon={faFilm} className="mr-2" />
                      {theatre.screens} Screens
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {
                          todaysShowtimes.filter((s) => s.theatreId === theatre.id)
                            .length
                        }{' '}
                        Showtimes Today
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          statusColors[theatre.status]
                        }`}
                      >
                        {theatre.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Showtimes Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTheatreFilter
                ? `Today's Showtimes for ${theatres.find(
                    (t) => t.id === activeTheatreFilter
                  )?.name}`
                : "Today's Showtimes"}
            </h2>
            <div className="flex space-x-2">
              <Link to="/showtime">
                <button className="p-2 bg-[#472da9] text-white rounded-md hover:bg-[#3a2587] transition-colors">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Showtime
                </button>
              </Link>
              <button
                className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                onClick={refreshShowtimes}
                disabled={loadingShowtimes}
              >
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  className={loadingShowtimes ? 'animate-spin' : ''}
                />
              </button>
            </div>
          </div>

          {activeTheatreFilter && (
            <div className="mb-4">
              <button
                className="text-[#472da9] hover:underline flex items-center"
                onClick={() => setActiveTheatreFilter(null)}
              >
                ← Show all theatres
              </button>
            </div>
          )}

          {loadingShowtimes ? (
            <div>
              {[1, 2, 3, 4].map((i) => (
                <ShowtimeSkeleton key={i} />
              ))}
            </div>
          ) : filteredShowtimes.length > 0 ? (
            <div>
              {filteredShowtimes.map((showtime) => (
                <div
                  key={showtime.id}
                  className="flex bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={showtime.moviePoster || '/placeholder.svg'}
                    alt={showtime.movieTitle}
                    className="w-24 h-24 object-cover rounded mr-4"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src =
                        '../../../public/Image/Fallback Image/default-fallback-image.png';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {showtime.movieTitle}
                      </h3>
                      {!activeTheatreFilter && (
                        <span className="text-sm text-[#472da9] font-medium">
                          {showtime.theatreName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Screen {showtime.screenNumber} • {showtime.startTime} -{' '}
                      {showtime.endTime}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        <FontAwesomeIcon icon={faMoneyBill} className="mr-1" />$
                        {showtime.price.toFixed(2)}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                        <FontAwesomeIcon icon={faChair} className="mr-1" />
                        {showtime.availableSeats} / {showtime.totalSeats} seats
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                        <FontAwesomeIcon icon={faCalendarDay} className="mr-1" />
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
                icon={faTicket}
                className="text-4xl text-gray-400 mb-3"
              />
              <h3 className="text-lg font-medium text-gray-700">
                No showtimes found
              </h3>
              <p className="text-gray-500">
                {activeTheatreFilter
                  ? 'There are no showtimes scheduled for this theatre today.'
                  : 'There are no showtimes scheduled for today.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TheatreManagerDashboard;