import React, { useState, useRef } from 'react';
    import { FormField } from './FormField';
    import { supabase } from '../../lib/supabase';
    import { toast } from 'react-hot-toast';
    import { useProductData } from '../../hooks/useProductData';
    import { Html5QrcodeScanner } from 'html5-qrcode';
    import { QrCode } from 'lucide-react';

    export function DisassemblyForm() {
      const [formData, setFormData] = useState({
        motorId: '',
        productName: '',
        contractor: '',
        employeeId: '',
        disassemblyDate: '',
        disassemblyTime: ''
      });
      const [scanning, setScanning] = useState(false);
      const scannerRef = useRef<Html5QrcodeScanner | null>(null);

      const { fetchProductData } = useProductData(setFormData);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

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

      const startScanning = () => {
        setScanning(true);
        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: 250 },
          /* verbose= */ false
        );
        scannerRef.current.render(onScanSuccess, onScanError);
      };

      const onScanSuccess = (decodedText: string) => {
        setFormData(prev => ({ ...prev, motorId: decodedText }));
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
        setScanning(false);
      };

      const onScanError = (errorMessage: string) => {
        console.warn(errorMessage);
      };

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
            <button type="button" onClick={startScanning} className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 active:bg-gray-400" title="Сканировать QR-код">
              <QrCode size={24} />
            </button>
          </div>
          {scanning && <div id="qr-reader" className="w-full h-64"></div>}
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
