# 🍽️ Dari Belle — Luxury Lifestyle (Tiaret, Algérie)

Plateforme e-commerce Full Stack **MERN** (MongoDB, Express.js, React 18, Node.js) conçue sur mesure pour **Dari Belle**, magasin de référence en arts de la table, vaisselle de luxe, marmites granite & inox, ménagères royales et petit électroménager situé à **Tiaret (Algérie)**.

> **Slogans de la marque :**  
> 🌟 *« 3AMRI DAREK M3ANA »* (عمري دارك معانا)  
> 🌟 *« La Beauté a Son Adresse »*  
> 🌟 *« LUXURY LIFESTYLE »*  
> 📍 **Adresse physique :** Route Lacadémie, à côté du Printemps, Tiaret – Algérie  
> 📞 **Téléphones :** 06 59 40 84 03 / 05 51 00 70 98

---

## 🎨 Identité Visuelle & Expérience Utilisateur

- **Charte Graphique :**
  - `Jaune Moutarde (#F2A81D)` : Chaleur, prestige et accents or.
  - `Turquoise (#3FB8A8)` : Sérénité, fraîcheur et éléments de réassurance.
  - `Rouge Framboise (#D42A52)` : Couleur identitaire du logo Dari Belle et des CTA majeurs.
  - `Bleu Nuit (#1B1F4A)` : Structure, typographie de prestige et footer royal.
  - `Blanc Cassé (#FFFDF8)` : Fond porcelaine doux et chaleureux.
- **Polices Google Fonts :**
  - `Playfair Display` : Titres de prestige avec empattements élégants.
  - `Jost` : Typographie épurée pour les textes et l'UI e-commerce.
  - `Great Vibes` : Calligraphie cursive pour les slogans signature.
  - `Cairo` : Typographie arabe moderne avec prise en charge **RTL intégrale**.
- **Signatures Graphiques :** Vagues décoratives inspirées des cartes de visite, cadres et silhouettes en arche/maisonette inspirés du logo Dari Belle, badges dorés.

---

## 🚀 Stack Technique Imposée

### Frontend (`/client`)
- **React 18** + **Vite** (JavaScript ESM)
- **Tailwind CSS** (Palette Dari Belle, utilitaires sur-mesure)
- **Framer Motion** & **Swiper.js** (Animations et carousels fluides)
- **Zustand** (Panier persistant en `localStorage`, gestion de l'auth et de l'UI)
- **React Router v6** (Navigation publique & Espace administration protégé)
- **react-i18next** (Français par défaut + Arabe avec basculement automatique `dir="rtl"`)
- **Recharts** (Statistiques et visualisations graphiques de vente)
- **react-helmet-async** (Référencement naturel & méta-données dynamiques)
- **react-hot-toast** (Notifications interactives)
- **Lucide React** (Iconographie vectorielle)

### Backend (`/server`)
- **Node.js 20+** + **Express.js** (ES Modules)
- **Mongoose & MongoDB** (Schémas bilingues FR/AR, indexation texte, transactions)
- **Sécurité :** Helmet, CORS avec cookies sécurisés, express-rate-limit, express-mongo-sanitize
- **Authentification :** JWT (Access token court + Refresh token en cookie httpOnly) + bcryptjs
- **Services Métier :**
  - `pdfkit` : Génération automatisée des Factures et Bons de Commande PDF format A4
  - `exceljs` : Exportation complète de l'inventaire en classeur Excel (`.xlsx`)
  - `csv-parser` : Importation et mise à jour de stock par fichier CSV
  - `multer` : Gestion des uploads d'images et de fichiers

---

## 📁 Arborescence du Projet

```text
dariBelle/
├── client/
│   ├── src/
│   │   ├── api/             # Client Axios & endpoints API REST
│   │   ├── assets/          # Ressources statiques
│   │   ├── components/
│   │   │   ├── admin/       # Layout backoffice, sidebar, stat cards
│   │   │   ├── home/        # Slider hero, catégories, réassurance, story
│   │   │   ├── layout/      # Header, Footer, CartDrawer, MobileNav, QuickOrderModal
│   │   │   ├── product/     # ProductCard, variantes, galerie
│   │   │   └── ui/          # Boutons, inputs, modal, vagues SVG, badges maison
│   │   ├── i18n/            # i18n config, locales/fr.json et locales/ar.json
│   │   ├── pages/
│   │   │   ├── admin/       # Dashboard, Commandes, Produits, Inventaire, etc.
│   │   │   └── public/      # Accueil, Catalogue, Fiche Produit, Panier, Checkout, etc.
│   │   ├── routes/          # AppRoutes.jsx, ProtectedRoute.jsx
│   │   ├── store/           # cartStore.js, authStore.js, uiStore.js
│   │   ├── utils/           # Formatage DZD, liste des 58 wilayas
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/          # Connexion MongoDB, Cloudinary
│   │   ├── controllers/     # Contrôleurs API REST
│   │   ├── middlewares/     # JWT Auth, Validation, Upload, Error Handler
│   │   ├── models/          # Modèles Mongoose (Product, Order, StockMovement, etc.)
│   │   ├── routes/          # authRoutes, publicRoutes, adminRoutes
│   │   ├── services/        # Générateur PDF Facture, Export Excel, Gestion Stocks
│   │   ├── utils/           # Wilayas d'Algérie, tokens, réponses API
│   │   ├── seed/            # Seeding des 58 wilayas, catalogue vaisselle, comptes
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── .env.example
└── README.md
```

