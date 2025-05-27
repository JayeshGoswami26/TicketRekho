import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CouponManagement from '../components/CouponManagement';
import CouponTable from '../components/Tables/CouponTable';

const Coupon = () => {
  return (
    <div>
      <Breadcrumb pageName="Coupon Codes" />

      {/* <CouponTable /> */}
      <CouponManagement/>
    </div>
  );
};

export default Coupon;
