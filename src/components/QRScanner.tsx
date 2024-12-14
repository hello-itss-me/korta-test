import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onResult: (result: string) => void;
  isScannerOpen: boolean;
  onClose: () => void;
}

export function QRScanner({ onResult, isScannerOpen, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const readerDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScannerOpen && readerDivRef.current) {
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
  }, [isScannerOpen]);


  const onScanSuccess = (decodedText: string) => {
    onResult(decodedText);
    onClose();
  };

  const onScanError = (errorMessage: string) => {
    console.warn(errorMessage);
    toast.error('Ошибка сканирования QR-кода');
  };

  return (
    <div ref={readerDivRef} style={{ display: isScannerOpen ? 'block' : 'none' }} />
  );
}