---

## 📦 Spécificités E-Commerce Algérie

1. **Paiement à la Livraison (COD - Cash On Delivery) :**
   - Aucune carte bancaire requise au passage de commande.
   - Confirmation rapide par téléphone ou direct **WhatsApp** avec message pré-rempli.
2. **Prise en charge des 58 Wilayas d'Algérie :**
   - Sélection interactive parmi les 58 Wilayas (Tiaret en local à 350 DZD, wilayas limitrophes et grand sud).
   - Calcul en temps réel de la livraison à domicile vs Stop Desk (point relais).
   - Livraison offerte dès 35 000 DZD d'achats.
3. **Commande Express en 1-Clic :**
   - Bouton d'achat direct sans passer par le panier pour maximiser les conversions mobiles.
4. **Suivi Public de Commande :**
   - Suivi en ligne via le numéro de commande (ex: `DB-XXXXXX-XXX`) avec timeline d'avancement.
5. **Garantie Emballage Anti-Casse Spécial Vaisselle :**
   - Protection renforcée pour la porcelaine fine et le cristal lors de l'acheminement national.

---

## 🛠️ Installation & Démarrage

### 1. Prérequis
- **Node.js** v18+ ou v20+
- **MongoDB** (Local ou cluster MongoDB Atlas)

### 2. Configuration du Backend (`/server`)
```bash
cd server
cp .env.example .env
npm install
npm run seed     # Peuple la base avec les 58 wilayas, produits luxe, admin & manager
npm start        # Démarre l'API sur http://localhost:5000
```

### 3. Configuration du Frontend (`/client`)
```bash
cd ../client
cp .env.example .env
npm install
npm run dev      # Démarre l'application sur http://localhost:5173
```

---

## 🔑 Identifiants d'Administration Démo

Rendez-vous sur [http://localhost:5173/admin/login](http://localhost:5173/admin/login) :

| Rôle | Email | Mot de passe | Permissions |
| :--- | :--- | :--- | :--- |
| **Superadmin (Directeur)** | `admin@daribelle.com` | `admin123456` | Accès complet : stats, commandes, factures, produits, bannières, prix wilayas |
| **Stock Manager** | `stock@daribelle.com` | `stock123456` | Gestion d'inventaire, entrées/sorties, ajustements, exports Excel |

---

## 📄 API REST (/api/v1)

### Authentification
- `POST /api/v1/auth/login` : Connexion admin & émission du JWT.
- `POST /api/v1/auth/refresh` : Rafraîchissement automatique du token.
- `POST /api/v1/auth/logout` : Révocation du cookie httpOnly.
- `GET /api/v1/auth/me` : Profil de l'utilisateur connecté.

### Public
- `GET /api/v1/products` : Liste des articles avec filtres (catégorie, prix, tag, stock, tri, recherche).
- `GET /api/v1/products/:slug` : Détail d'un article et produits similaires.
- `GET /api/v1/categories` : Liste des catégories.
- `GET /api/v1/hero-slides` : Bannières actives pour la page d'accueil.
- `GET /api/v1/shipping-zones` : Tarifs de livraison des 58 Wilayas.
- `POST /api/v1/orders` : Enregistrement d'une commande COD & décrémentation de stock.
- `GET /api/v1/orders/track/:orderNumber` : Suivi public d'une commande.
- `POST /api/v1/coupons/validate` : Validation d'un code promo.
- `GET /api/v1/settings` : Coordonnées du showroom à Tiaret.

### Administration (JWT Protégé)
- `GET /api/v1/admin/stats` : KPIs, séries temporelles 30 jours, top ventes.
- `GET /api/v1/admin/orders` : Liste et filtrage des commandes.
- `PATCH /api/v1/admin/orders/:id/status` : Changement de statut et restock en cas d'annulation.
- `GET /api/v1/admin/orders/:id/invoice` : Génération et téléchargement de la **Facture PDF A4**.
- `CRUD /api/v1/admin/products` : Gestion des fiches produits et variantes.
- `GET /api/v1/admin/inventory` : Tableau d'inventaire valorisé.
- `POST /api/v1/admin/inventory/movements` : Saisie des mouvements de stock (entrée, sortie, ajustement, retour).
- `GET /api/v1/admin/inventory/export` : Export Excel `.xlsx` complet.
- `POST /api/v1/admin/inventory/import` : Import CSV de mise à jour des stocks.
- `CRUD /api/v1/admin/hero-slides` : Gestion des bannières du carousel.
- `CRUD /api/v1/admin/coupons` : Gestion des codes de réduction.
- `PUT /api/v1/admin/shipping-zones/:id` : Mise à jour des frais de livraison par wilaya.

---

© 2026 **Dari Belle** — Tiaret, Algérie. Tous droits réservés.