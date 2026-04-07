import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarcodeScanner } from './components/BarcodeScanner';
import { ProductDetails } from './components/ProductDetails';
import { Leaf, Sparkles } from 'lucide-react';

export interface Product {
  barcode: string;
  name: string;
  brand: string;
  ecoRating: 'A' | 'B' | 'C' | 'D' | 'E';
  recyclability: number;
  carbonFootprint: number;
  origin: string;
  category?: string;
  imageUrl?: string;
  packaging?: string;
  labels?: string[];
}

export default function App() {
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanComplete = (product: Product) => {
    setScannedProduct(product);
    setIsScanning(false);
  };

  const handleScanAgain = () => {
    setScannedProduct(null);
    setIsScanning(true);
  };

  const handleBack = () => {
    setScannedProduct(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6 shadow-xl"
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Leaf className="w-8 h-8" />
            </motion.div>
            <h1 className="text-white">EcoScan</h1>
          </div>
          <p className="text-center text-green-50 text-sm">Экологичность в каждой покупке</p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative max-w-md mx-auto p-6 pb-24">
        <AnimatePresence mode="wait">
          {!isScanning && !scannedProduct && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <motion.div 
                className="relative mb-8"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-12 rounded-3xl shadow-2xl">
                  <Leaf className="w-20 h-20 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-gray-800 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              >
                Узнайте об экологичности продуктов
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-10 max-w-sm leading-relaxed"
              >
                Сканируйте штрих-коды товаров и получайте информацию об их экологичности, 
                углеродном следе и перерабатываемости упаковки
              </motion.p>
              
              <motion.button 
                onClick={() => setIsScanning(true)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Начать сканирование
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          )}

          {isScanning && !scannedProduct && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <BarcodeScanner onScanComplete={handleScanComplete} onBack={handleBack} />
            </motion.div>
          )}

          {scannedProduct && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <ProductDetails product={scannedProduct} onScanAgain={handleScanAgain} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-green-100 p-5 z-50 shadow-2xl"
      >
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
            <span>Делайте осознанный выбор для планеты</span>
            <span className="text-xl">🌍</span>
          </p>
        </div>
      </motion.footer>
    </div>
  );
}