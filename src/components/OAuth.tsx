// import React from 'react'
// import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
// import { app } from '../firebase'
// import { useDispatch } from 'react-redux'
// import { signInSuccess } from '../redux/user/userSlice'
// import {useNavigate} from 'react-router-dom'


// const OAuth = () => {

//     const dispatch = useDispatch();
//     const navigate = useNavigate()

//     const handleGoogleClick = async() =>{
//         try{
//             const provider = new GoogleAuthProvider()
//             const auth = getAuth(app)

//             const result = await signInWithPopup(auth, provider)
//             // console.log(result);
//             const res = await fetch('/api/auth/google', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 name: result.user.displayName,
//                 email: result.user.email,
//                 photo: result.user.photoURL

//               })
//             })
//             const data = await res.json()
//             dispatch(signInSuccess(data))
//             navigate('/')
//         } catch(error){
//           console.log('Could not login with google', error);
//         }
//     }


//   return (
  
//   <button 
//   type='button' onClick={handleGoogleClick}
//   className={`bg-red-700 text-white rounded-md p-2 uppercase hover:opacity-95 disabled:opacity-80`}>Continue with Google</button>
    
//   )
// }

// export default OAuth

import React from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
// @ts-ignore
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
// @ts-ignore
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.error('Could not login with Google', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white rounded-md p-2 uppercase hover:opacity-95 disabled:opacity-80"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
