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
  const readerId = 'qr-reader';

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        toast.error('Ошибка при запросе доступа к камере');
        return false;
      }
    };

    const startScanner = async () => {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const config = { fps: 5, qrbox: 250 };
      const html5QrCode = new Html5Qrcode(readerId, { formatsToSupport: [0] });
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
        scannerRef.current.stop()
          .then(() => {
            console.log('QR Scanner stopped.');
            scannerRef.current = null;
          })
          .catch((error) => {
            console.error('Failed to stop scanner:', error);
          });
      }
    };

    if (isScannerOpen) {
      const timeoutId = setTimeout(startScanner, 300); // Delay start
      return () => {
        clearTimeout(timeoutId);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [isScannerOpen, onResult, onClose]);

  return <div id={readerId} style={{ width: '100%' }} />;
}
