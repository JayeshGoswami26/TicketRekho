import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import EventTicketTable from './EventTicketTable';

const EventTicket = () => {
  return (
    <div>
      <Breadcrumb pageName="Event Tickets" />

      <EventTicketTable />
    </div>
  );
};

export default EventTicket;
