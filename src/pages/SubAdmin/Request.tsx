import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import RequestTable from '../../components/Tables/RequestTable';

const Request = () => {
  return (
    <>
      <Breadcrumb pageName="Requests" />

      <RequestTable />
    </>
  );
};

export default Request;
