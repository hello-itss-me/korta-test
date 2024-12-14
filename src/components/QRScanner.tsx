import React, { useRef } from 'react';
import { toast } from 'react-hot-toast';
import jsQR from 'jsqr';

interface QRScannerProps {
  onResult: (result: string) => void;
}

export function QRScanner({ onResult }: QRScannerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const imageData = e.target.result as string;
          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d');

            if (context) {
              context.drawImage(image, 0, 0);
              const imageData = context.getImageData(0, 0, image.width, image.height);
              const code = jsQR(imageData.data, image.width, image.height);

              if (code) {
                onResult(code.data);
              } else {
                toast.error('Не удалось распознать QR-код');
              }
            } else {
              toast.error('Не удалось получить контекст canvas');
            }
          };
          image.onerror = () => {
            toast.error('Ошибка при загрузке изображения');
          };
          image.src = imageData;
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
