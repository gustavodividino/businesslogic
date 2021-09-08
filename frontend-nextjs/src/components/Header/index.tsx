import React from 'react';
import Link from "next/link";

import styles from './styles.module.scss';

export function Header() {

    return (
        <header>
            <section className={styles.headerContainer}>
                <div className={styles.headerLogo}>
                    <img src="/mind-map.png"></img>
                    <h3>MindMap - IntermediatE</h3>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href="/"><i className="las la-home"></i><small>Início</small></a>
                        </li>
                        <Link href="#">
                            <a target="_blank" href="https://telefonicacorp-my.sharepoint.com/:f:/g/personal/andrius_ribas_telefonica_com/Ep84usjJGPFOmGSITNJY290B06K-vXgp6_o6h3A6uRnPSw?e=OV8exW"><i className="las la-folder"></i><small>Documentações</small> </a>
                        </Link>

                    </ul>
                </nav>
            </section>
        </header>
    )
}