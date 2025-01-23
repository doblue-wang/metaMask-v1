
'use client';

import styles from "./page.module.scss";
import React, { useEffect, useRef, useState } from 'react'
import { Button, Image, NoticeBar, Space, Swiper, ProgressBar, Toast } from 'antd-mobile'
import { CloseCircleOutline, CompassOutline } from 'antd-mobile-icons'
import { useRouter, useSearchParams } from "next/navigation";
import CountUp from "react-countup";
import BottomNav from "@/components/Tabbar";
import { fetchGetHome, fetchGetSpeedOfProgress, fetchLogin } from "@/api/home";
import { getCookie, setCookie } from "@/utils/utils";
import { ethers } from "ethers";
export default function Home() {
  const router = useRouter();
  const [percent, setPercent] = useState(30);
  const [source, setSource] = useState({} as any);
  const [progress, setProgress] = useState({} as any);
  const [WalletAddress,setWalletAddress]= useState(123123);
  const items = source?.RotationData?.[0]?.pic?.map((item: any, index: any) => (
    <Swiper.Item className={styles.item} key={index}>
      <div
        className={styles.content}
      >
        <Image className={styles.img} src={item.url} fit='fill' />
      </div>
    </Swiper.Item>
  ))


  useEffect(() => {
    isAuthorize()
  }, [])

  //是否授权
  const isAuthorize = () => {
    const token = getCookie('token')
    if (token) {
      getHome()
      getProgress()
    } else {
      //唤起metamask 授权
      connectMetaMask()
      
    }
  }


  //接口授权
  const getGoodsNineTrans = async ({WalletAddress}:{WalletAddress:Number}) => {
    fetchLogin({ WalletAddress:WalletAddress})
      .then(({ data }) => {
        setCookie("token", data.token, 7);
        getHome()
      })
      .catch((e) => {
        console.log(e);
      });
  };


//metamask 授权
const connectMetaMask = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // 请求用户连接 MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(accounts[0])
     getGoodsNineTrans({WalletAddress:accounts[0]})
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  } else {
    alert('MetaMask is not installed');
  }
};



  // 首页数据
  const getHome = () => {
    fetchGetHome({
      AccountId: 123
    }).then(({ code, data }) => {
      console.log(code);
      if (code === 600) {
        //重新登录
        connectMetaMask()
      }
      setSource(data);
    })
      .catch((e) => {
        console.log(e);
      });
  }

  //数据进度
  const getProgress = () => {
    fetchGetSpeedOfProgress({
      AccountId: 123
    }).then(({ code, data }) => {
      console.log(data);
      setProgress(data)
    })
      .catch((e) => {
        console.log(e);
      });
  }
  const formatProgressQty = (qty: number) => {
    if (qty >= 100000000) {  // 大于一亿
      return (qty / 100000000).toFixed(0) + "亿";  // 保留两位小数
    } else if (qty >= 10000) {  // 大于一万，小于一亿
      return (qty / 10000).toFixed(0) + "万";  // 保留两位小数
    } else {
      return qty;  // 小于一万，直接返回数字
    }
  };
  return (
    <div className={styles.page}>
      <div className={styles.swiperbox}>
        <Swiper className={styles.swiper} autoplay indicator={() => null}>
          {items}
        </Swiper>
      </div>
      <div className={styles.notice} onClick={() => router.push('/homeDetail')}>
        <Image className={styles.noticeimg} src='/home/notice.png' fit='fill' />
        <div className={styles.noticebox}>
          公告：{source?.NoticeData?.title || ""}
        </div>
      </div>
      <div className={styles.DTV}>
        <div className={styles.title}>DTV挖矿进度</div>
        <div className={styles.progress}>
          <ProgressBar percent={(progress?.TotalReleaseQty / progress?.TotalQty) * 100} text={formatProgressQty(progress?.TotalQty)} style={{
            '--fill-color': 'linear-gradient( 90deg, #EF5A80 0%, #E5154C 100%);', '--track-color': 'rgba(255,110,145,0.2)',
          }} />
          {
            progress?.TotalReleaseQty > 0 ? <div className={styles.progress_bubble} style={{ left: `${(progress?.TotalReleaseQty / progress?.TotalQty) * 100}%`, marginLeft: `-${12 / 2}px` }}>
              <div className={styles.bubble_content} >  {formatProgressQty( progress?.TotalReleaseQty || 0)}</div>
            </div> : null
          }

          <div className={styles.circle} style={{ left: `${(progress?.TotalReleaseQty / progress?.TotalQty) * 100}%`, marginLeft: `-${12 / 2}px` }}>
            <div className={styles.circle_inner} ></div>
          </div>
        </div>
        <div className={styles.year}>
          <div className={styles.year_num}>{progress?.StartYear || 0}年</div>
          <div className={styles.year_num}>{progress?.EndYear || 0}年</div>
        </div>
        <div className={styles.title}>DTV销毁进度</div>
        <div className={styles.progress}>
          <ProgressBar percent={(progress?.AlreadyDestructionQty / progress?.DestructionTotalQty) * 100} text={formatProgressQty( progress?.DestructionTotalQty)  || 0} style={{
            '--fill-color': 'linear-gradient( 90deg, #EF5A80 0%, #E5154C 100%);', '--track-color': 'rgba(255,110,145,0.2)',
          }} />
          {
            progress?.AlreadyDestructionQty > 0 ? <div className={styles.progress_bubble} style={{ left: `${(progress?.AlreadyDestructionQty / progress?.DestructionTotalQty) * 100}%`, marginLeft: `-${12 / 2}px` }}>
              <div className={styles.bubble_content} >{formatProgressQty(  progress?.AlreadyDestructionQty || 0) }</div>
            </div> : null
          }


          <div className={styles.circle} style={{ left: `${(progress?.AlreadyDestructionQty / progress?.DestructionTotalQty) * 100}%`, marginLeft: `-${12 / 2}px` }}>
            <div className={styles.circle_inner} ></div>
          </div>
        </div>
      </div>
      <div className={styles.funbox}>
        <div className={styles.funItem}>
          <div className={styles.Item_title}>全网POS算力</div>
          <div className={styles.content}>
            <div className={styles.num}> <CountUp start={0} end={progress?.TheEntireNetworkHashratePos} duration={3} /></div>
            <div className={styles.icon}>
              <Image className={styles.iconimg} src='/home/POS.png' fit='fill' />
            </div>
          </div>
        </div>
        <div className={styles.funItem}>
          <div className={styles.Item_title}>全网POP算力</div>
          <div className={styles.content}>
            <div className={styles.num}> <CountUp start={0}  end={progress?.TheEntireNetworkHashratePop} duration={3} /></div>
            <div className={styles.icon}>
              <Image className={styles.iconimg} src='/home/POP.png' fit='fill' />
            </div>
          </div>
        </div>
        <div className={styles.funItem}>
          <div className={styles.Item_title}>昨日挖矿数量</div>
          <div className={styles.content}>
            <div className={styles.num}>
              <span><CountUp start={0}  end={progress?.MiningQty||0} duration={3} /></span>
              <p className={styles.unit}>{progress?.DailyTotalQty||0}</p>
            </div>
            <div className={styles.icon}>
              <Image className={styles.iconimg} src='/home/mining.png' fit='fill' />
            </div>
          </div>
        </div>
        <div className={styles.funItem}>
          <div className={styles.Item_title}>昨日销毁数量</div>
          <div className={styles.content}>
            <div className={styles.num}>
              <span><CountUp start={0}  end={progress?.DailyAlreadyDestructionQty} duration={3} /></span>
              <p className={styles.unit}>{progress?.DailyDestructionQty}</p>
            </div>
            <div className={styles.icon}>
              <Image className={styles.iconimg} src='/home/destroy.png' fit='fill' />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.drama}>
        <div className={styles.drama_title}>热播剧</div>
        <div className={styles.drama_list}>
          {
            (source?.HotDramaData || []).map((item: any) => <div key={item.id} className={styles.drama_item}>
              <div className={styles.top}>
                <Image className={styles.img} src={item?.pic[0]?.url} fit='fill' />
                <div className={styles.item_num}>更新至30集</div>
              </div>
              <div className={styles.item_name}>{item?.title || ""}</div>
              <div className={styles.item_txt}>{item?.subtitle || ""}</div>
            </div>)
          }
        </div>
      </div>
      <div className={styles.linkbox}>
        {
          (source?.ExternalLinksData || []).map((item: any) => <div key={item.id} className={styles.linkitem}>
            <div className={styles.icon}>
              <Image className={styles.iconimg} src={item?.pic[0]?.url} fit='fill' />
            </div>
            <div className={styles.title}>{item.title || ''}</div>
          </div>)
        }
      </div>
      <BottomNav initialTab='/' />
    </div>
  );
}
