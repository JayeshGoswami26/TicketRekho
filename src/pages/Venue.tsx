import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import VenueTable from '../components/Tables/VenueTable';

const Venue = () => {
  return (
    <div>
      <Breadcrumb pageName="Manage Venues" />

      <VenueTable />
    </div>
  );
};

export default Venue;
