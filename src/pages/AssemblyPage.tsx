import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { AssemblyForm } from '../components/forms/AssemblyForm';

export function AssemblyPage() {
  return (
    <PageContainer title="Регистрация сборки электродвигателя">
      <AssemblyForm />
    </PageContainer>
  );
}
