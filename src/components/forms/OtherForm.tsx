import React, { useState } from 'react';
    import { FormField } from './FormField';
    import { supabase } from '../../lib/supabase';
    import { toast } from 'react-hot-toast';
    import { useProductData } from '../../hooks/useProductData';

    export function OtherForm() {
      const [formData, setFormData] = useState({
        motorId: '',
        productName: '',
        contractor: '',
        employeeId: '',
        workDate: '',
        workTime: '',
        workDescription: ''
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
          const { error } = await supabase.from('other_works').insert([{
            motor_id: parseInt(formData.motorId),
            employee_id: formData.employeeId,
            work_date: formData.workDate,
            work_time: formData.workTime,
            description: formData.workDescription
          }]);

          if (error) throw error;
          
          toast.success('Данные успешно сохранены');
          setFormData({
            motorId: '',
            productName: '',
            contractor: '',
            employeeId: '',
            workDate: '',
            workTime: '',
            workDescription: ''
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
            label="Дата работы"
            type="date"
            name="workDate"
            value={formData.workDate}
            onChange={handleChange}
          />
          <FormField
            label="Время работы"
            type="time"
            name="workTime"
            value={formData.workTime}
            onChange={handleChange}
          />
          <FormField
            label="Описание работы"
            type="text"
            name="workDescription"
            value={formData.workDescription}
            onChange={handleChange}
            placeholder="Введите описание работы"
          />
          <button type="submit" className="submit-button">
            Отправить
          </button>
        </form>
      );
    }
