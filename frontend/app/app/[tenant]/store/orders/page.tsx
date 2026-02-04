'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
}

export default function StoreOrdersPage({ params }: { params: { tenant: string } }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    (window as any).currentTenantSlug = params.tenant;
    const res = await api.get('/admin/store/orders');
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, [params.tenant]);

  const markPaid = async (id: string) => {
    await api.post(`/admin/store/orders/${id}/pay`);
    loadOrders();
  };

  return (
    <div>
       <h2 className="text-2xl font-bold text-white mb-6">Pedidos Tienda Online</h2>
       <Card className="p-0 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-400">
             <thead className="bg-white/5 text-gray-200 uppercase text-xs">
                <tr>
                   <th className="p-4">ID Orden</th>
                   <th className="p-4">Total</th>
                   <th className="p-4">Estado</th>
                   <th className="p-4">Acciones</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {orders.map(o => (
                   <tr key={o.id} className="hover:bg-white/5">
                      <td className="p-4 font-mono">{o.id.substring(0,8)}</td>
                      <td className="p-4">${o.total.toLocaleString()}</td>
                      <td className="p-4">
                         <span className={`px-2 py-1 rounded text-xs ${o.status === 'PAID' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                            {o.status}
                         </span>
                      </td>
                      <td className="p-4">
                         {o.status === 'PENDING_PAYMENT' && (
                            <Button size="sm" onClick={() => markPaid(o.id)}>Marcar Pagado</Button>
                         )}
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </Card>
    </div>
  );
}