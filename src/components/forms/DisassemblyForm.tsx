import React, { useState } from 'react';
    import { FormField } from './FormField';
    import { supabase } from '../../lib/supabase';
    import { toast } from 'react-hot-toast';
    import { useProductData } from '../../hooks/useProductData';

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
          <FormField
            label="ID Электродвигателя"
            type="text"
            name="motorId"
            value={formData.motorId}
            onChange={handleChange}
            placeholder="Введите ID электродвигателя"
          />
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
          <button type="submit" className="submit-button" style={{
            boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
            width: '100%',
            height: '48px',
            borderRadius: '0.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer',
          }}>
            Отправить
          </button>
        </form>
      );
    }
