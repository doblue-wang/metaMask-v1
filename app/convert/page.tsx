'use client';
import styles from "./page.module.scss";
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Image, Input } from 'antd-mobile'
import BottomNav from "@/components/Tabbar";
import { fetchGetDiva } from "@/api/home";
import CustomAlert from "@/components/Toast";
import { ethers, parseUnits } from "ethers";
import { ERC20_ABI } from "../../ERC20ABI";
import { StakingABI } from "../../StakingABI";
import { t } from "i18next";
import NewLoading from "@/components/Loading";
export default function Convert () {
  const [USDTValue, setUSDTValue] = useState(''); // USDT 输入框的值
  const [DTVValue, setDTVValue] = useState('');   // DTV 输入框的值
  const [scale, setScale] = useState(0);
  const [visible, setVisble] = useState(false)
  const [message, setMessage] = useState('')
  const [show, setShow] = useState(false)
  const router = useRouter();
  const handleRecord = () => {
    router.push('/convert/convertRecord');
  }

  // 处理 USDT 输入框的变化
  const handleUSDTChange = (val: string) => {
    setUSDTValue(val);
    // 如果输入的是有效数字，则转换为 DTV
    const usdtAmount = parseFloat(val);
    if (!isNaN(usdtAmount)) {
      setDTVValue((usdtAmount * 100).toString());
    } else {
      setDTVValue('');
    }
  }

  // 处理 DTV 输入框的变化
  const handleDTVChange = (val: string) => {
    setDTVValue(val);
    // 如果输入的是有效数字，则转换为 USDT
    const dtvAmount = parseFloat(val);
    if (!isNaN(dtvAmount)) {
      setUSDTValue((dtvAmount / 100).toString());
    } else {
      setUSDTValue('');
    }
  }

  const fetchGetDivaSource = () => {
    fetchGetDiva({})
      .then(({ data }) => {
        setScale(data?.SubscriptionRatio)
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {

    fetchGetDivaSource()

  }, [])





  //授权

  const USDT_address = '0xa2d272B92Cd921C572698Db1b999c1fC4c8374CA';//usdt 合约
  const Contract_address = '0xCBA1eE61f79006A5A02aB32425c57e750A86DB4B';//测试合约地址
  //授权钱包
  const approveToken = async (appunmu: any) => {

    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      try {
        const gasPrice = Number((await provider.getFeeData()).gasPrice);
        const options = {
          gasPrice
        };
        const signer = await provider.getSigner();
        const USDTcontract = new ethers.Contract(USDT_address, ERC20_ABI, signer);
        (USDTcontract);

        const tx = await USDTcontract.approve(Contract_address, BigInt(appunmu), options);
        await tx.wait();
        await change(appunmu)
        // await stakeTokens(getCookie('accounts'), product, appunmu)
      } catch (e) {
        console.error("授权失败", e);
      }
    } else {
      alert('MetaMask is not installed');
    }

  };

  //兑换
  const exchangeTokens = async () => {
    (Number(USDTValue));

    if (Number(USDTValue) === 0) {
      setVisble(true)
      setMessage('请输入金额')
    } else {
      const amountInUnits = parseUnits(USDTValue.toString(), 18);  // 转换为最小单位
      const amountInUnitsStr = amountInUnits.toString();  // 转换为字符串
      await approveToken(amountInUnitsStr)
    }


  };

  const change = async (appunmu: any) => {
    if (typeof window !== 'undefined' && window.ethereum) {

      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
      // 你的兑换合约地址，确认该地址是正确的
      const exchangeContract = new ethers.Contract(Contract_address, StakingABI, signer);
      // 获取当前 Gas 费用数据
      const gasPrice = Number((await provider.getFeeData()).gasPrice);
      const options = {
        gasPrice,
      };
      // 调用合约的 exchange 方法兑换 DTV
      const tx = await exchangeContract.exchange(BigInt(9999999999999999999), options);
      // 等待交易确认
      setShow(true)
      await tx.wait();
      setShow(false)
      setVisble(true)
      setMessage('兑换成功')
    } else {
      alert('MetaMask is not installed');
    }

  }





  return (
    <div className={styles.page}>
      <div className={styles.nav}>
        <div className={styles.navTitle}>{t('Earnings.Exchange')}</div>
        <div className={styles.navIcon} onClick={() => handleRecord()}>
          <Image className={styles.navIconImg} src="/convert/record.png" />
        </div>
      </div>
      <div className={styles.purse}>
        <div className={styles.purseicon}>
          <Image className={styles.purseIconImg} src="/convert/purse.png" />
        </div>
        <div className={styles.price}>0.00</div>
      </div>
      <div className={styles.exchangeArea}>
        <div className={styles.exchange}>
          <div className={styles.left}>
            <div className={styles.icon}>
              <Image className={styles.iconImg} src="/convert/exchangeUSDT.png" />
            </div>
            <div className={styles.text}>USDT</div>
          </div>
          <div className={styles.right}>
            <Input
              className={styles.price}
              placeholder=''
              type="decimal"
              value={USDTValue}
              onChange={e => handleUSDTChange(e)}
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
              <Image className={styles.iconImg} src="/convert/exchangeDTV.png" />
            </div>
            <div className={styles.text}>DTV</div>
          </div>
          <div className={styles.right}>
            <Input
              className={styles.price}
              placeholder=''
              type="decimal"
              value={DTVValue}
              onChange={e => handleDTVChange(e)}
              style={{
                '--text-align': 'right',         // 文本右对齐
                '--color': '#86909C',             // 输入文字颜色为黑色
                caretColor: '#FF6E91',          // 光标颜色为红色
              }}
            />
          </div>
        </div>
        <div className={styles.arrow}>
          <Image className={styles.arrowImg} src="/convert/exchangeArrow.png" />
        </div>
      </div>
      <div className={styles.subscription}>{scale}DTV - 1USDT</div>
      <div className={styles.button}>
        <div onClick={() => exchangeTokens()} className={styles.buttonText}>{
          t('Earnings.Exchange')
        }</div>
      </div>
      <BottomNav initialTab='/convert' />
      <NewLoading show={show} />
      <CustomAlert visible={visible} message={message} setVisible={setVisble} />
    </div>
  );
}
