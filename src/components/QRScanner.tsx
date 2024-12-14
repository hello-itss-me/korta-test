import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onResult: (result: string) => void;
  isScannerOpen: boolean;
  onClose: () => void;
}

export function QRScanner({ onResult, isScannerOpen, onClose }: QRScannerProps) {
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isScannerOpen && videoRef.current) {
      const startScanner = async () => {
        try {
          const hasPermission = await navigator.mediaDevices.getUserMedia({ video: true });
          if (!hasPermission) {
            toast.error('Необходимо разрешение на использование камеры');
            onClose();
            return;
          }

          codeReaderRef.current = new BrowserQRCodeReader();
          const result = await codeReaderRef.current.decodeFromVideoDevice(undefined, videoRef.current);
          onResult(result.getText());
          onClose();
        } catch (error) {
          console.error('Ошибка при сканировании:', error);
          toast.error('Ошибка при сканировании QR-кода');
          onClose();
        }
      };

      startScanner();
    }

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
        codeReaderRef.current = null;
      }
    };
  }, [isScannerOpen, onResult, onClose]);

  return (
    <div style={{ display: isScannerOpen ? 'block' : 'none' }}>
      <video ref={videoRef} width="300" height="200" style={{ border: '1px solid gray' }} />
    </div>
  );
}
