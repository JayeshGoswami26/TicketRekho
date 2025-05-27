import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import EventReportTable from '../components/Tables/EventReportTable';

const EventReport: React.FC = () => {
  
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Manage Event Reports" />
      <EventReportTable />
    </div>
  );
};

export default EventReport;


