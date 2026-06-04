import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '../../utils/types';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  selectors: {
    getItemsSelector: (state) => ({
      bun: state.bun,
      ingredients: state.ingredients || []
    })
  },
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => ({
      ...state,
      ingredients: [...(state.ingredients || []), action.payload]
    }),

    removeIngredient: (state, action: PayloadAction<number>) => ({
      ...state,
      ingredients: [
        ...state.ingredients.slice(0, action.payload),
        ...state.ingredients.slice(action.payload + 1)
      ]
    }),

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < 0 || index >= state.ingredients.length - 1) return state;

      const ingredients = [...state.ingredients];
      [ingredients[index + 1], ingredients[index]] = [
        ingredients[index],
        ingredients[index + 1]
      ];

      return {
        ...state,
        ingredients
      };
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index <= 0 || index >= state.ingredients.length) return state;

      const ingredients = [...state.ingredients];
      [ingredients[index], ingredients[index - 1]] = [
        ingredients[index - 1],
        ingredients[index]
      ];

      return {
        ...state,
        ingredients
      };
    },

    addBun: (state, action: PayloadAction<TConstructorIngredient>) => ({
      ...state,
      bun: action.payload
    }),

    clear: () => initialState
  }
});

export const constructorReducer = constructorSlice.reducer;

export const {
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  addBun,
  clear
} = constructorSlice.actions;

export const { getItemsSelector } = constructorSlice.selectors;
export default constructorSlice;
