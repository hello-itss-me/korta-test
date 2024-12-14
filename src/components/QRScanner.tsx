import React, { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onResult: (result: string) => void;
  isScannerOpen: boolean;
  onClose: () => void;
}

export function QRScanner({ onResult, isScannerOpen, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          scannerRef.current = new QrScanner(
            videoRef.current,
            (result) => {
              onResult(result.data);
              onClose();
            },
            {
              preferredCamera: 'environment',
              maxScansPerSecond: 5,
              highlightScanRegion: true,
              returnDetailedScanResult: true,
              onDecodeError: (error) => {
                console.log('Ошибка декодирования:', error);
              }
            }
          );

          await scannerRef.current.start();
        } catch (error) {
          console.error('Ошибка запуска сканера:', error);
          if (error.name === 'NotAllowedError') {
            toast.error('Пожалуйста, разрешите доступ к камере');
          } else {
            toast.error('Ошибка при запуске сканера');
          }
          onClose();
        }
      }
    };

    const stopScanner = () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    if (isScannerOpen) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isScannerOpen, onResult, onClose]);

  return (
    <div className="qr-scanner-container">
      <video
        ref={videoRef}
        style={{
          width: '100%',
          maxWidth: '400px',
          display: isScannerOpen ? 'block' : 'none'
        }}
        playsInline
        muted
      />
    </div>
  );
}
