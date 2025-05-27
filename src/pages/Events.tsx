import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import EventsTable from '../components/Tables/EventsTable';

const Events = () => {
  return (
    <>
      <Breadcrumb pageName="Event Management" />
      <EventsTable />
    </>
  );
};

export default Events;