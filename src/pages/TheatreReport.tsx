import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TheatreReportTable from '../components/Tables/TheatreReportTable';

const TheatreReport: React.FC = () => {
  
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Manage Theatre Reports" />
      <TheatreReportTable />
    </div>
  );
};

export default TheatreReport;


