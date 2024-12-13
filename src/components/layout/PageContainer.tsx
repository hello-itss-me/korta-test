import React, { ReactNode } from 'react';

    interface PageContainerProps {
      children: ReactNode;
      title: string;
    }

    export function PageContainer({ children, title }: PageContainerProps) {
      return (
        <div className="container pb-20">
          <div className="card" style={{ maxWidth: '768px', margin: '0 auto' }}>
            <h1 className="text-2xl font-bold mb-6 text-gray-900">{title}</h1>
            {children}
          </div>
        </div>
      );
    }
