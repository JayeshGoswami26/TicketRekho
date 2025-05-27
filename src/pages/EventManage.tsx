import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TheatreManagerTable from '../components/Tables/TheatreManagerTable';
import EventManagerTable from '../components/Tables/EventManagerTable';

const EventManage: React.FC = () => {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Event Management" />
      <EventManagerTable />
    </div>
  );
};

export default EventManage;
