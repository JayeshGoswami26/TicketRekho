import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TheatresTable from './TheatresTable';

const Theatres = () => {
  return (
    <div>
      <Breadcrumb pageName="Manage Theatres" />

      <TheatresTable />
    </div>
  );
};

export default Theatres;
