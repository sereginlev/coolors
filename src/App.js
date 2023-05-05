import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import Color from './components/Color';
import styles from 'scss/modules/Main.module.scss';

import { changeOrder } from 'redux/slice/colorsSlice';

function App() {
	const dispatch = useDispatch();
	const [hash, setHash] = React.useState(window.location.hash); // get hash at first page loading 
	const [hashes, setHashes] = React.useState([]); // array with hex codes from url

	const { colors } = useSelector(state => state.colors);

	//===if user transit by link set hex codes from link to array=====================================================================================
	React.useEffect(() => {
		if (hash.length > 1) {
			let arr = [];
			hash.slice(1).split('-').map(color => arr.push(`#${color}`));
			setHashes(arr);
		}
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
			<DndContext modifiers={[restrictToHorizontalAxis]} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={colors} strategy={horizontalListSortingStrategy}>
					{
						colors.map((color, index) => (
							<Color key={index} {...color} index={index} colorHash={hashes[index]} />
						))
					}
				</SortableContext>
			</DndContext>
		</div>
	);
}

export default App;