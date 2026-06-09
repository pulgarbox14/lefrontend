import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Boutique (côté client, public)
  layout("components/StorefrontLayout.tsx", [
    index("routes/home.tsx"),
    route("shop", "routes/shop.tsx"),
    route("product/:id", "routes/product.tsx"),
    route("cart", "routes/cart.tsx"),
    route("account", "routes/account.tsx"),
  ]),

  // Authentification
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  // Administration (réservé au rôle admin)
  layout("components/AppLayout.tsx", [
    route("admin", "routes/admin/dashboard.tsx"),
    route("admin/products", "routes/admin/products.tsx"),
    route("admin/orders", "routes/admin/orders.tsx"),
    route("admin/inventory", "routes/admin/inventory.tsx"),
    route("admin/payments", "routes/admin/payments.tsx"),
  ]),
] satisfies RouteConfig;
