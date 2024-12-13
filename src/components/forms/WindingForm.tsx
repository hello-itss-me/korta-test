import React, { useState } from 'react';
import { FormField } from './FormField';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useProductData } from '../../hooks/useProductData';

export function WindingForm() {
  const [formData, setFormData] = useState({
    motorId: '',
    productName: '',
    contractor: '',
    employeeId: '',
    windingDate: '',
    windingTime: '',
    wireConsumption: '',
    stickQuantity: ''
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
      const { error } = await supabase.from('motor_winding').insert([{
        motor_id: parseInt(formData.motorId),
        employee_id: formData.employeeId,
        winding_date: formData.windingDate,
        winding_time: formData.windingTime,
        wire_consumption: formData.wireConsumption,
        stick_quantity: formData.stickQuantity
      }]);

      if (error) throw error;
      
      toast.success('Данные успешно сохранены');
      setFormData({
        motorId: '',
        productName: '',
        contractor: '',
        employeeId: '',
        windingDate: '',
        windingTime: '',
        wireConsumption: '',
        stickQuantity: ''
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
        label="Дата Обмотки"
        type="date"
        name="windingDate"
        value={formData.windingDate}
        onChange={handleChange}
      />
      <FormField
        label="Время Обмотки"
        type="time"
        name="windingTime"
        value={formData.windingTime}
        onChange={handleChange}
      />
      <FormField
        label="Расход провода"
        type="text"
        name="wireConsumption"
        value={formData.wireConsumption}
        onChange={handleChange}
        placeholder="Введите расход провода"
      />
      <FormField
        label="Количество палочек"
        type="number"
        name="stickQuantity"
        value={formData.stickQuantity}
        onChange={handleChange}
        placeholder="Введите количество палочек"
      />
      <button type="submit" className="submit-button">
        Отправить
      </button>
    </form>
  );
}
