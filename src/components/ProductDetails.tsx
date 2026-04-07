import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Leaf, Package, Factory, MapPin, Recycle, ScanLine, Award, Sparkles } from 'lucide-react';
import { Product } from '../App';
import { EcoRatingBadge } from './EcoRatingBadge';

interface ProductDetailsProps {
  product: Product;
  onScanAgain: () => void;
}

export function ProductDetails({ product, onScanAgain }: ProductDetailsProps) {
  const getRatingColor = (rating: string) => {
    const colors = {
      A: 'text-green-600',
      B: 'text-lime-600',
      C: 'text-yellow-600',
      D: 'text-orange-600',
      E: 'text-red-600',
    };
    return colors[rating as keyof typeof colors] || 'text-gray-600';
  };

  const getRatingDescription = (rating: string) => {
    const descriptions = {
      A: 'Отличная экологичность',
      B: 'Хорошая экологичность',
      C: 'Средняя экологичность',
      D: 'Низкая экологичность',
      E: 'Очень низкая экологичность',
    };
    return descriptions[rating as keyof typeof descriptions] || 'Нет данных';
  };

  const getRecyclabilityLabel = (percentage: number) => {
    if (percentage >= 80) return 'Отлично';
    if (percentage >= 60) return 'Хорошо';
    if (percentage >= 40) return 'Средне';
    return 'Низко';
  };

  const getCarbonFootprintLabel = (value: number) => {
    if (value <= 100) return 'Низкий';
    if (value <= 300) return 'Средний';
    return 'Высокий';
  };

  const getRecyclabilityColor = (percentage: number) => {
    if (percentage >= 80) return 'from-blue-500 to-cyan-500';
    if (percentage >= 60) return 'from-blue-400 to-blue-600';
    if (percentage >= 40) return 'from-yellow-400 to-orange-400';
    return 'from-orange-500 to-red-500';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="space-y-5 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Product Image & Name */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 text-center bg-gradient-to-br from-white to-gray-50 shadow-xl border-2 border-green-100 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50" />
          
          <div className="relative z-10">
            {product.imageUrl ? (
              <motion.div 
                className="w-36 h-36 mx-auto mb-5 bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-contain p-3"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>';
                    }
                  }}
                />
              </motion.div>
            ) : (
              <div className="w-36 h-36 mx-auto mb-5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-20 h-20 text-gray-400" />
              </div>
            )}
            <h2 className="text-gray-900 mb-2">{product.name}</h2>
            <p className="text-gray-500 mb-3">{product.brand.replace(/&quot;|\"/g, '').trim()}</p>
            {product.category && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                {product.category}
              </Badge>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Eco Rating */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-br from-white to-green-50 shadow-lg border-2 border-green-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Sparkles className="w-32 h-32 text-green-600" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-gray-900">Эко-рейтинг</h3>
              </div>
              <EcoRatingBadge rating={product.ecoRating} size="lg" />
            </div>
            
            <motion.p 
              className={`${getRatingColor(product.ecoRating)} mb-4`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {getRatingDescription(product.ecoRating)}
            </motion.p>
            
            <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-green-100">
              <p className="text-gray-600 text-sm leading-relaxed">
                Рейтинг основан на анализе упаковки, происхождения и производственных процессов
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recyclability */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-br from-white to-blue-50 shadow-lg border-2 border-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Recycle className="w-32 h-32 text-blue-600" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Recycle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-gray-900">Перерабатываемость</h3>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {getRecyclabilityLabel(product.recyclability)}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Упаковка</span>
                <span className="text-gray-900">{product.recyclability}%</span>
              </div>
              
              <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className={`h-3 rounded-full bg-gradient-to-r ${getRecyclabilityColor(product.recyclability)} shadow-lg`}
                  initial={{ width: 0 }}
                  animate={{ width: `${product.recyclability}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                />
              </div>
              
              {product.packaging && (
                <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-blue-100 mt-4">
                  <p className="text-gray-600 text-sm">{product.packaging}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Carbon Footprint */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-br from-white to-orange-50 shadow-lg border-2 border-orange-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Factory className="w-32 h-32 text-orange-600" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Factory className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-gray-900">Углеродный след</h3>
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                {getCarbonFootprintLabel(product.carbonFootprint)}
              </Badge>
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              <motion.span 
                className="text-gray-900"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
              >
                {product.carbonFootprint}
              </motion.span>
              <span className="text-gray-500 text-sm">г CO₂ на 100г продукта</span>
            </div>
            
            <div className="bg-orange-50/70 backdrop-blur rounded-xl p-4 border border-orange-100">
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.carbonFootprint <= 100 
                  ? '✨ Этот продукт имеет низкий углеродный след' 
                  : product.carbonFootprint <= 300
                  ? '📊 Средний углеродный след для данной категории'
                  : '⚠️ Рассмотрите альтернативы с меньшим углеродным следом'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Origin */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-br from-white to-purple-50 shadow-lg border-2 border-purple-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <MapPin className="w-32 h-32 text-purple-600" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-gray-900">Происхождение</h3>
            </div>
            <p className="text-gray-700 ml-11">{product.origin}</p>
          </div>
        </Card>
      </motion.div>

      {/* Labels */}
      {product.labels && product.labels.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-gradient-to-br from-white to-amber-50 shadow-lg border-2 border-amber-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Award className="w-32 h-32 text-amber-600" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-gray-900">Сертификаты и маркировки</h3>
              </div>
              <div className="flex flex-wrap gap-2 ml-11">
                {product.labels.map((label, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                      {label}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Barcode Info */}
      <motion.div variants={itemVariants}>
        <Card className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <ScanLine className="w-4 h-4" />
            <span>Штрих-код: {product.barcode}</span>
          </div>
        </Card>
      </motion.div>

      {/* Scan Again Button */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          onClick={onScanAgain}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <ScanLine className="w-5 h-5" />
            Сканировать другой продукт
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
