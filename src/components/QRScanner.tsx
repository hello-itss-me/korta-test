import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

export function QRScanner({ onResult, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
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

    startScanner();

    return () => {
      stopScanner();
    };
  }, [onResult, onClose]);

  return <div id="qr-reader" style={{ width: '100%' }} />;
}
