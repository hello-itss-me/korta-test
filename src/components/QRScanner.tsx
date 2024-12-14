import { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onResult: (result: string) => void;
  isScannerOpen: boolean;
  onClose: () => void;
}

const QRScanner = ({ onResult, isScannerOpen, onClose }: QRScannerProps) => {
  const [result, setResult] = useState(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    // Инициализация сканера
    if (isScannerOpen && videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          setResult(result.data);
          onResult(result.data);
          onClose();
        },
        {
          // Специфичные настройки для iOS
          preferredCamera: 'environment', // Задняя камера
          maxScansPerSecond: 5,
          highlightScanRegion: true,
          returnDetailedScanResult: true,
          
          // Обработка ошибок
          onDecodeError: (error) => {
            console.log('Ошибка декодирования:', error);
          }
        }
      );
    }

    return () => {
      // Очистка при размонтировании
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }
    };
  }, [isScannerOpen, onResult, onClose]);

  useEffect(() => {
    const startScanning = async () => {
      try {
        if (scannerRef.current) {
          await scannerRef.current.start();
        }
      } catch (error) {
        console.error('Ошибка запуска сканера:', error);
        
        // Расширенная диагностика
        if (error.name === 'NotAllowedError') {
          alert('Пожалуйста, разрешите доступ к камере');
        }
      }
    };

    if (isScannerOpen) {
      startScanning();
    }
  }, [isScannerOpen]);

  return (
    <div className="qr-scanner-container">
      {/* Видео-элемент для сканирования */}
      <video 
        ref={videoRef} 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          display: isScannerOpen ? 'block' : 'none' 
        }}
      />

      {/* Результат сканирования */}
      {result && (
        <div className="scan-result">
          <p>Результат: {result}</p>
          <button onClick={() => setResult(null)}>
            Сканировать снова
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
