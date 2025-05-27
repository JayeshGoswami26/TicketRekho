import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
// @ts-ignore
import { RootState } from '../redux/store'; // Import the RootState type from your store

interface PrivateRouteProps {
  allowedRoles: string[]; // Define allowed roles as a prop
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const currentUser = useSelector(
    (state: RootState) => state.user.currentUser?.data,
  );

  // console.log(currentUser)
  // Check if the user is authenticated and has one of the allowed roles
  const hasAccess = currentUser && allowedRoles.includes(currentUser.role);

  return hasAccess ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default PrivateRoute;
