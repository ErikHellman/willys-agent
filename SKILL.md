---
name: willys-cli
description: Manages grocery shopping at Willys.se. Search for products, browse categories, and manage a shopping cart. Use when the user wants to find groceries, add/remove items from their Willys cart, or view their cart.
argument-hint: "[search query or command]"
allowed-tools: Bash(willys-cli *)
---

# Willys Grocery CLI

A CLI tool for shopping at Willys.se (Swedish grocery store).

Credentials are read from WILLYS_USERNAME and WILLYS_PASSWORD environment variables,
or from a .env file in the current directory. They can also be passed with -u and -p flags.

## Commands

### Search for products

```bash
# Search for products (default 10 results)
willys-cli search mjölk

# Search with a specific number of results (fetches multiple pages if needed)
willys-cli search "ekologisk mjölk" 20
```

Output includes product name, brand, volume, price, compare price, and product code.

### Browse categories

```bash
# List all top-level categories (with 2 levels of subcategories)
willys-cli categories

# Browse products in a specific category
willys-cli browse frukt-och-gront/frukt/citrusfrukt
```

Category paths use the URL-style paths shown in the categories output (e.g. `kott-chark-och-fagel/korv`).

### Cart operations

```bash
# Show current cart
willys-cli cart

# Add a product (product code from search results, optional quantity defaults to 1)
willys-cli add 101233933_ST 2

# Remove a product
willys-cli remove 101233933_ST

# Clear entire cart
willys-cli clear
```

Cart-modifying operations (add, remove, clear) print the updated cart after each change.

### Batch operations from CSV file

```bash
willys-cli -i shopping-list.csv
```

CSV format (one operation per line, lines starting with # are ignored):
```
add,101233933_ST,2
add,101205823_ST,1
remove,101233933_ST
cart
clear
```

## Product codes

Product codes look like `101233933_ST` or `100126409_KG`. They are shown in parentheses
in search and browse output. Always use the exact code from the output.

## Typical workflow

1. Search for a product: `willys-cli search mjölk`
2. Pick a product code from the results
3. Add it to cart: `willys-cli add 101233933_ST 2`
4. Review the cart: `willys-cli cart`
5. Repeat steps 1-4 until the cart is complete

## Tips

- When the user asks to "add milk", first search for it, present the options, and let them pick before adding.
- Use `willys-cli categories` to help the user browse when they don't know exactly what they want.
- Product codes ending in `_ST` are sold per item, `_KG` are sold by weight.
- Always show the updated cart after modifications so the user can verify.
