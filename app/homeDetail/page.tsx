'use client';
import styles from "./page.module.scss";
import React from 'react'
import { Image } from 'antd-mobile'
import NavBar from "@/components/NavBar/page";
export default function HomeDetail () {
    const demoSrc = 'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'
    return (
        <div className={styles.page}>
            <NavBar title="详情" />
            <div className={styles.titbox}>
                <Image alt="" className={styles.head} src="/images/head.png" />
                <div className={styles.namebox}>
                    <div className={styles.name}>DETV</div>
                    <div className={styles.time}>2020-2-2</div>
                </div>
            </div>
            <div className={styles.detailTitle}>
                市场很热闹
            </div>
            <div className={styles.txt}>
                最近，市场很热闹，大家都在谈论着区块链、元宇宙、NFT等新技术，这些新技术究竟是什么？它们又会对我们的生活产生什么样的影响呢？
            </div>
            <Image alt="" className={styles.img} src={demoSrc} />
        </div>
    )
}