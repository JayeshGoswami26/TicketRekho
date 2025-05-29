import type React from 'react';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faLocationDot,
  faPlus,
  faMoneyBill,
  faUsers,
  faTicketAlt,
  faCalendarDay,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

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
  title: string;
  image: string;
  category: string;
  startTime: string;
  endTime: string;
  ticketPrice: number;
  ticketsSold: number;
  totalCapacity: number;
  createdAt: string;
}

const sampleVenue: Venue = {
  id: 1,
  name: 'Grand Convention Center',
  location: '123 Main Street, Downtown',
  capacity: 1500,
  status: 'Available',
};

const sampleEvents: Event[] = [
  {
    id: 1,
    venueId: 1,
    title: 'Tech Conference 2025',
    image: '/placeholder.svg',
    category: 'Conference',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    ticketPrice: 149.99,
    ticketsSold: 1200,
    totalCapacity: 1500,
    createdAt: '2025-05-26T12:00:00Z',
  },
  {
    id: 2,
    venueId: 1,
    title: 'Networking Mixer',
    image: '/placeholder.svg',
    category: 'Workshop',
    startTime: '06:30 PM',
    endTime: '09:00 PM',
    ticketPrice: 49.99,
    ticketsSold: 300,
    totalCapacity: 500,
    createdAt: '2025-05-27T15:00:00Z',
  },
  {
    id: 3,
    venueId: 1,
    title: 'Product Launch Summit',
    image: '/placeholder.svg',
    category: 'Conference',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    ticketPrice: 99.99,
    ticketsSold: 800,
    totalCapacity: 1000,
    createdAt: '2025-05-28T08:30:00Z',
  },
];

const EventManagerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const sortedEvents = [...sampleEvents].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setEvents(sortedEvents);
  }, []);

  return (
    <div className="p-6">
      <Breadcrumb pageName="Event Manager Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{sampleVenue.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-sm" />
            <span>{sampleVenue.location}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            <FontAwesomeIcon icon={faUsers} className="mr-2" /> Capacity: {sampleVenue.capacity.toLocaleString()}
          </p>
          <span className={`inline-block text-xs px-3 py-1 rounded-full ${sampleVenue.status === 'Available' ? 'bg-green-100 text-green-700' : sampleVenue.status === 'Booked' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {sampleVenue.status}
          </span>
        </div>
      </div>

      <div className="my-6">
        <h2 className="text-xl font-semibold mb-4">Recently Created Events</h2>

        {events.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No recent events found</h3>
            <p className="text-gray-500">There are no events created for this venue yet.</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
              <img
                src={event.image || '/placeholder.svg'}
                alt={event.title}
                className="w-20 h-20 object-cover rounded mr-4"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = '../../../public/Image/Fallback Image/default-fallback-image.png';
                }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                  <span className="text-sm text-[#472da9] font-medium">{sampleVenue.name}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  {event.startTime} - {event.endTime}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    <FontAwesomeIcon icon={faMoneyBill} className="mr-1" />${event.ticketPrice.toFixed(2)}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    <FontAwesomeIcon icon={faTicketAlt} className="mr-1" />{event.ticketsSold} / {event.totalCapacity} tickets
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                    <FontAwesomeIcon icon={faCalendarDay} className="mr-1" />Created
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventManagerDashboard;
