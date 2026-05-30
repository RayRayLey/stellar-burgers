import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  getUserApi,
  TRegisterData,
  loginUserApi,
  TLoginData,
  fetchWithRefresh
} from '../../utils/burger-api';
import { setCookie, getCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';
import { createSlice } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData) => loginUserApi({ email, password })
);

//export const getUser = fetchWithRefresh('auth/user', async() => getCookie('accessToken'));

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginUserRequest: boolean;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginUserRequest: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUserSelector: (state) => ({
      user: state.user,
      isAuthChecked: state.isAuthChecked,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      loginUserRequest: state.loginUserRequest
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message || 'Ошибка при входе';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        setCookie('accessToken', action.payload.accessToken); //register?
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }); //.addCase(getUser.fulfilled, (state, action) => {});
  }
});

export const { getUserSelector } = userSlice.selectors;
