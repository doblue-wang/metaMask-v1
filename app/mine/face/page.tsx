'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'antd-mobile';
import './index.scss';
import NavBar from '@/components/NavBar/page';
import Head from 'next/head';
import { UpdateAuthenticationStatus } from '@/api/home';
import CustomAlert from '@/components/Toast';
import { useRouter } from 'next/navigation';
import { t } from "i18next";
export default function Face () {
  const [isProcessing, setIsProcessing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visible1, setVisible1] = useState(false);
  const [message, setMessage] = useState('');
  const route = useRouter();
  const isMountedRef = useRef(false);
  const handlePlayRef = useRef<(() => void) | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // 用于保存摄像头流
  const [face, setFace] = useState(false);
  useEffect(() => {
    isMountedRef.current = true;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
    script.defer = true;
    script.onload = () => {
      initialize();
    };
    document.head.appendChild(script);

    return () => {
      isMountedRef.current = false;

      // 清理定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // 移除事件监听器
      if (videoRef.current && handlePlayRef.current) {
        videoRef.current.removeEventListener('play', handlePlayRef.current);
      }

      // **先清空 video 的 srcObject**
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // **确保摄像头流正确关闭**
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          streamRef.current?.removeTrack(track); // 确保移除轨道
        });
        streamRef.current = null;
      }
    };
  }, []);


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const initialize = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

      // 启动摄像头
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      streamRef.current = stream; // 保存摄像头流

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const video = videoRef.current;
      if (video) {
        const handlePlay = () => {
          intervalRef.current = setInterval(async () => {
            if (!isMountedRef.current) return;
            if (!isProcessing) {
              setIsProcessing(true);
              await detectFace();
              setIsProcessing(false);
            }
          }, 1000);
        };
        video.addEventListener('play', handlePlay);
        handlePlayRef.current = handlePlay;
      }

      updateStatus('准备就绪');
    } catch (err: any) {
      console.error('初始化失败:', err);
      updateStatus(`初始化失败: ${err.message}`, true);
    }
  };

  const detectFace = async () => {
    if (!isMountedRef.current || !videoRef.current) return null;

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      const overlay = document.getElementById('overlay') as HTMLDivElement;
      if (detection) {
        if (overlay) overlay.style.borderColor = '#28a745';
        updateStatus('检测到有效人脸');
        setFace(true)
        return detection.descriptor;
      } else {
        if (overlay) overlay.style.borderColor = '#dc3545';
        updateStatus('等待人脸...');
        setFace(false)
        return null;
      }
    } catch (err) {
      if (!isMountedRef.current) return null;
      console.error('人脸检测失败:', err);
      return null;
    }
  };

  const updateStatus = (text: string, isError = false) => {
    const statusEl = document.getElementById('status') as HTMLDivElement;
    if (statusEl) {
      statusEl.textContent = text;
      statusEl.style.color = isError ? '#dc3545' : '#28a745';
    }
  };
  const register = async () => {
    if (!face) {
      setVisible1(true);
      const ms = t('未识别到有效人脸')
      setMessage(ms)
      return
    }
    const descriptor = await detectFace();
    if (!descriptor) return;
    const descriptorJson = JSON.stringify(descriptor);
    UpdateAuthenticationStatuss(descriptorJson);
  };

  const UpdateAuthenticationStatuss = (IdentifyingData: any) => {
    const AccountId = localStorage.getItem('AccountId');
    UpdateAuthenticationStatus({ AccountId, IdentifyingData })
      .then(({ data, msg }) => {
        if (data) {
          setVisible1(true);
          const ms = t('人脸识别成功')
          setMessage(ms)
          setTimeout(() => {
            route.back(); // 返回上一页
          }, 2000);
        } else {
          setVisible1(true);
          setMessage(msg);
        }
      })
      .catch((e) => {
        setVisible1(true);
        setMessage(e);
      });
  };

  return (
    <div className="face">
      <Head>
        <script
          src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"
          defer
        ></script>
      </Head>
      <NavBar title={t('活体认证')} />
      <div className="video-box">
        <video
          playsInline
          ref={videoRef}
          id="video"
          className="video"
          autoPlay
        ></video>
        <Image lazy className="overlay" src="/mine/face.png" alt="" />
      </div>

      <div onClick={() => register()} className="button">
        {t('开始识别')}
      </div>
      {/* <div id="status">初始化中...</div> */}
      <CustomAlert visible={visible1} message={message} setVisible={setVisible1} />
    </div>
  );
}