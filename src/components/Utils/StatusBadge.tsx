import React from 'react';
import { ManagerStatus } from '../../types/manager';
import { CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ManagerStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        status === 'Active'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {status === 'Active' ? (
        <CheckCircle size={14} className="text-green-600" />
      ) : (
        <XCircle size={14} className="text-red-600" />
      )}
      {status}
    </div>
  );
};

export default StatusBadge;