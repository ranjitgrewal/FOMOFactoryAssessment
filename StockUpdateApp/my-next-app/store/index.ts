// store/index.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Stock {
    data: Object;
  }
interface StockState {
  stock: Stock[];
}

const initialState: StockState = {
  stock: [],
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStock(state, action: PayloadAction<Stock[]>) {
      state.stock = action.payload;
    },
  },
});

export const { setStock } = stockSlice.actions;

const store = configureStore({
  reducer: {
    stock: stockSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
