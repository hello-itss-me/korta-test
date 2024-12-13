import React, { useState, useEffect } from 'react';
import { FormField } from './FormField';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    positionEmployee: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          patronymic: data.patronymic || '',
          positionEmployee: data.position_employee || ''
        });
      }
    } catch (error) {
      toast.error('Ошибка при загрузке профиля');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { error } = await supabase
        .from('user')
        .upsert({
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          patronymic: formData.patronymic,
          position_employee: formData.positionEmployee
        });

      if (error) throw error;
      
      toast.success('Профиль успешно обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении профиля');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <FormField
        label="Имя"
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="Введите имя"
      />
      <FormField
        label="Фамилия"
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Введите фамилию"
      />
      <FormField
        label="Отчество"
        type="text"
        name="patronymic"
        value={formData.patronymic}
        onChange={handleChange}
        placeholder="Введите отчество"
      />
      <FormField
        label="Должность"
        type="text"
        name="positionEmployee"
        value={formData.positionEmployee}
        onChange={handleChange}
        placeholder="Введите должность"
      />
      <button type="submit" className="submit-button">
        Сохранить
      </button>
    </form>
  );
}
