'use client';
import CountUp from 'react-countup';
import './index.scss';
import { Image, Popup } from 'antd-mobile'
import BottomNav from '@/components/Tabbar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
export default function Mine () {
  const [show, setShow] = useState(false)
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
    i18n.changeLanguage(val.value); 
    setType(val.value)
    setShow(false)
  }
  return (
    <div className='mine'>
      <div className="userInfo">
        <div className="left">
          <Image className='avatr' src='/mine/idcard.png' fit='fill' />
          <div className="nameRow">
            <div className="top">
              <div className="name">{t('greeting')}</div>
              <div className="status">已认证</div>
              <div className="statusNomal">
                <img className='idcard' src="/mine/idcard.png" alt="" />
                未认证</div>
            </div>
            <div className="share">上级分享人0x4838***AD5f97</div>
          </div>
        </div>

        <div className="arrow"></div>
      </div>
      {/* 资产  */}
      <div className="assets">
        <div className="title">我的资产 </div>
        <div className="dtvrow">
          <div className="dtv">
            <div className="dtvimg">
              <img src="/mine/receives.png" alt="" />
              可领取DTV
              <img className='arrow' src="/mine/arrow.png" alt="" />
            </div>
            <div className="num">
              <CountUp start={0} end={138.23} duration={3} decimals={2} />
            </div>

          </div>
          <div className="dtv">
            <div className="dtvimg">
              <img src="/mine/exchange.png" alt="" />
              可兑换DTV
              <img className='arrow' src="/mine/arrow.png" alt="" />
            </div>
            <div className="num">
              <CountUp start={0} end={345342} duration={3} />
            </div>

          </div>
        </div>
      </div>
      {/* 算力 */}
      <div className="assets">
        <div className="title">我的算力 </div>
        <div className="dtvrow">
          <div className="dtv">
            <div className="pop">
              <div className="pointb"></div>
              POS
            </div>
            <div className="num">
              <CountUp start={0} end={138.23} duration={1} decimals={2} />
            </div>

          </div>
          <div className="dtv">
            <div className="pop">
              <div className="pointy"></div>
              POP
            </div>
            <div className="num">
              <CountUp start={0} end={345342} duration={1} />
            </div>

          </div>
        </div>
      </div>
      {/* nft */}
      <div className="assets">
        <div className="title">NFT资产</div>
        <div className="nftRow">
          <img className='nft' src="/mine/NFT.png" alt="" />
          <div className="namerow">
            <p>NFT</p>
            <span>铸造：2025-01-03</span>
          </div>
        </div>
      </div>
      {/* options */}
      <div className="container">
        <div className="mypool">
          <div className="optionLeft">
            <img className='icon' src="/mine/receives.png" alt="" />
            <div className="optionname">我的矿池</div>
          </div>
          <img className='arroww' src="/mine/arrow.png" alt="" />
        </div>

        <div className="mypool">
          <div className="optionLeft">
            <img className='icon' src="/mine/receives.png" alt="" />
            <div className="optionname">DETV账户绑定</div>
          </div>
          <img className='arroww' src="/mine/arrow.png" alt="" />
        </div>
        <div onClick={() => setShow(true)} className="mypool">
          <div className="optionLeft">
            <img className='icon' src="/mine/receives.png" alt="" />
            <div className="optionname">{t('aa')}</div>
          </div>
          <img className='arroww' src="/mine/arrow.png" alt="" />
        </div>
        <div className="mypool">
          <div className="optionLeft">
            <img className='icon' src="/mine/receives.png" alt="" />
            <div className="optionname">分享</div>
          </div>
          <img className='arroww' src="/mine/arrow.png" alt="" />
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
          <div className="tips">语言</div>
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