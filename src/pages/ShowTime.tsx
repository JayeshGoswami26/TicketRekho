import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import ShowTimeTable from '../components/Tables/ShowTimeTable';

const ShowTime = () => {
  return (
    <div>
      <Breadcrumb pageName="Showtimes" />
      <ShowTimeTable />
    </div>
  );
};

export default ShowTime;
