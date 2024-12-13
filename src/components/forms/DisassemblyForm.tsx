import React, { useState, useRef, useEffect } from 'react';
import { FormField } from './FormField';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useProductData } from '../../hooks/useProductData';
import { QrCode, XCircle } from 'lucide-react';
import { BrowserQRCodeReader } from '@zxing/browser';

const codeReader = new BrowserQRCodeReader();

export function DisassemblyForm() {
  const [formData, setFormData] = useState({
    motorId: '',
    productName: '',
    contractor: '',
    employeeId: '',
    disassemblyDate: '',
    disassemblyTime: ''
  });
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const { fetchProductData } = useProductData(setFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(function (prev) { return { ...prev, [name]: value }; });

    if (name === 'motorId' && value) {
      fetchProductData(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('motor_disassembly').insert([{
        motor_id: parseInt(formData.motorId),
        employee_id: formData.employeeId,
        disassembly_date: formData.disassemblyDate,
        disassembly_time: formData.disassemblyTime
      }]);

      if (error) throw error;

      toast.success('Данные успешно сохранены');
      setFormData({
        motorId: '',
        productName: '',
        contractor: '',
        employeeId: '',
        disassemblyDate: '',
        disassemblyTime: ''
      });
    } catch (error) {
      toast.error('Ошибка при сохранении данных');
    }
  };

  const handleScan = () => {
    setShowScanner(true);
    setScanning(true);
  };

  const onScanSuccess = (result: any) => {
    if (result) {
      try {
        const url = new URL(result.text);
        const searchParams = new URLSearchParams(url.search);
        const id = searchParams.get('id');

        if (id) {
          setFormData(function (prev) { return { ...prev, motorId: id }; });
          toast.success('QR код успешно отсканирован');
        } else {
          toast.error('QR код не содержит ID');
        }
      } catch (error) {
        toast.error('Неверный формат QR кода');
      } finally {
        setShowScanner(false);
        setScanning(false);
        codeReader.reset();
      }
    }
  };

  const onScanFailure = (error: any) => {
    console.error('QR code scan failed:', error);
    toast.error('Ошибка при сканировании QR кода');
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setScanning(false);
    codeReader.reset();
  };

  useEffect(() => {
    let selectedDeviceId: string | undefined;
  
    if (showScanner) {
      // Get a list of available cameras
      codeReader.listVideoInputDevices()
        .then((videoInputDevices) => {
          // Try to find a rear-facing camera
          const rearCamera = videoInputDevices.find(device => device.label.toLowerCase().includes('back'));
          selectedDeviceId = rearCamera ? rearCamera.deviceId : videoInputDevices[0]?.deviceId;
  
          // Start scanning with the selected camera
          if (selectedDeviceId) {
            codeReader.decodeFromVideoDevice(selectedDeviceId, 'qr-reader', (result, error, controls) => {
              if (result) {
                onScanSuccess(result);
              }
              if (error) {
                // Only log the error if it's not a NotFoundException
                if (error.name !== 'NotFoundException') {
                  onScanFailure(error);
                }
              }
            });
          } else {
            toast.error('Не найдено ни одной камеры');
            setShowScanner(false);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error('Не удалось получить список камер');
          setShowScanner(false);
        });
    }
  
    return () => {
      codeReader.reset();
    };
  }, [showScanner]);

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="flex items-center space-x-2">
        <FormField
          label="ID Электродвигателя"
          type="text"
          name="motorId"
          value={formData.motorId}
          onChange={handleChange}
          placeholder="Введите ID электродвигателя"
        />
        <button type="button" onClick={handleScan} className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-colors">
          <QrCode size={24} />
        </button>
      </div>
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="scanner-container bg-white p-4 rounded-lg relative">
            <div id="qr-reader" className="w-full" style={{ minWidth: '300px', minHeight: '300px' }}></div>
            <button
              type="button"
              onClick={handleCloseScanner}
              className="absolute top-2 right-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>
      )}
      <FormField
        label="Название товара"
        type="text"
        name="productName"
        value={formData.productName}
        onChange={handleChange}
        placeholder="Введите ID Электродвигателя в строке выше"
        disabled
      />
      <FormField
        label="Контрагент"
        type="text"
        name="contractor"
        value={formData.contractor}
        onChange={handleChange}
        placeholder="Заполнится при вводе ID электродвигателя"
        disabled
      />
      <FormField
        label="ID Сотрудника"
        type="text"
        name="employeeId"
        value={formData.employeeId}
        onChange={handleChange}
        placeholder="Введите ID сотрудника"
      />
      <FormField
        label="Дата Разборки"
        type="date"
        name="disassemblyDate"
        value={formData.disassemblyDate}
        onChange={handleChange}
      />
      <FormField
        label="Время Разборки"
        type="time"
        name="disassemblyTime"
        value={formData.disassemblyTime}
        onChange={handleChange}
      />
      <button type="submit" className="submit-button">
        Отправить
      </button>
    </form>
  );
}
