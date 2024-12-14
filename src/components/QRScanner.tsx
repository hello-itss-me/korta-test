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
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        return stream;
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        toast.error('Ошибка при запросе доступа к камере');
        return null;
      }
    };

    const startScanner = async () => {
      const stream = await requestCameraPermission();
      if (!stream || !videoRef.current) return;

      const config = { fps: 5, qrbox: 250 };
      const html5QrCode = new Html5Qrcode(videoRef.current, { formatsToSupport: [0] }, false);
      scannerRef.current = html5QrCode;

      setTimeout(async () => {
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
      }, 500); // Delay of 500ms
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
    <div style={{ width: '300px', height: '300px', position: 'relative', overflow: 'hidden' }}>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}
