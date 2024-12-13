import { Dispatch, SetStateAction } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function useProductData(setFormData: Dispatch<SetStateAction<any>>) {
  const fetchProductData = async (motorId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_data')
        .select('name, contractor')
        .eq('id', parseInt(motorId))
        .single();

      if (error) throw error;

      if (data) {
        setFormData(prev => ({
          ...prev,
          productName: data.name,
          contractor: data.contractor
        }));
      }
    } catch (error) {
      toast.error('Ошибка при получении данных продукта');
    }
  };

  return { fetchProductData };
}
