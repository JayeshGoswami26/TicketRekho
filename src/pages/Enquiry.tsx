import React from 'react'
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import EnquiryTable from '../components/Tables/EnquiryTable';

const Enquiry = () => {
  return (
    <>
      <Breadcrumb pageName="Enquiries" />
      <EnquiryTable />
    </>
  );
};

export default Enquiry
