import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { DisassemblyForm } from '../components/forms/DisassemblyForm';

export function DisassemblyPage() {
  return (
    <PageContainer title="Регистрация разборки электродвигателя">
      <DisassemblyForm />
    </PageContainer>
  );
}
