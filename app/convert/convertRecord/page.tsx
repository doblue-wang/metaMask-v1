'use client';
import styles from "./page.module.scss";
import React, { useEffect, useState } from 'react'
import { Image, Toast } from 'antd-mobile'
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar/page";
import { ethers } from "ethers";
import { StakingABI } from "@/StakingABI";
import Empty from "@/components/empty/page";
import CustomAlert from "@/components/Toast";
import { useTranslation } from "react-i18next";

// 动态导入 Toast 组件，禁用服务器端渲染

export default function ConvertRecord () {
    const { t } = useTranslation();
    const title = `${t('兑换记录')}`;  // 假设我们要传递的 title 字符串
    const Contract_address = '0x1E5F7963B774F2e5ceC16d4d761A314Cbfaf1F08';//测试合约地址
    const [list, setList] = useState<any>([])
    const router = useRouter();
    const [visible1, setVisble1] = useState(false)
    const [message, setMessage] = useState('')
    const { i18n } = useTranslation();
    const handleDetail = (data: any) => {
        const encodedData = encodeURIComponent(JSON.stringify(data));
        // 将数据以 JSON 字符串的形式传递
        router.push(`/convert/convertDetails?data=${encodedData}`);
    }
    useEffect(() => {
        i18n.changeLanguage(localStorage.getItem('languages') as any);
        getExchangeList()
    }, [])

    const getExchangeList = async () => {
        const walletAddress = localStorage.getItem('accounts')
        if (typeof window !== 'undefined' && window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            try {
                const signer = await provider.getSigner();
                const USDTcontract = new ethers.Contract(Contract_address, StakingABI, signer);
                // 执行 approve 操作
                const records = await USDTcontract.getexchangelist(walletAddress);
                // 等待授权交易完成
                const parsedRecords = parseRecords(records);
                const reversedRecords = parsedRecords.reverse();
                setList(reversedRecords)
                return records;
            } catch (e) {
                console.log("失败", e);
            }
        }
    }
    const parseRecords = (records: any) => {
        return records.map((record: any) => parseRecord(record));
    };
    // 解析单个记录的函数
    const parseRecord = (record: any) => {
        // 获取时间戳（秒）
        const timestamp = Number(record[0]);
        // 时间戳转换为日期和时间
        const date = new Date(timestamp * 1000);
        const dateStr = date.toLocaleDateString(); // 获取日期部分
        // 金额（假设是 DTV 或类似代币，使用 18 位小数）
        const usdtamount = ethers.formatUnits(record[1], 18);  // 转换为普通数字字符串
        const dtvamount = ethers.formatUnits(record[2], 18);  // 转换为普通数字字符串

        // 返回格式化后的结果
        return {
            date: dateStr,
            usdtamount,
            dtvamount,
        };
    };

    const getObfuscatedAccount = (account: string | null) => {
        if (!account) return '****';  // 如果没有账号，则显示 '****'

        const start = account.slice(0, 12);  // 获取前四个字符
        const end = account.slice(-12);      // 获取后四个字符

        return `${start}****${end}`;  // 拼接成：前4个字符 + **** + 后4个字符
    };
    return (
        <div className={styles.page}>
            <NavBar title={title} />
            <div className={styles.listbox}>
                <div className={styles.item}>
                    {
                        (list || []).length > 0 ? <>
                            {
                                (list || []).map((item: any, index: number) =>
                                    <div onClick={() => handleDetail(item)} key={index} className={styles.itemMap}>
                                        <div className={styles.subItem}>
                                            <div className={styles.content1}>
                                                <div className={styles.top}>
                                                    <div className={styles.dui}>{t('兑')}</div>
                                                    <div className={styles.txt}>{t('到')}</div>
                                                    <div className={styles.name}>{getObfuscatedAccount(Contract_address)}</div>
                                                </div>
                                                <div className={styles.time}>12:21:31 </div>
                                            </div>
                                            <div className={styles.content2}>
                                                <div className={styles.top}>
                                                    <div className={styles.zhi}>{t('支')}</div>
                                                    <div className={styles.txt}>{t('从')}</div>
                                                    <div className={styles.name}> {getObfuscatedAccount(localStorage.getItem('accounts'))}</div>
                                                </div>
                                                <div className={styles.time}>12:21:31 </div>

                                            </div>
                                            <div className={styles.rightArrow}>
                                                <Image lazy alt="" className={styles.rightArrowImg} src="/images/recordArrow.png" />
                                            </div>
                                        </div>

                                    </div>)
                            }
                        </> : <Empty />
                    }

                </div>


            </div>
            <CustomAlert visible={visible1} message={message} setVisible={setVisble1} />
        </div>
    )
}