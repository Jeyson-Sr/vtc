import { useState, type ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />
      <main className="main">
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
