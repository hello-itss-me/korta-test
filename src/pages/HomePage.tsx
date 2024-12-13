import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';

export function HomePage() {
  return (
    <PageContainer title="Главная">
      <div className="text-center">
        <h2 className="text-lg font-medium mb-4">Добро пожаловать в систему учета работ</h2>
        <p className="text-gray-600">Выберите тип работы в меню навигации</p>
      </div>
    </PageContainer>
  );
}
