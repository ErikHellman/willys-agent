import "dotenv/config";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { WillysApi } from "./willys-api.js";

const username = process.env.WILLYS_USERNAME?.replace(/^"|"$/g, "") ?? "";
const password = process.env.WILLYS_PASSWORD?.replace(/^"|"$/g, "") ?? "";
const hasCredentials = username !== "" && password !== "";

describe.skipIf(!hasCredentials)("Willys API Integration", { timeout: 30_000 }, () => {
  const api = new WillysApi();

  beforeAll(async () => {
    await api.login(username, password);
  });

  afterAll(async () => {
    try {
      await api.logout();
    } catch {
      // ignore logout errors during cleanup
    }
  });

  it("should login and return a customer profile", async () => {
    const customer = await api.getCustomer();
    expect(customer.name).toBeTruthy();
    expect(customer.email).toBeTruthy();
    expect(customer.storeId).toBeDefined();
  });

  it("should search for products", async () => {
    const results = await api.search("mjölk", 0, 5);
    expect(results.pagination.totalNumberOfResults).toBeGreaterThan(0);
    expect(results.results.length).toBeGreaterThan(0);

    const product = results.results[0];
    expect(product.name).toBeTruthy();
    expect(product.code).toBeTruthy();
    expect(product.price).toBeDefined();
  });

  it("should get categories", async () => {
    const tree = await api.getCategories();
    expect(tree.title).toBeTruthy();
    expect(tree.children.length).toBeGreaterThan(0);
  });

  it("should browse a category", async () => {
    const results = await api.browseCategory("frukt-och-gront/frukt/citrusfrukt", 0, 5);
    expect(results.pagination.totalNumberOfResults).toBeGreaterThan(0);
    expect(results.results.length).toBeGreaterThan(0);
  });

  it("should add to and remove from cart", async () => {
    const searchResult = await api.search("mjölk", 0, 1);
    const product = searchResult.results[0];
    expect(product).toBeDefined();

    await api.addToCart([{ code: product.code, qty: 1 }]);
    const cartAfterAdd = await api.getCart();
    expect(cartAfterAdd.totalUnitCount).toBeGreaterThan(0);

    await api.removeFromCart(product.code);
    const cartAfterRemove = await api.getCart();
    expect(cartAfterRemove.totalUnitCount).toBeLessThan(cartAfterAdd.totalUnitCount);
  });

  it("should clear the cart", async () => {
    const searchResult = await api.search("mjölk", 0, 1);
    await api.addToCart([{ code: searchResult.results[0].code, qty: 1 }]);

    await api.clearCart();
    const cart = await api.getCart();
    expect(cart.totalUnitCount).toBe(0);
  });
});
