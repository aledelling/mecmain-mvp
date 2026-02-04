'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Search, ShoppingCart, Filter, Plus, Minus, ArrowLeft } from 'lucide-react';

// Mock Data
const PRODUCTS = [
  { id: 1, name: 'Casco Arai Concept-X', price: 2800000, category: 'Cascos', image: '🪖' },
  { id: 2, name: 'Jacket Alpinestars', price: 1450000, category: 'Guantes', image: '🧥' },
  { id: 3, name: 'Aceite Motul 7100', price: 85000, category: 'Aceites', image: '🛢️' },
  { id: 4, name: 'Guantes GP Pro', price: 450000, category: 'Guantes', image: '🧤' },
  { id: 5, name: 'Botas Tech 7', price: 1200000, category: 'Accesorios', image: '👢' },
  { id: 6, name: 'Kit Arrastre MT09', price: 650000, category: 'Repuestos', image: '⚙️' },
];

export default function StorePage({ params }: { params: { tenant: string } }) {
  const [cart, setCart] = useState<{id: number, qty: number}[]>([]);

  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === id);
      if (existing) {
        return prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce((acc, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return acc + (product ? product.price * item.qty : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background text-gray-200">
      
      {/* Navbar Tienda */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-white/10 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
           <Link href={`/t/${params.tenant}`} className="text-gray-400 hover:text-white">
             <ArrowLeft size={20} />
           </Link>
           <h1 className="font-bold text-white tracking-wide">TIENDA OFICIAL {params.tenant.toUpperCase()}</h1>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar cascos, guantes..." 
            className="bg-surface border border-white/10 rounded-full px-4 py-1.5 text-sm w-64 focus:outline-none focus:border-primary/50 text-white placeholder-gray-500"
          />
          <Search className="absolute right-3 top-1.5 text-gray-500 w-4 h-4" />
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        
        {/* Sidebar Filtros */}
        <aside className="w-64 hidden lg:block p-6 border-r border-white/10 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Filter size={16}/> Categoría
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Cascos', 'Guantes', 'Aceites', 'Repuestos', 'Accesorios'].map(cat => (
                <li key={cat} className="hover:text-primary cursor-pointer flex items-center justify-between">
                  {cat} <span className="text-xs bg-white/5 px-2 py-0.5 rounded">12</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-white font-bold mb-4">Precio</h3>
            <div className="h-1 bg-white/10 rounded overflow-hidden">
               <div className="h-full bg-primary w-1/2"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
               <span>$0</span>
               <span>$5M+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {PRODUCTS.map(product => (
              <Card key={product.id} className="group relative">
                <div className="aspect-square bg-surface flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                  {product.image}
                </div>
                <div className="p-4 bg-surface/50">
                  <div className="text-xs text-primary mb-1">{product.category}</div>
                  <h3 className="font-bold text-white mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-mono">
                       ${product.price.toLocaleString()}
                    </span>
                    <Button size="sm" onClick={() => addToCart(product.id)}>
                      Añadir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>

        {/* Cart Sidebar (Right) */}
        <aside className="w-80 bg-surface border-l border-white/10 p-6 flex flex-col">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <ShoppingCart size={18} /> TU CARRITO ({cart.reduce((a, b) => a + b.qty, 0)})
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-4">
             {cart.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-10">Tu carrito está vacío.</p>
             )}
             {cart.map(item => {
                const product = PRODUCTS.find(p => p.id === item.id)!;
                return (
                  <div key={item.id} className="flex gap-3 items-center bg-white/5 p-3 rounded-lg">
                     <div className="w-10 h-10 bg-black/20 rounded flex items-center justify-center text-lg">{product.image}</div>
                     <div className="flex-1">
                        <p className="text-white text-sm font-bold truncate">{product.name}</p>
                        <p className="text-primary text-xs">${product.price.toLocaleString()}</p>
                     </div>
                     <div className="flex items-center gap-2 bg-black/30 rounded px-2">
                        <span className="text-xs text-white">{item.qty}</span>
                     </div>
                  </div>
                );
             })}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
             <div className="flex justify-between text-white font-bold mb-4">
                <span>Total:</span>
                <span className="text-primary">${cartTotal.toLocaleString()} COP</span>
             </div>
             <Button className="w-full font-bold">PROCEDER AL PAGO</Button>
             <div className="mt-4 flex justify-center gap-2 opacity-50">
                {/* Mock logos pago */}
                <div className="w-8 h-5 bg-white/20 rounded"></div>
                <div className="w-8 h-5 bg-white/20 rounded"></div>
                <div className="w-8 h-5 bg-white/20 rounded"></div>
             </div>
          </div>
        </aside>

      </div>
    </div>
  );
}