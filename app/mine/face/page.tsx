
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'antd-mobile'
import './index.scss';
import NavBar from '@/components/NavBar/page';
import Head from 'next/head';
import { UpdateAuthenticationStatus } from '@/api/home';
import CustomAlert from '@/components/Toast';
import { useRouter } from 'next/navigation';
export default function face () {
  const [isProcessing, setIsProcessing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);  // 使用 useRef 来存储定时器 ID
  const videoRef = useRef<HTMLVideoElement | null>(null); // 使用 ref 获取 video 元素
  const [visible1, setVisble1] = useState(false)
  const [message, setMessage] = useState('')
  const route = useRouter()
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
    script.defer = true;
    script.onload = () => {
      initialize(); // 确保 faceapi 加载完成后再初始化
    };
    document.head.appendChild(script);
    return () => {
      // 停止定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null; // 清除定时器引用
        console.log("计时器已停止");
      }
      console.log("摄像头已关闭");
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop()); // 停止所有轨道
      }
    };
  }, []);

  const UpdateAuthenticationStatuss = (IdentifyingData: any) => {
    const AccountId = localStorage.getItem('AccountId')
    UpdateAuthenticationStatus({ AccountId, IdentifyingData: IdentifyingData }).then(({ data, msg }) => {
      console.log(data, msg);
      if (data) {
        setVisble1(true)
        setMessage('人脸识别成功')
        setTimeout(() => {
          route.back
        }, 2000);
      } else {
        setVisble1(true)
        setMessage(msg)
      }
    })
      .catch((e) => {
        setVisble1(true)
        setMessage(e)
      });
  }



  const initialize = async () => {
    try {
      // 加载模型
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      // 启动摄像头
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const video = document.getElementById('video') as HTMLVideoElement;
      if (video) {
        video.srcObject = stream;
        // 启动检测循环
        video.addEventListener('play', () => {
          intervalRef.current = setInterval(async () => {
            if (!isProcessing) {
              setIsProcessing(true);
              await detectFace();
              setIsProcessing(false);
            }
          }, 1000);
        });
      }

      updateStatus("准备就绪");
    } catch (err: any) {
      console.log(err);

      updateStatus(`初始化失败: ${err.message}`, true);
    }
  };
  // 人脸检测
  const detectFace = async () => {
    const detection = await faceapi.detectSingleFace(
      document.getElementById('video') as HTMLVideoElement,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptor();

    const overlay = document.getElementById('overlay') as HTMLDivElement;
    if (detection) {
      if (overlay) overlay.style.borderColor = "#28a745";
      updateStatus("检测到有效人脸");
      return detection.descriptor;
    } else {
      if (overlay) overlay.style.borderColor = "#dc3545";
      updateStatus("等待人脸...");
      return null;
    }
  };
  // 状态更新
  const updateStatus = (text: string, isError = false) => {
    const statusEl = document.getElementById('status') as HTMLDivElement;
    if (statusEl) {
      statusEl.textContent = text;
      statusEl.style.color = isError ? "#dc3545" : "#28a745";
    }
  };
  // 用户注册
  const register = async () => {
    const descriptor = await detectFace();
    if (!descriptor) return;
    console.log(descriptor);
    const descriptorJson = JSON.stringify(descriptor);
    UpdateAuthenticationStatuss(descriptorJson)
    console.log(descriptorJson);
  };


  return <div className="face">
    <Head>
      {/* 引入外部cdn */}
      <script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js" defer></script>
    </Head>
    <NavBar title="活体认证" />
    <div className="video-box">
      <video ref={videoRef} id="video" className="video" autoPlay></video>
      <Image className="overlay" src="/mine/face.png" alt="" />
    </div>

    <div onClick={() => register()} className="button">
      开始识别
    </div>
    <div id="status">初始化中...</div>
    <CustomAlert visible={visible1} message={message} setVisible={setVisble1} />
  </div>
}