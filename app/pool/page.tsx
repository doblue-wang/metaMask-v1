'use client';
import styles from "./page.module.scss";
import { Image, Button, Popup } from 'antd-mobile'
import React, { useRef, useState, useEffect, } from 'react'
import { useRouter } from "next/navigation";
import BottomNav from "@/components/Tabbar";
import { GetObtainNftSellableStatus, UpdateAllFixedAssets, UpdateNftOnSaleQuantity, fetchGetGetQuantumTypeList, fetchGetMiningPool } from "@/api/home";
import CountUp from "react-countup";
import { ethers, parseUnits } from "ethers";
import { ERC20_ABI } from "../../ERC20ABI";
import { StakingABI } from "../../StakingABI";
import { t } from "i18next";
import CustomAlert from "@/components/Toast";
import NewLoading from "@/components/Loading";
import { NFT_ABI } from "@/NFT";
import { px2rem } from "@/utils/pxToRem";
import { useTranslation } from "react-i18next";
export default function Pool () {
  useEffect(() => {
    document.title = `${t("矿池")}`;
  }, []);
  const [selectedTab, setSelectedTab] = useState(0);
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [source, setSource] = useState({} as any)
  const [itemSource, setItemSource] = useState({} as any)
  const [filterList, setFilterList] = useState<any>([])
  const [defults, setDefult] = useState<any>()
  const [show, setShow] = useState(false)
  const [visible1, setVisble1] = useState(false)
  const [message, setMessage] = useState('')
  const [isstaking, setIsstaking] = useState(false)
  const NFT_CONTRACT_ADDRESS = '0x63367C35b647C0275188cEcC06F9cCD68d1C6fe6';//nft测试合约地址
  const Contract_address = '0xc182E6C5145CbFccC18f822Bc03953484947fFcD';//测试合约地址
  const STAKING_CONTRACT_ADDRESS = '0x04A4ece9543d01C48bdA2384211dC0DDA4F090B2'// dtv 合约
  const USDT_address = '0x55d398326f99059fF775485246999027B3197955';//usdt 合约
  const [canStaking, setCanStaking] = useState(true)

  const tabs = [
    { id: 0, label: `${t('Miner')}` },
    { id: 1, label: 'NFT' },
  ];
  useEffect(() => {
    getSource()
    UpdateAllFixedAssetss()
    status()
  }, [])
  const getSource = () => {
    const AccountId = localStorage.getItem('AccountId')
    fetchGetMiningPool({
      AccountId
    }).then(({ code, data }) => {
      setSource(data)
    })
      .catch((e) => {
        console.log(e);
      });
  }
  const UpdateAllFixedAssetss = async () => {
    const AccountId = localStorage.getItem('AccountId')
    await UpdateAllFixedAssets({
      AccountId
    }).then(({ code, data }) => {
      getSource()
      setShow(false)
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

  //授权钱包
  const approveToken = async (appunmu: any) => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      try {
        // 获取 Gas 费用数据
        const gasPrice = Number((await provider.getFeeData()).gasPrice) * 2;
        const options = {
          gasPrice
        };
        const signer = await provider.getSigner();
        const USDTcontract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, ERC20_ABI, signer);
        // 执行 approve 操作
        setShow(true)

        const balance = await provider.getBalance(localStorage.getItem("accounts") as any);
        const BNBbalance = ethers.formatUnits(balance, 18)
        if (Number(BNBbalance) <= 0.0003) {
          const ms = t('BNB金额不足')
          setMessage(ms)
          setVisble1(true)
          setShow(false)
          return
        }
        const tx = await USDTcontract.approve(Contract_address, BigInt(appunmu), options);
        // 等待授权交易完成
        await tx.wait();
        const walletAddress = localStorage.getItem('accounts')
        // 授权完成后，执行质押操作
        // const amountInUnits = parseUnits( itemSource?.MappingValue === 6 ? defults.Price.toString() : itemSource.Staking.toString(), 18);  // 转换为最小单位
        // const amountInUnitsStr = amountInUnits.toString();
        await stakeTokens(walletAddress, itemSource.MappingValue, BigInt(appunmu));
      } catch (e) {
        setShow(false)
        const ms = t('授权失败')
        setMessage(ms)
        setVisble1(true)
      }
    }
  };
  const stakeTokens = async (_address: any, _product: any, _amount: any) => {
    try {
      if (typeof window.ethereum === "undefined") {
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
      // 初始化质押合约
      const stakingContract = new ethers.Contract(Contract_address, StakingABI, signer);
      // 获取 Gas 费用数据
      const gasPrice = Number((await provider.getFeeData()).gasPrice) * 2;
      const options = {
        gasPrice
      };
      const balance = await provider.getBalance(localStorage.getItem("accounts") as any);
      const BNBbalance = ethers.formatUnits(balance, 18)
      if (Number(BNBbalance) <= 0.0003) {
        const ms = t('BNB金额不足')
        setMessage(ms)
        setVisble1(true)
        setShow(false)
        return
      }
      // 执行质押操作
      const tx = await stakingContract.stakeproducts(
        _address,
        _product,
        BigInt(_amount), // 转换为最小单位
        options
      );
      // 等待质押交易完成
      await tx.wait();
      setVisble1(true)
      const ms = t('质押成功')
      setMessage(ms)
      setTimeout(async () => {
        await UpdateAllFixedAssetss()
      }, 500);

    } catch (e) {
      console.log(e);

      setShow(false)
      setVisble1(true)
      const ms = t('质押失败')
      setMessage(ms)
    }
  };
  //是否质押 nft
  const getIds = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner(); // 获取签名者（即用户钱包）
    const ownerAddress = await signer.getAddress();
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
    const balance = await nftContract.balanceOf(ownerAddress);
    const tokenIds = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await nftContract.tokenOfOwnerByIndex(ownerAddress, i);
      tokenIds.push(tokenId.toString());
    }
    if (tokenIds.length > 0) {
      setIsstaking(true)
    } else {
      setIsstaking(false)
    }
  }
  const handleNavTo = async (index: number) => {
    //自定义跳转页面type  1，矿池赎回，2，NFT质押，3，NFT赎回
    if (selectedTab == 0) {
      if (index == 0) {
        if (localStorage.getItem("show") !== "0") {
          setVisble1(true)
          const ms = t('请进行人脸识别')
          setMessage(ms)
          return
        }
        if (Object.keys(itemSource).length) {
          const num = itemSource?.MappingValue === 6 ? defults.Price : itemSource.Staking;
          const amountInUnits = parseUnits(num.toString(), 18);  // 转换为最小单位
          const amountInUnitsStr = amountInUnits.toString();  // 转换为字符串
          await approveToken(amountInUnitsStr)
        } else {
          const ms = t('请先选择矿机')
          setMessage(ms)
          setVisble1(true)
        }

        //质押
      } else if (index == 1) {
        router.push("/pool/KJredeem?type=1")
      }
    } else if (selectedTab == 1) {
      if (index == 0) {
        //质押
        router.push('/pool/KJredeem?type=2')
      } else if (index == 1) {
        //赎回
        router.push('/pool/KJredeem?type=3')
      } else if (index === 2) {
        //铸造
        router.push('/pool/KJredeem?type=4')
      }
    }
  }
  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem('languages') as any);
    getfilterList()
    getIds()
  }, [])
  const exchangeNFT = async (_amount: any) => {
    if (!window.ethereum) {
      return;
    }
    update(0)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const gasPrice = Number((await provider.getFeeData()).gasPrice) * 2;
      const options = {
        gasPrice
      };
      const balance = await provider.getBalance(localStorage.getItem("accounts") as any);
      const BNBbalance = ethers.formatUnits(balance, 18)
      if (Number(BNBbalance) <= 0.0003) {
        const ms = t('BNB金额不足')
        setMessage(ms)
        setVisble1(true)
        setShow(false)
        update(1)
        return
      }
      const USDTcontract = new ethers.Contract(USDT_address, ERC20_ABI, signer);
      const tx = await USDTcontract.approve(Contract_address, BigInt(_amount), options);
      setShow(true)
      try {
        await tx.wait();
      } catch (error) {
        update(1)
      }

      // 3. 连接 NFT 兑换合约
      const nftContract = new ethers.Contract(Contract_address, StakingABI, signer);
      // 4. 兑换 NFT
      const num = source?.NFTType.Price
      const amountInUnits = parseUnits(num.toString(), 18);  // 转换为最小单位
      const amountInUnitsStr = amountInUnits.toString();
      //bnb
      const balance1 = await provider.getBalance(localStorage.getItem("accounts") as any);
      const BNBbalance1 = ethers.formatUnits(balance1, 18)
      if (Number(BNBbalance1) <= 0.0003) {
        const ms = t('BNB金额不足')
        setMessage(ms)
        setVisble1(true)
        setShow(false)
        update(1)
        return
      }

      const exchangeTx = await nftContract.exchangenft(BigInt(amountInUnitsStr), options);
      await exchangeTx.wait();
      setShow(false)
      setVisble1(true)
      const ms = t('NFT 铸造成功! 请检查您的钱包!')
      setMessage(ms)
      getIds()
      // 解析 Transfer 事件，找到 NFT Token ID
    } catch (error) {
      update(1)
      setShow(false)
      setVisble1(true)
      const ms = t('铸造失败')
      setMessage(ms)
    }
  };
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

  const status = async () => {
    GetObtainNftSellableStatus({}).then(({ data }) => {
      setCanStaking(data);
    })
      .catch((e) => {
        console.log(e);
      });
  }

  const update = (type: any) => {
    UpdateNftOnSaleQuantity({ OperationType: type }).then(({ data }) => {
      setCanStaking(data);
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
                        <Image lazy className={styles.img} src='/pool/quantum.png' />
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
                  <div className={styles.label}>{t('Current_Selection')}</div>
                  <div className={styles.nummin}>   {
                    itemSource?.MappingValue === 6 ? defults.Price :
                      itemSource?.Staking || 0} DTV</div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.label}>{itemSource?.Name}</div>
                  <div className={styles.nummin}>POS：{itemSource.MappingValue === 6 ? defults?.Hashrate : itemSource?.Hashrate || 0}</div>
                </div>
              </div>
              {
                itemSource.MappingValue === 6 ? <div className={styles.select} >
                  <Image lazy className={styles.img} src='/pool/select.png' />
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
                  <Image lazy className={styles.img} src='/pool/leave.png' />
                </div>
              </div>
              <div className={styles.itemTitle}>{source?.HavingMiningMachineInformation?.Name}</div>
            </div>
            <div className={styles.nummin}>{source?.HavingMiningMachineInformation?.Staking || 0}DTV</div>
            <div className={styles.pos}>POS：{source?.HavingMiningMachineInformation?.Hashrate || 0}</div>
          </div>
          //NFT页面
        ) : selectedTab == 1 ? (
          <>
            {
              !isstaking && !source?.IsNFTIlluminate ? <div className={styles.nftbox}>
                <div className={styles.imagebox}>
                  <Image width={px2rem(80)} height={px2rem(87)} lazy className={styles.img} src='/pool/poolNFT.png' />
                </div>
                <div className={styles.price}>{source?.NFTType.Price}U</div>
              </div> : <div className={styles.nftbox}>
                <div className={styles.imagebox}>
                  <Image width={px2rem(80)} height={px2rem(87)} lazy className={styles.img} src='/pool/poolNFT.png' />
                </div>
                <div className={styles.price}>{source?.NFTType.Price || 0}U</div>
                <div className={styles.row}>
                  <div className={styles.pos}>{t('POS_Bonus')}{source?.NFTType.IncreasePos || 0}%</div>
                  <div className={styles.pop}>{t('POP_Bonus')}{source?.NFTType.IncreasePop || 0}%</div>
                </div>
              </div>
            }
          </>
        ) : null}
        {
          selectedTab === 0 ?
            <div className={styles.btnbox}>
              <Button disabled={source?.HavingMiningMachineInformation} className={styles.btn} onClick={() => handleNavTo(0)}>
                <div className={styles.btnlist}>
                  <span className={styles.btnText}>{t('Staking_Redemption_Minting.Staking')}</span>
                </div>
              </Button>
              <Button disabled={!source?.HavingMiningMachineInformation} className={styles.btn} onClick={() => handleNavTo(1)}>
                <div className={styles.btnlist}>
                  <span className={styles.btnText}>{t('Staking_Redemption_Minting.Redemption')}</span>
                </div>
              </Button>
            </div> :
            <div className={styles.btnbox}>
              {
                !isstaking && !source?.IsNFTIlluminate ?
                  <Button onClick={async () => {
                    if (localStorage.getItem("show") !== "0") {
                      setVisble1(true)
                      const ms = t('请进行人脸识别')
                      setMessage(ms)
                      return
                    }
                    if (!canStaking) {
                      setVisble1(true)
                      const ms = t('本期铸造已结束')
                      setMessage(ms)
                      return
                    }
                    const num = source?.NFTType.Price
                    const amountInUnits = parseUnits(num.toString(), 18);  // 转换为最小单位
                    const amountInUnitsStr = amountInUnits.toString();
                    await exchangeNFT(amountInUnitsStr)
                  }} className={styles.btn} >
                    <div className={styles.btnlist}>
                      <span className={styles.btnText}>{t("Staking_Redemption_Minting.Minting")}</span>
                      <Image lazy className={styles.img} src='/pool/casting.png' />
                    </div>
                  </Button> :
                  <>
                    <Button onClick={
                      () => handleNavTo(0)
                    } disabled={source?.IsNFTIlluminate} className={styles.btn} >
                      <div className={styles.btnlist}>
                        <span className={styles.btnText}>{t('Staking_Redemption_Minting.Staking')}</span>
                      </div>
                    </Button>
                    <Button disabled={!source?.IsNFTIlluminate} onClick={
                      () => handleNavTo(1)}
                      className={styles.btn} >
                      <div className={styles.btnlist}>
                        <span className={styles.btnText}>{t('Staking_Redemption_Minting.Redemption')}</span>
                      </div>
                    </Button>
                  </>
              }
            </div>
        }
      </div>
      <div className={styles.bonusBox}>
        <div className={styles.bonusTitle}>{t('奖金收益')}</div>
        <div className={styles.bonusList}>
          <div className={styles.sublist}>
            <div className={styles.subitem}>
              <div className={styles.label}>{t('Earnings.Yesterday_Earnings')}(DTV)</div>
              <div className={styles.num}><CountUp start={0} end={source?.YesterdaysEarningsDTV || 0} duration={3} /></div>
            </div>
            <div className={styles.subitem}>
              <div className={styles.label}>{t('Earnings.Pending_Collection')}（DTV）</div>
              <div className={styles.num}><CountUp start={0} end={source?.PendingRewardsDTV || 0} duration={3} /></div>
            </div>
            <div className={`${styles.subitem} ${styles.subitem1}`}>
              <div className={styles.label}>{t('Earnings.Total_earnings')}（DTV）</div>
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
              <div className={styles.label1}>{t('Earnings.Pending_Exchanged')} (DTVC)</div>
              <div className={styles.num}><CountUp start={0} end={source?.PendingRewardsDTVC || 0} duration={3} /></div>
            </div>
            <div className={`${styles.subitem} ${styles.subitem1}`}>
              <div className={styles.label1}>{t('Earnings.Accumulated_rewards')}(DTVC)</div>
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
        <div className={styles.poptitle}>{t('选择')}DTV
        </div>
        <div className={styles.poplistbox}>
          {
            (filterList || []).map((item: any, index: number) => <div onClick={() => {
              setDefult(item)
              setVisible(false)
            }} key={index} className={item.Price === defults.Price ? `${styles.list} ${styles.listSelect}` : styles.list}>
              <div className={styles.name}>{item.Price} DTV</div>
              <div className={styles.price}>POS: {item.Hashrate} </div>
            </div>)
          }
        </div>
      </Popup >
      <BottomNav initialTab='/pool' />
      <NewLoading show={show} />
      <CustomAlert visible={visible1} message={message} setVisible={setVisble1} />
    </div >
  );
}
