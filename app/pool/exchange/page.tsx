'use client';
import styles from "./page.module.scss";
import React, { useEffect, useState } from 'react'
import { Image } from 'antd-mobile'
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/page";
import Empty from "@/components/empty/page";
import { t } from "i18next";
import { ExchangeDtv, ExchangeDtvRecord, fetchGetMiningPool } from "@/api/home";
import CustomAlert from "@/components/Toast";
import { ethers, parseUnits } from "ethers";
import { StakingABI } from "@/StakingABI";
import { useTranslation } from "react-i18next";
import { convertUTCToLocal } from "@/utils/utils";
export default function Exchange () {
    const [visible1, setVisble1] = useState(false)
    const [message, setMessage] = useState('')
    const [source, setSource] = useState({} as any)
    const [list, setList] = useState([] as any)
    const [gas, setGas] = useState('')
    const { i18n } = useTranslation();
    const Contract_address = '0xc182E6C5145CbFccC18f822Bc03953484947fFcD';//测试合约地址
    useEffect(() => {
        i18n.changeLanguage(localStorage.getItem('languages') as any);

        Record()
        getSource()
    }, [])
    const getSource = () => {
        const AccountId = localStorage.getItem('AccountId')
        fetchGetMiningPool({
            AccountId
        }).then(({ code, data }) => {
            setSource(data)
        })
            .catch((e) => {
                console.log(e);
            });
    }
    const exchange = () => {
        const AccountId = localStorage.getItem('AccountId')
        ExchangeDtv({
            AccountId,
            ServiceCharge: 0
        })
            .then(({ data, code, msg }) => {
                if (code === 200) {
                    const ms = t('兑换成功')
                    setMessage(ms)
                    setVisble1(true);
                    Record()
                } else {
                    setMessage(msg)
                    setVisble1(true);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    const Record = () => {
        const AccountId = localStorage.getItem('AccountId')
        ExchangeDtvRecord({
            AccountId
        })
            .then(({ data }) => {
                setList(data);
            })
            .catch((e) => {
                console.log(e);
            });
    }
    return (
        <div className={styles.page}>
            <NavBar title={`DTVC ${t('Earnings.Exchange')}`} />
            <div className={(((source?.ConvertibleDTV || 0).toString()).length) > 10 || (((source?.ConvertibleDTVC || 0).toString()).length) > 10 ? styles.content : styles.content1}>
                <div className={styles.l_con}>
                    <Image lazy className={styles.img} src="/pool/receive.png" />
                    <div className={styles.txtbox}>
                        <div className={styles.desc}>DTV</div>
                        <div className={styles.title}>
                            {source?.ConvertibleDTV || 0}
                        </div>

                    </div>
                </div>
                <div onClick={() => exchange()} className={styles.c_con}>
                    <Image lazy className={styles.img} src="/pool/left_arrow.png" />
                    <div className={styles.txt}>{t('Earnings.Exchange')}</div>
                </div>
                <div className={styles.r_con}>
                    <Image lazy className={styles.img} src="/pool/exchange.png" />
                    <div className={styles.txtbox}>
                        <div className={styles.desc}>DTVC</div>
                        <div className={styles.title}>
                            {source?.ConvertibleDTVC || 0}
                        </div>
                    </div>
                </div>
            </div>
            {
                (list || []).length > 0 ? <div className={styles.listbox}>
                    <div className={styles.listTitle}>DTVC {t('Earnings.Exchange_Record')}</div>
                    <div className={styles.list}>
                        {
                            list.map((item: any, index: number) =>
                                <div key={index} className={styles.listitem} >
                                    <div className={styles.left}>
                                        <div className={styles.DTV}>{item?.DTVQuantity || 0} DTV</div>
                                        <div className={styles.itemTitle}>{t('手续费')}：{item?.ServiceCharge || 0}DTV</div>

                                    </div>
                                    {
                                        (() => {
                                            const { date, time } = convertUTCToLocal(item?.RedemptionTime);
                                            // 格式化为可读的日期格式
                                            return <div className={styles.time}>{date}{time}</div>
                                        })()
                                    }

                                </div>)

                        }

                    </div>
                </div> : <Empty />
            }

            <CustomAlert visible={visible1} message={message} setVisible={setVisble1} />
        </div>
    )
}