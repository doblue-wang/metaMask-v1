'use client';
import styles from "./page.module.scss";
import React from 'react'
import { Image } from 'antd-mobile'
import NavBar from "@/components/NavBar/page";
import useClipboard from '@/utils/useClipboard'
import { useSearchParams } from 'next/navigation';
export default function ConvertDetails () {
  const { copyToClipboard } = useClipboard();
  const Contract_address = '0xC9F278a1102FDC3795E29205e554a93f23CFb089';//测试合约地址
  const handleCopy = async () => {
    copyToClipboard('2222222')
  }
  const searchParams = useSearchParams();
  const data = searchParams.get('data');
  const parsedData = data ? JSON.parse(decodeURIComponent(data)) : null;
  console.log(parsedData);
  const getObfuscatedAccount = (account: string | null) => {
    if (!account) return '****';  // 如果没有账号，则显示 '****'

    const start = account.slice(0, 12);  // 获取前四个字符
    const end = account.slice(-12);      // 获取后四个字符

    return `${start}****${end}`;  // 拼接成：前4个字符 + **** + 后4个字符
  };
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
            {parsedData?.usdtamount || 0}
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
            {parsedData?.dtvamount || 0}
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
            <div className={styles.txt}>{getObfuscatedAccount(localStorage.getItem('accounts'))}</div>
            <div className={styles.copyicon} onClick={handleCopy}>
              <Image alt="" className={styles.copyImg} src="/convert/copy.png" />
            </div>
          </div>
        </div>
        <div className={styles.list}>
          <div className={styles.label}>到</div>
          <div className={styles.txtbox}>
            <div className={styles.txt}>{getObfuscatedAccount(Contract_address)}</div>
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
          <div className={styles.label}>时间 </div>
          <div className={styles.txtbox}>
            <div className={styles.txt}>{parsedData?.date || ''}</div>

          </div>
        </div>
      </div>
    </div>
  )
}