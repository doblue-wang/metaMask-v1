'use client';
import styles from "./page.module.scss";
import React, { useEffect } from 'react'
import { Image } from 'antd-mobile'
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/page";
import Empty from "@/components/empty/page";
import { t } from "i18next";
import { ExchangeDtv, ExchangeDtvRecord } from "@/api/home";
import { getCookie } from "@/utils/utils";
export default function Exchange () {
    useEffect(() => {
        Record()
    }, [])
    const exchange = () => {
        ExchangeDtv({
            AccountId: getCookie('AccountId')
        })
            .then(({ data }) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            });
    }
    const Record = () => {
        ExchangeDtvRecord({
            AccountId: getCookie('AccountId')
        })
            .then(({ data }) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            });
    }
    return (
        <div className={styles.page}>
            <NavBar title={`DTVC ${t('Earnings.Exchange')}`} />
            <div className={styles.content}>
                <div className={styles.l_con}>
                    <Image className={styles.img} src="/pool/receive.png" />
                    <div className={styles.txtbox}>
                        <div className={styles.title}>138.23</div>
                        <div className={styles.desc}>DTV</div>
                    </div>
                </div>
                <div onClick={() => exchange()} className={styles.c_con}>
                    <Image className={styles.img} src="/pool/left_arrow.png" />
                    <div className={styles.txt}>{t('Earnings.Exchange')}</div>
                </div>
                <div className={styles.r_con}>
                    <Image className={styles.img} src="/pool/exchange.png" />
                    <div className={styles.txtbox}>
                        <div className={styles.title}>1,138.23</div>
                        <div className={styles.desc}>DTVC</div>
                    </div>
                </div>

            </div>
            <div className={styles.listbox}>
                <div className={styles.listTitle}>DTVC {t('Earnings.Exchange_Record')}</div>
                {/* <div className={styles.list}>
                    <div className={styles.listitem} >
                        <div className={styles.left}>
                            <div className={styles.DTV}>10,000 DTV</div>
                            <div className={styles.itemTitle}>手续费：12.12DTV</div>

                        </div>
                        <div className={styles.time}>2025-01-03</div>
                    </div>
                </div> */}
                <Empty />
            </div>
        </div>
    )
}