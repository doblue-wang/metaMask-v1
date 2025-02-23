'use client';
import { Image } from 'antd-mobile'
import styles from './page.module.scss'
import React, { useState, useEffect, } from 'react'
import { useRouter } from 'next/navigation';
import { fetchGetGetMyShare } from '@/api/home';
import { t } from 'i18next';
import useClipboard from '@/utils/useClipboard';
import CustomAlert from '@/components/Toast';
import { useTranslation } from 'react-i18next';
export default function MyShare () {
    const { copyToClipboard } = useClipboard();
    const [visible, setVisble] = useState(false)
    const { i18n } = useTranslation();
    const [message, setMessage] = useState('')
    const handleCopy = async () => {
        copyToClipboard(`https://dao.demedia.tv/?code=${source?.ShareLinkAddress}`)
        const ms = t('复制成功')
        setMessage(ms)
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
        i18n.changeLanguage(localStorage.getItem('languages') as any);
    }, [])
    return (
        <div className={styles.page}>
            <div className={styles.navbar}>
                <div className={styles.navbar__logo} onClick={() => handleBack()}>
                    <Image lazy className={styles.navbar__logo_img} src="/images/jiantou.png" />
                </div>
                <div className={styles.navbar__title}>{t('Share')}</div>
                <div className={styles.navbar__links}></div>
            </div>
            <div className={styles.contentbox}>
                <div className={styles.top}>
                    <Image lazy className={styles.userimg} src="/mine/receives.png" />
                    <div className={styles.titlebox}>
                        <div className={styles.title}>{source?.AccountName || '--'}</div>
                        <div className={styles.text}>{t("上级分享人")}{source?.SuperiorSharer || '--'}</div>
                    </div>
                </div>
                <div className={styles.ewmbox}>
                    <Image lazy className={styles.ewm} src={source?.ShareImg} />
                </div>
                <div className={styles.or}>or</div>
                <div className={styles.promotion}>{source?.PromotionCopy || '--'}

                </div>
                <div className={styles.promotioncode}>{source?.ShareLinkAddress || "--"}</div>
                <div onClick={() => handleCopy()} className={styles.joinbtn}>{t("复制邀请链接")}</div>
            </div>
            <CustomAlert visible={visible} message={message} setVisible={setVisble} />
        </div>
    )
}