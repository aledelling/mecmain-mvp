'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Search, ShoppingCart, Filter, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface StoreProduct {
  id: string;
  name: string;
  brand: string;
  finalPrice: number;
  imageUrl: string;
  stock: number;
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  qty: number;
  price: number;
}

export default function StorePage({ params }: { params: { tenant: string } }) {
  const router = useRouter();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 1. Cargar Usuario y Datos
  useEffect(() => {
    (window as any).currentTenantSlug = params.tenant;
    
    const init = async () => {
       // Verificación de Auth simplificada (MVP) basada en token
       const token = localStorage.getItem('sb-access-token');
       if (token) {
         setUser({ email: 'usuario@taller.com' }); // Usuario simulado si hay token
       } else {
         setUser(null);
       }

       // Cargar Productos Públicos
       try {
         const res = await api.get('/public/store/products');
         setProducts(res.data);
         
         // Si hay user (token), cargar carrito
         if (token) {
            const cartRes = await api.get('/store/cart');
            setCart(cartRes.data);
         }
       } catch (err) {
         console.error(err);
       } finally {
         setLoading(false);
       }
    };
    init();
  }, [params.tenant]);

  // 2. Acción: Agregar al Carrito
  const addToCart = async (product: StoreProduct) => {
    if (!user) {
       router.push('/auth/login');
       return;
    }
    
    try {
       await api.post('/store/cart/items', { productId: product.id, quantity: 1 });
       // Recargar carrito
       const cartRes = await api.get('/store/cart');
       setCart(cartRes.data);
    } catch (err) {
       alert('Error al agregar (quizás stock insuficiente)');
    }
  };

  // 3. Acción: Checkout
  const handleCheckout = async () => {
    if (!user) return;
    try {
       const res = await api.post('/store/checkout', {});
       alert(`Orden Creada! ID: ${res.data}`);
       setCart([]); // Vaciar local
    } catch (err) {
       alert('Error en checkout. Revisa stock.');
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary"><Loader2 className="animate-spin w-10 h-10"/></div>;

  return (
    <div className="min-h-screen bg-background text-gray-200">
      
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-white/10 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
           <Link href={`/t/${params.tenant}`} className="text-gray-400 hover:text-white">
             <ArrowLeft size={20} />
           </Link>
           <h1 className="font-bold text-white tracking-wide">TIENDA {params.tenant.toUpperCase()}</h1>
        </div>
        <div className="flex items-center gap-4">
           {!user && <Link href="/auth/login" className="text-sm text-primary hover:underline">Iniciar Sesión</Link>}
           {user && <span className="text-xs text-gray-500">{user.email}</span>}
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        
        {/* Sidebar Filtros Mock */}
        <aside className="w-64 hidden lg:block p-6 border-r border-white/10 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Filter size={16}/> Categoría</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-primary cursor-pointer">Aceites</li>
              <li className="hover:text-primary cursor-pointer">Cascos</li>
              <li className="hover:text-primary cursor-pointer">Guantes</li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id} className="group relative">
                <div className="aspect-square bg-surface flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                  {product.imageUrl}
                </div>
                <div className="p-4 bg-surface/50">
                  <div className="text-xs text-primary mb-1">{product.brand}</div>
                  <h3 className="font-bold text-white mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <div>
                        <span className="text-gray-300 font-mono block">${product.finalPrice.toLocaleString()}</span>
                        <span className="text-xs text-gray-600">Stock: {product.stock}</span>
                    </div>
                    <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock <= 0}>
                      {product.stock > 0 ? 'Añadir' : 'Agotado'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>

        {/* Cart Sidebar */}
        <aside className="w-80 bg-surface border-l border-white/10 p-6 flex flex-col">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <ShoppingCart size={18} /> CARRITO ({cart.reduce((a, b) => a + b.qty, 0)})
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-4">
             {cart.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-10">
                   {user ? 'Tu carrito está vacío.' : 'Inicia sesión para comprar.'}
                </p>
             )}
             {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center bg-white/5 p-3 rounded-lg">
                   <div className="w-10 h-10 bg-black/20 rounded flex items-center justify-center text-lg">{item.image}</div>
                   <div className="flex-1">
                      <p className="text-white text-sm font-bold truncate">{item.name}</p>
                      <p className="text-primary text-xs">${item.price.toLocaleString()}</p>
                   </div>
                   <div className="bg-black/30 rounded px-2 text-xs text-white">{item.qty}</div>
                </div>
             ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
             <div className="flex justify-between text-white font-bold mb-4">
                <span>Total:</span>
                <span className="text-primary">${cartTotal.toLocaleString()}</span>
             </div>
             <Button className="w-full font-bold" onClick={handleCheckout} disabled={cart.length === 0}>
                PAGAR
             </Button>
          </div>
        </aside>

      </div>
    </div>
  );
}