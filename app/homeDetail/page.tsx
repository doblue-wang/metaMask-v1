'use client';
import styles from "./page.module.scss";
import React, { useEffect, useState } from 'react'
import { Image } from 'antd-mobile'
import NavBar from "@/components/NavBar/page";
import { fetchGetHome } from "@/api/home";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
export default function HomeDetail () {
    const [source, setSource] = useState({} as any);
    const { i18n } = useTranslation();
    useEffect(() => {
        i18n.changeLanguage(localStorage.getItem('languages') as any);
        // 首页数据
        fetchGetHome({
            AccountId: localStorage.getItem('AccountId')
        }).then(({ data }) => {
            setSource(data);
        })
            .catch((e) => {
                console.log(e);
            });
    }, [])
    return (
        <div className={styles.page}>
            <NavBar title={t('详情')} />
            <div className={styles.titbox}>
                <Image lazy alt="" className={styles.head} src={source?.MembersData?.Pic} />
                <div className={styles.namebox}>
                    <div className={styles.name}>{source?.MembersData?.Name || "--"}</div>
                    <div className={styles.time}>{source?.NoticeData?.creatorTime}</div>
                </div>
            </div>
            <div className={styles.detailTitle}>
                {source?.NoticeData?.title}
            </div>
            <div dangerouslySetInnerHTML={{ __html: source?.NoticeData?.content }} className={styles.txt}>
            </div>
        </div>
    )
}