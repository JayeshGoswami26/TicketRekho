import React, {useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import url from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import ScreensTable from './ScreensTable';



const Screens = () => {
  const { id } = useParams(); 
  const [theatreName, setTheatreName] = useState<string>('');
  const currentUser = useSelector((state: any) => state.user.currentUser?.data); // User data from Redux

  useEffect(() => {
    const fetchTheatreDetail = async () => {
      try {
        const res = await axios.get(`${url.getTheatreDetail}?id=${id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setTheatreName(res.data.data.name); 

      } catch (err) {
        console.error('Error fetching theatre:', err);
      }
    };
  
    if (id) fetchTheatreDetail();
  }, [id, currentUser.token]);

  return (
    <div>
      <Breadcrumb pageName={`${theatreName} → Screens`} parentName="Theatres" parentPath="/theatres"/>

      <ScreensTable />
    </div>
  );
};

export default Screens;
