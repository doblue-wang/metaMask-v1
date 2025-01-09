'use client'; 
import styles from "./page.module.scss";
import React, { useRef, useState } from 'react'
import { Button, Image, NoticeBar, Space, Swiper, ProgressBar, Toast } from 'antd-mobile'
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar/page";
export default function ConvertRecord() {
    const title = "兑换记录";  // 假设我们要传递的 title 字符串
    const router = useRouter();
    const handleDetail = () => {
       router.push('/convert/convertDetails') 
    }
    return (
        <div className={styles.page}>
            <NavBar title={title} />
            <div className={styles.listbox}>
                <div className={styles.item}>
                    <div className={styles.item_time}>2025-01-04</div>
                    <div className={styles.itemMap}>
                        <div className={styles.subItem}>
                            <div className={styles.content1}>
                                <div className={styles.top}>
                                    <div className={styles.dui}>兑</div>
                                    <div className={styles.txt}>到</div>
                                    <div className={styles.name}>0xA24***CDDA6</div>
                                </div>
                                <div className={styles.time}>12:21:31 </div>
                            </div>
                             <div className={styles.content2}>
                                <div className={styles.top}>
                                    <div className={styles.zhi}>支</div>
                                    <div className={styles.txt}>到</div>
                                    <div className={styles.name}>0xA24***CDDA6</div>
                                </div>
                                <div className={styles.time}>12:21:31 </div>
                               
                            </div>
                            <div className={styles.rightArrow} onClick={()=>handleDetail()}>
                                <Image className={styles.rightArrowImg} src="/images/recordArrow.png"  />
                            </div>
                        </div>
                        <div className={styles.subItem}>
                            <div className={styles.content1}>
                                <div className={styles.top}>
                                    <div className={styles.dui}>兑</div>
                                    <div className={styles.txt}>到</div>
                                    <div className={styles.name}>0xA24***CDDA6</div>
                                </div>
                                <div className={styles.time}>12:21:31 </div>
                            </div>
                             <div className={styles.content2}>
                                <div className={styles.top}>
                                    <div className={styles.zhi}>支</div>
                                    <div className={styles.txt}>到</div>
                                    <div className={styles.name}>0xA24***CDDA6</div>
                                </div>
                                <div className={styles.time}>12:21:31 </div>
                               
                            </div>
                            <div className={styles.rightArrow}>
                                <Image className={styles.rightArrowImg} src="/images/recordArrow.png"  />
                            </div>
                        </div>
                    </div>
                </div>
                 <div className={styles.item}>
                    <div className={styles.item_time}>2025-01-04</div>
                    <div className={styles.itemMap}>
                        <div className={styles.subItem}>
                            <div className={styles.content1}>
                                <div className={styles.top}>
                                    <div className={styles.dui}>兑</div>
                                    <div className={styles.txt}>到</div>
                                    <div className={styles.name}>0xA24***CDDA6</div>
                                </div>
                                <div className={styles.time}>12:21:31 </div>
                            </div>
                             <div className={styles.content2}>
                                <div className={styles.top}>
                                    <div className={styles.zhi}>支</div>
                                    <div className={styles.txt}>到</div>
                                    <div className={styles.name}>0xA24***CDDA6</div>
                                </div>
                                <div className={styles.time}>12:21:31 </div>
                               
                            </div>
                            <div className={styles.rightArrow}>
                                <Image className={styles.rightArrowImg} src="/images/recordArrow.png"  />
                            </div>
                        </div>
                        <div className={styles.subItem}>
                            <div className={styles.content1}>
                                <div className={styles.top}>
                                    <div className={styles.dui}>兑</div>
                                    <div className={styles.txt}>到</div>
                                    <div className={styles.name}>0xA24***CDDA6</div>
                                </div>
                                <div className={styles.time}>12:21:31 </div>
                            </div>
                             <div className={styles.content2}>
                                <div className={styles.top}>
                                    <div className={styles.zhi}>支</div>
                                    <div className={styles.txt}>到</div>
                                    <div className={styles.name}>0xA24***CDDA6</div>
                                </div>
                                <div className={styles.time}>12:21:31 </div>
                               
                            </div>
                            <div className={styles.rightArrow}>
                                <Image className={styles.rightArrowImg} src="/images/recordArrow.png"  />
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}