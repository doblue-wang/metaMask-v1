'use client';
import styles from "./page.module.scss";
import React from 'react'
import { Image } from 'antd-mobile'
import NavBar from "@/components/NavBar/page";
import useClipboard from '@/utils/useClipboard'
export default function ConvertDetails () {
  const { copyToClipboard } = useClipboard();
  const handleCopy = async () => {
    copyToClipboard('2222222')
  }
  return (
    <div className={styles.page}>
      <NavBar title="兑换详情" />
      <div className={styles.statusbox}>
        <div className={styles.status}>
          <Image
            className={styles.statusimg}
            src="/convert/success.png"
            alt=""
          />
          {/* <Image
              className={styles.statusimg}
              src="/convert/error.png"
            /> */}
        </div>
        <div className={styles.statusTxt}>兑换成功</div>
      </div>
      <div className={styles.exchangeArea}>
        <div className={styles.exchange1}>
          <div className={styles.left}>
            <div className={styles.icon}>
              <Image className={styles.iconImg} alt="" src="/convert/exchangeUSDT.png" />
            </div>
            <div className={styles.text}>USDT</div>
          </div>
          <div className={styles.right}>
            22222
          </div>

        </div>
        <div className={styles.exchange}>
          <div className={styles.left}>
            <div className={styles.icon}>
              <Image className={styles.iconImg} src="/convert/exchangeDTV.png" />
            </div>
            <div className={styles.text}>DTV</div>
          </div>
          <div className={styles.right}>
            22222
          </div>

        </div>
        <div className={styles.arrow}>
          <Image className={styles.arrowImg} alt="" src="/convert/detailArrow.png" />
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.list}>
          <div className={styles.label}>从</div>
          <div className={styles.txtbox}>
            <div className={styles.txt}>USDT</div>
            <div className={styles.copyicon} onClick={handleCopy}>
              <Image alt="" className={styles.copyImg} src="/convert/copy.png" />
            </div>
          </div>
        </div>
        <div className={styles.list}>
          <div className={styles.label}>到</div>
          <div className={styles.txtbox}>
            <div className={styles.txt}>0xA2411eDCC5177482367f502fC6D8daC334cCDDA6</div>
            <div className={styles.copyicon}>
              <Image alt="" className={styles.copyImg} src="/convert/copy.png" />
            </div>
          </div>
        </div>
        <div className={styles.list}>
          <div className={styles.label}>网络</div>
          <div className={styles.txtbox}>
            <div className={styles.txt}>BNB Chain</div>
          </div>
        </div>
        <div className={styles.list}>
          <div className={styles.label}>网络费用</div>
          <div className={styles.txtbox}>
            <div className={styles.txt}>XXXXXXX</div>
          </div>
        </div>
        <div className={styles.list}>
          <div className={styles.label}>时间 </div>
          <div className={styles.txtbox}>
            <div className={styles.txt}>2025-01-03 12:21:31 </div>

          </div>
        </div>
      </div>
    </div>
  )
}