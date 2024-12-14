import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onResult: (result: string) => void;
  isScannerOpen: boolean;
  onClose: () => void;
}

export function QRScanner({ onResult, isScannerOpen, onClose }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (isScannerOpen && videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        result => {
          onResult(result.data);
          stopScanning();
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
      startScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isScannerOpen, onResult, onClose]);

  const startScanning = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.start();
        setScanning(true);
      }
    } catch (error) {
      console.error('Ошибка запуска сканера:', error);
      if ((error as Error).name === 'NotAllowedError') {
        alert('Пожалуйста, разрешите доступ к камере');
      }
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
      setScanning(false);
    }
  };

  return (
    <div className="qr-scanner-container" style={{ display: isScannerOpen ? 'block' : 'none' }}>
      <video
        ref={videoRef}
        style={{
          width: '100%',
          maxWidth: '400px',
          display: scanning ? 'block' : 'none'
        }}
        playsInline
        autoPlay
        muted
      />
    </div>
  );
};
