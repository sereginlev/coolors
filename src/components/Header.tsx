import React from 'react';

import styles from 'scss/modules/Header.module.scss';

const Header: React.FC = () => {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<p className={styles.text}>
					Press the spacebar to generate color palettes!
				</p>
			</div>
		</header>
	)
}

export default Header;
