'use client';
import styles from "./page.module.scss";
import React, { useRef, useState } from 'react'
import { Button, Image, NoticeBar, Space, Swiper, ProgressBar, Toast } from 'antd-mobile'
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/page";
export default function KJredeem() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    console.log(type)
    return (
        <div className={styles.page}>
            <NavBar title="矿机赎回" />
            <div className={styles.content}>
                <div className={styles.onminingbox}>
                    <div className={styles.item}>
                        <div className={styles.topbox}>
                            <div className={styles.imgbox}>
                                <Image className={styles.img} src='/pool/leave.png' />
                            </div>
                        </div>
                        <div className={styles.itemTitle}>尾矿</div>
                    </div>
                    <div className={styles.numbox}>
                        <div className={styles.nummin}>20,000 DTV</div>
                        <div className={styles.pos}>POS：20</div>
                    </div>

                </div>
                <div className={styles.nftbox}>
                    <div className={styles.imagebox}>
                        <Image className={styles.img} src='/pool/poolNFT.png' />
                    </div>
                    <div className={styles.price}>1000u</div>

                </div>
                <div className={styles.nftbox1}>
                    <div className={styles.mark_up}>
                        <div className={styles.pos}>
                            <div className={styles.label}>在售：</div>
                            <div className={styles.num}>2000</div>
                        </div>
                        <div className={styles.pos}>
                            <div className={styles.label}>已售：</div>
                            <div className={styles.num}>2000</div>
                        </div>
                        <div className={styles.pos}>
                            <div className={styles.label}>总数：</div>
                            <div className={styles.num}>2000</div>
                        </div>
                    </div>
                    <div className={styles.imagebox}>
                        <Image className={styles.img} src='/pool/poolNFT.png' />
                    </div>
                    <div className={styles.price}>1000u</div>

                </div>
                <div className={styles.btnbox}>赎回</div>
            </div>
            <div className={styles.listbox}>
                <div className={styles.listTitle}>矿机赎回记录</div>
            </div>
        </div>
    )
}