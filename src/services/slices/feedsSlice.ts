import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { createSlice } from '@reduxjs/toolkit';

export const getFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

type TFeedsState = {
  feeds: TOrder[];
  total: number;
  totalToday: number;
  isFeedsLoading: boolean;
  error: string | null;
};

const initialState: TFeedsState = {
  feeds: [],
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
    getFeedsSelector: (state) => ({
      feeds: state.feeds,
      total: state.total,
      totalToday: state.totalToday,
      isFeedsLoading: state.isFeedsLoading,
      error: state.error
    })
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
        state.feeds = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const { getFeedsSelector } = feedSlice.selectors;
