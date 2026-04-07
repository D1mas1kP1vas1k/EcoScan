import { Product } from '../App';

const sanitizeText = (value?: string) => {
  if (!value) return undefined;
  return value.replace(/&quot;|\"/g, '').trim();
};

const sanitizeLabels = (labels: string[] = []) =>
  labels.map(label => sanitizeText(label) || '').filter(Boolean);

/**
 * Fetches product data from OpenFoodFacts API
 * API Documentation: https://world.openfoodfacts.org/data
 */
export async function fetchFromOpenFoodFacts(barcode: string): Promise<Product> {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  );

  if (!response.ok) {
    throw new Error('Product not found');
  }

  const data = await response.json();

  if (data.status === 0) {
    throw new Error('Product not found in OpenFoodFacts database');
  }

  const productData = data.product;
  console.log('Product data:', productData);
  console.log('Image URLs:', {
    image_url: productData.image_url,
    image_front_url: productData.image_front_url,
    images: productData.images
  });

  // Build image URL
  let imageUrl = sanitizeText(productData.image_url) || sanitizeText(productData.image_front_url);
  if (!imageUrl && productData.images && productData.images['1']) {
    const barcodePath = barcode.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '$1/$2/$3/$4');
    imageUrl = `https://images.openfoodfacts.org/images/products/${barcodePath}/1.400.jpg`;
  }

  // Calculate eco rating based on available data
  const ecoRating = calculateEcoRating(productData);
  
  // Estimate recyclability based on packaging
  const recyclability = estimateRecyclability(productData.packaging);
  
  // Estimate carbon footprint (OpenFoodFacts doesn't always have this)
  const carbonFootprint = productData.carbon_footprint_from_known_ingredients_100g 
    ? Math.round(productData.carbon_footprint_from_known_ingredients_100g)
    : estimateCarbonFootprint(productData);

  // Get origin
  const origin = productData.origins || 
                 productData.countries || 
                 productData.manufacturing_places || 
                 'Неизвестно';

  // Get labels
  const labels = productData.labels_tags 
    ? productData.labels_tags.map((tag: string) => 
        tag.replace('en:', '').replace(/-/g, ' ')
      ).slice(0, 5)
    : [];

  return {
    barcode,
    name: sanitizeText(productData.product_name) || 'Продукт без названия',
    brand: sanitizeText(productData.brands) || 'Неизвестный бренд',
    ecoRating,
    recyclability,
    carbonFootprint,
    origin,
    category: sanitizeText(productData.categories_tags?.[0]?.replace('en:', '').replace(/-/g, ' ')) || undefined,
    imageUrl,
    packaging: sanitizeText(productData.packaging_text) || sanitizeText(productData.packaging) || undefined,
    labels: sanitizeLabels(labels).length > 0 ? sanitizeLabels(labels) : undefined,
  };
}

function calculateEcoRating(productData: any): 'A' | 'B' | 'C' | 'D' | 'E' {
  // Use Nutri-Score or Eco-Score if available
  if (productData.ecoscore_grade) {
    const grade = productData.ecoscore_grade.toUpperCase();
    // Validate that it's a valid grade
    if (['A', 'B', 'C', 'D', 'E'].includes(grade)) {
      return grade as 'A' | 'B' | 'C' | 'D' | 'E';
    }
  }

  // Fallback estimation based on available data
  let score = 50; // Start at C

  // Positive factors
  if (productData.labels_tags?.some((tag: string) => tag.includes('organic'))) score += 20;
  if (productData.labels_tags?.some((tag: string) => tag.includes('fair-trade'))) score += 10;
  if (productData.additives_n === 0) score += 10;
  
  // Negative factors
  if (productData.additives_n > 5) score -= 15;
  if (productData.nova_group >= 4) score -= 15; // Ultra-processed foods
  if (productData.packaging_tags?.some((tag: string) => tag.includes('plastic'))) score -= 10;

  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 25) return 'D';
  return 'E';
}

function estimateRecyclability(packaging?: string): number {
  if (!packaging) return 60;

  const packagingLower = packaging.toLowerCase();
  
  if (packagingLower.includes('glass') || packagingLower.includes('стекло')) return 95;
  if (packagingLower.includes('paper') || packagingLower.includes('cardboard') || 
      packagingLower.includes('бумага') || packagingLower.includes('картон')) return 90;
  if (packagingLower.includes('pet') || packagingLower.includes('пэт')) return 85;
  if (packagingLower.includes('aluminum') || packagingLower.includes('алюминий')) return 80;
  if (packagingLower.includes('plastic') || packagingLower.includes('пластик')) return 70;
  if (packagingLower.includes('mixed') || packagingLower.includes('смешанн')) return 50;
  
  return 60;
}

function estimateCarbonFootprint(productData: any): number {
  // Rough estimation based on product category
  const category = productData.categories_tags?.[0] || '';
  
  if (category.includes('meat') || category.includes('beef')) return 500;
  if (category.includes('cheese') || category.includes('dairy')) return 300;
  if (category.includes('fish')) return 250;
  if (category.includes('chicken') || category.includes('poultry')) return 200;
  if (category.includes('bread') || category.includes('cereals')) return 80;
  if (category.includes('vegetables') || category.includes('fruits')) return 50;
  
  // Default for processed foods
  return 150;
}