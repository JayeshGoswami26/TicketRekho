import React from 'react';
import { motion } from 'framer-motion';
import { Manager, ManagerCategory } from '../../types/manager';
import StatusBadge from '../Utils/StatusBadge';
import CategoryBadge from '../Utils/CategoryBadge';
import { Mail, Phone, MapPin, Calendar, BookOpen } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface ManagerCardProps {
  manager: Manager;
  index: number;
  onViewProfile: (id: string) => void;
}

const ManagerCard: React.FC<ManagerCardProps> = ({
  manager,
  index,
  onViewProfile,
}) => {
  const navigate = useNavigate();

  const roleDescriptions: Record<ManagerCategory, string> = {
    'Theatre Manager':
      'Responsible for managing theater operations, including theaters, showtimes, and assigning theater employees.',
    'Theatre Employee':
      'Handles ticket validation by scanning QR codes for movie show entries.',
    'Event Manager':
      'Oversees event creation, venue management, and assigning event employees to ensure smooth event operations.',
    'Event Employee':
      'Responsible for scanning QR codes at event entries and verifying ticket authenticity.',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{
        y: -5,
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      className="bg-white rounded-xl shadow-md overflow-hidden w-full h-full"
    >
      <div className="h-24 bg-indigo-purple relative">
        <div className="absolute -bottom-10 left-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg"
          >
            {/* <img
              src={'../../../public//Image/Profile/profile-1.jpg'}
              alt={manager.name}
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.target.onerror = null; // Prevents looping in case fallback also fails
                e.target.src =
                  '../../../public/Image/Fallback Image/default-fallback-image.png'; // Your fallback image path
              }}
            /> */}
            <div className="w-full h-full object-cover bg-[#f1f5f9] p-3">
              <svg
                viewBox="0 0 1024 1024"
                className="icon"
                width={'100%'}
                height={'100%'}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M691.573 338.89c-1.282 109.275-89.055 197.047-198.33 198.331-109.292 1.282-197.065-90.984-198.325-198.331-0.809-68.918-107.758-68.998-106.948 0 1.968 167.591 137.681 303.31 305.272 305.278C660.85 646.136 796.587 503.52 798.521 338.89c0.811-68.998-106.136-68.918-106.948 0z"
                    fill="#4A5699"
                  ></path>
                  <path
                    d="M294.918 325.158c1.283-109.272 89.051-197.047 198.325-198.33 109.292-1.283 197.068 90.983 198.33 198.33 0.812 68.919 107.759 68.998 106.948 0C796.555 157.567 660.839 21.842 493.243 19.88c-167.604-1.963-303.341 140.65-305.272 305.278-0.811 68.998 106.139 68.919 106.947 0z"
                    fill="#C45FA0"
                  ></path>
                  <path
                    d="M222.324 959.994c0.65-74.688 29.145-144.534 80.868-197.979 53.219-54.995 126.117-84.134 201.904-84.794 74.199-0.646 145.202 29.791 197.979 80.867 54.995 53.219 84.13 126.119 84.79 201.905 0.603 68.932 107.549 68.99 106.947 0-1.857-213.527-176.184-387.865-389.716-389.721-213.551-1.854-387.885 178.986-389.721 389.721-0.601 68.991 106.349 68.933 106.949 0.001z"
                    fill="#E5594F"
                  ></path>
                </g>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pt-12 px-6 pb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{manager.name}</h3>
            <p className="text-gray-600 text-sm">
              {/* {(() => {
                const start = new Date(manager.createdAt);
                const now = new Date();

                let years = now.getFullYear() - start.getFullYear();
                let months = now.getMonth() - start.getMonth();

                if (months < 0) {
                  years--;
                  months += 12;
                }

                return `${years==0 ? '' : years+ ' year'}  ${months===0 ? 'new join this' : months} month${
                  months !== 0 ? 's' : ''
                }`;
              })()} */}
              Joined <br />
              {formatDistanceToNow(new Date(manager.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <StatusBadge status={manager.active} />
            <CategoryBadge category={manager.role} />
          </div>
        </div>

        {/* Manager Description */}

        {/* <p className="text-gray-600 text-sm mt-4 mb-4 line-clamp-2">
          {roleDescriptions[manager.role]}
        </p> */}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail size={16} className="mr-2 text-indigo-500" />
            <span className="truncate">{manager?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone size={16} className="mr-2 text-indigo-500" />
            <span>{manager.phoneNumber || 'N/A'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-indigo-500" />
            <span>
              {manager.city || manager.address || 'N/A'}
              {manager.state ? ',' + manager.state : ''}

            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2 text-indigo-500" />
            <span>
              Joined {new Date(manager.createdAt || 'N/A').toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {manager.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div> */}

        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full py-2 bg-indigo-purple text-white rounded-lg font-medium flex items-center justify-center"
          onClick={() => {
            navigate(`/manager-detail/${manager._id}`);
          }}
        >
          <BookOpen size={16} className="mr-2" />
          View Profile
        </motion.button> */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full py-2 bg-indigo-purple text-white rounded-lg font-medium flex items-center justify-center"
          onClick={() => onViewProfile(manager._id)}
        >
          <BookOpen size={16} className="mr-2" />
          View Profile
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ManagerCard;
