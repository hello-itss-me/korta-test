import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { TurningForm } from '../components/forms/TurningForm';

export function TurningPage() {
  return (
    <PageContainer title="Регистрация токарных работ">
      <TurningForm />
    </PageContainer>
  );
}
