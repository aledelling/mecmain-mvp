import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getTenantConfig } from '@/lib/tenants';
import { Wrench, ShieldCheck, Zap, Battery, ShoppingBag, MapPin, Phone } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function TenantLandingPage({ params }: { params: { tenant: string } }) {
  const tenant = getTenantConfig(params.tenant);

  return (
    <div className="min-h-screen bg-background font-sans text-gray-200">
      
      {/* 1. Navbar Tenant */}
      <header className="fixed w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary text-2xl">
              <Wrench /> {/* Logo placeholder */}
            </span>
            <span className="text-xl font-bold tracking-wide text-white uppercase">
              {tenant.logoText}
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#" className="hover:text-primary transition-colors">Inicio</a>
            <a href="#servicios" className="hover:text-primary transition-colors">Servicios</a>
            <Link href={`/t/${params.tenant}/store`} className="hover:text-primary transition-colors">Tienda</Link>
            <a href="#contacto" className="hover:text-primary transition-colors">Contacto</a>
          </nav>

          <div className="flex gap-4">
             <Link href={`/t/${params.tenant}/store`}>
                <Button variant="ghost" className="hidden sm:inline-flex border border-white/20">
                    Ver Tienda
                </Button>
             </Link>
             <Link href="/auth/login">
                <Button>Agendar Cita</Button>
             </Link>
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
              <Button size="lg" className="px-8 text-black font-bold">AGENDAR CITA →</Button>
              <Link href={`/t/${params.tenant}/store`}>
                  <Button variant="outline" size="lg">VER TIENDA</Button>
              </Link>
            </div>
          </div>

          {/* Hero Image / Graphic Mock */}
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
             <div className="relative bg-gradient-to-tr from-surface to-background border border-white/10 rounded-3xl h-[400px] w-full flex items-center justify-center overflow-hidden">
                {/* Aquí iría la imagen de la moto del Hero. Usamos un placeholder estilizado */}
                <div className="text-center p-8">
                   <Wrench className="w-32 h-32 text-primary mx-auto mb-4 opacity-80" />
                   <p className="text-gray-500 text-sm">Imagen Hero (Moto BMW GS Example)</p>
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
                <Button size="sm" variant="outline">Facebook</Button>
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
        {/* Fix: Casting icon to ReactElement<any> to allow 'size' prop injection without TS error */}
        {React.cloneElement(icon as React.ReactElement<any>, { size: 40 })}
      </div>
      <h3 className="font-bold text-white text-sm md:text-base leading-tight">{title}</h3>
    </div>
  )
}
