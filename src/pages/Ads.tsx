import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import AdsTable from '../components/Tables/AdsTable';


const Ads = () => {
  return (
    <div>
      <Breadcrumb pageName="Advertisements" />
      <AdsTable />
    </div>
  );
};

export default Ads;
