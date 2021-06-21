import React from 'react';

import styles from './styles.module.scss';

export function Header() {

    return (
        <header>
            <section className={styles.headerContainer}>
                <div className={styles.headerLogo}>
                    <img src="/mind-map.png"></img>
                    <h3>MindMap - IntermediatE</h3>
                </div>
            </section>
        </header>
    )
}