'use client';
import { Image } from 'antd-mobile'
import styles from './page.module.scss'
import React, { useState, useEffect, } from 'react'
import { useRouter } from 'next/navigation';
import { fetchGetGetMyShare } from '@/api/home';
import { t } from 'i18next';
export default function MyShare () {
    const [source, setSource] = useState({} as any);
    const router = useRouter();
    const handleBack = () => {
        router.back()
    }

    const getSource = () => {
        fetchGetGetMyShare({ AccountId: 123 }).then(({ data }) => {
            setSource(data);
        })
            .catch((e) => {
                console.log(e);

            });
    }
    useEffect(() => {
        getSource()
    }, [])
    return (
        <div className={styles.page}>
            <div className={styles.navbar}>
                <div className={styles.navbar__logo} onClick={() => handleBack()}>
                    <Image className={styles.navbar__logo_img} src="/images/recordArrow.png" />
                </div>
                <div className={styles.navbar__title}>{t('Share')}</div>
                <div className={styles.navbar__links}></div>
            </div>
            <div className={styles.contentbox}>
                <div className={styles.top}>
                    <Image className={styles.userimg} src="/mine/receives.png" />
                    <div className={styles.titlebox}>
                        <div className={styles.title}>{source?.AccountName || '--'}</div>
                        <div className={styles.text}>上级分享人{source?.SuperiorSharer || '--'}</div>
                    </div>
                </div>
                <div className={styles.ewmbox}>
                    <Image className={styles.ewm} src={`data:image/jpeg;base64,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`} />
                </div>
                <div className={styles.or}>or</div>
                <div className={styles.promotion}>{source?.PromotionCopy || '--'}

                </div>
                <div className={styles.promotioncode}>{source?.ShareLinkAddress || "--"}</div>
                <div className={styles.joinbtn}>立即加入</div>
            </div>
        </div>
    )
}