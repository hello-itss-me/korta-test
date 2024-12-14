import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onResult: (result: string) => void;
}

export function QRScanner({ onResult }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const readerDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScanning && readerDivRef.current) {
      const scanner = new Html5QrcodeScanner(
        readerDivRef.current,
        {
          qrbox: 250,
          fps: 5,
        },
        false
      );

      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;
    } else if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [isScanning]);

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const onScanSuccess = (decodedText: string) => {
    onResult(decodedText);
    stopScanning();
  };

  const onScanError = (errorMessage: string) => {
    console.warn(errorMessage);
    toast.error('Ошибка сканирования QR-кода');
  };

  return (
    <div>
      {!isScanning ? (
        <button onClick={startScanning} className="submit-button">
          Сканировать QR-код
        </button>
      ) : (
        <button onClick={stopScanning} className="submit-button">
          Остановить сканирование
        </button>
      )}
      <div ref={readerDivRef} style={{ display: isScanning ? 'block' : 'none' }} />
    </div>
  );
}
