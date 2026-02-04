import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop con blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="glass-panel rounded-2xl p-0 overflow-hidden shadow-2xl border border-white/10 bg-[#0B0E11]/90">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
             <h3 className="text-xl font-bold text-white tracking-tight">
               {title || 'MecMain'}
             </h3>
             <button 
               onClick={onClose}
               className="text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-full p-1"
             >
               <X size={20} />
             </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}