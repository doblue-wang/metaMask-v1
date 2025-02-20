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
import { px2rem } from "@/utils/pxToRem";
export default function Convert () {
  useEffect(() => {
    document.title = `${t("兑换")}`;
  }, []);
  const [USDTValue, setUSDTValue] = useState(''); // USDT 输入框的值
  const [DTVValue, setDTVValue] = useState('');   // DTV 输入框的值
  const [scale, setScale] = useState(0);
  const [visible, setVisble] = useState(false)
  const [message, setMessage] = useState('')
  const [show, setShow] = useState(false)
  const [moneySource, setMoney] = useState("")
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
      setDTVValue((usdtAmount * scale).toString());
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
      setUSDTValue((dtvAmount / scale).toString());
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
    money()
  }, [])
  //授权
  const USDT_address = '0x55d398326f99059fF775485246999027B3197955';//usdt 合约
  const Contract_address = '0x1E5F7963B774F2e5ceC16d4d761A314Cbfaf1F08';//测试合约地址
  const money = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
    const ownerAddress = await signer.getAddress();
    const nftContract = new ethers.Contract(USDT_address, ERC20_ABI, signer);
    const balance = await nftContract.balanceOf(ownerAddress);
    const num = Number(ethers.formatUnits(balance, 18)).toFixed(0) as any
    const formattedMoney = new Intl.NumberFormat().format(num);
    setMoney(formattedMoney);
  }
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
        setShow(true)
        const balance = await provider.getBalance(localStorage.getItem("accounts") as any);
        const BNBbalance = ethers.formatUnits(balance, 18)
        if (Number(BNBbalance) <= 0.00005) {
          const ms = t('BNB金额不足')
          setMessage(ms)
          setVisble(true)
          setShow(false)
          return
        }

        const tx = await USDTcontract.approve(Contract_address, BigInt(appunmu), options);
        await tx.wait();
        await change(appunmu)
        // await stakeTokens(getCookie('accounts'), product, appunmu)
      } catch (e) {
        console.log('Error:', e);
      }
    }
  };
  //兑换
  const exchangeTokens = async () => {
    if (localStorage.getItem("show") !== "0") {
      setVisble(true)
      const ms = t('请进行人脸识别')
      setMessage(ms)
      return
    }
    if (Number(USDTValue) === 0) {
      setVisble(true)
      const ms = t('请输入金额')
      setMessage(ms)
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

      const balance = await provider.getBalance(localStorage.getItem("accounts") as any);
      const BNBbalance = ethers.formatUnits(balance, 18)
      if (Number(BNBbalance) <= 0.00005) {
        const ms = t('BNB金额不足')
        setMessage(ms)
        setVisble(true)
        setShow(false)
        return
      }

      // 调用合约的 exchange 方法兑换 DTV
      const tx = await exchangeContract.exchange(BigInt(appunmu), options);
      // 等待交易确认
      await tx.wait();
      setShow(false)
      setVisble(true)
      const ms = t('兑换成功')
      setMessage(ms)
    }
  }
  return (
    <div className={styles.page}>
      <div className={styles.nav}>
        <div className={styles.navTitle}>{t('Earnings.Exchange')}</div>
        <div className={styles.navIcon} onClick={() => handleRecord()}>
          <Image width={px2rem(24)} height={px2rem(24)} fit="cover" className={styles.navIconImg} src="/convert/record.png" />
        </div>
      </div>
      <div className={styles.purse}>
        <div className={styles.purseicon}>
          <Image fit="cover" className={styles.purseIconImg} src="/convert/purse.png" />
        </div>
        <div className={styles.price}>{moneySource}</div>
      </div>
      <div className={styles.exchangeArea}>
        <div className={styles.exchange}>
          <div className={styles.left}>
            <div className={styles.icon}>
              <Image fit="cover" className={styles.iconImg} src="/convert/exchangeUSDT.png" />
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
          <Image width={px2rem(30)} height={px2rem(30)} fit="cover" className={styles.arrowImg} src="/convert/exchangeArrow.png" />
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
