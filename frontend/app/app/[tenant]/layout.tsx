'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Bike, Package, FileText, LogOut } from 'lucide-react';

export default function TenantAppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const { tenant } = params;
  const pathname = usePathname();

  useEffect(() => {
    (window as any).currentTenantSlug = tenant;
    localStorage.setItem('currentTenantSlug', tenant);
  }, [tenant]);

  const baseUrl = `/app/${tenant}`;
  
  // Función para determinar si el link está activo
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex h-screen bg-background text-gray-200 overflow-hidden">
      
      {/* Sidebar Oscuro */}
      <aside className="w-64 bg-surface border-r border-white/10 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-white/10">
           <h1 className="font-bold tracking-wider text-white">
             {tenant.toUpperCase().substring(0, 10)}...
           </h1>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" href={`${baseUrl}/dashboard`} active={isActive(`${baseUrl}/dashboard`)} />
          <SidebarItem icon={<Users size={20}/>} label="Clientes" href={`${baseUrl}/customers`} active={isActive(`${baseUrl}/customers`)} />
          <SidebarItem icon={<Bike size={20}/>} label="Motos" href={`${baseUrl}/motorcycles`} active={isActive(`${baseUrl}/motorcycles`)} />
          <SidebarItem icon={<Package size={20}/>} label="Inventario" href={`${baseUrl}/inventory`} active={isActive(`${baseUrl}/inventory`)} />
          <SidebarItem icon={<FileText size={20}/>} label="Órdenes" href="#" active={false} />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-2 text-sm font-medium">
             <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
        <div className="text-[10px] text-gray-600 text-center pb-2">
           MecMain v1.0
        </div>
      </aside>

      {/* Main Content con fondo y scroll */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar simple */}
        <header className="h-16 bg-background/50 backdrop-blur border-b border-white/10 flex items-center justify-between px-8">
           <h2 className="font-medium text-white">Panel de Administración</h2>
           <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center text-xs font-bold">
              ADMIN
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, href, active }: any) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
        ${active 
          ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,229,153,0.1)]' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
        }
      `}
    >
      {icon}
      {label}
    </Link>
  );
}