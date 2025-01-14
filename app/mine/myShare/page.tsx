'use client';
import { Image, Popup, ProgressCircle } from 'antd-mobile'
import styles from './page.module.scss'
import React, { useRef, useState, useEffect, } from 'react'
import { useRouter } from 'next/navigation';
export default function MyShare() {
    const router = useRouter();
    const handleBack = () => {
        router.back()
    }
    return (
        <div className={styles.page}>
            <div className={styles.navbar}>
                <div className={styles.navbar__logo} onClick={() => handleBack()}>
                    <Image className={styles.navbar__logo_img} src="/images/recordArrow.png" />
                </div>
                <div className={styles.navbar__title}>分享</div>
                <div className={styles.navbar__links}></div>
            </div>
            <div className={styles.contentbox}>
                <div className={styles.top}>
                    <Image className={styles.userimg} src="/mine/receives.png" />
                    <div className={styles.titlebox}>
                        <div className={styles.title}>张三</div>
                        <div className={styles.text}>上级分享人 0x4838***AD5f97</div>
                    </div>
                </div>
                <div className={styles.ewmbox}>
                    <div className={styles.ewm}></div>
                </div>
                <div className={styles.or}>or</div>
                <div className={styles.promotion}>推广文案替换

                </div>
                <div className={styles.promotioncode}>34HuwzDnSwxVRNCoyFCpQnRBXV2sVVmGUY</div>
                <div className={styles.joinbtn}>立即加入</div>
            </div>
        </div>
    )
}