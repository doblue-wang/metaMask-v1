'use client';
import styles from "./page.module.scss";
import React, { useState } from 'react'
import { Image, Popup } from 'antd-mobile'
// import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/page";
import Empty from "@/components/empty/page";
import { getCookie } from "@/utils/utils";
import { ethers } from "ethers";
import { StakingABI } from "@/StakingABI";
import NewLoading from "@/components/Loading";
import CustomAlert from "@/components/Toast";
export default function KJredeem () {

    const Contract_address = '0xC9F278a1102FDC3795E29205e554a93f23CFb089';//测试合约地址
    //赎回
    const withdrawTokens = async (_address: string, _product: number, _amount: any) => {
        console.log(_address, _product, _amount);

        try {
            if (typeof window.ethereum === "undefined") {
                console.error("MetaMask 未安装");
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
            // 调用合约的 withdrawproducts 方法赎回 DTV
            const tx = await stakingContract.withdrawproducts(_address, _product, BigInt(_amount), options);
            // 等待交易确认
            setShow(true)
            await tx.wait();
            setShow(false)
            console.error("赎回成功");
            setAlart(true)
            setMessage('赎回成功')
        } catch (e) {
            console.error("赎回失败", e);
        }
    };

    const [visible, setVisible] = useState(false);
    const [show, setShow] = useState(false)
    const [alart, setAlart] = useState(false)
    const [message, setMessage] = useState('')
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
                {/* <div className={styles.nftbox}>
                    <div className={styles.imagebox}>
                        <Image className={styles.img} src='/pool/poolNFT.png' />
                    </div>
                    <div className={styles.price}>1000u</div>

                </div> */}
                {/* <div className={styles.nftbox1}>
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

                </div> */}
                <div onClick={async () => {
                    await withdrawTokens(getCookie('accounts'), 1, 20000)
                }} className={styles.btnbox}>赎回</div>
            </div>
            <div className={styles.listbox}>
                <div className={styles.listTitle}>矿机赎回记录</div>
                <div className={styles.list}>
                    <div className={styles.listitem} onClick={() => setVisible(true)}>
                        <div className={styles.left}>
                            <div className={styles.DTV}>10,000 DTV</div>
                            <div className={styles.itemTitle}>矿机_赎回</div>

                        </div>
                        <div className={styles.time}>2025-01-03</div>
                    </div>
                    <div className={styles.listitem}>
                        <div className={styles.left}>
                            <div className={styles.DTV}>10,000 DTV</div>
                            <div className={styles.itemTitle}>矿机_赎回</div>

                        </div>
                        <div className={styles.time}>2025-01-03</div>
                    </div>
                    <div className={styles.listitem}>
                        <div className={styles.left}>
                            <div className={styles.DTV}>10,000 DTV</div>
                            <div className={styles.itemTitle}>矿机_赎回</div>

                        </div>
                        <div className={styles.time}>2025-01-03</div>
                    </div>
                    <div className={styles.listitem}>
                        <div className={styles.left}>
                            <div className={styles.DTV}>10,000 DTV</div>
                            <div className={styles.itemTitle}>矿机_赎回</div>

                        </div>
                        <div className={styles.time}>2025-01-03</div>
                    </div>
                </div>
                {/* <Empty /> */}
                {/* <div className={styles.empty}>
                    <Image className={styles.img} src='/pool/empty.png' />
                    <div className={styles.emptytext}>暂无记录~</div>
                </div> */}
            </div>
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
                            <div className={styles.detailvalue}>2025-01-03 12:21:31 </div>
                        </div>
                    </div>
                    <div className={styles.btn} onClick={() => setVisible(false)}>返回</div>
                </div>

            </Popup>
            <NewLoading show={show} />
            <CustomAlert visible={alart} message={message} setVisible={setAlart} />
        </div>
    )
}