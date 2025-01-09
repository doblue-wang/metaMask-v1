'use client'; 
import styles from "./page.module.scss";
import React, { useRef, useState,  } from 'react'
import { useRouter } from 'next/navigation';
import { Button, Image,Input, NoticeBar, Space, Swiper,ProgressBar,Toast } from 'antd-mobile'
export default function Convert() {
  const [USDTValue, setUSDTValue] = useState('');
  const router = useRouter();
  const handleRecord = () => {
    // 处理记录按钮点击事件
    router.push('/convert/convertRecord');
  }
    return (
        <div  className={styles.page}>
          <div className={styles.nav}>
            <div className={styles.navTitle}>兑换</div>
            <div className={styles.navIcon} onClick={()=>handleRecord()}>
              <Image className={styles.navIconImg} src="/convert/record.png"  />
            </div>
        </div>
          <div className={styles.purse}>
            <div className={styles.purseicon}>
              <Image className={styles.purseIconImg} src="/convert/purse.png"  />
            </div>
            <div className={styles.price}>0.00</div>
        </div>
        <div className={styles.exchangeArea}>
          <div className={styles.exchange}>
            <div className={styles.left}>
              <div className={styles.icon}>
                <Image className={styles.iconImg} src="/convert/exchangeUSDT.png"  />
              </div>
              <div className={styles.text}>USDT</div>
            </div>
            <div className={styles.right}>
              <Input
                className={styles.price}
                placeholder=''
                type="decimal"
                value={USDTValue}
                onChange={val => {
                setUSDTValue(val)
                }}
                 style={{
                    '--text-align': 'right',         // 文本右对齐
                    '--color': '#86909C',             // 输入文字颜色为黑色
                    caretColor: '#FF6E91',          // 光标颜色为红色
                  }}
                />
            </div>

          </div>
          <div className={styles.exchange}>
            <div className={styles.left}>
              <div className={styles.icon}>
                <Image className={styles.iconImg} src="/convert/exchangeDTV.png"  />
              </div>
              <div className={styles.text}>DTV</div>
            </div>
            <div className={styles.right}>
              <Input
                className={styles.price}
                placeholder=''
                type="decimal"
                value={USDTValue}
                onChange={val => {
                setUSDTValue(val)
                }}
                 style={{
                   '--text-align': 'right',         // 文本右对齐
                    '--color': '#86909C',             // 输入文字颜色为黑色
                    caretColor: '#FF6E91',          // 光标颜色为红色
                }}
                />
            </div>

          </div>
          <div className={styles.arrow}>
            <Image className={styles.arrowImg} src="/convert/exchangeArrow.png"  />
          </div>
        </div>
        <div className={styles.subscription}>100DTV - 1USTD</div>
        <div className={styles.button}>
          <div className={styles.buttonText}>兑换</div>
        </div>
        </div>
      );
}