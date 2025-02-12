'use client';
import CountUp from 'react-countup';
import './index.scss';
import { Image, Popup } from 'antd-mobile'
import BottomNav from '@/components/Tabbar';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { MyInformationUploadImage, fetchGetMine } from '@/api/home';
import { title } from 'process';
export default function Mine () {
  useEffect(() => {
    document.title = `${t("我的")}`;
  }, []);
  const router = useRouter();
  const [show, setShow] = useState(false)
  const [source, setSource] = useState({} as any)
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [type, setType] = useState(i18n.language)
  const list = [
    {
      key: "English",
      value: 'en'
    },
    {
      key: "中文",
      value: 'zh'
    }
  ]
  const changeLanguage = (val: any) => {
    fetchLanguage(val.value)
    i18n.changeLanguage(val.value);
    setType(val.value)
    setShow(false)
  }
  useEffect(() => {
    console.log(i18n.language);

    fetchGetMineSource()
  }, [])
  //接口授权
  const fetchGetMineSource = async () => {
    const AccountId = localStorage.getItem('AccountId')
    fetchGetMine({ AccountId })
      .then(({ data }) => {
        setSource(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //语言
  const fetchLanguage = async (val: any) => {
    const AccountId = localStorage.getItem('AccountId')
    MyInformationUploadImage({ AccountId, Languages: val })
      .then(({ data }) => {
        (data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div className='mine'>
      <div className="userInfo" onClick={() => router.push('/mine/face')}>
        <div className="left">
          <Image lazy className='avatr' alt='' src={source?.AccountImg} fit='fill' />
          <div className="nameRow">
            <div className="top">
              <div className="name">{source?.AccountName || '--'}</div>
              {
                source?.AccountState === 1 ? <div className="status">{t('Face_Authentication.Face_Authenticated')}</div> : <div className="statusNomal">
                  <Image lazy className='idcard' src="/mine/idcard.png" alt="" />
                  {t('Face_Authentication.Face_Not_Authenticated')}</div>
              }
            </div>
            <div className="share">{t('上级分享人')}{source?.SuperiorSharer || '--'}</div>
          </div>
        </div>
        <div className="arrow"></div>
      </div>
      {/* 资产  */}
      <div className="assets">
        <div className="title">{t('MY_Assets')}</div>
        <div className="dtvrow">
          <div onClick={() => { router.push('/pool/receive') }} className="dtv">
            <div className="dtvimg">
              <img src="/mine/receives.png" alt="" />
              {t('My_Assets.Redeemable')}DTV
              <img className='arrow' src="/mine/arrow.png" alt="" />
            </div>
            <div className="num">
              <CountUp start={0} end={source?.PendingRewardsDTV || 0} duration={3} decimals={2} />
            </div>
          </div>
          <div onClick={() => { router.push('/pool/exchange') }} className="dtv">
            <div className="dtvimg">
              <img src="/mine/exchange.png" alt="" />
              {t('My_Assets.Exchangeable')}DTV
              <img className='arrow' src="/mine/arrow.png" alt="" />
            </div>
            <div className="num">
              <CountUp start={0} end={source?.PendingRewardsDTV || 0} duration={3} decimals={2} />
            </div>
          </div>
        </div>
      </div>
      {/* 算力 */}
      <div className="assets">
        <div className="title">{t('My_Hashrate')} </div>
        <div className="dtvrow">
          <div className="dtv">
            <div className="pop">
              <div className="pointb"></div>
              POS
            </div>
            <div className="num">
              <CountUp start={0} end={source?.MyHashrate || 0} duration={1} decimals={2} />
            </div>
          </div>
          <div className="dtv">
            <div className="pop">
              <div className="pointy"></div>
              POP
            </div>
            <div className="num">
              <CountUp start={0} end={source?.MyPop || 0} duration={1} decimals={2} />
            </div>
          </div>
        </div>
      </div>
      {/* nft */}
      <div className="assets">
        <div className="title">{t('NFT_Assets')}</div>
        <div className="nftRow">
          <Image lazy className={source?.IsCastingNFT > 0 ? 'nft' : "nft_no"} src="/mine/NFT.png" alt="" />
          <div className="namerow">
            <p>NFT</p>
            {
              source?.IsCastingNFT > 0 ?
                <>
                  {
                    (() => {
                      const timestamp = source?.CastingDateTime; // 假设是一个时间戳
                      const date = new Date(timestamp); // 将时间戳转为 Date 对象
                      // 格式化为可读的日期格式
                      const formattedDate = date.toLocaleString();
                      return <span>{t('Staking_Redemption_Minting.Minting')}：{formattedDate}</span>
                    })()
                  }
                </>
                : null
            }
          </div>
        </div>
      </div>
      {/* options */}
      <div className="container">
        <div className="mypool" onClick={() => router.push('/mine/myPool')}>
          <div className="optionLeft" >
            <Image lazy className='icon' src="/mine/my.png" alt="" />
            <div className="optionname">{t('My_Mining_Pool')}</div>
          </div>
          <Image lazy className='arroww' src="/mine/arrow.png" alt="" />
        </div>

        <div className="mypool">
          <div className="optionLeft">
            <Image lazy className='icon' src="/mine/detv.png" alt="" />
            <div className="optionname">{t('DETV_Account_Binding')}</div>
          </div>
          <Image lazy className='arroww' src="/mine/arrow.png" alt="" />
        </div>
        <div onClick={() => setShow(true)} className="mypool">
          <div className="optionLeft">
            <Image lazy className='icon' src="/mine/lunage.png" alt="" />
            <div className="optionname">{t('Language')}</div>
          </div>
          <Image lazy className='arroww' src="/mine/arrow.png" alt="" />
        </div>
        <div className="mypool" onClick={() => router.push('/mine/myShare')}>
          <div className="optionLeft">
            <Image lazy className='icon' src="/mine/shareicon.png" alt="" />
            <div className="optionname">{t('Share')}</div>
          </div>
          <Image lazy className='arroww' src="/mine/arrow.png" alt="" />
        </div>
      </div>
      <BottomNav initialTab='/mine' />
      <Popup
        visible={show}
        onMaskClick={() => setShow(false)}
        bodyStyle={{
          background: "transparent"
        }}
      >
        <div className="language">
          <div className="tips">{t('Language')}</div>
          {
            list.map((item) => <div onClick={() => changeLanguage(item)} key={item.value} className={
              item.value === type ? 'lunItemActive' : 'lunItem'
            }>{item.key}</div>)
          }
        </div>
      </Popup>
    </div>
  );
}