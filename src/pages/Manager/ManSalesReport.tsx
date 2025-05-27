import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import ChartOne from '../../components/Charts/ChartOne';
import ManagerCalendar from './ManagerCalendar';


const ManSalesReport = () => {
  return (
    <>
      <Breadcrumb pageName="Sales Report" />
      <ManagerCalendar />

      {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <ChartOne />
        </div>
      </div> */}

    </>
  );
};

export default ManSalesReport;
