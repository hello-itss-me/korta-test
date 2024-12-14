import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'react-hot-toast';
import { CameraManager } from './CameraManager';

interface QRScannerProps {
  onResult: (result: string) => void;
  isScannerOpen: boolean;
  onClose: () => void;
}

export function QRScanner({ onResult, isScannerOpen, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleStreamReady = (stream: MediaStream) => {
    setStream(stream);
  };

  useEffect(() => {
    const startScanner = async () => {
      if (!stream) return;

      const config = { fps: 5, qrbox: 250 };
      const html5QrCode = new Html5Qrcode('qr-reader', { formatsToSupport: [0] });
      scannerRef.current = html5QrCode;

      setTimeout(async () => {
        try {
          await html5QrCode.start(
            { stream: stream },
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
      }, 500); // Delay of 500ms
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

    if (isScannerOpen && stream) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [onResult, isScannerOpen, onClose, stream]);

  return (
    <div style={{ display: isScannerOpen ? 'block' : 'none', position: 'relative', width: '100%' }}>
      <CameraManager onStreamReady={handleStreamReady} isScannerOpen={isScannerOpen} />
      <div id="qr-reader" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }} />
    </div>
  );
}
