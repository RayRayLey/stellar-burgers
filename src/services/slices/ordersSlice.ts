import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  getOrderByNumberApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const getOrders = createAsyncThunk('orders/getAll', async () =>
  getOrdersApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getById',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders;
  }
);

export const orderBurger = createAsyncThunk(
  'orders/newOrder',
  async (ingredients: string[]) => orderBurgerApi(ingredients)
);

type TOrdersState = {
  orders: Array<TOrder>;
  currentOrder: TOrder | null;
  isOrdersLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  currentOrder: null,
  isOrdersLoading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.currentOrder = null;
    }
  },
  selectors: {
    getOrdersSelector: (state) => state.orders,
    currentOrderSelector: (state) => state.currentOrder,
    loadingOrderSelector: (state) => state.isOrdersLoading,
    errorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error.message || 'Заказы не загрузились';
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error.message || 'Заказ не загрузился';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.currentOrder = action.payload[0] ?? null;
      })
      .addCase(orderBurger.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error.message || 'Заказ не заказался';
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        const newBurger: TOrder = {
          ...action.payload.order,
          ingredients: action.meta.arg
        };
        state.orders.push(newBurger);
        state.currentOrder = newBurger;
      });
  }
});

export const {
  getOrdersSelector,
  currentOrderSelector,
  loadingOrderSelector,
  errorSelector
} = orderSlice.selectors;
export const { clearCurrent } = orderSlice.actions;

export default orderSlice;
