import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onResult: (result: string) => void;
  isScannerOpen: boolean;
  onClose: () => void;
}

export function QRScanner({ onResult, isScannerOpen, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const checkCameraPermissions = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        if (!hasCamera) {
          toast.error('Камера не обнаружена');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error checking camera permissions:', error);
        toast.error('Ошибка при проверке разрешений камеры');
        return false;
      }
    };

    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
        return true;
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        toast.error('Ошибка при запросе доступа к камере');
        return false;
      }
    };

    const startScanner = async () => {
      const hasCamera = await checkCameraPermissions();
      if (!hasCamera) return;

      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const config = { fps: 5, qrbox: 250 };
      const html5QrCode = new Html5Qrcode('qr-reader', { formatsToSupport: [0] }); // Specify QR_CODE format
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
      } catch (error) {
        console.error('Failed to start scanner:', error);
        toast.error('Ошибка при запуске сканера');
      }
    };

    const stopScanner = () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            console.log('QR Scanner stopped.');
          })
          .catch((error) => {
            console.error('Failed to stop scanner:', error);
          });
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
  }, [onResult, isScannerOpen, onClose]);

  return <div id="qr-reader" style={{ width: '100%' }} />;
}
