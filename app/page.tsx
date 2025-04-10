import { Dashboard } from '@/components/dashboard';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
