import { db } from '../server/db'; // adjust this import path if your db file is elsewhere
import { products, categories } from './schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clear existing data (optional - comment out if you want to append)
  await db.delete(products);
  await db.delete(categories);

  // 2. Insert categories
  const categoryData = [
    { name: 'Épices & Masalas', slug: 'epices-masalas', image: '/images/categories/spices.jpg' },
    { name: 'Riz & Staples', slug: 'riz-staples', image: '/images/categories/rice.jpg' },
    { name: 'Farines & Atta', slug: 'farines-atta', image: '/images/categories/flour.jpg' },
    { name: 'Snacks & Mithai', slug: 'snacks-mithai', image: '/images/categories/snacks.jpg' },
    { name: 'Pickles & Chutneys', slug: 'pickles-chutneys', image: '/images/categories/pickles.jpg' },
  ];

  const insertedCategories = await db.insert(categories).values(categoryData).returning();

  const categoryMap = Object.fromEntries(
    insertedCategories.map(c => [c.slug, c.id])
  );

  console.log(`Inserted ${insertedCategories.length} categories`);

  // 3. Insert products
  const productData = [
    {
      categoryId: categoryMap['epices-masalas'],
      name: 'Shan Bombay Biryani Masala',
      brand: 'Shan',
      description: 'Perfect blend for authentic Bombay-style biryani',
      image: '/images/products/shan-bombay-biryani.jpg',
      weight: '120g',
      originalPrice: '3.49',
      salePrice: '2.79',
      stock: 180,
      isValueDeal: true,
      isBestseller: true,
    },
    {
      categoryId: categoryMap['epices-masalas'],
      name: 'National Chicken Masala',
      brand: 'National',
      description: 'Rich and aromatic spice mix for chicken curry',
      image: '/images/products/national-chicken-masala.jpg',
      weight: '100g',
      originalPrice: '2.99',
      salePrice: '2.49',
      stock: 250,
      isNew: true,
    },
    {
      categoryId: categoryMap['riz-staples'],
      name: 'Heer Superior Basmati Rice',
      brand: 'Heer',
      description: 'Long-grain premium basmati – aged for aroma',
      image: '/images/products/heer-basmati-5kg.jpg',
      weight: '5kg',
      originalPrice: '14.99',
      salePrice: '12.99',
      stock: 90,
      isValueDeal: true,
    },
    {
      categoryId: categoryMap['epices-masalas'],
      name: 'Mehran Nihari Masala',
      brand: 'Mehran',
      description: 'Traditional slow-cooked beef/shank spice blend',
      image: '/images/products/mehran-nihari.jpg',
      weight: '110g',
      originalPrice: '3.29',
      salePrice: '2.69',
      stock: 140,
      isBestseller: true,
    },
    {
      categoryId: categoryMap['epices-masalas'],
      name: 'Shan Butter Chicken Masala',
      brand: 'Shan',
      description: 'Creamy, mild & buttery – restaurant style at home',
      image: '/images/products/shan-butter-chicken.jpg',
      weight: '50g',
      originalPrice: '2.19',
      salePrice: '1.89',
      stock: 320,
      isNew: true,
    },
    {
      categoryId: categoryMap['farines-atta'],
      name: 'Aashirvaad Whole Wheat Atta',
      brand: 'Aashirvaad',
      description: 'Chakki-fresh whole wheat flour for soft rotis',
      image: '/images/products/aashirvaad-atta-5kg.jpg',
      weight: '5kg',
      originalPrice: '8.99',
      salePrice: '7.49',
      stock: 110,
      isValueDeal: true,
    },
    {
      categoryId: categoryMap['snacks-mithai'],
      name: 'Haldiram’s Aloo Bhujia',
      brand: 'Haldiram’s',
      description: 'Crispy, spicy potato snack – classic Indian namkeen',
      image: '/images/products/haldirams-aloo-bhujia.jpg',
      weight: '200g',
      originalPrice: '2.29',
      salePrice: '1.79',
      stock: 400,
      isBestseller: true,
    },
    {
      categoryId: categoryMap['pickles-chutneys'],
      name: 'Mother’s Recipe Mango Pickle',
      brand: 'Mother’s Recipe',
      description: 'Spicy & tangy – traditional South Indian style',
      image: '/images/products/mothers-mango-pickle.jpg',
      weight: '400g',
      originalPrice: '4.49',
      salePrice: '3.99',
      stock: 200,
      isNew: true,
    },
    {
      categoryId: categoryMap['epices-masalas'],
      name: 'Laziza Karahi Gosht Masala',
      brand: 'Laziza',
      description: 'Bold flavor for restaurant-style karahi',
      image: '/images/products/laziza-karahi.jpg',
      weight: '100g',
      originalPrice: '2.79',
      salePrice: '2.29',
      stock: 160,
      isValueDeal: true,
    },
    {
      categoryId: categoryMap['riz-staples'],
      name: 'Daawat Super Basmati Rice',
      brand: 'Daawat',
      description: 'Extra-long grain – premium aroma & texture',
      image: '/images/products/daawat-basmati-5kg.jpg',
      weight: '5kg',
      originalPrice: '16.99',
      salePrice: '14.49',
      stock: 70,
      isBestseller: true,
    },
  ];

  await db.insert(products).values(productData);

  console.log(`Seeded ${productData.length} products successfully! 🌟`);
  console.log('Seed complete. Run `npm run dev` to see the site.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
