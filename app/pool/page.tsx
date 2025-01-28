'use client';
import styles from "./page.module.scss";
import { Image, Button, Popup } from 'antd-mobile'
import React, { useRef, useState, useEffect, } from 'react'
import { useRouter } from "next/navigation";
import BottomNav from "@/components/Tabbar";
import { fetchGetGetQuantumTypeList, fetchGetMiningPool } from "@/api/home";
import CountUp from "react-countup";
import { ethers, parseUnits } from "ethers";
import { ERC20_ABI } from "../../ERC20ABI";
import { StakingABI } from "../../StakingABI";
import { getCookie } from "@/utils/utils";
import { t } from "i18next";
// import { utils } from "ethers"; // 显式导入utils模块

export default function Pool () {
  const [selectedTab, setSelectedTab] = useState(0);
  const [visible, setVisible] = useState(false);
  const [source, setSource] = useState({} as any)
  const [itemSource, setItemSource] = useState({} as any)
  const [filterList, setFilterList] = useState<any>([])
  const [defults, setDefult] = useState<any>()

  const tabs = [
    { id: 0, label: `${t('Miner')}` },
    { id: 1, label: 'NFT' },
  ];
  useEffect(() => {
    getSource()
  }, [])
  const getSource = () => {
    fetchGetMiningPool({
      AccountId: getCookie('AccountId')
    }).then(({ code, data }) => {
      setSource(data)
    })
      .catch((e) => {
        console.log(e);
      });
  }

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
  const handleClick = (item: any, index: number) => {
    setSelectedItemIndex(index); // 设置选中的项
    setItemSource(item)
  }
  const router = useRouter();

  //正式
  const Contract_address = '0xCBA1eE61f79006A5A02aB32425c57e750A86DB4B';//测试合约地址

  const STAKING_CONTRACT_ADDRESS = '0xe8f59c86808F5DD44d7E92beD2f8405a6988BEeB'// dtv 合约


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
        const USDTcontract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ERC20_ABI, signer);
        (USDTcontract);

        const tx = await USDTcontract.approve(Contract_address, BigInt(appunmu), options);
        await tx.wait();
        await stakeTokens(getCookie('accounts'), itemSource.MappingValue, appunmu)
      } catch (e) {
        console.error("授权失败", e);
      }
    } else {
      alert('MetaMask is not installed');
    }

  };

  const stakeTokens = async (_address: any, _product: any, _amount: any) => {
    try {
      if (typeof window.ethereum === "undefined") {
        console.error("MetaMask 未安装");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
      const stakingContract = new ethers.Contract(Contract_address, StakingABI, signer);
      // 获取当前 Gas 费用数据
      const gasPrice = Number((await provider.getFeeData()).gasPrice);
      const options = {
        gasPrice
      };
      // 质押代币
      const tx = await stakingContract.stakeproducts(
        _address,
        _product,
        BigInt(20000), // 转换为最小单位
        options
      );
      // 等待交易确认
      await tx.wait();
    } catch (e) {
      console.error("质押失败", e);
    }
  };


  const handleNavTo = async (index: number) => {
    //自定义跳转页面type  1，矿池赎回，2，NFT质押，3，NFT赎回
    if (selectedTab == 0) {
      if (index == 0) {
        const num = 20000;
        const amountInUnits = parseUnits(num.toString(), 18);  // 转换为最小单位
        const amountInUnitsStr = amountInUnits.toString();  // 转换为字符串
        await approveToken(amountInUnitsStr)
        //质押
      } else if (index == 1) {
        // await withdrawTokens(getCookie('accounts'), 1, 20000)
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
  useEffect(() => {
    getfilterList()
  }, [])

  const getfilterList = () => {
    fetchGetGetQuantumTypeList({})
      .then(({ data }) => {
        setFilterList(data)
        setDefult(data[0])
      })
      .catch((e) => {
        console.log(e);

      });
  }
  return (
    <div className={styles.page}>
      <div className={`${styles.funbox} ${selectedTab == 1 ? styles.bg : ''}`}>
        <div className={styles.tabbox}>
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              ref={(el: any) => (tabRefs.current[index] = el)}
              className={`${styles.tab} ${selectedTab === index ? styles.active : ''}`}
              onClick={() => handleTabClick(index)}
            >
              {tab.label}
            </div>
          ))}
          <div className={styles.colorBar} style={{
            width: '36px',
            left: `${colorBarPosition + 3}px`,
          }}></div>

        </div>
        {/* 未质押 */}
        {selectedTab == 0 && !source?.HavingMiningMachineInformation ? (
          <div className={styles.miningbox}>
            <div className={styles.listbox}>
              {(source?.MinerTypeList || []).map((item: any, index: number) => {
                return (
                  <div key={index} className={styles.item} onClick={() => handleClick(item, index)}>
                    <div className={`${styles.topbox} ${selectedItemIndex == index ? styles.selected : ''}`}>
                      <div className={styles.imgbox}>
                        <Image className={styles.img} src='/pool/quantum.png  ' />
                      </div>
                    </div>
                    <div className={`${styles.itemTitle} ${selectedItemIndex == index ? styles.selected : ''}`}>{item.Name}</div>
                  </div>
                )
              })}
            </div>
            <div onClick={() => {

              if (itemSource.MappingValue === 6) {
                setVisible(true)
              }

            }} className={styles.selectedbox}>
              <div className={styles.fivebox}>
                <div className={styles.top}>
                  <div className={styles.label}>{t('Current_Selection')}：</div>
                  <div className={styles.nummin}>   {
                    itemSource?.MappingValue === 6 ? defults.Price :
                      itemSource?.Staking || 0} DTV</div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.label}>{itemSource?.Name}</div>
                  <div className={styles.nummin}>POS：{itemSource?.Hashrate || 0}</div>
                </div>
              </div>
              {
                itemSource.MappingValue === 6 ? <div className={styles.select} >
                  <Image className={styles.img} src='/pool/select.png' />
                </div> : null
              }

            </div>
          </div>
          // 已质押
        ) : selectedTab == 0 && source?.HavingMiningMachineInformation ? (
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
                <div className={styles.label}>{t('POS_Bonus')}：</div>
                <div className={styles.num}>2000 (12%)</div>
              </div>
              <div className={styles.pos}>
                <div className={styles.label}>{t('POP_Bonus')}：</div>
                <div className={styles.num}>2000 (12%)</div>
              </div>
            </div>
          </div>
        ) : null}
        <div className={styles.btnbox}>
          <Button disabled={source?.HavingMiningMachineInformation} className={styles.btn} onClick={() => handleNavTo(0)}>
            <div className={styles.btnlist}>
              <span className={styles.btnText}>{t('Staking_Redemption_Minting.Staking')}</span>
              {/* <Image className={styles.img} src='/pool/casting.png' /> */}
            </div>
          </Button>
          {/* disabled={!source?.HavingMiningMachineInformation} */}
          <Button className={styles.btn} onClick={() => handleNavTo(1)}>
            <div className={styles.btnlist}>
              <span className={styles.btnText}>{t('Staking_Redemption_Minting.Redemption')}</span>
              {/* <Image className={styles.img} src='/pool/casting.png' /> */}
            </div>
          </Button>
        </div>
      </div>
      <div className={styles.bonusBox}>
        <div className={styles.bonusTitle}>奖金收益</div>
        <div className={styles.bonusList}>
          <div className={styles.sublist}>
            <div className={styles.subitem}>
              <div className={styles.label}>{t('Earnings.Yesterday_Earnings')}(DTV)</div>
              <div className={styles.num}><CountUp start={0} end={source?.YesterdaysEarningsDTV || 0} duration={3} /></div>
            </div>
            <div className={styles.subitem}>
              <div className={styles.label}>{t('Earnings.Pending_Collection')}（DTV）</div>
              <div className={styles.num}><CountUp start={0} end={source?.AccumulatedIncomeDTV || 0} duration={3} /></div>
            </div>
          </div>
          <div className={styles.bonusbtn} onClick={() => { router.push('/pool/receive') }}>{t('Earnings.Collect')}</div>

        </div>
        <div className={styles.bonusList}>
          <div className={styles.sublist}>
            <div className={styles.subitem}>
              <div className={styles.label1}>{t('Earnings.Yesterday_Rewards')}</div>
              <div className={styles.num}><CountUp start={0} end={source?.YesterdaysEarningsDTVC || 0} duration={3} /></div>
            </div>
            <div className={styles.subitem}>
              <div className={styles.label1}>{t('Earnings.Pending_Collection_Reward')}(DTVC)</div>
              <div className={styles.num}><CountUp start={0} end={source?.AccumulatedIncomeDTVC || 0} duration={3} /></div>
            </div>
          </div>
          <div className={styles.bonusbtn1} onClick={() => { router.push('/pool/exchange') }}>{t('Earnings.Exchange')}</div>

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
        bodyStyle={{ height: '575px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', backgroundColor: '#17161b', padding: '38px 14px', overflow: 'hidden' }}
        bodyClassName={styles.popbox}
      >
        <div className={styles.poptitle}>选择DTV
        </div>
        <div className={styles.poplistbox}>
          {
            filterList.map((item: any, index: number) => <div onClick={() => {
              (item);

              setDefult(item)
            }} key={index} className={item.Price === defults.Price ? `${styles.list} ${styles.listSelect}` : styles.list}>
              <div className={styles.name}>{item.Price} DTV</div>
              <div className={styles.price}>POS: {item.Hashrate} </div>
            </div>)
          }


        </div>
      </Popup >
      <BottomNav initialTab='/pool' />
    </div >
  );
}
