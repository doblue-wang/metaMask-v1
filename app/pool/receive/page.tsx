'use client';
import styles from "./page.module.scss";
import React, { useRef, useState } from 'react'
import { Button, Image, Popup, NoticeBar, ErrorBlock, Space, Swiper, ProgressBar, Toast } from 'antd-mobile'
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/page";
import Empty from "@/components/empty/page";
export default function Receive() {
    return (
        <div className={styles.page}>
            <NavBar title="收益领取" />
            <div className={styles.content}>
                <div className={styles.nftbox}>
                    <div className={styles.imagebox}>
                        <Image className={styles.img} src='/pool/receive.png' />
                    </div>
                    <div className={styles.price}>138.23 DTV</div>
                    <div className={styles.txt}>待领</div>
                    <div className={styles.btn}>领取</div>
                    <div className={styles.prompt}>扣除 10% 收益用于token销毁</div>

                </div>
            </div>
            <div className={styles.listbox}>
                <div className={styles.listTitle}>收益领取记录</div>
                <div className={styles.list}>
                    <div className={styles.listitem} >
                        <div className={styles.left}>
                            <div className={styles.DTV}>10,000 DTV</div>
                            <div className={styles.itemTitle}>手续费：12.12DTV</div>

                        </div>
                        <div className={styles.time}>2025-01-03</div>
                    </div>
                </div>
                <Empty />
                {/* <div className={styles.empty}>
                    <Image className={styles.img} src='/pool/empty.png' />
                    <div className={styles.emptytext}>暂无记录~</div>
                </div> */}
            </div>
        </div>
    )
}