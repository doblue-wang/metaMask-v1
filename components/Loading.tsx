

// components/CustomAlert.tsx

import React from 'react';
import { Mask, SpinLoading } from 'antd-mobile';
import "./index.scss";
interface CustomAlertProps {
  show: boolean; // 控制弹窗显示与隐藏
}

const NewLoading: React.FC<CustomAlertProps> = ({ show }) => {
  return (
    <Mask visible={show} >
      <SpinLoading className='loading' style={{
        "--color": 'rgba(239, 90, 128, 1)'
      }} />
    </Mask>
  );
};

export default NewLoading;
