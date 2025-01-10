'use client';
import styles from "./page.module.scss";
import React, { useRef, useState } from 'react'
import { Button, Image, Popup, NoticeBar, ErrorBlock, Space, Swiper, ProgressBar, Toast } from 'antd-mobile'
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar/page";
import Empty from "@/components/empty/page";
export default function KJredeem() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    console.log(type)
    const [visible, setVisible] = useState(false);
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
                <Empty />
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
        </div>
    )
}