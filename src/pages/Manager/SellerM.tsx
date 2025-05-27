import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SellerMTable from './SellerMTable';


const SellerM = () => {
  return (
    <>
      <Breadcrumb pageName="Sellers" />
      <SellerMTable />
    </>
  );
};

export default SellerM;
