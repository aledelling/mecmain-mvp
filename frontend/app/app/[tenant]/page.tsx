import React from 'react';
import { Card } from '@/components/ui/Card';
import { Bike, DollarSign, Wrench, AlertCircle } from 'lucide-react';

export default function DashboardPage({ params }: { params: { tenant: string } }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Resumen del Taller</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
           title="Órdenes Activas" 
           value="5" 
           icon={<Wrench className="text-primary"/>} 
           trend="+2 hoy"
        />
        <StatCard 
           title="Motos en Taller" 
           value="12" 
           icon={<Bike className="text-blue-400"/>} 
        />
        <StatCard 
           title="Facturación Mes" 
           value="$2.5M" 
           icon={<DollarSign className="text-green-400"/>} 
           trend="+15% vs mes pasado"
        />
        <StatCard 
           title="Stock Bajo" 
           value="3 Ítems" 
           icon={<AlertCircle className="text-red-400"/>} 
           alert
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 p-6">
            <h3 className="text-white font-bold mb-4">Órdenes Recientes</h3>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs uppercase bg-white/5 text-gray-200">
                     <tr>
                        <th className="px-4 py-3 rounded-l-lg">ID</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Moto</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 rounded-r-lg">Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     <tr className="hover:bg-white/5">
                        <td className="px-4 py-3 font-mono">#ORD-001</td>
                        <td className="px-4 py-3">Juan Pérez</td>
                        <td className="px-4 py-3">Yamaha MT09</td>
                        <td className="px-4 py-3"><span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs">En Proceso</span></td>
                        <td className="px-4 py-3">$450.000</td>
                     </tr>
                     <tr className="hover:bg-white/5">
                        <td className="px-4 py-3 font-mono">#ORD-002</td>
                        <td className="px-4 py-3">Maria Gomez</td>
                        <td className="px-4 py-3">Suzuki GS500</td>
                        <td className="px-4 py-3"><span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">Finalizada</span></td>
                        <td className="px-4 py-3">$120.000</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </Card>

         <Card className="p-6">
            <h3 className="text-white font-bold mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
               {[1,2,3].map(i => (
                  <div key={i} className="flex gap-3 items-start text-sm">
                     <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_var(--primary)]"></div>
                     <div>
                        <p className="text-gray-300">Nueva orden creada para <span className="text-white font-medium">Carlos R.</span></p>
                        <span className="text-xs text-gray-500">Hace 2 horas</span>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, alert }: any) {
   return (
      <Card className={`p-6 border-l-4 ${alert ? 'border-l-red-500' : 'border-l-primary'}`}>
         <div className="flex justify-between items-start mb-2">
            <span className="text-gray-400 text-sm font-medium">{title}</span>
            <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
         </div>
         <div className="text-3xl font-bold text-white mb-1">{value}</div>
         {trend && <div className="text-xs text-primary font-medium">{trend}</div>}
      </Card>
   )
}