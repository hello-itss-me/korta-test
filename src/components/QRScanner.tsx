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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
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
      const html5QrCode = new Html5Qrcode('qr-reader', { formatsToSupport: [0] });
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
            if (videoRef.current && videoRef.current.srcObject) {
              const stream = videoRef.current.srcObject as MediaStream;
              const tracks = stream.getTracks();
              tracks.forEach(track => track.stop());
              videoRef.current.srcObject = null;
            }
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

  return (
    <div>
      <div id="qr-reader" style={{ width: '100%', display: isScannerOpen ? 'block' : 'none' }} />
      <video ref={videoRef} autoPlay playsInline muted style={{ display: isScannerOpen ? 'block' : 'none', width: '100%' }} />
    </div>
  );
}
