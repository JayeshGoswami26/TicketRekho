import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import ManagerDepositTable from '../../components/Tables/ManagerDepositTable';

const ManagerDeposits = () => {
  return (
    <>
      <Breadcrumb pageName="Team Deposits" />
      <ManagerDepositTable />
    </>
  );
};

export default ManagerDeposits;
