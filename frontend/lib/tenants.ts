// Este archivo simula la configuración de branding que vendría de BD en el futuro.
// Permite que la UI se adapte según el tenant detectado.

export interface TenantConfig {
  slug: string;
  name: string;
  description: string;
  logoText: string;
  heroImage?: string; // URL o placeholder
}

export const tenantsConfig: Record<string, TenantConfig> = {
  motoridersco: {
    slug: 'motoridersco',
    name: 'MotoRiders Colombia',
    description: 'Taller especializado y almacén premium. Repuestos originales y técnicos certificados.',
    logoText: 'MotoRiders Co',
  },
  // Default fallback
  default: {
    slug: 'default',
    name: 'MecMain Demo Taller',
    description: 'Sistema de gestión para tu taller.',
    logoText: 'Tu Taller',
  }
};

export function getTenantConfig(slug: string): TenantConfig {
  return tenantsConfig[slug] || tenantsConfig['default'];
}