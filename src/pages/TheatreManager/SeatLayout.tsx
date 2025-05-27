import React, {useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import url from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import ScreensTable from './ScreensTable';
import Seatx from './Seatx';

const SeatLayout = () => {
  const { id } = useParams(); 
     const [breadcrumbPath, setBreadcrumbPath] = useState<string>('');
    const [theatreInfo, setTheatreInfo] = useState<string>('');
    const currentUser = useSelector((state: any) => state.user.currentUser?.data); // User data from Redux
  
    useEffect(() => {
      const fetchTheatreAndScreenDetail = async () => {
        try {
          const res = await axios.get(`${url.getScreensDetailWithTheatre}?id=${id}`, {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          });

          // Extract and store in variables
          
           // Set breadcrumb path using screen ID
          setBreadcrumbPath(`/screens/${res.data.data.theatre._id}`);
          const theatreName = res.data.data.theatre.name;
          const screenName = res.data.data.name;
          const combineResult = theatreName +" → "+screenName;
          setTheatreInfo(combineResult); 

          // console.log("res.data.data.name",res.data.data.name);
         //  console.log("stateName",stateName);
  
        } catch (err) {
          console.error('Error fetching state:', err);
        }
      };
    
      if (id) fetchTheatreAndScreenDetail();
    }, [id, currentUser.token]);

      

  return (
    <div>
      <Breadcrumb pageName={`${theatreInfo} → Seat layout`} parentName="Screens" parentPath={breadcrumbPath}/>

      {/* <ScreensTable /> */}
      <Seatx />
    </div>
  );
};

export default SeatLayout;
