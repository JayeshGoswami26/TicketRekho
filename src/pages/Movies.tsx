import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import MoviesTable from '../components/Tables/MoviesTable';

const Movies = () => {
  return (
    <>
      <Breadcrumb pageName="Movie Management" />
      <MoviesTable />
    </>
  );
};

export default Movies;
