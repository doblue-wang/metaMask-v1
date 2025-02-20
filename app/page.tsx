
'use client';

import styles from "./page.module.scss";
import React, { useEffect, useRef, useState } from 'react'
import { Image, Swiper, ProgressBar, Modal, Input } from 'antd-mobile'
import { useRouter, useSearchParams } from "next/navigation";
import CountUp from "react-countup";
import BottomNav from "@/components/Tabbar";
import { BindingRelationship, fetchGetHome, fetchGetSpeedOfProgress, fetchLogin } from "@/api/home";
import { useTranslation } from "react-i18next";
import CustomAlert from "@/components/Toast";
import { ethers } from "ethers";
import PageLoading from "@/components/PageLoading";
export default function Home () {
  useEffect(() => {
    document.title = `${t("首页")}`;
    connectMetaMask();
    if (data) {
      setCode(data.split(''))
    }
  }, []);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [source, setSource] = useState({} as any);
  const [progress, setProgress] = useState({} as any);
  const [shownetwork, setshownetwork] = useState(false)
  const { t } = useTranslation();
  const [visible1, setVisble1] = useState(false)
  const [message, setMessage] = useState('')
  const { i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]) as any;
  const items = (source?.RotationData || []).map((item: any, index: any) => (
    <Swiper.Item onClick={() => {
      if (item.url) {
        location.href = item.url
      }
    }} className={styles.item} key={index}>
      <div
        className={styles.content}
      >
        <Image lazy className={styles.img} src={item?.pic[0]?.url} fit='fill' />
      </div>
    </Swiper.Item>
  ))
  const searchParams = useSearchParams();
  const data = searchParams.get('code');

  //接口授权
  const getGoodsNineTrans = async ({ WalletAddress }: { WalletAddress: Number }) => {
    fetchLogin({ WalletAddress: WalletAddress })
      .then(({ data }) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('AccountId', data.AccountId);
        i18n.changeLanguage(data.Languages);
        localStorage.setItem('languages', data.Languages);
        if (data.IsWhetherToBindOnlineOrNot) {
          setShow(true)
        } else {
          setShow(false)
        }
        //不识别
        if (data.IsNeedFacialRecognition === 0) {
          localStorage.setItem('show', "0");
        } else {
          //未认证
          if (data.Verification === 0) {
            localStorage.setItem('show', "0");
          } else {
            localStorage.setItem('show', "1");
          }
        }

        setTimeout(() => {
          getHome(data.AccountId);
          getProgress();
        }, 100);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //metamask 授权
  const connectMetaMask = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { chainId } = await provider.getNetwork()
    console.log(ethers.formatUnits(chainId, 0));
    const BSC = ethers.formatUnits(chainId, 0)
    if (process.env.NODE_ENV === 'development') {
      if (Number(BSC) !== 97) {
        setshownetwork(true)
        return
      }
    } else {
      if (Number(BSC) !== 56) {
        setshownetwork(true)
        return
      }
    }
    try {
      // 请求用户连接 MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      localStorage.setItem('accounts', accounts[0]);

      getGoodsNineTrans({ WalletAddress: accounts[0] })
    } catch (error: any) {
      setLoading(false)
      if (error.code === 4001) {
        setMessage('User rejected the request.')
        setVisble1(true)
      }
    }
  };

  // 首页数据
  const getHome = (AccountId?: any) => {
    fetchGetHome({
      AccountId: AccountId ? AccountId : localStorage.getItem('AccountId')
    }).then(({ data }) => {
      setSource(data);
      setLoading(false)
    })
      .catch((e) => {
        console.log(e);
      });
  }
  //数据进度
  const getProgress = () => {
    const AccountId = localStorage.getItem('AccountId')
    fetchGetSpeedOfProgress({
      AccountId
    }).then(({ data }) => {
      setProgress(data)
    })
      .catch((e) => {
        console.log(e);
      });
  }
  const formatProgressQty = (qty: number) => {
    if (qty >= 1000000000) {  // 大于十亿
      return i18n.language === 'zh'
        ? (qty / 100000000).toFixed(0) + "亿"
        : (qty / 1000000000).toFixed(1) + "B";  // 英文：Billion
    } else if (qty >= 10000) {  // 大于一万，小于十亿
      return i18n.language === 'zh'
        ? (qty / 10000).toFixed(0) + "万"
        : (qty / 1000000).toFixed(1) + "M";  // 英文：Million
    } else {
      return qty;  // 小于一万，直接返回数字
    }
  };

  //绑定
  const BindingRelationshipon = (inviteCode: any) => {
    const AccountId = localStorage.getItem('AccountId')
    BindingRelationship({
      AccountId,
      ParentCode: inviteCode
    }).then(({ data, code, msg }) => {
      if (code !== 200) {
        setShow(false)
        setMessage(msg)
        setVisble1(true)
      } else {
        setShow(false)
        const ms = t('绑定成功')
        setMessage(ms)
        setVisble1(true)
      }
    })
      .catch((e) => {
        console.log(e);
      });

  }
  // 处理输入框变化
  const handleChange = (index: any, value: any) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return; // 仅允许输入字母或数字
    // 延迟处理输入，确保输入法候选字符完成后再更新状态
    setTimeout(() => {
      const newCode = [...code];
      newCode[index] = value.toUpperCase(); // 强制大写字母
      setCode(newCode);
      // 自动跳转到下一个输入框
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }, 100); // 延迟100ms后更新
  };
  // 处理删除操作，回退到上一个输入框
  const handleKeyDown = (index: any, event: any) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  // 点击确认按钮时，合并输入值并提交
  const handleSubmit = () => {
    const inviteCode = code.join("");
    if (inviteCode.length === 6) {
      BindingRelationshipon(inviteCode);
    } else {
      setVisble1(true);
      const ms = t('请输入完整的邀请码')
      setMessage(ms)
    }
  };

  return (
    <>
      {
        loading ? <>
          <PageLoading />
          <Modal
            className="modal"
            visible={shownetwork}
            content={
              <div className={styles.tost}>{t('请切换主网')}</div>
            }
          />
        </> : <div className={styles.page}>
          <div className={styles.swiperbox}>
            <Swiper className={styles.swiper} autoplay indicator={() => null}>
              {items}
            </Swiper>
          </div>
          <div className={styles.notice} onClick={() => router.push('/homeDetail')}>
            <Image lazy className={styles.noticeimg} src='/home/notice.png' fit='fill' />
            <div className={styles.noticebox}>
              {t("公告")}：{source?.NoticeData?.title || ""}
            </div>
          </div>
          <div className={styles.DTV}>
            <div className={styles.title}>{t('DTV_Mining')}</div>
            <div className={styles.progress}>
              <ProgressBar percent={(progress?.TotalReleaseQty / progress?.TotalQty) * 86} text={formatProgressQty(progress?.TotalQty) || 0}
                style={{
                  '--fill-color': 'rgba(255, 110, 145, 0.20)', '--track-color': 'rgba(255,110,145,0.2)',
                }}
              />
              {
                progress?.TotalReleaseQty > 0 ?
                  <div className={styles.progress_bubble} style={{ left: `${(progress?.TotalReleaseQty / progress?.TotalQty) * 86}%`, marginLeft: `-${12 / 2}px` }}>
                    <div className={styles.bubble_content} > {formatProgressQty(progress?.TotalReleaseQty || 0)}1</div>
                  </div> : null
              }

              <div className={styles.circle} style={{ left: `${(progress?.TotalReleaseQty / progress?.TotalQty) * 86}%`, marginLeft: `-${12 / 2}px` }}>
                <div className={styles.circle_inner} ></div>
              </div>
            </div>
            <div className={styles.year}>
              <div className={styles.year_num}>{progress?.StartYear || 0}{t('年')}</div>
              <div className={styles.year_num}>{progress?.EndYear || 0}{t('年')}</div>
            </div>
            <div className={styles.title}>{t('DTV_Burning_Progress')}</div>
            <div className={styles.progress}>
              <ProgressBar percent={(progress?.AlreadyDestructionQty / progress?.DestructionTotalQty) * 100} text={formatProgressQty(progress?.DestructionTotalQty) || 0}
                style={{
                  '--fill-color': 'rgba(255, 110, 145, 0.20)', '--track-color': 'rgba(255,110,145,0.2)',
                }} />
              {
                progress?.AlreadyDestructionQty > 0 ? <div className={styles.progress_bubble} style={{ left: `${(progress?.AlreadyDestructionQty / progress?.DestructionTotalQty) * 100}%`, marginLeft: `-${12 / 2}px` }}>
                  <div className={styles.bubble_content} >{formatProgressQty(progress?.AlreadyDestructionQty || 0)}</div>
                </div> : null
              }
              <div className={styles.circle} style={{ left: `${(progress?.AlreadyDestructionQty / progress?.DestructionTotalQty) * 100}%`, marginLeft: `-${12 / 2}px` }}>
                <div className={styles.circle_inner} ></div>
              </div>
            </div>
          </div>
          <div className={styles.funbox}>
            <div className={styles.funItem}>
              <div className={styles.Item_title}>{t('Total_Network_POS_Hashrate')}</div>
              <div className={styles.content}>
                <div className={styles.num}> <CountUp start={0} end={progress?.TheEntireNetworkHashratePos} duration={3} /></div>
                <div className={styles.icon}>
                  <Image lazy className={styles.iconimg} src='/home/POS.png' fit='fill' />
                </div>
              </div>
            </div>
            <div className={styles.funItem}>
              <div className={styles.Item_title}>{t('Total_Network_POP_Hashrate')}</div>
              <div className={styles.content}>
                <div className={styles.num}> <CountUp start={0} end={progress?.TheEntireNetworkHashratePop} duration={3} /></div>
                <div className={styles.icon}>
                  <Image lazy className={styles.iconimg} src='/home/POP.png' fit='fill' />
                </div>
              </div>
            </div>
            <div className={styles.funItem}>
              <div className={styles.Item_title}>{t('Yesterday_Mining_Quantity')}</div>
              <div className={styles.content}>
                <div className={styles.num}>
                  <span><CountUp start={0} end={progress?.MiningQty || 0} duration={3} /></span>
                  <p className={styles.unit}>{progress?.DailyTotalQty || 0}</p>
                </div>
                <div className={styles.icon}>
                  <Image lazy className={styles.iconimg} src='/home/mining.png' fit='fill' />
                </div>
              </div>
            </div>
            <div className={styles.funItem}>
              <div className={styles.Item_title}>{t('Yesterday_Burned_Quantity')}</div>
              <div className={styles.content}>
                <div className={styles.num}>
                  <span><CountUp start={0} end={progress?.DailyAlreadyDestructionQty || 0} duration={3} /></span>
                  <p className={styles.unit}>{progress?.DailyDestructionQty || 0}</p>
                </div>
                <div className={styles.icon}>
                  <Image lazy className={styles.iconimg} src='/home/destroy.png' fit='fill' />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.drama}>
            <div className={styles.drama_title}>{t('Popular_Drama')}</div>
            <div className={styles.drama_list}>
              {
                (source?.HotDramaData || []).map((item: any) => <div onClick={() => {
                  location.href = "https://data.demedia.tv/page/download.html"
                }} key={item.id} className={styles.drama_item}>
                  <div className={styles.top}>
                    <Image lazy className={styles.img} src={item?.pic[0]?.url} fit='fill' />
                    <div className={styles.item_num}>{item?.description || "--"}</div>
                  </div>
                  <div className={styles.item_name}>{item?.title || ""}</div>
                  <div className={styles.item_txt}>{item?.subtitle || ""}</div>
                </div>)
              }
            </div>
          </div>
          <div className={styles.linkbox}>
            {
              (source?.ExternalLinksData || []).map((item: any) => <div onClick={() => {
                location.href = item.url
              }} key={item.id} className={styles.linkitem}>
                <div className={styles.icon}>
                  <Image lazy className={styles.iconimg} src={item?.pic[0]?.url} fit='fill' />
                </div>
                <div className={styles.title}>{item.title || ''}</div>
              </div>)
            }
          </div>
          <BottomNav initialTab='/' />
          <CustomAlert visible={visible1} message={message} setVisible={setVisble1} />
          <Modal
            className="modal"
            visible={show}
            title={t("请输入邀请码")}
            content={
              <div className={styles.modals}>
                <div className={styles.inputContainer}>
                  {code.map((char, index) => (
                    <Input
                      key={index}
                      ref={(el: any) => (inputRefs.current[index] = el)}
                      className={styles.inputBox}
                      value={char}
                      style={{
                        '--text-align': 'center',         // 文本右对齐
                        '--color': '#FF6E91',
                        caretColor: '#FF6E91',
                        fontWeight: "blod",
                        "--font-size": "28px",     // 光标颜色为红色
                      }}
                      onChange={(val) => handleChange(index, val)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1} // 限制每个输入框只能输入一个字符
                    />
                  ))}
                  <CustomAlert visible={visible1} message={message} setVisible={setVisble1} />
                </div>
                <div onClick={handleSubmit} className={styles.check}>{t("确认")}</div>
              </div>
            }
            closeOnAction
            onClose={() => setShow(false)}
          />
        </div>
      }
    </>

  );
}
