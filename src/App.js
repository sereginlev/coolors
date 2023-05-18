import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import chroma from 'chroma-js';

import styles from 'scss/modules/Main.module.scss';

import { setHash, setColors, generateColors, changeOrder } from './redux/slice/colorsSlice';

import Header from 'components/Header';
import Color from './components/Color';

function App() {
	const dispatch = useDispatch();
	const [string, setString] = React.useState(window.location.hash);
	const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

	const { hash, colors } = useSelector(state => state.colors);

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

		const generate = (e) => {
			if (e.code.toLowerCase() === 'space') {
				e.preventDefault();

				let newHexes = [];

				for (let i = 0; i < colors.length; i++) {
					if (colors[i].isLocked) {
						newHexes.push({ hex: colors[i].hex.slice(1), isLocked: true, index: i });
					} else {
						newHexes.push({ hex: chroma.random().hex().slice(1), isLocked: false, index: i });
					}
				};

				let str = newHexes.map(item => item.hex).join('-');

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
	function handleDragEnd(event) {
		const { active, over } = event;

		const startIndex = active.data.current.sortable.index;
		const endIndex = over.data.current.sortable.index;

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