import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { OtherForm } from '../components/forms/OtherForm';

export function OtherPage() {
  return (
    <PageContainer title="Регистрация прочих работ">
      <OtherForm />
    </PageContainer>
  );
}
