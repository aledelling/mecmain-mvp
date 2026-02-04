'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60" />

      <Card className="w-full max-w-md p-8 relative z-10 glass-panel border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">BIENVENIDO A <br/><span className="text-primary">MEC MAIN</span></h2>
          <p className="text-gray-400 text-sm">Ingresa tus credenciales para acceder al taller.</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase">Correo Electrónico</label>
            <div className="relative">
               <input 
                  type="email" 
                  className="w-full bg-surface border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="usuario@taller.com"
               />
               <Mail className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase">Contraseña</label>
            <div className="relative">
               <input 
                  type="password" 
                  className="w-full bg-surface border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
               />
               <Lock className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
             <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-surface border-white/20 text-primary focus:ring-primary" />
                Recordar mi sesión
             </label>
             <a href="#" className="text-primary hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          <Button className="w-full py-3 font-bold shadow-lg shadow-primary/20">
             INGRESAR
          </Button>

          <div className="relative my-6 text-center">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
             <span className="relative bg-surface px-4 text-xs text-gray-500">O ingresa con</span>
          </div>

          <Button variant="secondary" className="w-full" type="button">
             Google
          </Button>
        </form>
      </Card>
    </div>
  );
}