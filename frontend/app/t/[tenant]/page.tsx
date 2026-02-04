'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getTenantConfig } from '@/lib/tenants';
import { AuthModal } from '@/components/auth/AuthModal';
import { createClient } from '@/lib/supabase/client';
import { Wrench, ShieldCheck, Zap, Battery, MapPin, Phone, LogIn, LayoutDashboard, ShoppingBag, LogOut } from 'lucide-react';

export default function TenantLandingPage({ params }: { params: { tenant: string } }) {
  const tenant = getTenantConfig(params.tenant);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Verificar Auth y Rol al cargar
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Consultar rol en este tenant
        const { data: membership } = await supabase
          .from('tenant_memberships')
          .select('role, tenants!inner(slug)')
          .eq('user_id', user.id)
          .eq('tenants.slug', params.tenant)
          .single();
        
        if (membership) {
           setRole(membership.role);
        }
      }
    };
    checkSession();
  }, [params.tenant, supabase]);

  const handleLogout = async () => {
      await supabase.auth.signOut();
      window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background font-sans text-gray-200">
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setAuthOpen(false)} 
        defaultTenantSlug={params.tenant}
      />

      {/* 1. Navbar Tenant */}
      <header className="fixed w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary text-2xl">
              <Wrench />
            </span>
            <span className="text-xl font-bold tracking-wide text-white uppercase hidden sm:block">
              {tenant.logoText}
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#" className="hover:text-primary transition-colors">Inicio</a>
            <a href="#servicios" className="hover:text-primary transition-colors">Servicios</a>
            <Link href={`/t/${params.tenant}/store`} className="hover:text-primary transition-colors">Tienda</Link>
          </nav>

          <div className="flex gap-4 items-center">
             {/* Lógica de Botones según Estado */}
             {!user ? (
                <>
                  <Link href={`/t/${params.tenant}/store`}>
                      <Button variant="ghost" className="hidden sm:inline-flex border border-white/20">
                          Ver Tienda
                      </Button>
                  </Link>
                  <Button onClick={() => setAuthOpen(true)}>
                      <LogIn size={16} className="mr-2"/> Ingresar
                  </Button>
                </>
             ) : (
                <>
                   {/* Si es staff/admin */}
                   {['OWNER_ADMIN', 'MECHANIC', 'CASHIER'].includes(role || '') && (
                      <Link href={`/app/${params.tenant}/dashboard`}>
                         <Button variant="secondary" className="border-primary/50 text-primary">
                            <LayoutDashboard size={16} className="mr-2"/> Dashboard
                         </Button>
                      </Link>
                   )}
                   
                   {/* Si es cliente (o cualquier user logueado) */}
                   <Link href={`/t/${params.tenant}/store`}>
                      <Button variant="ghost">
                         <ShoppingBag size={16} className="mr-2"/> Tienda
                      </Button>
                   </Link>

                   <button onClick={handleLogout} className="text-gray-500 hover:text-white ml-2" title="Cerrar Sesión">
                      <LogOut size={18}/>
                   </button>
                </>
             )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative z-10">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              TU MOTO EN LAS <br/>
              <span className="text-gray-400">MEJORES MANOS,</span> <br/>
              <span className="text-primary">BOGOTÁ, COLOMBIA</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-md">
              {tenant.description}
            </p>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                 <Button size="lg" className="px-8 text-black font-bold" onClick={() => setAuthOpen(true)}>
                    AGENDAR CITA →
                 </Button>
              ) : (
                 <Link href={`/t/${params.tenant}/store`}>
                    <Button size="lg" className="px-8 text-black font-bold">
                       COMPRAR REPUESTOS →
                    </Button>
                 </Link>
              )}
              
              <Link href={`/t/${params.tenant}/store`}>
                  <Button variant="outline" size="lg">VER TIENDA</Button>
              </Link>
            </div>
          </div>

          {/* Hero Image / Graphic Mock */}
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
             <div className="relative bg-gradient-to-tr from-surface to-background border border-white/10 rounded-3xl h-[400px] w-full flex items-center justify-center overflow-hidden shadow-2xl">
                <div className="text-center p-8">
                   <Wrench className="w-32 h-32 text-primary mx-auto mb-4 opacity-80" />
                   <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">
                      {params.tenant} Headquarters
                   </p>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* 3. Servicios Grid */}
      <section id="servicios" className="py-20 bg-surface/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ServiceCard icon={<Wrench />} title="Mantenimiento General" />
            <ServiceCard icon={<Zap />} title="Diagnóstico Computarizado" />
            <ServiceCard icon={<ShieldCheck />} title="Frenos & Seguridad" />
            <ServiceCard icon={<Battery />} title="Sistema Eléctrico" />
          </div>
        </div>
      </section>

      {/* 4. Footer Simple */}
      <footer id="contacto" className="bg-black py-12 border-t border-white/10">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm text-gray-400">
           <div>
              <h4 className="text-white font-bold text-lg mb-4">{tenant.name}</h4>
              <p className="mb-4">Especialistas en alto cilindraje.</p>
              <div className="flex gap-4">
                <Button size="sm" variant="outline">Instagram</Button>
              </div>
           </div>
           <div>
              <h4 className="text-white font-bold text-lg mb-4">Ubicación</h4>
              <p className="flex items-center gap-2 mb-2"><MapPin size={16}/> 1500 West Coast, Bogotá</p>
              <p className="flex items-center gap-2"><Phone size={16}/> +57 300 123 4567</p>
           </div>
           <div>
              <h4 className="text-white font-bold text-lg mb-4">Horario</h4>
              <p>Lunes a Viernes: 8am - 6pm</p>
              <p>Sábados: 8am - 2pm</p>
           </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
      <div className="text-primary group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 40 })}
      </div>
      <h3 className="font-bold text-white text-sm md:text-base leading-tight">{title}</h3>
    </div>
  )
}