import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import AppUserTable from '../components/Tables/AppUserTable';
import UsersTable from '../components/Tables/UsersTable';

const User: React.FC = () => {
  
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Users" />
      {/* <AppUserTable /> */}
      <UsersTable/>
    </div>
  );
};

export default User;


