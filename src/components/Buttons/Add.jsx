import React from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import styles from 'scss/modules/Add.module.scss';

import { addColor } from 'redux/slice/colorsSlice';

function Add({ index }) {
	const dispatch = useDispatch();

	return (
		<>
			<button id='add' className={styles.add} type='button' onClick={() => dispatch(addColor(index))} >
				<i className="fa-solid fa-plus"></i>
			</button>

			<Tooltip anchorSelect='#add' className={styles.tooltip} delayShow={1000} delayHide={500}>
				Add color
			</Tooltip>
		</>
	)
}

export default Add;
