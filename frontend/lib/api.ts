import axios from 'axios';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; 

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
  // 1. Obtener Token de Supabase (si existe sesión en frontend)
  // Nota: En un componente cliente se usa createClientComponentClient
  // Aquí simplificamos asumiendo que el token se pasa o se obtiene de localStorage si no usamos la librería helper en este archivo puro.
  const token = localStorage.getItem('sb-access-token'); // Simplificación para MVP
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. Inyectar Tenant Slug
  // ¿De dónde sacamos el slug?
  // Si estamos en el navegador, podemos leer la URL.
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
    
    // Si la reescritura de Next.js ocultó el /t/, necesitamos pasar el slug explícitamente desde los componentes React
    // o leer un contexto global. Para este ejemplo, usaremos un header custom 'X-Tenant-Slug' 
    // que el componente deberá configurar o inferir.
    // Hack MVP: Si window.currentTenantSlug existe (seteado en el Layout), úsalo.
    if ((window as any).currentTenantSlug) {
        config.headers['X-Tenant-Slug'] = (window as any).currentTenantSlug;
    }
  }

  return config;
});