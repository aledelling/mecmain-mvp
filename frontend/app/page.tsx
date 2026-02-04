'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AuthModal } from '@/components/auth/AuthModal';
import { Users, PenTool, Settings, BarChart3, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function GlobalLandingPage() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Verificar sesión al montar para ajustar UI
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();
  }, [supabase]);

  return (
    <div className="min-h-screen flex flex-col">
      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />

      {/* Navbar Global */}
      <header className="fixed top-0 w-full z-40 glass-panel border-b-0 border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-white tracking-tighter">
            Mec<span className="text-primary">Main</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <Link href="#features" className="hover:text-primary transition-colors">Características</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Precios</Link>
          </nav>
          <div className="flex gap-4 items-center">
             <Link href="/t/motoridersco">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Demo Taller</Button>
             </Link>
             
             {user ? (
                <Button size="sm" onClick={() => setAuthOpen(true)}>Mi Cuenta</Button>
             ) : (
                <Button size="sm" onClick={() => setAuthOpen(true)}>
                   <LogIn size={16} className="mr-2"/> Ingresar
                </Button>
             )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary">
            v1.0 MVP RELEASE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            El Sistema Operativo para tu <span className="text-neon block md:inline">Taller de Motos</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Gestiona clientes, órdenes, inventario y facturación en una sola plataforma SaaS moderna. 
            Diseñado para mecánicos, optimizado para dueños.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 h-14" onClick={() => setAuthOpen(true)}>
               Empezar Ahora
            </Button>
            <Button variant="secondary" size="lg" className="text-lg px-8 h-14">
               Ver Demo en Vivo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-surface/30 border-t border-white/5">
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
      <footer className="py-10 border-t border-white/10 mt-auto bg-black/40">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2024 MecMain. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-card p-6 rounded-xl hover:-translate-y-1 transition-transform group">
      <div className="mb-4 bg-white/5 w-14 h-14 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}