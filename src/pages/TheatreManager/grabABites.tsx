import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import GrabABitesTable from './GrabABitesTable';

import EventGrabABitesTable from './EventGrabABitesTable';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
const GrabABites = () => {

    const { id } = useParams(); 
    const navigate = useNavigate();
    const currentUser = useSelector((state: any) => state.user.currentUser.data);
   const [name, setName] = useState<string>('');

useEffect(() => {
  const fetchTheatreDetails = async () => {
    try {
    const res = await axios.get(`${Urls.getTheatreDetail}?id=${id}`, {
  headers: {
    Authorization: `Bearer ${currentUser.token}`,
  },
});

     const name = res.data.data.name;
     const displayName = name.length > 10 ? name.substring(0, 10) + '…' : name;
    setName(displayName);
    } catch (err) {
      console.error('Error fetching theatre Details:', err);
    }
  };

  if (id && currentUser?.token) fetchTheatreDetails();
}, [id, currentUser.token]);

  return (
    <div>
      <Breadcrumb pageName={`${name} → Manage Theatres`} parentName="Theatres" parentPath="/theatres"/>

      <GrabABitesTable />
    </div>
  );
};

export default GrabABites;
