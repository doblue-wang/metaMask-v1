
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'antd-mobile'
import './index.scss';
import NavBar from '@/components/NavBar/page';
import Head from 'next/head';
export default function face () {
  const [isProcessing, setIsProcessing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);  // 使用 useRef 来存储定时器 ID

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
      // 停止摄像头流
      const videoElement = document.getElementById('video') as HTMLVideoElement;
      if (videoElement) {
        const stream = videoElement.srcObject as MediaStream;
        const tracks = stream?.getTracks() as any;
        tracks.forEach((track: any) => track.stop()); // 停止所有轨道
        console.log("摄像头已关闭");
      }
    };
  }, []);

  const initialize = async () => {
    try {
      // 加载模型
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      // 启动摄像头
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
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

    const userId = prompt("请输入用户ID:");
    if (!userId) return;

    // 存储到IndexedDB
    const db = await openDatabase() as any;
    await db.put('users', {
      id: userId,
      descriptor: Array.from(descriptor)
    });

    updateStatus(`用户 ${userId} 注册成功`);
  };

  // 用户登录
  const login = async () => {
    const currentDescriptor = await detectFace();
    if (!currentDescriptor) return;

    const db = await openDatabase() as any;
    const users = await db.getAll('users');

    for (const user of users) {
      const distance = faceapi.euclideanDistance(
        new Float32Array(user.descriptor),
        currentDescriptor
      );

      if (distance < 0.6) {
        updateStatus(`欢迎回来，${user.id}！`);
        return;
      }
    }

    updateStatus("未找到匹配用户", true);
  };
  // IndexedDB封装
  const openDatabase = () => {
    return new Promise((resolve) => {
      const request = indexedDB.open('FaceAuthDB', 1);
      request.onupgradeneeded = (event: any) => {
        if (event.target) {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('users')) {
            db.createObjectStore('users', { keyPath: 'id' });
          }
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        resolve({
          put: (storeName: any, data: any) => {
            return new Promise((res) => {
              const tx = db.transaction(storeName, 'readwrite');
              tx.objectStore(storeName).put(data);
              tx.oncomplete = res;
            });
          },
          getAll: (storeName: any) => {
            return new Promise((res) => {
              const tx = db.transaction(storeName, 'readonly');
              tx.objectStore(storeName).getAll().onsuccess = (e: any) => res(e.target.result);
            });
          }
        });
      };
    });
  };

  return <div className="face">
    <Head>
      {/* 引入外部cdn */}
      <script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js" defer></script>
    </Head>
    <NavBar title="活体认证" />
    <div className="video-box">
      <video id="video" className="video" autoPlay></video>
      <Image className="overlay" src="/mine/face.png" alt="" />
    </div>

    <div onClick={() => register()} className="button">
      注册用户
    </div>
    <div id="status">初始化中...</div>
  </div>
}