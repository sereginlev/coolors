import React from 'react';
import { Tooltip } from 'react-tooltip';
import ReactDOM from 'react-dom';

import styles from 'scss/modules/Button.module.scss';

const portal = document.getElementById('portal');

type CopyProps = {
	hex: string;
	luminance: number;
}

const Copy: React.FC<CopyProps> = ({ hex, luminance }) => {
	const [isCopy, setIsCopy] = React.useState(false);

	const black = [styles.btn, styles.black].join(' ');
	const white: string = styles.btn;

	const className: string = luminance > 0.5 ? black : white;
	const color = luminance > 0.5 ? 'black' : 'white';

	const copyHex = () => {
		navigator.clipboard.writeText(hex.slice(1));
		setIsCopy(true);
		setTimeout(() => {
			setIsCopy(false);
		}, 1000)
	}

	return (
		<>
			<button id='copy' className={className} type='button' onClick={copyHex} >
				<i className="fa-regular fa-clone" style={{ color: `${color}` }}></i>
			</button>

			{
				isCopy && portal &&
				ReactDOM.createPortal(
					<div className={styles.portal}>
						<i className="fa-sharp fa-solid fa-circle-check"></i> 
						Color copied to the clipboard!
					</div>,
					portal
				)
			}

			<Tooltip anchorSelect='#copy' className={styles.tooltip} delayShow={1000} delayHide={200}>
				Copy HEX
			</Tooltip>
		</>
	)
}

export default Copy;
