import React from 'react'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import EnquiryTable from '../components/Tables/EnquiryTable';
import EnquiryGrid from '../components/Utils/EnquiryGrid';

const Enquiry = () => {
  return (
    <>
      <Breadcrumb pageName="Enquiries" />
      {/* <EnquiryTable /> */}
      <div className="px-4 md:px-6 py-4">
        <EnquiryGrid />
      </div>
    </>
  );
};

export default Enquiry
