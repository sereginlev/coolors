import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import chroma from 'chroma-js';

export const fetchColor = createAsyncThunk(
	'colors/fetchColor',
	async (hex, rejectWithValue) => {
		const { code, index } = hex;

		try {
			const { data } = await axios.get(`https://www.thecolorapi.com/id?hex=${code}`);

			const response = { name: data.name.value, index: index };

			return response;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
)

const initialState = {
	colors: [
		{ id: 1, hex: chroma.random().hex(), luminance: null, name: null, isLocked: false },
		{ id: 2, hex: chroma.random().hex(), luminance: null, name: null, isLocked: false },
		{ id: 3, hex: chroma.random().hex(), luminance: null, name: null, isLocked: false },
		{ id: 4, hex: chroma.random().hex(), luminance: null, name: null, isLocked: false },
		{ id: 5, hex: chroma.random().hex(), luminance: null, name: null, isLocked: false }
	],
	hash: '',
	status: ''
}

export const colorsSlice = createSlice({
	name: 'colors',
	initialState,
	reducers: {
		setId(state, action) {
			state.colors.map((color, i) => {
				if (i === action.payload) {
					color.id = action.payload + 1;
				}
			})
		},
		setHex(state, action) {
			state.colors.map((color, i) => {
				if (i === action.payload.index) {
					color.hex = action.payload.hex;
				}
			})
		},
		setLuminance(state, action) {
			state.colors.map((color, i) => {
				if (i === action.payload) {
					color.luminance = chroma(color.hex).luminance();
				}
			});
		},
		toggleLock(state, action) {
			state.colors.map((color, i) => {
				if (i === action.payload.index) {
					color.isLocked = action.payload.isLocked;
				}
			});
		},
		addColor(state, action) {
			if (state.colors.length < 8) {
				state.colors.splice(action.payload + 1, 0, {
					id: action.payload + 1,
					hex: chroma.random().hex(),
					luminance: null,
					name: null,
					isLocked: false
				});

				state.colors.map((color, i) => {
					if (i > action.payload) {
						return color.id++;
					}
				})
			}
		},
		removeColor(state, action) {
			if (state.colors.length > 1) {
				state.colors = state.colors.filter((col, i) => i !== action.payload);
			}
		},
		changeOrder(state, action) {
			state.colors = action.payload;
		},
		setHash(state) {
			state.hash = '';
			state.colors.map((color, i) => {
				if (i === 0) {
					state.hash += `${color.hex.slice(1)}`
				} else {
					state.hash += `-${color.hex.slice(1)}`
				}
			});
		}
	},
	extraReducers: {
		[fetchColor.pending]: (state) => {
			state.status = 'loading';
			state.colors.map(color => color.name);
		},
		[fetchColor.fulfilled]: (state, action) => {
			state.status = 'success';
			state.colors.map((color, i) => {
				if (i === action.payload.index) {
					color.name = action.payload.name;
				} else {
					return
				}
			});
		},
		[fetchColor.rejected]: (state) => {
			state.status = 'error';
			state.colors.map(color => color.name);
		}
	}
})


export const { setId, setHex, setHash, setName, setLuminance, toggleLock, addColor, removeColor, changeOrder } = colorsSlice.actions;

export default colorsSlice.reducer