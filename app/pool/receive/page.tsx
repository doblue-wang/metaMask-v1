'use client';
import styles from "./page.module.scss";
import React, { useEffect, useState } from 'react'
import { Image } from 'antd-mobile'
import NavBar from "@/components/NavBar/page";
import Empty from "@/components/empty/page";
import { ethers } from "ethers";
import { StakingABI } from "@/StakingABI";
import CustomAlert from "@/components/Toast";
import { t } from "i18next";
import { ClaimIncome, fetchGetMiningPool } from "@/api/home";
import NewLoading from "@/components/Loading";
export default function Receive () {
    const [visible, setVisble] = useState(false)
    const [message, setMessage] = useState('')
    const Contract_address = '0x1E5F7963B774F2e5ceC16d4d761A314Cbfaf1F08';//测试合约地址
    const [list, setList] = useState<any>([])
    const [show, setShow] = useState(false)
    const [source, setSource] = useState({} as any)
    useEffect(() => {
        getComingList(localStorage.getItem('accounts'))
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
    const withdrawComing = async (_address: any) => {
        if (source?.CanReceiveDTV === 0) {
            setVisble(true)
            const ms = t('金额不足')
            setMessage(ms)
            return
        }
        if (localStorage.getItem("show") !== "0") {
            setVisble(true)
            const ms = t('请进行人脸识别')
            setMessage(ms)
            return
        }
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
                const balance = await provider.getBalance(localStorage.getItem("accounts") as any);
                const BNBbalance = ethers.formatUnits(balance, 18)
                if (Number(BNBbalance) <= 0.00005) {
                    const ms = t('BNB金额不足')
                    setMessage(ms)
                    setVisble(true)
                    setShow(false)
                    return
                }
                // 调用合约的 withdrawcoming 方法提取收益
                const tx = await stakingContract.withdrawcoming(_address, options);
                // 等待交易确认
                setShow(true)
                await tx.wait();
                setShow(false)
                setVisble(true)
                const ms = t('成功提取收益')
                setMessage(ms)
                await getComingList(_address)
                exchange()
            } catch (e) {
                console.log("提取收益失败", e);
            }
        }

    };
    const exchange = () => {
        const AccountId = localStorage.getItem('AccountId')
        ClaimIncome({
            AccountId
        })
            .then(({ data }) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e);
            });
    }



    const getComingList = async (_address: any) => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
                // 你的质押合约地址和 ABI
                const stakingContract = new ethers.Contract(Contract_address, StakingABI, signer);
                // 调用合约的 getcominglist 方法获取用户收益记录
                const records = await stakingContract.getcominglist(_address);
                const parsedRecords = parseRecords(records);
                setList(parsedRecords)
                return records;  // 返回收益记录数组
            } catch (e) {
                console.log("获取收益记录失败", e);
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
                        <Image lazy className={styles.img} src='/pool/receive.png' />
                    </div>
                    <div className={styles.price}>{source?.CanReceiveDTV || 0} DTV</div>
                    <div className={styles.txt}>{t('Income_Collection.Available_for_Collection')}</div>
                    <div onClick={() => withdrawComing(localStorage.getItem('accounts'))} className={styles.btn}>{t('Earnings.Collect')}</div>
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
            </div>
            <NewLoading show={show} />
            <CustomAlert visible={visible} message={message} setVisible={setVisble} />
        </div>
    )
}