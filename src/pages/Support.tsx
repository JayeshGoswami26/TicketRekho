import React from 'react'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import SupportTable from '../components/Tables/SupportTable';
import SupportGrid from '../components/Utils/SupportGrid';

const Support = () => {
  return (
    <>
      <Breadcrumb pageName="Support & Feedback" />
      {/* <SupportTable /> */}
       <div className="px-4 md:px-6 py-4">
        <SupportGrid />
      </div>
    </>
  );
};

export default Support
