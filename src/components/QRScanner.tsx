import React, { useRef } from 'react';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onImageSelected: (imageData: string) => void;
}

export function QRScanner({ onImageSelected }: QRScannerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const imageData = e.target.result as string;
          onImageSelected(imageData);
        }
      };

      reader.onerror = () => {
        toast.error('Ошибка при чтении файла');
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button type="button" onClick={handleClick} className="submit-button">
        Сканировать QR
      </button>
    </div>
  );
}
