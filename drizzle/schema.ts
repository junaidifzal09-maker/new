import { mysqlTable, int, varchar, text, decimal, boolean, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const categories = mysqlTable('categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  image: varchar('image', { length: 500 }),
});

export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  categoryId: int('categoryId').notNull().references(() => categories.id),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 100 }),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  weight: varchar('weight', { length: 50 }),
  originalPrice: decimal('originalPrice', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('salePrice', { precision: 10, scale: 2 }).notNull(),
  stock: int('stock').default(100).notNull(),
  isValueDeal: boolean('isValueDeal').default(false),
  isBestseller: boolean('isBestseller').default(false),
  isNew: boolean('isNew').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const cartItems = mysqlTable('cartItems', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id),
  productId: int('productId').notNull().references(() => products.id),
  quantity: int('quantity').notNull().default(1),
});

export const orders = mysqlTable('orders', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id),
  orderNumber: varchar('orderNumber', { length: 50 }).unique().notNull(),
  status: mysqlEnum('status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).default('pending'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal('shippingCost', { precision: 10, scale: 2 }).default('0'),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text('shippingAddress').notNull(),
  shippingCity: varchar('shippingCity', { length: 100 }).notNull(),
  shippingPostalCode: varchar('shippingPostalCode', { length: 20 }).notNull(),
  shippingCountry: varchar('shippingCountry', { length: 100 }).notNull(),
  customerEmail: varchar('customerEmail', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const orderItems = mysqlTable('orderItems', {
  id: int('id').primaryKey().autoincrement(),
  orderId: int('orderId').notNull().references(() => orders.id),
  productId: int('productId').notNull().references(() => products.id),
  productName: varchar('productName', { length: 255 }).notNull(),
  quantity: int('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
});

// Relations (optional but helpful)
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));
