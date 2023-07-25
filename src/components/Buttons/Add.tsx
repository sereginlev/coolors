import React from 'react';
import { useAppDispatch } from 'hook';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import styles from 'scss/modules/Add.module.scss';

import { addColor } from 'redux/slice/colorsSlice';

type AddProps = {
	index: number;
	hex: string;
}

const Add: React.FC<AddProps> = ({ index, hex }) => {
	const dispatch = useAppDispatch();

	return (
		<>
			<button id='add' className={styles.add} type='button' onClick={() => dispatch(addColor({ hex: hex, index: index }))}>
				<i className="fa-solid fa-plus"></i>
			</button>

			<Tooltip anchorSelect='#add' className={styles.tooltip} delayShow={1000} delayHide={500}>
				Add color
			</Tooltip>
		</>
	)
}

export default Add;
