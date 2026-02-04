import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTenantSlug?: string; // Si venimos desde un tenant específico
}

export function AuthModal({ isOpen, onClose, defaultTenantSlug }: AuthModalProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Login con Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('No se pudo obtener el usuario');

      // 2. Cookie Handling
      // @supabase/ssr ya establece las cookies automáticamente en el navegador.
      // No necesitamos localStorage, pero si el API Client antiguo lo usa,
      // la migración de api.ts se encargará de leer del cliente en lugar de aquí.

      // 3. Resolución de Tenant (Post-Login Logic)
      const { data: memberships, error: memError } = await supabase
        .from('tenant_memberships')
        .select(`
          role,
          tenant:tenants (
            slug,
            name
          )
        `)
        .eq('user_id', data.user.id);

      if (memError) throw memError;

      onClose(); // Cerrar modal

      // 4. Lógica de Redirección
      if (!memberships || memberships.length === 0) {
         alert("No tienes membresías activas. Contacta soporte.");
         return;
      }

      if (defaultTenantSlug) {
         const hasAccess = memberships.some((m: any) => m.tenant.slug === defaultTenantSlug);
         if (hasAccess) {
             window.location.reload(); 
             return;
         }
      }

      if (memberships.length === 1) {
         const targetTenant = (memberships[0] as any).tenant.slug;
         router.push(`/t/${targetTenant}`);
      } else {
         const targetTenant = (memberships[0] as any).tenant.slug;
         router.push(`/t/${targetTenant}`);
      }

    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bienvenido a MecMain">
      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm">
           {defaultTenantSlug 
             ? `Ingresa para acceder a ${defaultTenantSlug.toUpperCase()}`
             : 'Gestiona tu taller desde cualquier lugar.'}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <Input 
          label="Correo Electrónico" 
          type="email" 
          placeholder="ejemplo@taller.com"
          icon={<Mail size={16}/>}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input 
          label="Contraseña" 
          type="password" 
          placeholder="••••••••"
          icon={<Lock size={16}/>}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded flex items-center gap-2">
             <AlertCircle size={14} />
             {error}
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-gray-400">
           <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input type="checkbox" className="rounded bg-surface border-white/20 text-primary" />
              Recordar sesión
           </label>
           <a href="#" className="hover:text-primary transition-colors">¿Olvidaste la contraseña?</a>
        </div>

        <Button className="w-full" size="lg" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {loading ? 'Validando...' : 'INGRESAR'}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-xs text-gray-500">
        ¿Aún no tienes cuenta? <a href="#" className="text-primary hover:underline">Solicita un Demo</a>
      </div>
    </Modal>
  );
}