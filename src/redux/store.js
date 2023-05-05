import { configureStore } from '@reduxjs/toolkit';

import colors from './slice/colorsSlice';

export const store = configureStore({
	reducer: {
		colors
	}
})