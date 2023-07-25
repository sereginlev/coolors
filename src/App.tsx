import React from 'react';
import { useAppSelector, useAppDispatch } from 'hook';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import chroma from 'chroma-js';

import styles from 'scss/modules/Main.module.scss';

import { setHash, setColors, generateColors, changeOrder } from './redux/slice/colorsSlice';

import Header from 'components/Header';
import Color from './components/Color';

type Color = {
	id: number;
	hex: string;
	luminance: number;
	isLocked: boolean;
	index: number;
}

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const [string, setString] = React.useState(window.location.hash);
	const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

	const { hash, colors } = useAppSelector(state => state.colors);

	React.useEffect(() => {
		window.location.hash = hash;
	}, [hash])

	React.useEffect(() => {
		const byLoad = () => {
			if (string.length > 1) {
				dispatch(setHash(string.slice(1)));
				dispatch(setColors());
			} else {
				dispatch(setHash(`${chroma.random().hex().slice(1)}-${chroma.random().hex().slice(1)}-${chroma.random().hex().slice(1)}-${chroma.random().hex().slice(1)}-${chroma.random().hex().slice(1)}`));
				dispatch(setColors());
			}
		}

		const generate = (event: KeyboardEvent) => {
			if (event.code.toLowerCase() === 'space') {
				event.preventDefault();

				let newHexes: Color[] = [];

				for (let i = 0; i < colors.length; i++) {
					if (colors[i].isLocked) {
						newHexes.push({ id: colors[i].id, hex: colors[i].hex.slice(1), isLocked: true, luminance: colors[i].luminance, index: i });
					} else {
						newHexes.push({ id: colors[i].id, hex: chroma.random().hex().slice(1), isLocked: false, luminance: colors[i].luminance, index: i });
					}
				};

				let str: string = newHexes.map(item => item.hex).join('-');

				dispatch(setHash(str));
				dispatch(generateColors(newHexes));
			}
		}

		window.addEventListener('keydown', generate);
		window.addEventListener('load', byLoad);

		return () => {
			window.removeEventListener('keydown', generate);
			window.removeEventListener('load', byLoad);
		}
	}, [colors]);

	React.useEffect(() => {
		const hanldeResize = () => {
			setWindowWidth(window.innerWidth);
		}

		window.addEventListener('resize', hanldeResize);

		return () => window.removeEventListener('resize', hanldeResize);
	}, [])

	//===change order of colors when it dragged======================================================================================================
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		const startIndex: number = active?.data.current?.sortable.index;
		const endIndex: number = over?.data.current?.sortable.index;

		if (startIndex !== endIndex) {
			dispatch(changeOrder(arrayMove(colors, startIndex, endIndex)));
		}
	}

	return (
		<div className={styles.main}>
			<DndContext modifiers={windowWidth > 767 ? [restrictToHorizontalAxis] : [restrictToVerticalAxis]} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>

				<Header />

				<SortableContext items={colors} strategy={windowWidth > 767 ? horizontalListSortingStrategy : verticalListSortingStrategy}>
					{
						colors.map((color, index) => (
							<Color key={index} index={index} {...color} />
						))
					}
				</SortableContext>
			</DndContext>
		</div >
	);
}

export default App;