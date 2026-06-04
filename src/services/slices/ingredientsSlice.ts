import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

type TIngredientsState = {
  ingredients: Array<TIngredient>;
  isIngredientsLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

export const categorised = (ingredients: Array<TIngredient>) =>
  ingredients.reduce(
    (acc, ingredient) => {
      if (ingredient.type === 'bun') {
        acc.buns.push(ingredient);
      } else if (ingredient.type === 'main') {
        acc.mains.push(ingredient);
      } else if (ingredient.type === 'sauce') {
        acc.sauces.push(ingredient);
      }
      return acc;
    },
    {
      buns: [] as TIngredient[],
      mains: [] as TIngredient[],
      sauces: [] as TIngredient[]
    }
  );

export const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsSelector: (state) => state.ingredients,
    loadingIngredientsSelector: (state) => state.isIngredientsLoading,
    errorSelector: (state) => state.error,
    categorisedSelector: (state) =>
      state.ingredients.reduce(
        (acc, ingredient) => {
          if (ingredient.type === 'bun') {
            acc.buns.push(ingredient);
          } else if (ingredient.type === 'main') {
            acc.mains.push(ingredient);
          } else if (ingredient.type === 'sauce') {
            acc.sauces.push(ingredient);
          }
          return acc;
        },
        {
          buns: [] as TIngredient[],
          mains: [] as TIngredient[],
          sauces: [] as TIngredient[]
        }
      )
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message || 'Ингридиенты не загрузились';
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const ingredientsReducer = ingredientSlice.reducer;

export const {
  getIngredientsSelector,
  loadingIngredientsSelector,
  errorSelector,
  categorisedSelector
} = ingredientSlice.selectors;

export default ingredientSlice.reducer;
