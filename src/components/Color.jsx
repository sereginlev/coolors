import React from 'react';
import chroma from 'chroma-js';
import { useDispatch, useSelector } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Add from './Buttons/Add';
import Remove from './Buttons/Remove';
import Lock from './Buttons/Lock';
import Copy from './Buttons/Copy';
import Drag from './Buttons/Drag';

import styles from 'scss/modules/Color.module.scss';

import { setId, setHex, setHash, setLuminance, fetchColor } from 'redux/slice/colorsSlice';

function Color({ id, hex, luminance, name, isLocked, index, colorHash }) {
	const dispatch = useDispatch();

	const color = luminance > 0.5 ? 'black' : 'white';

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

	const style = { transform: CSS.Transform.toString(transform), background: hex }

	const { hash } = useSelector(state => state.colors);

	//===if you have transition by link it generates colors by hex codes in link and if not, generate random colors at first loading====================
	React.useEffect(() => {
		if (colorHash) {
			dispatch(setId(index));
			dispatch(setHex({ hex: colorHash, index: index }));
			dispatch(setLuminance(index));
			dispatch(fetchColor({ code: colorHash.slice(1), index: index }));
			dispatch(setHash());
		} else {
			dispatch(setId(index));
			dispatch(setLuminance(index));
			dispatch(fetchColor({ code: hex.slice(1), index: index }));
			dispatch(setHash());
		}
	}, [colorHash, hex])

	//===generate new random color by pushing space==================================================================================================
	React.useEffect(() => {
		const generateRandomColors = (e) => {
			if (e.code.toLowerCase() === 'space') {
				e.preventDefault();

				if (!isLocked) {
					dispatch(setId(index));
					dispatch(setHex({ hex: chroma.random().hex(), index: index }));
					dispatch(setLuminance(index));
					dispatch(fetchColor({ code: hex.slice(1), index: index }));
					dispatch(setHash());
				}
			}
		}

		document.addEventListener('keydown', generateRandomColors);

		return () => {
			document.removeEventListener('keydown', generateRandomColors);
		}
	}, [hex, index, isLocked])

	//===generates hash at first page loading===========================================================================================================
	React.useEffect(() => {
		window.location.hash = hash;
	}, [hash]);

	return (
		<div className={styles.color} style={style} ref={setNodeRef} {...attributes}>
			<div className={styles.actions}>
				<Remove index={index} luminance={luminance} />
				<Drag {...listeners} luminance={luminance} />
				<Copy hex={hex} luminance={luminance} />
				<Lock index={index} isLocked={isLocked} luminance={luminance} />
			</div>

			<div className={styles.add}>
				<Add index={index} />
			</div>

			<div className={styles.info}>
				<h2 className={styles.hex} style={{ color: `${color}` }}>{hex.slice(1).toUpperCase()}</h2>
				<p className={styles.name} style={{ color: `${color}` }}>{name}</p>
			</div>
		</div>
	)
}

export default Color;