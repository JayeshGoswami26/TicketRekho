import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import BannerTable from '../components/Tables/BannerTable';

const Banner = () => {
  return (
    <div>
      <Breadcrumb pageName="Banners" />
      <BannerTable />
    </div>
  );
};

export default Banner;
