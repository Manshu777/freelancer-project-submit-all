import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import Baseurl from '../config/Appurl';

export const fetchData = createAsyncThunk(
  'data/fetchData',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/api/v1/user`);
      // console.warn('Data fetched:', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch data',
      );
    }
  },
);


export const postData = createAsyncThunk(
  'user/register',
  async (formData, {rejectWithValue}) => {
    try {
      const response = await axios.post(`http://10.0.2.2:8000/api/v1/user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // If successful, parse and return the response data
      // console.log(response.data,'this is from dataslices');
      return response.data;
    } catch (error) {
      console.warn(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: [],
    status: 'idle',
    token: null, // Token storage
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearData: state => {
      state.data = [];
    },
  },
  extraReducers: builder => {
    builder

      .addCase(fetchData.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred while fetching data';
      })

      .addCase(postData.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(postData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token; // Store the token
      })
      .addCase(postData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred during registration';
      });
  },
});

export const {clearData, setToken} = dataSlice.actions;

export default dataSlice.reducer;
