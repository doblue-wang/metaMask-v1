// components/CustomAlert.tsx

import React, { useEffect } from 'react';
import { Modal } from 'antd-mobile';
import "./index.scss";
interface CustomAlertProps {
  visible: boolean; // 控制弹窗显示与隐藏
  message: string; // 弹窗的提示内容
  setVisible: Function
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, message, setVisible }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false)
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [visible]);
  return (
    <Modal
      className='mask'
      visible={visible}
      content={message}
    />
  );
};

export default CustomAlert;
