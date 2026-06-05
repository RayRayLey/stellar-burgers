import { PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  getUserApi,
  TRegisterData,
  loginUserApi,
  TLoginData,
  logoutApi,
  updateUserApi
} from '../../utils/burger-api';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';
import { createSlice } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData, { rejectWithValue }) => {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, name, password }: TRegisterData, { rejectWithValue }) => {
    const data = await registerUserApi({ email, name, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    const dataUser = await getUserApi();
    if (!dataUser?.success) {
      return rejectWithValue(dataUser);
    }
    return dataUser.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: TUser, { rejectWithValue }) => {
    const data = await updateUserApi(user);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('Token required');

    try {
      await logoutApi();
      localStorage.clear(); // очищаем refreshToken
      deleteCookie('accessToken'); // очищаем accessToken
      dispatch(userLogout()); // удаляем пользователя из хранилища
    } catch (error) {
      console.log('Ошибка выполнения выхода:', error);
      throw error;
    }
  }
);

type TAuthState = {
  user: TUser | null;
  form: TRegisterData;
  error: string | null;
  sending: boolean;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
};

const initialState: TAuthState = {
  user: null,
  form: {
    email: '',
    password: '',
    name: ''
  },
  error: null,
  sending: false,
  isAuthChecked: false,
  isAuthenticated: false
};

export type TFieldType<T> = {
  field: keyof T;
  value: string;
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFormValue: (state, action: PayloadAction<TFieldType<TLoginData>>) => {
      state.form[action.payload.field] = action.payload.value;
    },
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.user = initialState.user;
      state.isAuthenticated = false;
    }
  },
  selectors: {
    getUserSelector: (state) => state.user,
    authCheckedSelector: (state) => state.isAuthChecked,
    isAuthenticatedSelector: (state) => state.isAuthenticated,
    sendingSelector: (state) => state.sending,
    sendErrorSelector: (state) => state.error,
    authSelector: (state) => state.form
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.sending = false;
        state.error = action.error.message || 'Ошибка при входе';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.sending = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(getUser.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.sending = false;
        state.error = action.error.message || 'Ошибка получения данных';
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.sending = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(registerUser.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.sending = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка при регистрации';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.sending = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.sending = false;
        state.error = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.sending = false;
        state.error = action.error.message || 'Ошибка обновления данных';
      });
  }
});

export const { authChecked, userLogout, setFormValue } = userSlice.actions;

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const userReducer = userSlice.reducer;

export const {
  getUserSelector,
  authCheckedSelector,
  isAuthenticatedSelector,
  sendingSelector,
  sendErrorSelector,
  authSelector
} = userSlice.selectors;

export default userSlice;
