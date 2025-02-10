import React from 'react';
// 导入你下载的 JSON 动画文件
import animationData from '../public/lottie/animation.json';
import Lottie from 'lottie-react';
import "./index.scss";
const PageLoading = () => {
  return <div className='lottie'>
    <Lottie animationData={animationData} loop={true} autoplay={true} style={{ width: '300px', height: '300px' }} />
  </div>;
};

export default PageLoading;
