import React from 'react';


import styles from 'scss/modules/Header.module.scss';

import Navigation from './Buttons/Navigation';

function Header() {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<p className={styles.text}>
					Press the spacebar to generate color palettes!
				</p>


				{/* <nav className={styles.nav}>
					<Navigation icon='fa-solid fa-reply' text='Undo' id='undo' />
					<Navigation icon='fa-solid fa-share' text='Redo' id='redo' />
				</nav> */}
			</div>
		</header>
	)
}

export default Header;
