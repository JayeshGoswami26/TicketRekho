import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
// import RolesPermissions from '../components/Cards/RolesPermissionsDummy';
import RolePermission from '../components/RolePermission';

const RolesPermission = () => {
  return (
    <div className='mx-auto max-w-270' >
      <Breadcrumb pageName="Roles & Permissions" />

      {/* <UserManager /> */}

      <RolePermission />

      {/* <RolesPermissions/> */}

    </div>
  );
};

export default RolesPermission;
