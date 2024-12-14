import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface CameraManagerProps {
  onStreamReady: (stream: MediaStream) => void;
  isScannerOpen: boolean;
}

export function CameraManager({ onStreamReady, isScannerOpen }: CameraManagerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const requestCameraPermission = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        onStreamReady(mediaStream);
        setStream(mediaStream);
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        toast.error('Ошибка при запросе доступа к камере');
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };

    if (isScannerOpen) {
      requestCameraPermission();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [onStreamReady, isScannerOpen]);

  return <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block' }} />;
}
