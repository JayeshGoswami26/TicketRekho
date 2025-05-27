// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// // Define the shape of the user state
// interface UserState {
//   currentUser: any | null;
//   loading: boolean;
//   error: string | null;
// }

// // Define the initial state using the UserState interface
// const initialState: UserState = {
//   currentUser: null,
//   loading: false,
//   error: null,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     signInStart: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     signInSuccess: (state, action: PayloadAction<any>) => {
//       state.currentUser = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     signInFailure: (state, action: PayloadAction<string>) => {
//       state.loading = false;
//       state.error = action.payload; // Set the error payload
//     },
//     updateUserStart: (state) => {
//       state.loading = true;
//     },
//     updateUserSuccess: (state, action: PayloadAction<any>) => {
//       state.currentUser = action.payload;
//       state.loading = false;
//       state.error = null; // Set to null instead of false for better error handling
//     },
//     updateUserFailure: (state, action: PayloadAction<string>) => {
//       state.loading = false;
//       state.error = action.payload; // Set the error payload
//     },
//     deleteUserStart: (state) => {
//       state.loading = true;
//     },
//     deleteUserSuccess: (state) => {
//       state.currentUser = null;
//       state.loading = false;
//       state.error = null; // Set to null instead of false for better error handling
//     },
//     deleteUserFailure: (state, action: PayloadAction<string>) => {
//       state.loading = false;
//       state.error = action.payload; // Set the error payload
//     },
//     signOut: (state) => {
//       state.currentUser = null;
//       state.loading = false;
//       state.error = null; // Set to null instead of false for better error handling
//     },
//   },
// });

// export const {
//   signInFailure,
//   signInStart,
//   signInSuccess,
//   updateUserFailure,
//   updateUserStart,
//   updateUserSuccess,
//   deleteUserFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   signOut,
// } = userSlice.actions;

// export default userSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the user state
interface UserState {
  currentUser: any | null;
  loading: boolean;
  error: string | null;
}

// Define the initial state using the UserState interface
const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload; // Set the error payload
    },
    updateProfileImage: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.data.profileImage = action.payload; // Update only the profileImage
      }
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null; // Set to null instead of false for better error handling
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload; // Set the error payload
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null; // Set to null instead of false for better error handling
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload; // Set the error payload
    },
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null; // Set to null instead of false for better error handling
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
  updateProfileImage, 
} = userSlice.actions;

export default userSlice.reducer;
