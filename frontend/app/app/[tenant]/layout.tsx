'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const { tenant } = params;

  useEffect(() => {
    // Hack para que el API client sepa el tenant actual
    (window as any).currentTenantSlug = tenant;
    localStorage.setItem('currentTenantSlug', tenant);
  }, [tenant]);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-4">
        <h1 className="text-xl font-bold mb-8 uppercase tracking-wider">{tenant}</h1>
        <nav className="space-y-2">
          <a href="#" className="block py-2 px-4 rounded hover:bg-slate-800">Dashboard</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-slate-800 bg-slate-800">Clientes</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-slate-800">Motos</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-slate-800">Órdenes</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}