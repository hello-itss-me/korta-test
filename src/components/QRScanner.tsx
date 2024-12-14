import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onResult: (result: string) => void;
  isScannerOpen: boolean;
  onClose: () => void;
}

export function QRScanner({ onResult, isScannerOpen, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraPermission, setCameraPermission] = useState(false);

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraPermission(true);
      } catch (err) {
        console.error('Camera permission denied:', err);
        toast.error('Необходимо разрешение на использование камеры');
        setCameraPermission(false);
      }
    };

    if (isScannerOpen) {
      checkCameraPermission();
    }
  }, [isScannerOpen]);

  useEffect(() => {
    const startScanner = async () => {
      if (!cameraPermission || !videoRef.current) return;

      const config = { fps: 5, qrbox: 250 };
      const html5QrCode = new Html5Qrcode(videoRef.current, { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] }, true);
      scannerRef.current = html5QrCode;

      try {
        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText: string) => {
            onResult(decodedText);
            stopScanner();
            onClose();
          },
          undefined
        );
        console.log('Scanner started successfully');
      } catch (error) {
        console.error('Failed to start scanner:', error);
        toast.error('Ошибка при запуске сканера');
      }
    };

    const stopScanner = () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          console.log('QR Scanner stopped.');
        }).catch((err: any) => {
          console.error('Error stopping scanner:', err);
        });
      }
    };

    if (isScannerOpen && cameraPermission) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [onResult, isScannerOpen, onClose, cameraPermission]);

  return (
    <div style={{ display: isScannerOpen ? 'block' : 'none', position: 'relative', width: '100%' }}>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}
