'use client';
import styles from "./page.module.scss";
import React, { useEffect, useState } from 'react'
import { Image } from 'antd-mobile'
import NavBar from "@/components/NavBar/page";
import { fetchGetHome } from "@/api/home";
export default function HomeDetail () {
    const [source, setSource] = useState({} as any);
    useEffect(() => {
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
            <NavBar title="详情" />
            <div className={styles.titbox}>
                <Image alt="" className={styles.head} src={source?.MembersData?.Pic} />
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