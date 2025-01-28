'use client';
import styles from "./page.module.scss";
import React, { useEffect, useState } from 'react'
import { Image } from 'antd-mobile'
import NavBar from "@/components/NavBar/page";
import Empty from "@/components/empty/page";
import { ethers } from "ethers";
import { StakingABI } from "@/StakingABI";
import { getCookie } from "@/utils/utils";
import CustomAlert from "@/components/Toast";
import { t } from "i18next";
import { ClaimIncome } from "@/api/home";
export default function Receive () {
    const [visible, setVisble] = useState(false)
    const [message, setMessage] = useState('')
    const Contract_address = '0xCBA1eE61f79006A5A02aB32425c57e750A86DB4B';//测试合约地址
    const [list, setList] = useState<any>([])

    useEffect(() => {
        getComingList(getCookie('accounts'))
    }, [])

    const withdrawComing = async (_address: string) => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner(); // 获取签名者（即用户钱包）

                // 你的质押合约地址和 ABI
                const stakingContract = new ethers.Contract(Contract_address, StakingABI, signer);

                // 获取当前 Gas 费用数据
                const gasPrice = Number((await provider.getFeeData()).gasPrice);
                const options = {
                    gasPrice
                };
                // 调用合约的 withdrawcoming 方法提取收益
                const tx = await stakingContract.withdrawcoming(_address, options);
                // 等待交易确认
                await tx.wait();
                setVisble(true)
                setMessage('成功提取收益')
                await getComingList(_address)
                exchange()
            } catch (e) {
                console.error("提取收益失败", e);
            }
        }

    };
    const exchange = () => {
        ClaimIncome({
            AccountId: getCookie('AccountId')
        })
            .then(({ data }) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            });
    }



    const getComingList = async (_address: string) => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
                // 你的质押合约地址和 ABI
                const stakingContract = new ethers.Contract(Contract_address, StakingABI, signer);
                // 调用合约的 getcominglist 方法获取用户收益记录
                const records = await stakingContract.getcominglist(_address);
                const parsedRecords = parseRecords(records);
                (parsedRecords);
                setList(parsedRecords)

                return records;  // 返回收益记录数组
            } catch (e) {
                console.error("获取收益记录失败", e);
            }
        }

    };
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
        const timeStr = date.toLocaleTimeString(); // 获取时间部分

        // 金额（假设是 DTV 或类似代币，使用 18 位小数）
        const amount = ethers.formatUnits(record[1], 18);  // 转换为普通数字字符串

        // 进出标记，0 为进，1 为出
        const inout = record[2] === BigInt(0) ? '进' : '出';

        // 返回格式化后的结果
        return {
            date: dateStr,
            time: timeStr,
            amount,
            inout,
        };
    };




    return (
        <div className={styles.page}>
            <NavBar title={`${t('IncomeCollection')}`} />
            <div className={styles.content}>
                <div className={styles.nftbox}>
                    <div className={styles.imagebox}>
                        <Image className={styles.img} src='/pool/receive.png' />
                    </div>
                    <div className={styles.price}>138.23 DTV</div>
                    <div className={styles.txt}>{t('Income_Collection.Available_for_Collection')}</div>
                    <div onClick={() => withdrawComing(getCookie('accounts'))} className={styles.btn}>{t('Earnings.Collect')}</div>
                    <div className={styles.prompt}>{t('burning')}</div>

                </div>
            </div>
            <div className={styles.listbox}>
                <div className={styles.listTitle}>{t('Income_Collection.Income_Withdrawal_Record')}</div>
                {
                    list.length > 0 ? <>
                        {
                            list.map((item: any, index: number) => <div key={index} className={styles.list}>
                                <div className={styles.listitem} >
                                    <div className={styles.left}>
                                        <div className={styles.DTV}>{item.amount} DTV</div>
                                        <div className={styles.itemTitle}>手续费：12.12DTV</div>

                                    </div>
                                    <div className={styles.rightcon}>
                                        <div className={styles.date}>{item.date}</div>
                                        <div className={styles.time}>{item.time}</div>
                                    </div>

                                </div>
                            </div>)
                        }
                    </> : <Empty />
                }
                {/*  */}

            </div>
            <CustomAlert visible={visible} message={message} setVisible={setVisble} />
        </div>
    )
}