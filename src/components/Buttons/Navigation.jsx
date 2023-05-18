import React from 'react';
import { Tooltip } from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styles from 'scss/modules/Navigation.module.scss';

import { setColors, setHash } from 'redux/slice/colorsSlice';

function Navigation({ icon, text, id, dir }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const btnRef = React.useRef();

	const { hash, colors } = useSelector(state => state.colors);

	return (
		<>
			<button id={id} ref={btnRef} className={styles.btn} type='button'>
				<i className={icon}></i>
			</button>

			<Tooltip anchorSelect={`#${id}`} className={styles.tooltip} delayShow={1000} delayHide={200}>
				{text}
			</Tooltip>
		</>
	)
}

export default Navigation;
