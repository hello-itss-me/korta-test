import React, { useState } from 'react';
    import { FormField } from './FormField';
    import { supabase } from '../../lib/supabase';
    import { toast } from 'react-hot-toast';
    import { useProductData } from '../../hooks/useProductData';
    import { QRScanner } from '../QRScanner';

    export function DisassemblyForm() {
      const [formData, setFormData] = useState({
        motorId: '',
        productName: '',
        contractor: '',
        employeeId: '',
        disassemblyDate: '',
        disassemblyTime: ''
      });

      const { fetchProductData } = useProductData(setFormData);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'motorId' && value) {
          fetchProductData(value);
        }
      };

      const handleScanResult = (result: string) => {
        const url = new URL(result);
        const id = url.searchParams.get('id');
        if (id) {
          setFormData(prev => ({ ...prev, motorId: id }));
          fetchProductData(id);
        } else {
          toast.error('Не удалось извлечь ID из QR-кода');
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

      return (
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">ID Электродвигателя</label>
            <div className="flex items-center">
              <input
                type="text"
                name="motorId"
                value={formData.motorId}
                onChange={handleChange}
                placeholder="Введите ID электродвигателя"
                className="flex-grow mr-2 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <QRScanner onResult={handleScanResult} />
            </div>
          </div>
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
