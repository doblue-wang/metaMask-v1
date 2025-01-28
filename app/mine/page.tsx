'use client';
import CountUp from 'react-countup';
import './index.scss';
import { Image, Popup } from 'antd-mobile'
import BottomNav from '@/components/Tabbar';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { MyInformationUploadImage, fetchGetMine } from '@/api/home';
import { getCookie } from '@/utils/utils';
export default function Mine () {
  const router = useRouter();
  const [show, setShow] = useState(false)
  const [source, setSource] = useState({} as any)
  const [type, setType] = useState('en')
  const { i18n } = useTranslation();
  const { t } = useTranslation();
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
    fetchGetMineSource()
  }, [])


  //接口授权
  const fetchGetMineSource = async () => {
    fetchGetMine({ AccountId: getCookie('AccountId') })
      .then(({ data }) => {
        setSource(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //语言
  const fetchLanguage = async (val: any) => {
    MyInformationUploadImage({ AccountId: getCookie('AccountId'), Languages: val })
      .then(({ data }) => {
        (data);
      })
      .catch((e) => {
        console.log(e);
      });
  };



  return (
    <div className='mine'>
      <div className="userInfo">
        <div className="left">
          <Image className='avatr' alt='' src='/mine/idcard.png' fit='fill' />
          <div className="nameRow">
            <div className="top">
              <div className="name">{source?.AccountName || '--'}</div>
              <div className="status">{t('Face_Authentication.Face_Authenticated')}</div>
              <div className="statusNomal">
                <Image className='idcard' src="/mine/idcard.png" alt="" />
                {t('Face_Authentication.Face_Not_Authenticated')}</div>
            </div>
            <div className="share">上级分享人{source?.SuperiorSharer || '--'}</div>
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
              <Image src="/mine/receives.png" alt="" />
              {t('My_Assets.Redeemable')}DTV
              <Image className='arrow' src="/mine/arrow.png" alt="" />
            </div>
            <div className="num">
              <CountUp start={0} end={source?.PendingRewardsDTV || 0} duration={3} decimals={2} />
            </div>

          </div>
          <div onClick={() => { router.push('/pool/exchange') }} className="dtv">
            <div className="dtvimg">
              <Image src="/mine/exchange.png" alt="" />
              {t('My_Assets.Exchangeable')}DTV
              <Image className='arrow' src="/mine/arrow.png" alt="" />
            </div>
            <div className="num">
              <CountUp start={0} end={source?.PendingRewardsDTV || 0} duration={3} />
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
              <CountUp start={0} end={source?.MyPop || 0} duration={1} />
            </div>

          </div>
        </div>
      </div>
      {/* nft */}
      <div className="assets">
        <div className="title">{t('NFT_Assets')}</div>
        <div className="nftRow">
          <Image className='nft' src="/mine/NFT.png" alt="" />
          <div className="namerow">
            <p>NFT</p>
            {
              source?.IsCastingNFT > 0 ? <span>{t('Staking_Redemption_Minting.Minting')}：{source?.CastingDateTime}</span> : null
            }

          </div>
        </div>
      </div>
      {/* options */}
      <div className="container">
        <div className="mypool" onClick={() => router.push('/mine/myPool')}>
          <div className="optionLeft" >
            <Image className='icon' src="/mine/receives.png" alt="" />
            <div className="optionname">{t('My_Mining_Pool')}</div>
          </div>
          <Image className='arroww' src="/mine/arrow.png" alt="" />
        </div>

        <div className="mypool">
          <div className="optionLeft">
            <Image className='icon' src="/mine/receives.png" alt="" />
            <div className="optionname">{t('DETV_Account_Binding')}</div>
          </div>
          <Image className='arroww' src="/mine/arrow.png" alt="" />
        </div>
        <div onClick={() => setShow(true)} className="mypool">
          <div className="optionLeft">
            <Image className='icon' src="/mine/receives.png" alt="" />
            <div className="optionname">{t('Language')}</div>
          </div>
          <Image className='arroww' src="/mine/arrow.png" alt="" />
        </div>
        <div className="mypool" onClick={() => router.push('/mine/myShare')}>
          <div className="optionLeft">
            <Image className='icon' src="/mine/receives.png" alt="" />
            <div className="optionname">{t('Share')}</div>
          </div>
          <Image className='arroww' src="/mine/arrow.png" alt="" />
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