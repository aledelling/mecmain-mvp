import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Settings, Users, PenTool, BarChart3 } from 'lucide-react';

export default function GlobalLandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar Global */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/5 bg-background/80">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-white tracking-tighter">
            Mec<span className="text-primary">Main</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <Link href="#features" className="hover:text-primary transition-colors">Características</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Precios</Link>
            <Link href="/auth/login" className="hover:text-primary transition-colors">Login</Link>
          </nav>
          <div className="flex gap-4">
             <Link href="/t/motoridersco">
                <Button variant="outline" size="sm">Ver Demo Taller</Button>
             </Link>
             <Link href="/auth/register">
                <Button size="sm">Prueba Gratis</Button>
             </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            El Sistema Operativo para tu <span className="text-neon">Taller de Motos</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Gestiona clientes, órdenes, inventario y facturación en una sola plataforma SaaS moderna. 
            Diseñado para mecánicos, optimizado para dueños.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">Empezar Ahora</Button>
            <Button variant="secondary" size="lg" className="text-lg px-8">Agendar Demo</Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-surface/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">Todo lo que necesitas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-primary" />}
              title="CRM Clientes"
              desc="Historial completo de vehículos, reparaciones y contacto."
            />
            <FeatureCard 
              icon={<PenTool className="w-8 h-8 text-primary" />}
              title="Órdenes de Trabajo"
              desc="Control de estados, repuestos y mano de obra en tiempo real."
            />
            <FeatureCard 
              icon={<Settings className="w-8 h-8 text-primary" />}
              title="Inventario"
              desc="Control de stock con alertas automáticas y cálculo de costos."
            />
             <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-primary" />}
              title="Facturación"
              desc="Genera facturas profesionales y controla tus ingresos."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/10 mt-auto">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2024 MecMain. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-card p-6 rounded-xl hover:-translate-y-1 transition-transform">
      <div className="mb-4 bg-white/5 w-14 h-14 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}