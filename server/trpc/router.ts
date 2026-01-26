import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { db } from '../db'; // adjust path to your Drizzle db instance
import { products, categories, cartItems, orders, orderItems, users } from '../../drizzle/schema';
import { eq, like, and, sql, desc, asc } from 'drizzle-orm';
import superjson from 'superjson';

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  // ──────────────────────────────────────────────
  // Products
  // ──────────────────────────────────────────────
  products: {
    list: t.procedure
      .input(
        z.object({
          categoryId: z.number().optional(),
          search: z.string().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          sort: z.enum(['price-asc', 'price-desc', 'newest']).optional().default('newest'),
          limit: z.number().optional().default(20),
        }).optional()
      )
      .query(async ({ input }) => {
        let query = db.select().from(products);

        if (input?.categoryId) {
          query = query.where(eq(products.categoryId, input.categoryId));
        }

        if (input?.search) {
          const searchTerm = `%${input.search}%`;
          query = query.where(
            or(
              like(products.name, searchTerm),
              like(products.brand, searchTerm)
            )
          );
        }

        if (input?.minPrice !== undefined) {
          query = query.where(sql`${products.salePrice} >= ${input.minPrice}`);
        }

        if (input?.maxPrice !== undefined) {
          query = query.where(sql`${products.salePrice} <= ${input.maxPrice}`);
        }

        // Sorting
        if (input?.sort === 'price-asc') {
          query = query.orderBy(asc(products.salePrice));
        } else if (input?.sort === 'price-desc') {
          query = query.orderBy(desc(products.salePrice));
        } else {
          query = query.orderBy(desc(products.createdAt)); // newest first
        }

        return await query.limit(input?.limit ?? 20);
      }),

    getById: t.procedure
      .input(z.number())
      .query(async ({ input: id }) => {
        const result = await db
          .select()
          .from(products)
          .where(eq(products.id, id))
          .limit(1);

        return result[0] ?? null;
      }),

    getValueDeals: t.procedure.query(async () => {
      return db
        .select()
        .from(products)
        .where(eq(products.isValueDeal, true))
        .orderBy(desc(products.createdAt))
        .limit(12);
    }),

    getBestsellers: t.procedure.query(async () => {
      return db
        .select()
        .from(products)
        .where(eq(products.isBestseller, true))
        .orderBy(desc(products.createdAt))
        .limit(12);
    }),

    getNewArrivals: t.procedure.query(async () => {
      return db
        .select()
        .from(products)
        .where(eq(products.isNew, true))
        .orderBy(desc(products.createdAt))
        .limit(12);
    }),
  },

  // ──────────────────────────────────────────────
  // Categories
  // ──────────────────────────────────────────────
  categories: {
    list: t.procedure.query(async () => {
      return db.select().from(categories);
    }),

    getBySlug: t.procedure
      .input(z.string())
      .query(async ({ input: slug }) => {
        const result = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, slug))
          .limit(1);

        return result[0] ?? null;
      }),
  },

  // ──────────────────────────────────────────────
  // Cart (protected - requires user context)
  // ──────────────────────────────────────────────
  cart: {
    getCart: t.procedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) throw new Error('Not authenticated');

      const items = await db
        .select({
          id: cartItems.id,
          quantity: cartItems.quantity,
          product: products,
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, ctx.user.id));

      return items;
    }),

    addItem: t.procedure
      .input(z.object({ productId: z.number(), quantity: z.number().min(1) }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.id) throw new Error('Not authenticated');

        // Check if item already exists
        const existing = await db
          .select()
          .from(cartItems)
          .where(
            and(
              eq(cartItems.userId, ctx.user.id),
              eq(cartItems.productId, input.productId)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(cartItems)
            .set({ quantity: existing[0].quantity + input.quantity })
            .where(eq(cartItems.id, existing[0].id));
        } else {
          await db.insert(cartItems).values({
            userId: ctx.user.id,
            productId: input.productId,
            quantity: input.quantity,
          });
        }

        return { success: true };
      }),

    removeItem: t.procedure
      .input(z.number())
      .mutation(async ({ ctx, input: cartItemId }) => {
        if (!ctx.user?.id) throw new Error('Not authenticated');

        await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
        return { success: true };
      }),
  },

  // Add more routers (orders, admin, etc.) later as needed
});

export type AppRouter = typeof appRouter;
