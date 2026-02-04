import axios from 'axios';
import { createClient } from '@/lib/supabase/client';

// URL del backend (Spring Boot)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar token y tenant slug
api.interceptors.request.use(async (config) => {
  // 1. Obtener Token de Supabase
  // Instanciamos el cliente (singleton en navegador) y pedimos la sesión actual.
  // @supabase/ssr gestiona las cookies automáticamente.
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. Inyectar Tenant Slug
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const path = window.location.pathname;
    
    let tenantSlug = '';
    
    // Modo Subdominio
    if (!hostname.includes('localhost') && !hostname.includes('vercel.app')) {
       tenantSlug = hostname.split('.')[0];
    }
    
    // Modo Path (Localhost fallback)
    if (path.startsWith('/t/')) {
       tenantSlug = path.split('/')[2];
    }
    
    if ((window as any).currentTenantSlug) {
        config.headers['X-Tenant-Slug'] = (window as any).currentTenantSlug;
    }
  }

  return config;
});