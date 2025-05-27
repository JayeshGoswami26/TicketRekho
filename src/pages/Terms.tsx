import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TermsTable from '../components/Tables/TermsTable';

const Terms = () => {
  return (
    <div>
      <Breadcrumb pageName="Terms & Conditions" />

      <TermsTable />
    </div>
  );
};

export default Terms;
