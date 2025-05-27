import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import MoviesTicketTable from './MoviesTicketTable';

const MoviesTicket = () => {
  return (
    <div>
      <Breadcrumb pageName="Movie Tickets" />

      <MoviesTicketTable />
    </div>
  );
};

export default MoviesTicket;
