import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Camera, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Product } from '../App';
import { localProducts } from '../data/localProducts';
import { fetchFromOpenFoodFacts } from '../utils/openFoodFacts';

interface BarcodeScannerProps {
  onScanComplete: (product: Product) => void;
  onBack: () => void;
}

export function BarcodeScanner({ onScanComplete, onBack }: BarcodeScannerProps) {
  const [barcode, setBarcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
                            ('ontouchstart' in window) || 
                            (window.innerWidth <= 768 && window.innerHeight <= 1024);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  const handleSearch = async () => {
    if (!barcode.trim()) {
      setError('Пожалуйста, введите штрих-код');
      return;
    }

    setIsLoading(true);
    setError('');

    // Check local database first
    const localProduct = localProducts.find(p => p.barcode === barcode);
    
    if (localProduct) {
      setTimeout(() => {
        setIsLoading(false);
        onScanComplete(localProduct);
      }, 500);
      return;
    }

    // If not found locally, try OpenFoodFacts
    try {
      const product = await fetchFromOpenFoodFacts(barcode);
      setIsLoading(false);
      onScanComplete(product);
    } catch (err) {
      setIsLoading(false);
      setError('Продукт не найден. Попробуйте другой штрих-код.');
    }
  };

  const handleExampleBarcode = (exampleBarcode: string) => {
    setBarcode(exampleBarcode);
    setError('');
  };

  const handleScan = async () => {
    try {
      const { CapacitorBarcodeScanner } = await import('@capacitor/barcode-scanner');
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: 17, // ALL formats
        scanInstructions: 'Наведите камеру на штрих-код',
        scanButton: true,
        scanText: 'Сканировать'
      });
      setBarcode(result.ScanResult);
      setError('');
      // Automatically search after scanning
      await handleSearchFromBarcode(result.ScanResult);
    } catch (error) {
      console.error('Scan error:', error);
      setError('Ошибка сканирования. Попробуйте ввести штрих-код вручную.');
    }
  };

  const handleSearchFromBarcode = async (scannedBarcode: string) => {
    setIsLoading(true);
    setError('');

    // Check local database first
    const localProduct = localProducts.find(p => p.barcode === scannedBarcode);
    
    if (localProduct) {
      setTimeout(() => {
        setIsLoading(false);
        onScanComplete(localProduct);
      }, 500);
      return;
    }

    // If not found locally, try OpenFoodFacts
    try {
      const product = await fetchFromOpenFoodFacts(scannedBarcode);
      setIsLoading(false);
      onScanComplete(product);
    } catch (err) {
      setIsLoading(false);
      setError('Продукт не найден. Попробуйте другой штрих-код.');
    }
  };

  const exampleBarcodes = [
    { code: '4607065235468', name: 'Молоко Простоквашино', icon: '🥛' },
    { code: '4602083000012', name: 'Йогурт Активия', icon: '🥤' },
    { code: '3017620422003', name: 'Nutella', icon: '🍫' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="hover:bg-green-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-gray-800">Сканирование</h2>
          <p className="text-sm text-gray-500">Найдите продукт по штрих-коду</p>
        </div>
      </div>

      {/* Scanner Simulation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 overflow-hidden relative">
          {/* Animated scan line */}
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"
            animate={{ 
              top: ['10%', '90%', '10%'] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
            <div className="w-full aspect-square max-w-xs bg-white rounded-2xl shadow-inner flex items-center justify-center p-8">
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Camera className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                </motion.div>
                {isMobile ? (
                  <>
                    <p className="text-gray-500 mb-2">
                      Сканируйте штрих-код с камеры
                    </p>
                    <Button 
                      onClick={handleScan}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Сканировать
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-500 mb-2">
                    Сканирование доступно только на мобильных устройствах
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Manual Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-5 bg-white shadow-lg border-green-100">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-green-600" />
              <label className="text-gray-700">Введите штрих-код</label>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="например, 4607065235468"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 border-green-200 focus:border-green-500 focus:ring-green-500"
              />
              {isMobile && (
                <Button 
                  onClick={handleScan}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
              <Button 
                onClick={handleSearch} 
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Example Barcodes */}
      <motion.div 
        className="space-y-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-gray-600 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Попробуйте примеры:
        </p>
        <div className="grid gap-3">
          {exampleBarcodes.map((example, index) => (
            <motion.button
              key={example.code}
              onClick={() => handleExampleBarcode(example.code)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="text-left p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{example.icon}</span>
                <div className="flex-1">
                  <p className="text-gray-800 group-hover:text-green-700 transition-colors">
                    {example.name}
                  </p>
                  <p className="text-gray-500 text-sm">{example.code}</p>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-green-500 rotate-180 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
