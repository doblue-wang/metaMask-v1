import React, { useState, useEffect } from 'react';
// 导入你下载的 JSON 动画文件
import animationData from '../public/lottie/dtv.json';
import Lottie from 'lottie-react';
import "./index.scss";

const PageLoading = () => {
  return (
    <div className='lottie'>
      <Lottie animationData={animationData} loop={true} autoplay={true} style={{ width: '300px', height: '300px' }} />
      <div className="detv">
        <div>D</div>
        <div>e</div>
        <div>t</div>
        <div>v.</div>
      </div>
    </div>
  );
};

export default PageLoading;
