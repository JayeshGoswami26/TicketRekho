import React from 'react';
import { ManagerCategory } from '../../types/manager';
import { Theater, Calendar } from 'lucide-react';

interface CategoryBadgeProps {
  category: ManagerCategory;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        category === 'Theatre Manager'
          ? 'bg-indigo-100 text-indigo-800'
          : ''
      } 
      ${category === 'Event Manager' ? 'bg-purple-100 text-purple-800': ''}
      ${category === 'Event Employee' ? 'bg-teal-100 text-teal-800' : ''}
      ${category === 'Theatre Employee' ? 'bg-red-100 text-red-800' : ''}
      `}
    >
      {category === 'Theatre Manager' ? (
        <Theater size={14} className="text-indigo-600" />
      ) : (
        null
      )}  
      {category === 'Event Manager' ? (
        <Calendar size={14} className="text-purple-600" />
      ) : (
        null
      )}  
      {category === 'Theatre Employee' ? (
        <Theater size={14} className="text-red-600" />
      ) : (
        null
      )}  
      {category === 'Event Employee' ? (
        <Calendar size={14} className="text-teal-600" />
      ) : (
        null
      )}  
      {category}
    </div>
  );
};

export default CategoryBadge;
