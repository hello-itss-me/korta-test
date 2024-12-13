import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ProfileForm } from '../components/forms/ProfileForm';

export function ProfilePage() {
  return (
    <PageContainer title="Профиль">
      <ProfileForm />
    </PageContainer>
  );
}
