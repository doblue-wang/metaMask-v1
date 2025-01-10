'use client';
import styles from "./page.module.scss";
import { Tabs, Image, Button, Popup } from 'antd-mobile'
import React, { useRef, useState, useEffect, } from 'react'
import { useRouter, useSearchParams } from "next/navigation";
export default function Pool() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [visible, setVisible] = useState(false);
  const tabs = [
    { id: 0, label: '矿机' },
    { id: 1, label: 'NFT' },
    // 你可以继续添加更多 tab 项
  ];
  const miningList = [
    {
      name: '微型矿机',
      img: '/pool/leave.png',
      type: '微型矿机',
      price: '0.1USDT',
      time: '1小时',
      profit: '0.01USDT',
      status: '运行中',
    },
    {
      name: '小型矿机',
      img: '/pool/leave.png',
      type: '小型矿机',
      price: '0.1USDT',
      time: '1小时',
      profit: '0.01USDT',
      status: '运行中',
    },
    {
      name: '中型矿机',
      img: '/pool/leave.png',
      type: '中型矿机',
      price: '0.1USDT',
      time: '1小时',
      profit: '0.01USDT',
      status: '运行中',
    },
    {
      name: '大型矿机',
      img: '/pool/leave.png',
      type: '大型矿机',
      price: '0.1USDT',
      time: '1小时',
      profit: '0.01USDT',
      status: '运行中',
    },
    {
      name: '超级矿机',
      img: '/pool/leave.png',
      type: '超级矿机',
      price: '0.1USDT',
      time: '1小时',
      profit: '0.01USDT',
      status: '运行中',
    },
    {
      name: '量子矿机',
      img: '/pool/quantum.png',
      type: '量子矿机',
      price: '0.1USDT',
      time: '1小时',
      profit: '0.01USDT',
      status: '运行中',
    },
  ]
  // 使用 useRef 创建对每个 tab 的引用，显式指定类型为 HTMLDivElement

  const handleTabClick = (index: number) => {
    setSelectedTab(index);
  };
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [colorBarPosition, setColorBarPosition] = useState(0);
  const getTabOffset = (index: number) => {
    return tabRefs.current[index] ? tabRefs.current[index]!.offsetLeft : 20;
  };
  useEffect(() => {
    const initialOffset = getTabOffset(selectedTab);
    setColorBarPosition(initialOffset + (48 - 36) / 2);  // Color bar width is 36px, center it under the tab
  }, [selectedTab]);



  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);//选中的矿机index
  const btnList = ['质押', '赎回', '铸造']
  const [selectedType, setSelectedType] = useState<any>(1);//0质押1赎回,
  const handleClick = (item: any, index: number) => {
    console.log(item, index)
    setSelectedItemIndex(index); // 设置选中的项
  }
  const router = useRouter();
  const handleNavTo = (index: number) => {
    setSelectedType(index)
    //自定义跳转页面type  1，矿池赎回，2，NFT质押，3，NFT赎回
    if (selectedTab == 0) {
      if (index == 0) {
        //质押
      } else if (index == 1) {
        //赎回 带参
        router.push('/pool/KJredeem?type=1')
      }
    } else if (selectedTab == 1) {
      if (index == 0) {
        //质押
        router.push('/pool/KJredeem?type=2')
      } else if (index == 1) {
        //赎回
        router.push('/pool/KJredeem?type=3')
      }
    }
  }











  return (
    <div className={styles.page}>
      <div className={`${styles.funbox} ${selectedTab == 1 ? styles.bg : ''}`}>
        <div className={styles.tabbox}>
          {tabs.map((tab, index) => (
            <div
              key={tab.id}  // 使用 tab.id 作为唯一的 key
              ref={(el) => (tabRefs.current[index] = el)}  // 使用 ref 数组存储每个 tab 的引用
              className={`${styles.tab} ${selectedTab === index ? styles.active : ''}`}
              onClick={() => handleTabClick(index)}  // 点击时切换选中的 tab
            >
              {tab.label}  {/* 渲染每个 tab 的标签 */}
            </div>
          ))}
          <div className={styles.colorBar} style={{
            width: '36px',  // 颜色条的宽度比 tab 短 12px，固定为 36px
            left: `${colorBarPosition + 3}px`,  // 动态计算颜色条的位置
          }}></div>

        </div>
        {/* 如果是矿机赎回页面 */}
        {selectedTab == 0 && selectedType == 1 ? (
          <div className={styles.miningbox}>
            <div className={styles.listbox}>
              {miningList.map((item, index) => {
                return (
                  <div className={styles.item} onClick={() => handleClick(item, index)}>
                    <div className={`${styles.topbox} ${selectedItemIndex == index ? styles.selected : ''}`}>
                      <div className={styles.imgbox}>
                        <Image className={styles.img} src={item.img} />
                      </div>
                    </div>
                    <div className={`${styles.itemTitle} ${selectedItemIndex == index ? styles.selected : ''}`}>{item.name}</div>
                  </div>
                )
              })}

            </div>
            <div className={styles.selectedbox}>
              <div className={styles.fivebox}>
                <div className={styles.top}>
                  <div className={styles.label}>当前选择：</div>
                  <div className={styles.nummin}>20,000 DTV</div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.label}>矿机名称</div>
                  <div className={styles.nummin}>POS：20</div>
                </div>
              </div>
              <div className={styles.select}>
                <Image className={styles.img} src='/pool/select.png' />
              </div>
            </div>
          </div>

          // 如果是矿机质押页面
        ) : selectedTab == 0 && selectedType == 0 ? (
          <div className={styles.onminingbox}>
            <div className={styles.item}>
              <div className={styles.topbox}>
                <div className={styles.imgbox}>
                  <Image className={styles.img} src='/pool/leave.png' />
                </div>
              </div>
              <div className={styles.itemTitle}>尾矿</div>
            </div>
            <div className={styles.nummin}>20,000 DTV</div>
            <div className={styles.pos}>POS：20</div>
          </div>
          //NFT页面
        ) : selectedTab == 1 ? (
          <div className={styles.nftbox}>
            <div className={styles.imagebox}>
              <Image className={styles.img} src='/pool/poolNFT.png' />
            </div>
            <div className={styles.price}>1000u</div>
            <div className={styles.mark_up}>
              <div className={styles.pos}>
                <div className={styles.label}>POS加成：</div>
                <div className={styles.num}>2000 (12%)</div>
              </div>
              <div className={styles.pos}>
                <div className={styles.label}>POP加成：</div>
                <div className={styles.num}>2000 (12%)</div>
              </div>
            </div>
          </div>
        ) : null}
        <div className={styles.btnbox}>
          {btnList.map((item, index) => {
            return (
              // disabled={selectedType==index ? true : false}
              <Button className={styles.btn} onClick={() => handleNavTo(index)}>
                <div className={styles.btnlist}>
                  <span className={styles.btnText}>{item}</span>
                  <Image className={styles.img} src='/pool/casting.png' />
                </div>
              </Button>
            )
          })}
        </div>
      </div>
      <div className={styles.bonusBox}>
        <div className={styles.bonusTitle}>奖金收益</div>
        <div className={styles.bonusList}>
          <div className={styles.sublist}>
            <div className={styles.subitem}>
              <div className={styles.label}>昨日收益(DTV)</div>
              <div className={styles.num}>1000</div>
            </div>
            <div className={styles.subitem}>
              <div className={styles.label}>待领取/累计收益（DTV）</div>
              <div className={styles.num}>1000</div>
            </div>
          </div>
          <div className={styles.bonusbtn}>领取</div>

        </div>
        <div className={styles.bonusList}>
          <div className={styles.sublist}>
            <div className={styles.subitem}>
              <div className={styles.label1}>昨日奖励(DTVC)</div>
              <div className={styles.num}>1000</div>
            </div>
            <div className={styles.subitem}>
              <div className={styles.label1}>待兑换/累计奖励（DTVC）</div>
              <div className={styles.num}>1000</div>
            </div>
          </div>
          <div className={styles.bonusbtn1}>兑换</div>

        </div>

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
        bodyStyle={{ height: '575px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', backgroundColor: '#17161b', padding: '38px 14px' }}
        bodyClassName={styles.popbox}
      >
        <div style={{ fontFamily: 'PingFang SC, PingFang SC', fontWeight: '600', fontSize: '18px', color: '#FFFFFF', lineHeight: '28px' }} className={styles.popitem}>选择DTV
        </div>
        <div></div>
      </Popup>
    </div>
  );
}
