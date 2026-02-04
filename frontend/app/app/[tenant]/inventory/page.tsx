'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

export default function InventoryPage({ params }: { params: { tenant: string } }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (window as any).currentTenantSlug = params.tenant;
    
    api.get('/inventory-items')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [params.tenant]);

  if (loading) return <div>Cargando inventario...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventario</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          + Agregar Ítem
        </button>
      </div>
      
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">SKU</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
             {items.length === 0 && (
               <tr><td colSpan={5} className="p-4 text-center text-gray-500">Inventario vacío.</td></tr>
            )}
            {items.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{item.sku || '-'}</td>
                <td className="p-4">{item.name}</td>
                <td className="p-4">
                  <span className={item.stock < 5 ? 'text-red-600 font-bold' : ''}>
                    {item.stock} un.
                  </span>
                </td>
                <td className="p-4">${item.price}</td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}