'use client';
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import React, { useEffect, useState } from 'react'
import { Image, Popup } from 'antd-mobile'
import NavBar from "@/components/NavBar/page";
import Empty from "@/components/empty/page";
import { ethers, parseUnits } from "ethers";
import { NFT_ABI } from "../../../NFT";
import { StakingABI } from "@/StakingABI";
import NewLoading from "@/components/Loading";
import CustomAlert from "@/components/Toast";
import { UpdateAllFixedAssets, fetchGetMiningPool } from "@/api/home";

export default function KJredeem () {
    const searchParams = useSearchParams();
    const paramValue = searchParams.get("type");
    const [source, setSource] = useState({} as any)
    const Contract_address = '0xC9F278a1102FDC3795E29205e554a93f23CFb089';//测试合约地址
    const NFT_CONTRACT_ADDRESS = '0x4Df31fBA8EEB438604c4c489dE14AA8cdaaEe0e9';//nft测试合约地址
    const [list, setList] = useState<any>([])
    const [nftlist, setNftList] = useState<any>([])
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 月份从 0 开始
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    useEffect(() => {
        getSource()
        if (paramValue === "1") {
            getComingList(localStorage.getItem('accounts'))
        } else if (paramValue === "2" || paramValue === "3") {
            getNftStakingList(localStorage.getItem('accounts'))
        }
    }, [paramValue])

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
    //矿机赎回
    const withdrawTokens = async (_address: any, _product: number, _amount: any) => {
        if (localStorage.getItem("show") === "0") {
            setAlart(true)
            setMessage('请进行人脸识别');
            return
        }
        console.log(_address, _product, _amount);
        try {
            if (typeof window.ethereum === "undefined") {
                setAlart(true)
                setMessage('MetaMask 未安装')
                return;
            }
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
            // 你的质押合约地址，确认该地址是正确的
            const stakingContract = new ethers.Contract(Contract_address, StakingABI, signer);
            // 获取当前 Gas 费用数据
            const gasPrice = Number((await provider.getFeeData()).gasPrice);
            const options = {
                gasPrice,
            };
            const amountInUnits = parseUnits(_amount.toString(), 18);  // 转换为最小单位
            const amountInUnitsStr = amountInUnits.toString();  // 转换为字符串
            setShow(true)
            // 调用合约的 withdrawproducts 方法赎回 DTV
            const tx = await stakingContract.withdrawproducts(_address, _product, BigInt(amountInUnitsStr), options);
            // 等待交易确认
            try {
                await tx.wait();
            } catch (error) {
                setShow(false)
            }
            setShow(false)
            setAlart(true)
            setMessage('赎回成功')
            setTimeout(() => {
                router.back()
            }, 1000);
        } catch (e) {
            console.log(e);
            setShow(false)
            setAlart(true)
            setMessage('赎回失败')
        }
    };

    const [visible, setVisible] = useState(false);
    const [show, setShow] = useState(false)
    const [alart, setAlart] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter();
    //nft 质押
    const stakeNFT = async (_tokenid: number) => {
        if (localStorage.getItem("show") === "0") {
            setAlart(true)
            setMessage('请进行人脸识别');
            return
        }
        if (!window.ethereum) {
            setAlart(true)
            setMessage('MetaMask is not installed')
            return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
        const gasPrice = Number((await provider.getFeeData()).gasPrice);
        const options = {
            gasPrice
        };
        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
        try {
            setShow(true)
            // 1. 授权质押合约可以使用 NFT
            const approveTx = await nftContract.setApprovalForAll(Contract_address, true, options);
            console.log("NFT 授权交易发送中:", approveTx.hash);
            await approveTx.wait();
            console.log("NFT 授权成功!");
            // 2. 调用质押合约的 stakenft 方法
            const stakeContract = new ethers.Contract(Contract_address, StakingABI, signer);
            const stakeTx = await stakeContract.stakenft(_tokenid, options);
            setAlart(true)
            setMessage('NFT 质押交易发送中')
            console.log("NFT 质押交易发送中:", stakeTx.hash);
            try {
                await stakeTx.wait();
            } catch (error) {
                console.log(error);
                setShow(false)
            }
            setShow(false)
            setVisible(true)
        } catch (error) {
            console.log(error);
            setShow(false)
            setAlart(true)
            setMessage('质押失败')
        }
    };
    const getIds = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
        const ownerAddress = await signer.getAddress();
        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
        const balance = await nftContract.balanceOf(ownerAddress);
        const tokenIds = [];
        for (let i = 0; i < balance; i++) {
            const tokenId = await nftContract.tokenOfOwnerByIndex(ownerAddress, i);
            tokenIds.push(tokenId.toString());
        }
        console.log(tokenIds);
        await stakeNFT(tokenIds[0])
        return tokenIds;
    }
    //nft 赎回
    const withdrawNFT = async () => {
        if (!window.ethereum) {
            setAlart(true)
            setMessage('MetaMask 未安装')
            return;
        }
        if (localStorage.getItem("show") === "0") {
            setAlart(true)
            setMessage('请进行人脸识别');
            return
        }
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
        const gasPrice = Number((await provider.getFeeData()).gasPrice);
        const options = {
            gasPrice
        };
        const stakeContract = new ethers.Contract(Contract_address, StakingABI, signer);
        setShow(true)
        try {
            // 发送赎回交易（并支付 Gas 费用）
            const withdrawTx = await stakeContract.withdrawnft({
                options
            });
            console.log("NFT 赎回交易发送中:", withdrawTx.hash);
            try {
                await withdrawTx.wait();
            } catch (error) {
                setShow(false)
            }
            setShow(false)
            setAlart(true)
            setMessage('NFT 赎回成功')
            setTimeout(() => {
                router.back()
            }, 2000);
        } catch (error) {
            console.log(error);
            setShow(false)
            setAlart(true)
            setMessage('NFT 赎回失败')
        }
    };
    //矿机赎回记录
    const getComingList = async (_address: any) => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
                // 你的质押合约地址和 ABI
                const stakingContract = new ethers.Contract(Contract_address, StakingABI, signer);
                // 调用合约的 getcominglist 方法获取用户收益记录
                const records = await stakingContract.getproductslist(_address);
                const parsedRecords = parseRecords(records);
                console.log(parsedRecords);
                const reversedRecords = parsedRecords.reverse();
                setList(reversedRecords)
            } catch (e) {
                console.error("获取记录失败", e);
            }
        }

    };
    //nft质押记录
    const getNftStakingList = async (_address: any) => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
                const stakingContract = new ethers.Contract(Contract_address, StakingABI, signer);
                const records = await stakingContract.getnftlist(_address);
                const parsedRecords = parseRecords(records, true);
                console.log(parsedRecords);
                const reversedRecords = parsedRecords.reverse();
                setNftList(reversedRecords)
            } catch (e) {
                console.error("获取记录失败", e);
            }
        }

    };
    const parseRecords = (records: any, show?: boolean) => {
        console.log(records);
        return records.map((record: any) => parseRecord(record, show));
    };

    // 解析单个记录的函数
    const parseRecord = (record: any, show?: boolean) => {
        // 获取时间戳（秒）
        const timestamp = Number(record[0]);
        // 时间戳转换为日期和时间
        const date = new Date(timestamp * 1000);
        const dateStr = date.toLocaleDateString(); // 获取日期部分
        const timeStr = date.toLocaleTimeString(); // 获取时间部分
        const amount = show ? ethers.formatUnits(record[1], 0) : ethers.formatUnits(record[1], 18);  // 转换为普通数字字符串
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
            <NavBar title="矿机" />
            <div className={styles.content}>
                {
                    (() => {
                        if (paramValue === "1") {
                            return <div className={styles.onminingbox}>
                                <div className={styles.item}>
                                    <div className={styles.topbox}>
                                        <div className={styles.imgbox}>
                                            <Image className={styles.img} src='/pool/leave.png' />
                                        </div>
                                    </div>
                                    <div className={styles.itemTitle}>{source?.HavingMiningMachineInformation?.Name}</div>
                                </div>
                                <div className={styles.numbox}>
                                    <div className={styles.nummin}>{source?.HavingMiningMachineInformation?.Staking}DTV</div>
                                    <div className={styles.pos}>POS：{source?.HavingMiningMachineInformation?.Hashrate || 0}</div>
                                </div>

                            </div>
                        } else if (paramValue === "2") {
                            return <div className={styles.nftbox1}>
                                <div className={styles.mark_up}>
                                    <div className={styles.pos}>
                                        <div className={styles.label}>在售:</div>
                                        <div className={styles.num}>{source?.NFTType?.QuantityOnSale || 0}</div>
                                    </div>
                                    <div className={styles.pos}>
                                        <div className={styles.label}>已售:</div>
                                        <div className={styles.num}>{source?.NFTType?.IssuedQuantity || 0}</div>
                                    </div>
                                    <div className={styles.pos}>
                                        <div className={styles.label}>总数:</div>
                                        <div className={styles.num}>{source?.NFTType?.Total || 0}</div>
                                    </div>
                                </div>
                                <div className={styles.imagebox}>
                                    <Image className={styles.img} src='/pool/poolNFT.png' />
                                </div>
                                <div className={styles.price}>NFT质押</div>

                            </div>
                        }
                        return <div className={styles.nftbox}>
                            <div className={styles.imagebox}>
                                <Image className={styles.img} src='/pool/poolNFT.png' />
                            </div>
                            <div className={styles.price}>NFT_赎回</div>

                        </div>
                    })()
                }
                {
                    (paramValue === "1" || paramValue === "3") && <div onClick={async () => {
                        if (paramValue === "1") {
                            await withdrawTokens(localStorage.getItem('accounts'), source?.HavingMiningMachineInformation.MappingValue, source?.HavingMiningMachineInformation.Staking)
                        } else {
                            await withdrawNFT()
                        }
                    }} className={styles.btnbox}>赎回</div>
                }
                {
                    paramValue === "2" && <div onClick={async () => {
                        await getIds()
                    }} className={styles.btnbox1}>质押</div>
                }

            </div>
            {
                (() => {
                    if (paramValue === "1") {
                        return <div className={styles.listbox}>
                            <div className={styles.listTitle}>矿机赎回记录</div>
                            <div className={styles.list}>
                                {
                                    (list || []).length > 0 ? <>
                                        {
                                            list.filter(((item: any) => item.inout === "出")).map((item: any, index: any) => <div key={index} className={styles.listitem} >
                                                <div className={styles.left}>
                                                    <div className={styles.DTV}>{item.amount} DTV</div>
                                                    <div className={styles.itemTitle}>矿机_赎回</div>
                                                </div>
                                                <div className={styles.time}>{item.date}</div>
                                            </div>)
                                        }
                                    </> : <Empty />
                                }
                            </div>
                        </div>
                    } else if (paramValue === "2") {
                        return <div className={styles.listbox}>
                            <div className={styles.listTitle}>质押记录</div>
                            <div className={styles.list}>
                                {
                                    (nftlist.filter(((item: any) => item.inout === "进")) || []).length > 0 ? <>
                                        {
                                            nftlist.filter(((item: any) => item.inout === "进")).map((item: any, index: any) => <div key={index} className={styles.listitem} >
                                                <div className={styles.left}>
                                                    <div className={styles.DTV}>{item.amount} 号</div>
                                                    <div className={styles.itemTitle}>NFT_质押</div>
                                                </div>
                                                <div className={styles.time}>{item.date}</div>
                                            </div>)
                                        }
                                    </> : <Empty />
                                }
                            </div>
                        </div>
                    }
                    return <div className={styles.listbox}>
                        <div className={styles.listTitle}>赎回记录</div>
                        <div className={styles.list}>
                            {
                                (nftlist.filter(((item: any) => item.inout === "出")) || []).length > 0 ? <>
                                    {
                                        nftlist.filter(((item: any) => item.inout === "出")).map((item: any, index: any) => <div key={index} className={styles.listitem} >
                                            <div className={styles.left}>
                                                <div className={styles.DTV}>{item.amount} 号</div>
                                                <div className={styles.itemTitle}>NFT_赎回</div>
                                            </div>
                                            <div className={styles.time}>{item.date}</div>
                                        </div>)
                                    }
                                </> : <Empty />
                            }
                        </div>
                    </div>
                })()
            }

            <Popup
                visible={visible}
                onMaskClick={() => {
                    setVisible(false)
                }}
                onClose={() => {
                    setVisible(false)
                }}
                forceRender={true}
                bodyStyle={{ height: '467px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', backgroundColor: '#17161b', padding: '38px 14px', overflow: 'hidden' }}
                bodyClassName={styles.popbox}
            >
                <div className={styles.poptitle}>NFT质押
                </div>
                <div className={styles.statusbox}>
                    <div className={styles.popimagebox}>
                        <Image className={styles.img} src='/convert/success.png' />
                        {/* <Image className={styles.img} src='/convert/error.png' /> */}
                        <div className={styles.statusTitle}>质押成功</div>
                    </div>
                    <div className={styles.details}>
                        <div className={styles.detailitem}>
                            <div className={styles.detailtitle}>兑换数量</div>
                            <div className={styles.detailvalue}>1个</div>
                        </div>
                        <div className={styles.detailitem}>
                            <div className={styles.detailtitle}>时间 </div>
                            <div className={styles.detailvalue}>{
                                `${year}-${month}-${day} ${hours}:${minutes}`
                            } </div>
                        </div>
                    </div>
                    <div className={styles.btn} onClick={() => {
                        setVisible(false)
                        router.back()
                    }}>返回</div>
                </div>

            </Popup>
            <NewLoading show={show} />
            <CustomAlert visible={alart} message={message} setVisible={setAlart} />
        </div>
    )
}