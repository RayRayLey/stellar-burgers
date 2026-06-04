import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientSlice } from '../services/slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';
import { orderSlice } from './slices/ordersSlice';
import { feedSlice } from './slices/feedsSlice';
import { constructorSlice } from './slices/constructorSlice';

export const rootReducer = combineSlices(
  ingredientSlice,
  userSlice,
  orderSlice,
  feedSlice,
  constructorSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['constructor/addIngredient'],
        ignoredPaths: ['constructor']
      }
    })
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
