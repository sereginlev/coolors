import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styles from 'scss/modules/Color.module.scss';

import Add from './Buttons/Add';
import Remove from './Buttons/Remove';
import Lock from './Buttons/Lock';
import Copy from './Buttons/Copy';
import Drag from './Buttons/Drag';

import { fetchColor } from 'redux/slice/colorsSlice';

function Color({ id, hex, luminance, isLocked, index }) {
	const dispatch = useDispatch();
	const { colors } = useSelector(state => state.colors);

	const color = luminance > 0.5 ? 'black' : 'white';

	const { attributes, listeners, setNodeRef, transform } = useSortable({ id: id });

	const style = { transform: CSS.Transform.toString(transform), background: hex }

	React.useEffect(() => {
		dispatch(fetchColor({ hex: hex.slice(1), index: index }));
	}, [hex, index]);

	React.useEffect(() => {
		if (isLocked) {
			dispatch(fetchColor({ hex: hex.slice(1), index: index }));
		}
	}, [colors])

	return (
		<div className={styles.color} style={style} ref={setNodeRef} {...attributes} >
			<div className={styles.actions}>
				<Remove index={index} luminance={luminance} />
				<Drag {...listeners} luminance={luminance} />
				<Copy hex={hex} luminance={luminance} />
				<Lock index={index} isLocked={isLocked} luminance={luminance} />
			</div>

			<div className={styles.add}>
				<Add index={index} hex={hex} />
			</div>

			<div className={styles.info}>
				<h2 className={styles.hex} style={{ color: `${color}` }}>{hex.slice(1).toUpperCase()}</h2>
				<p className={styles.name} style={{ color: `${color}` }}>{colors[index].name}</p>
			</div>
		</div>
	)
}

export default Color;