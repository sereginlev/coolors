import React from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import styles from 'scss/modules/Button.module.scss';

import { removeColor } from 'redux/slice/colorsSlice';

function Remove({ index, luminance }) {
	const dispatch = useDispatch();

	const black = [styles.btn, styles.black].join(' ');
	const white = styles.btn;

	const className = luminance > 0.5 ? black : white;
	const color = luminance > 0.5 ? 'black' : 'white';

	return (
		<>
			<button id='remove' className={className} type='button' onClick={() => dispatch(removeColor(index))}>
				<i className="fa-solid fa-xmark" style={{ color: `${color}` }}></i>
			</button>

			<Tooltip anchorSelect='#remove' className={styles.tooltip} delayShow={1000} delayHide={200}>
				Remove color
			</Tooltip>
		</>

	)
}

export default Remove;