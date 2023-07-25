import React from 'react';
import { useAppDispatch } from 'hook';
import { Tooltip } from 'react-tooltip';

import styles from 'scss/modules/Button.module.scss';

import { removeColor } from 'redux/slice/colorsSlice';

type RemoveProps = {
	index: number;
	luminance: number;
}

const Remove: React.FC<RemoveProps> = ({ index, luminance }) => {
	const dispatch = useAppDispatch();

	const black = [styles.btn, styles.black].join(' ');
	const white: string = styles.btn;

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