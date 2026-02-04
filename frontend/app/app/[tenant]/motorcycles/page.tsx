'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Motorcycle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
}

export default function MotorcyclesPage({ params }: { params: { tenant: string } }) {
  const [motos, setMotos] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aseguramos que el cliente API tenga el slug correcto
    (window as any).currentTenantSlug = params.tenant;
    
    api.get('/motorcycles')
      .then(res => setMotos(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [params.tenant]);

  if (loading) return <div>Cargando motos...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Motocicletas</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Nueva Moto
        </button>
      </div>
      
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Placa</th>
              <th className="p-4">Marca/Modelo</th>
              <th className="p-4">Año</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {motos.length === 0 && (
               <tr><td colSpan={4} className="p-4 text-center text-gray-500">No hay motos registradas.</td></tr>
            )}
            {motos.map(moto => (
              <tr key={moto.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono font-bold">{moto.plate}</td>
                <td className="p-4">{moto.brand} {moto.model}</td>
                <td className="p-4">{moto.year}</td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}