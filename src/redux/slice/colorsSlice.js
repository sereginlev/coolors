import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import chroma from 'chroma-js';

export const fetchColor = createAsyncThunk(
	'colors/fetchColor',
	async (props, rejectWithValue) => {
		const { hex, index } = props;

		try {
			const { data } = await axios.get(`https://www.thecolorapi.com/id?hex=${hex}`);

			const response = { hex: data.name.value, index: index };

			return response;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
)

const initialState = {
	colors: [],
	hash: '',
	status: ''
}

export const colorsSlice = createSlice({
	name: 'colors',
	initialState,
	reducers: {
		setHash(state, action) {
			state.hash = action.payload;
		},
		setColors(state) {
			state.colors = state.hash.split('-').map((hex, index) => {
				return { id: index + 1, hex: `#${hex}`, luminance: chroma(`#${hex}`).luminance(), isLocked: false }
			});
		},
		generateColors(state, action) {
			state.colors = state.hash.split('-').map((hex, index) => {
				const item = action.payload[index];

				if (index == item.index) {
					return { id: index + 1, hex: `#${item.hex}`, luminance: chroma(`#${item.hex}`).luminance(), isLocked: item.isLocked }
				}
			});
		},
		addColor(state, action) {
			if (state.colors.length < 8) {
				state.colors.splice(action.payload.index + 1, 0, {
					id: action.payload.index + 1,
					hex: chroma.random().hex(),
					luminance: chroma(action.payload.hex).luminance(),
					isLocked: false
				});

				state.colors.map((color, i) => {
					if (i > action.payload.index) {
						return color.id++;
					}
				})

				state.hash = '';

				state.colors.map((color, index) => {
					if (index === 0) {
						state.hash += `${color.hex.slice(1)}`
					} else {
						state.hash += `-${color.hex.slice(1)}`
					}
				});
			}
		},
		removeColor(state, action) {
			if (state.colors.length > 1) {
				state.colors = state.colors.filter((color, index) => index !== action.payload);

				state.hash = '';

				state.colors.map((color, index) => {
					if (index === 0) {
						state.hash += `${color.hex.slice(1)}`
					} else {
						state.hash += `-${color.hex.slice(1)}`
					}
				});
			}
		},
		toggleLock(state, action) {
			state.colors.map((color, i) => {
				if (i === action.payload.index) {
					return color.isLocked = action.payload.isLocked;
				}
			});
		},
		changeOrder(state, action) {
			state.colors = action.payload;
		}
	},
	extraReducers: {
		[fetchColor.pending]: (state) => {
			state.status = 'loading';
			state.colors.map(color => color.name);
		},
		[fetchColor.fulfilled]: (state, action) => {
			state.status = 'success';
			state.colors.map((color, index) => {
				if (index === action.payload.index) {
					return color.name = action.payload.hex;
				}
			});
		},
		[fetchColor.rejected]: (state) => {
			state.status = 'error';
			state.colors.map(color => color.name);
		}
	}
});

export const { setHash, setColors, generateColors, addColor, removeColor, toggleLock, changeOrder } = colorsSlice.actions;

export default colorsSlice.reducer;
