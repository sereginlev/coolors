import { configureStore } from '@reduxjs/toolkit';

import colors from './slice/colorsSlice';

export const store = configureStore({
	reducer: {
		colors
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;