'use client';
import { Image } from 'antd-mobile'
import styles from './page.module.scss'
import React, { useState, useEffect, } from 'react'
import { useRouter } from 'next/navigation';
import { fetchGetGetMyShare } from '@/api/home';
import { t } from 'i18next';
import useClipboard from '@/utils/useClipboard';
import CustomAlert from '@/components/Toast';
export default function MyShare () {
    const { copyToClipboard } = useClipboard();
    const [visible, setVisble] = useState(false)
    const [message, setMessage] = useState('')
    const handleCopy = async () => {
        copyToClipboard(source?.ShareLinkAddress)
        setMessage('复制成功')
        setVisble(true)
    }
    const [source, setSource] = useState({} as any);
    const router = useRouter();
    const handleBack = () => {
        router.back()
    }
    const getSource = () => {
        const AccountId = localStorage.getItem('AccountId')
        fetchGetGetMyShare({ AccountId }).then(({ data }) => {
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
                    <Image className={styles.ewm} src={source?.ShareImg} />
                </div>
                <div className={styles.or}>or</div>
                <div className={styles.promotion}>{source?.PromotionCopy || '--'}

                </div>
                <div className={styles.promotioncode}>{source?.ShareLinkAddress || "--"}</div>
                <div onClick={() => handleCopy()} className={styles.joinbtn}>立即加入</div>
            </div>
            <CustomAlert visible={visible} message={message} setVisible={setVisble} />
        </div>
    )
}