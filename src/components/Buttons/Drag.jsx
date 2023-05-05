import React from 'react';
import { Tooltip } from 'react-tooltip';

import styles from 'scss/modules/Button.module.scss';

function Drag(props) {
	const { ...listeners } = props;
	const { luminance } = props;

	const black = [styles.btn, styles.black].join(' ');
	const white = styles.btn;

	const className = luminance > 0.5 ? black : white;
	const color = luminance > 0.5 ? 'black' : 'white';

	return (
		<>
			<button id='drag' className={className} type='button' {...listeners} style={{ cursor: 'grab' }}>
				<i className="fa-solid fa-arrows-left-right" style={{ color: `${color}` }}></i>
			</button>

			<Tooltip anchorSelect='#drag' className={styles.tooltip} delayShow={1000} delayHide={200}>
				Drag
			</Tooltip>
		</>
	)
}

export default Drag;