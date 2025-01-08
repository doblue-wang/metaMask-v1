
'use client'; 

import styles from "./page.module.scss";
import React, { useRef,useState } from 'react'
import { Button, Image, NoticeBar, Space, Swiper,ProgressBar,Toast } from 'antd-mobile'
import { CloseCircleOutline, CompassOutline } from 'antd-mobile-icons'
export default function Home() {
  const [percent, setPercent] = useState(30);
   const demoSrc =['https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60']
  const items = demoSrc.map((item, index) => (
  <Swiper.Item className={styles.item} key={index}> 
    <div
        className={styles.content}
      >
        <Image className={styles.img} src={item}  fit='fill' />
      </div>
  </Swiper.Item>
))
 
  
  return (
    <div className={styles.page}>
      <div className={styles.swiperbox}>
        <Swiper className={styles.swiper} autoplay indicator={() => null}>
         {items}
         </Swiper>
      </div>
      <div className={styles.notice}>
        <Image className={styles.noticeimg} src='/home/notice.png'   fit='fill' />
        <div className={styles.noticebox}>
          公告：2025年春节放假通知
        </div>
      </div>
      <div className={styles.DTV}>
        <div className={styles.title}>DTV挖矿进度</div>
        <div className={styles.progress}>

          <ProgressBar percent={percent} text='100亿' style={{
              '--fill-color': 'linear-gradient( 90deg, #EF5A80 0%, #E5154C 100%);','--track-color': 'rgba(255,110,145,0.2)',
          }} />
          
          <div className={styles.progress_bubble}  style={{ left: `${percent-5}%` }}>
            <div className={styles.bubble_content} >12.3827亿</div>
          </div>
          <div className={styles.circle} style={{ left: `${percent-5}%` }}>
            <div className={styles.circle_inner} ></div>
          </div>
          
        </div>
        <div className={styles.year}>
          <div className={styles.year_num}>2025年</div>
          <div className={styles.year_num}>2032年</div>
        </div>
         <div className={styles.title}>DTV销毁进度</div>
        <div className={styles.progress}>

          <ProgressBar percent={percent} text='100亿' style={{
              '--fill-color': 'linear-gradient( 90deg, #EF5A80 0%, #E5154C 100%);','--track-color': 'rgba(255,110,145,0.2)',
          }} />
          
          <div className={styles.progress_bubble}  style={{ left: `${percent-5}%` }}>
            <div className={styles.bubble_content} >12.3827亿</div>
          </div>
          <div className={styles.circle} style={{ left: `${percent-5}%` }}>
            <div className={styles.circle_inner} ></div>
          </div>
          
        </div>
      </div>
      <div className={styles.funbox}>
        <div className={styles.funItem}>
          <div className={styles.Item_title}>全网POS算力</div>
          <div className={styles.content}>
            <div className={styles.num}>3,414</div>
            <div className={styles.icon}>
              <Image className={styles.iconimg} src='/home/POS.png'   fit='fill' />
            </div>
          </div>
        </div>
         <div className={styles.funItem}>
          <div className={styles.Item_title}>全网POP算力</div>
          <div className={styles.content}>
            <div className={styles.num}>71,228</div>
            <div className={styles.icon}>
              <Image className={styles.iconimg} src='/home/POP.png'   fit='fill' />
            </div>
          </div>
        </div>
         <div className={styles.funItem}>
          <div className={styles.Item_title}>昨日挖矿数量</div>
          <div className={styles.content}>
            <div className={styles.num}>
              <span>15,789</span>
              <span className={styles.unit}>/ 29014</span>
            </div>
            <div className={styles.icon}>
              <Image className={styles.iconimg} src='/home/mining.png'   fit='fill' />
            </div>
          </div>
        </div>
         <div className={styles.funItem}>
          <div className={styles.Item_title}>昨日销毁数量</div>
          <div className={styles.content}>
            <div className={styles.num}>
              <span>15,789</span>
              <span className={styles.unit}>/ 29014</span>
            </div>
            <div className={styles.icon}>
              <Image className={styles.iconimg} src='/home/destroy.png'   fit='fill' />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.drama}>
        <div className={styles.drama_title}>热播剧</div>
        <div className={styles.drama_list}>
          <div className={styles.drama_item}>
            <div className={styles.top}>
              <Image className={styles.img} src={demoSrc} fit='fill' />
              <div className={styles.item_num}>更新至30集</div>
            </div>
            <div className={styles.item_name}>心智相投</div>
            <div className={styles.item_txt}>埃迪·雷埃迪·雷埃迪·雷埃迪·雷埃迪·雷</div>
          </div>
          <div className={styles.drama_item}>
            <div className={styles.top}>
              <Image className={styles.img} src={demoSrc} fit='fill' />
              <div className={styles.item_num}>更新至30集</div>
            </div>
            <div className={styles.item_name}>心智相投</div>
            <div className={styles.item_txt}>埃迪·</div>
          </div>
          <div className={styles.drama_item}>
            <div className={styles.top}>
              <Image className={styles.img} src={demoSrc} fit='fill' />
              <div className={styles.item_num}>更新至30集</div>
            </div>
            <div className={styles.item_name}>心智相投</div>
            <div className={styles.item_txt}>埃迪·</div>
          </div>
          <div className={styles.drama_item}>
            <div className={styles.top}>
              <Image className={styles.img} src={demoSrc} fit='fill' />
              <div className={styles.item_num}>更新至30集</div>
            </div>
            <div className={styles.item_name}>心智相投</div>
            <div className={styles.item_txt}>埃迪·</div>
          </div>
        </div>
      </div>
      <div className={styles.linkbox}>
        <div className={styles.linkitem}>
          <div className={styles.icon}>
            <Image className={styles.iconimg} src='/home/externallink1.png'   fit='fill' />
          </div>
          <div className={styles.title}>外链地址</div>
        </div>
        <div className={styles.linkitem}>
          <div className={styles.icon}>
            <Image className={styles.iconimg} src='/home/externallink2.png'   fit='fill' />
          </div>
          <div className={styles.title}>外链地址</div>
        </div>
        <div className={styles.linkitem}>
          <div className={styles.icon}>
            <Image className={styles.iconimg} src='/home/externallink3.png'   fit='fill' />
          </div>
          <div className={styles.title}>外链地址</div>
        </div>
      </div>
    </div>
  );
}
