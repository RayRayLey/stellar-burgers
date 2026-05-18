import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { createSlice } from '@reduxjs/toolkit';

export const getFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

type TFeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isFeedsLoading: boolean;
  error: string | null;
};

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isFeedsLoading: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    getFeedsSelector: (state) => state.orders,
    totalSelector: (state) => state.total,
    totalTodaySelector: (state) => state.totalToday,
    loadingSelector: (state) => state.isFeedsLoading,
    errorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isFeedsLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isFeedsLoading = false;
        state.error = action.error.message || 'Ингридиенты не загрузились';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isFeedsLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const {
  getFeedsSelector,
  totalSelector,
  totalTodaySelector,
  loadingSelector,
  errorSelector
} = feedSlice.selectors;
export default feedSlice;
