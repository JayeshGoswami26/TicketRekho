
import React, {useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import url from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import EventSeatx from './EventSeatx';

const EventSeatLayout = () => {
  const { id } = useParams(); 
  const [name, setName] = useState<string>('');
  const currentUser = useSelector((state: any) => state.user.currentUser?.data); // User data from Redux

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get(`${url.displayVenueDetail}?id=${id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setName(res.data.data.name); 
        // console.log("res.data.data.name",res.data.data.name);
        // console.log("stateName",stateName);

      } catch (err) {
        console.error('Error fetching venue:', err);
      }
    };
  
    if (id) fetchVenue();
  }, [id, currentUser.token]);

  return (
    <div>
      <Breadcrumb pageName={`${name} → Seat layout`}  parentName="Venues" parentPath="/venues"/>

      {/* <ScreensTable /> */}
      <EventSeatx />
    </div>
  );
};

export default EventSeatLayout;
