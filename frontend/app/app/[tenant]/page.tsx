import React from 'react';

export default function DashboardPage({ params }: { params: { tenant: string } }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Bienvenido al taller</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500 text-sm">Órdenes Activas</h3>
          <p className="text-3xl font-bold">5</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500 text-sm">Clientes Totales</h3>
          <p className="text-3xl font-bold">120</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500 text-sm">Facturación Mes</h3>
          <p className="text-3xl font-bold">$ 2.5M</p>
        </div>
      </div>
    </div>
  );
}