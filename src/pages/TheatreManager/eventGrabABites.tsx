import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import EventGrabABitesTable from './EventGrabABitesTable';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';

const eventGrabABites = () => {
  const { id } = useParams(); 
    const navigate = useNavigate();
    const currentUser = useSelector((state: any) => state.user.currentUser.data);
   const [name, setName] = useState<string>('');

useEffect(() => {
  const fetchEventDetails = async () => {
    try {
      const res = await axios.post(`${Urls.getEventDetail}`, { eventId: id }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

     const name = res.data.data.name;
     const displayName = name.length > 10 ? name.substring(0, 10) + '…' : name;
    setName(displayName);
    } catch (err) {
      console.error('Error fetching Event Details:', err);
    }
  };

  if (id && currentUser?.token) fetchEventDetails();
}, [id, currentUser.token]);


  return (
    <div>
      <Breadcrumb pageName={`${name} → Event Management`} parentName="Event Management" parentPath="/events" />


      <EventGrabABitesTable />
    </div>
  );
};

export default eventGrabABites;
