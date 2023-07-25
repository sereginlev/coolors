import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import chroma from 'chroma-js';

type ColorProps = {
	hex: string;
	index: number;
}

type Data = {
	XYZ: object;
	cmyk: object;
	contrast: object;
	hex: object
	hsl: object;
	hsv: object;
	image: object;
	name: Name;
	rgb: object;
	_embedded: object;
	_links: object;
}

type Name = {
	closest_named_hex: string;
	distance: number;
	exact_match_name: boolean;
	value: string;
}

export const fetchColor = createAsyncThunk(
	'colors/fetchColor',
	async (props: ColorProps, { rejectWithValue }) => {
		const { hex, index } = props;
	
		try {
			const { data } = await axios.get<Data>(`https://www.thecolorapi.com/id?hex=${hex}`)

			const response: ColorProps = { hex: data.name.value, index: index };

			return response;
		} catch (error: any) {
			alert('Server Error! Please, try again.')
			return rejectWithValue(error.message);
		}
	}
)

type Color = {
	id: number;
	hex: string;
	luminance: number;
	isLocked: boolean;
	name?: string;
	index?: number;
}

interface ColorsState {
	colors: Color[];
	hash: string;
	status: string;
}

enum Status {
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error'
}

const initialState: ColorsState = {
	colors: [],
	hash: '',
	status: ''
}

export const colorsSlice = createSlice({
	name: 'colors',
	initialState,
	reducers: {
		setHash(state, action: PayloadAction<string>) {
			state.hash = action.payload;
		},
		setColors(state) {
			state.colors = state.hash.split('-').map((hex, index) => {
				return { id: index + 1, hex: `#${hex}`, luminance: chroma(`#${hex}`).luminance(), isLocked: false, name: '' }
			});
		},
		generateColors(state, action: PayloadAction<Color[]>) {
			state.colors = state.hash.split('-').map((hex, index) => {
				const item: Color = action.payload[index];

				if (index == item.index) {
					return { id: index + 1, hex: `#${item.hex}`, luminance: chroma(`#${item.hex}`).luminance(), isLocked: item.isLocked, name: '' }
				}
			}) as Color[];
		},
		addColor(state, action: PayloadAction<{ hex: string, index: number }>) {
			if (state.colors.length < 8) {
				state.colors.splice(action.payload.index + 1, 0, {
					id: action.payload.index + 1,
					hex: chroma.random().hex(),
					luminance: chroma(action.payload.hex).luminance(),
					isLocked: false,
					name: ''
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
		removeColor(state, action: PayloadAction<number>) {
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
		toggleLock(state, action: PayloadAction<{ isLocked: boolean, index: number }>) {
			state.colors.map((color, i) => {
				if (i === action.payload.index) {
					return color.isLocked = action.payload.isLocked;
				}
			});
		},
		changeOrder(state, action: PayloadAction<Color[]>) {
			state.colors = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchColor.pending, (state) => {
				state.status = Status.LOADING;
				state.colors.map(color => color.name);
			})
			.addCase(fetchColor.fulfilled, (state, action) => {
				state.status = Status.SUCCESS;
				state.colors.map((color, index) => {
					if (index === action.payload.index) {
						return color.name = action.payload.hex;
					}
				});
			})
			.addCase(fetchColor.rejected, (state) => {
				state.status = Status.ERROR;
				state.colors.map(color => color.name);
			})
	}
});

export const { setHash, setColors, generateColors, addColor, removeColor, toggleLock, changeOrder } = colorsSlice.actions;

export default colorsSlice.reducer;
