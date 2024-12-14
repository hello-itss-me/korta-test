import React, { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

export function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast.error('Ошибка доступа к камере');
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop the camera stream when the component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
}
