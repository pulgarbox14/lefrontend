# 🛍️ MyShop — Boutique e-commerce (frontend)

Boutique de mode en ligne : **vêtements, chaussures, accessoires**. Deux espaces :

- **Boutique (client)** — accueil, catalogue avec filtres par catégorie + recherche,
  fiche produit, panier et passage de commande, compte client.
- **Administration (admin)** — tableau de bord, gestion des produits, commandes,
  stock et paiements.

Construit avec **React Router v7**, **TypeScript** et **Tailwind CSS v4**.

## Prérequis : le backend

Ce dépôt ne contient que le **frontend**. Il a besoin du **backend** (API REST,
`http://localhost:3000` par défaut) exposant :

| Méthode | Route | Corps |
| --- | --- | --- |
| POST | `/auth/login` | `{ email, password }` → token (+ `user` si possible) |
| POST | `/auth/register` | `{ email, password }` |
| GET / POST / DELETE | `/products` | `{ name, price, stock, category?, imageUrl?, description? }` |
| GET / POST / DELETE | `/orders` | `{ customerName, quantity, totalPrice }` |
| GET / POST / DELETE | `/inventory` | `{ productName, quantity, price }` |
| GET / POST / DELETE | `/payments` | `{ amount, paymentMethod }` |

### Rôles (admin / client)

L'accès à `/admin` est réservé aux administrateurs. Le frontend détermine le rôle
ainsi (dans l'ordre) :

1. `user.role` dans la réponse de `/auth/login` (`"admin"` ou `"user"`), **ou**
2. `role` / `roles` dans le payload du **JWT**.

➡️ Pour qu'un compte soit admin, le backend doit renvoyer `role: "admin"` (sinon
l'utilisateur est traité comme client). Tout le monde peut s'inscrire comme client.

### Champs produits pour la mode

Pour de vrais produits de mode, ajoute ces champs (optionnels) à ton entité/DTO
`Product` côté backend : `category` (`vetements` | `chaussures` | `accessoires` |
`mode`), `imageUrl`, `description`. S'ils sont absents, la boutique reste
fonctionnelle (image de remplacement, pas de catégorie).

## Démarrage

```bash
cp .env.example .env      # configure VITE_API_URL si besoin
npm install
npm run dev               # http://localhost:5173  (+ backend sur :3000)
```

Autres scripts : `npm run typecheck`, `npm run build`, `npm run start`.

## Structure

```
app/
├── routes.ts                 # routing (boutique / auth / admin)
├── root.tsx                  # HTML + AuthProvider + CartProvider
├── routes/
│   ├── home.tsx  shop.tsx  product.tsx  cart.tsx  account.tsx   # boutique
│   ├── login.tsx  register.tsx                                  # auth
│   └── admin/  dashboard, products, orders, inventory, payments # admin
├── components/               # StorefrontLayout, AppLayout, ProductCard,
│                             # DataTable, CrudPage, ConfirmDialog, ui...
├── hooks/useCrud.ts          # liste / création / suppression génériques
└── lib/                      # api, auth (rôles), cart, session, jwt, types,
                              # categories, format
```

Les pages d'admin (produits, commandes, stock, paiements) sont générées par un
composant `CrudPage` configurable. La boutique partage les mêmes composants UI.
