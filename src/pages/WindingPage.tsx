import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { WindingForm } from '../components/forms/WindingForm';

export function WindingPage() {
  return (
    <PageContainer title="Регистрация обмотки электродвигателя">
      <WindingForm />
    </PageContainer>
  );
}
