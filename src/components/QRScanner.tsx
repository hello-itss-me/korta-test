import React, { useEffect, useRef, useState } from 'react';
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
  const [stream, setStream] = useState<MediaStream | null>(null);

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
      if (!stream) return;

      setStream(stream);

      const config = { fps: 5, qrbox: 250 };
      const html5QrCode = new Html5Qrcode('qr-reader', { formatsToSupport: [0] });
      scannerRef.current = html5QrCode;

      setTimeout(async () => {
        try {
          await html5QrCode.start(
            { facingMode: 'environment' },
            config,
            (decodedText: string) => {
              onResult(decodedText);
            },
            undefined
          );
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
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
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
    <div style={{ display: isScannerOpen ? 'block' : 'none', position: 'relative', width: '100%' }}>
      <div id="qr-reader" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }} />
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}
