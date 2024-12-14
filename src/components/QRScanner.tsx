import React, { useState, useRef, LegacyRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onResult: (result: string) => void;
  isScannerOpen: boolean;
  onClose: () => void;
}

export function QRScanner({ onResult, isScannerOpen, onClose }: QRScannerProps) {
  const qrReaderRef = useRef<QrReader>(null);

  const handleScan = (data: string | null) => {
    if (data) {
      onResult(data);
      onClose();
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    toast.error('Ошибка сканирования QR-кода');
  };

  return (
    <div style={{ display: isScannerOpen ? 'block' : 'none' }}>
      <QrReader
        ref={qrReaderRef as LegacyRef<QrReader>}
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
    </div>
  );
}
