import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import HeroSlide from "../models/HeroSlide.js";
import Coupon from "../models/Coupon.js";
import ShippingZone from "../models/ShippingZone.js";
import Settings from "../models/Settings.js";
import { ALGERIA_WILAYAS } from "../utils/wilayasAlgeria.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dari_belle";

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Clear existing collections
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Brand.deleteMany(),
      Product.deleteMany(),
      HeroSlide.deleteMany(),
      Coupon.deleteMany(),
      ShippingZone.deleteMany(),
      Settings.deleteMany(),
    ]);
    console.log("Cleared existing collections.");

    // 1. Users
    const users = await User.create([
      {
        name: "Directeur Dari Belle",
        email: "admin@daribelle.com",
        password: "admin123456",
        role: "superadmin",
        isActive: true,
      },
      {
        name: "Gestionnaire Stock Tiaret",
        email: "stock@daribelle.com",
        password: "stock123456",
        role: "stock_manager",
        isActive: true,
      },
    ]);
    console.log(`Created ${users.length} administrative users.`);

    // 2. Settings
    await Settings.create({
      storeName: "Dari Belle",
      slogans: {
        luxury: "LUXURY LIFESTYLE",
        ar: "3AMRI DAREK M3ANA",
        fr: "La Beauté a Son Adresse",
      },
      address: {
        wilaya: "Tiaret",
        street: "Route Lacadémie, à côté du Printemps",
        country: "Algérie",
        mapsUrl: "https://maps.google.com/?q=Tiaret+Algeria",
      },
      phones: ["06 59 40 84 03", "05 51 00 70 98"],
      emails: ["contact@daribelle-dz.com", "service.daribelle@gmail.com"],
      socialMedia: {
        facebook: "https://facebook.com/daribelle.tiaret",
        instagram: "https://instagram.com/daribelle.tiaret",
        tiktok: "https://tiktok.com/@daribelle_officiel",
        whatsapp: "213659408403",
      },
      openingHours: {
        fr: "Samedi - Jeudi : 09h00 - 19h30 | Vendredi : 14h30 - 20h00",
        ar: "السبت إلى الخميس: 09:00 إلى 19:30 | الجمعة: 14:30 إلى 20:00",
      },
      defaultLowStockThreshold: 5,
      freeShippingThreshold: 35000,
    });
    console.log("Created Store Settings.");

    // 3. Shipping Zones (58 wilayas)
    const zones = ALGERIA_WILAYAS.map((w) => ({
      wilayaCode: w.code,
      wilaya: {
        fr: `${w.code} - ${w.nameFr}`,
        ar: `${w.code} - ${w.nameAr}`,
      },
      fee: w.fee,
      deskFee: Math.max(250, w.fee - 200),
      deliveryDays: w.deliveryDays,
      isActive: true,
    }));
    await ShippingZone.insertMany(zones);
    console.log(`Inserted ${zones.length} Shipping Zones (58 Wilayas of Algeria).`);

    // 4. Brands
    const brands = await Brand.create([
      { name: "Dari Belle Prestige", logo: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=200" },
      { name: "Karaca Luxury Home", logo: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200" },
      { name: "Korkmaz Turkey", logo: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=200" },
      { name: "Hascevher Elite", logo: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=200" },
      { name: "Luminarc Imperial", logo: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200" },
    ]);
    console.log(`Created ${brands.length} Brands.`);

    // 5. Categories
    const categories = await Category.create([
      {
        name: {
          fr: "Services de Table & Porcelaine",
          ar: "أطقم المائدة والبورسلان الفاخر",
        },
        slug: "services-de-table",
        image: "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=600&auto=format&fit=crop",
        order: 1,
      },
      {
        name: {
          fr: "Marmites, Casseroles & Faitouts",
          ar: "القدور والطناجر الفاخرة",
        },
        slug: "marmites-et-casseroles",
        image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop",
        order: 2,
      },
      {
        name: {
          fr: "Ménagères & Couverts Dorés",
          ar: "أطقم الملاعق والسكاكين الملكية",
        },
        slug: "menageres-et-couverts",
        image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop",
        order: 3,
      },
      {
        name: {
          fr: "Verrerie & Tasses à Thé/Café",
          ar: "كؤوس وأطقم الشاي والقهوة",
        },
        slug: "verrerie-et-tasses",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop",
        order: 4,
      },
      {
        name: {
          fr: "Petit Électroménager Cuisine",
          ar: "أجهزة كهرومنزلية راقية للمطبخ",
        },
        slug: "petit-electromenager",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop",
        order: 5,
      },
      {
        name: {
          fr: "Décoration & Présentoirs de Table",
          ar: "ديكور المطبخ وحوامل الحلويات",
        },
        slug: "decoration-et-presentoirs",
        image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop",
        order: 6,
      },
    ]);
    console.log(`Created ${categories.length} Categories.`);

    // 6. Products
    const products = await Product.create([
      {
        name: {
          fr: "Service de Table Impérial Porcelaine Dorée 84 Pièces",
          ar: "طقم سفرة ملكي بورسلان مذهب 84 قطعة",
        },
        slug: "service-de-table-imperial-porcelaine-84-pieces",
        description: {
          fr: "L'excellence des arts de la table pour les grandes réceptions algériennes. Porcelaine fine de haute qualité rehaussée de liserés dorés 24 carats inaltérables. Comprend assiettes plates, creuses, à dessert, soupière d'apparat, saladiers, saucière et plats de service ovales.",
          ar: "قمة الفخامة لمناسباتك وعزوماتك الراقية. بورسلان نقي عالي الجودة مزين بزخارف ذهبية عيار 24 قيراط مقاومة للغسيل. يشمل صحون مسطحة وغائرة، طاجين حساء ملكي، أواني تقديم بيضاوية وسلطانيات متكاملة.",
        },
        images: [
          "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop",
        ],
        category: categories[0]._id,
        brand: brands[0]._id,
        sku: "DB-PORC-84P-01",
        purchasePrice: 28000,
        price: 42000,
        salePrice: 38500,
        stock: 14,
        lowStockThreshold: 4,
        tags: ["bestseller", "promo"],
        isPublished: true,
        soldCount: 38,
        attributes: {
          "Nombre de pièces": "84 pièces",
          "Matériau": "Porcelaine Bone China",
          "Finition": "Or 24K & motifs arabesques",
          "Usage": "Compatible lave-vaisselle (programme délicat)",
        },
      },
      {
        name: {
          fr: "Batterie de Cuisine Granite Royal 10 Pièces - Poignées Dorées",
          ar: "طقم طناجر وقدور جرانيت ملكي 10 قطع - مقابض ذهبية",
        },
        slug: "batterie-cuisine-granite-royal-10-pieces",
        description: {
          fr: "Préparez vos plats traditionnels (Chorba, Couscous, Tajine) avec un confort absolu. Revêtement antiadhésif multicouche granite allemand écologique sans PFOA. Couvercles en verre trempé cerclés d'or.",
          ar: "أعدي أشهى الأطباق الجزائرية التقليدية كالشوربة والكسكسي والطواجن. طبقات جرانيت ألماني عالي الجودة غير لاصق وصحي خالٍ من PFOA، مع أغطية زجاجية معززة بمقابض مقاومة للحرارة.",
        },
        images: [
          "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop",
        ],
        category: categories[1]._id,
        brand: brands[1]._id,
        sku: "DB-GRAN-10P-GRY",
        purchasePrice: 19000,
        price: 29500,
        salePrice: 26900,
        stock: 9,
        lowStockThreshold: 3,
        tags: ["bestseller"],
        isPublished: true,
        soldCount: 52,
        attributes: {
          "Nombre de pièces": "10 pièces (4 faitouts + 1 poêle + couvercles)",
          "Épaisseur": "5 mm fond thermo-diffuseur",
          "Compatibilité": "Tous feux dont induction",
        },
      },
      {
        name: {
          fr: "Coffret Ménagère Prestige Or Miroir 72 Pièces en Valise Velours",
          ar: "حقيبة ملاعق وسكاكين برستيج ذهبية 72 قطعة بمخمل فاخر",
        },
        slug: "coffret-menagere-prestige-or-72-pieces",
        description: {
          fr: "Une ménagère de haute orfèvrerie en acier inoxydable 18/10 finition titane doré miroir. Présentée dans sa sublime mallette capitonnée de velours bordeaux. Parfait pour les trousseaux de mariée (Tasdira).",
          ar: "حقيبة ملاعق وسكاكين ملكية مصنوعة من الفولاذ المقاوم للصدأ 18/10 مطلي بطبقة تيتانيوم ذهبي لامع. تأتي داخل علبة خشبية مبطنة بالمخمل الفاخر، مثالية لجهاز العروس الجزائرية.",
        },
        images: [
          "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=800&auto=format&fit=crop",
        ],
        category: categories[2]._id,
        brand: brands[2]._id,
        sku: "DB-MENAG-72P-GOLD",
        purchasePrice: 16000,
        price: 24500,
        salePrice: 22000,
        stock: 6,
        lowStockThreshold: 3,
        tags: ["new", "bestseller"],
        isPublished: true,
        soldCount: 41,
        attributes: {
          "Composition": "12 cuillères soupe, 12 fourchettes, 12 couteaux, 12 cuillères café, 12 fourchettes gâteau + 12 couverts de service",
          "Acier": "Inox 18/10 Haute Qualité",
          "Garantie": "Anti-ternissement",
        },
      },
      {
        name: {
          fr: "Ensemble Service à Thé & Café Sultan Cristal & Or 18 Pièces",
          ar: "طقم شاي وقهوة السلطان كريستال مذهب 18 قطعة",
        },
        slug: "service-the-cafe-sultan-cristal-or-18-pieces",
        description: {
          fr: "L'art de l'accueil traditionnel sublimé. Verres en cristal soufflé bouche décorés de motifs ottomans dorés, accompagnés de soucoupes festonnées et cuillères assorties.",
          ar: "أصالة الضيافة في أبهى حلة. كؤوس كريستال مزخرفة بنقوش أندلسية عثمانية ذهبية، مع صحون تقديم متناسقة وملاعق سكر مذهبة لتقديم الشاي والقهوة لضيوفك.",
        },
        images: [
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop",
        ],
        category: categories[3]._id,
        brand: brands[0]._id,
        sku: "DB-THE-18P-CRIST",
        purchasePrice: 6500,
        price: 11500,
        salePrice: 9800,
        stock: 22,
        lowStockThreshold: 5,
        tags: ["new"],
        isPublished: true,
        soldCount: 29,
        attributes: {
          "Nombre de pièces": "6 tasses cristal + 6 soucoupes dorées + 6 cuillères décoratives",
          "Origine": "Importation artisanale prestige",
        },
      },
      {
        name: {
          fr: "Friteuse sans Huile Air Fryer Touch Screen 7.5L Gold Edition",
          ar: "قلاية هوائية رقمية 7.5 لتر بدون زيت مع لمسات ذهبية",
        },
        slug: "air-fryer-touch-screen-75l-gold-edition",
        description: {
          fr: "Cuisinez sainement pour toute la famille avec 85% de matières grasses en moins. Écran tactile intuitif avec 10 programmes préenregistrés, cuve XL antiadhésive de 7.5 litres, design chic blanc et or pour illuminer votre plan de travail.",
          ar: "اطبخي طعاماً صحياً ومقرمشاً بدون زيوت لجميع أفراد العائلة. سعة كبيرة جداً 7.5 لتر مع شاشة لمس و10 برامج ذكية للطهي السريع، وبتصميم رخامي أبيض مع إطار ذهبي رائع.",
        },
        images: [
          "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop",
        ],
        category: categories[4]._id,
        brand: brands[3]._id,
        sku: "DB-ELEC-AF75L-W",
        purchasePrice: 14500,
        price: 21900,
        salePrice: 18900,
        stock: 8,
        lowStockThreshold: 3,
        tags: ["promo", "bestseller"],
        isPublished: true,
        soldCount: 65,
        attributes: {
          "Puissance": "1800 Watts",
          "Capacité": "7.5 Litres XL",
          "Technologie": "Circulation d'air 360°",
          "Garantie": "12 Mois avec SAV à Tiaret",
        },
      },
      {
        name: {
          fr: "Présentoir à Gâteaux & Pâtisseries 3 Étages Porcelaine & Laiton",
          ar: "حامل كعك وحلويات راقي 3 طبقات بورسلان ونحاس ذهبي",
        },
        slug: "presentoir-gateaux-3-etages-porcelaine-laiton",
        description: {
          fr: "Sublimez vos tables de fête de l'Aïd, fiançailles et réceptions. Trois plateaux en porcelaine festonnée montés sur tige centrale en laiton sculpté. Démontable et facile à nettoyer.",
          ar: "زيني طاولات الأعياد، الخطوبة والأفراح بأفخم طريقة. 3 طبقات من البورسلان النقي مع عمود نحاسي مذهب بتفاصيل راقية، عملي وسهل التركيب والتنظيف.",
        },
        images: [
          "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
        ],
        category: categories[5]._id,
        brand: brands[0]._id,
        sku: "DB-DECO-PRES3T-01",
        purchasePrice: 3800,
        price: 6800,
        salePrice: null,
        stock: 18,
        lowStockThreshold: 4,
        tags: ["new"],
        isPublished: true,
        soldCount: 19,
        attributes: {
          "Hauteur": "42 cm",
          "Diamètres": "27 cm, 21 cm, 16 cm",
          "Finition": "Porcelaine blanche à relief & or",
        },
      },
      {
        name: {
          fr: "Faitout Couscoussier Inox Professionnel 18/10 avec Couvercle Verre 12L",
          ar: "كسكاس وقدور إينوكس احترافي 18/10 بسعة 12 لتر",
        },
        slug: "couscoussier-inox-professionnel-12l",
        description: {
          fr: "Le couscoussier indispensable dans chaque foyer algérien. Acier inoxydable chirurgical 18/10 qui ne s'oxyde jamais, triple fond capsule pour une répartition homogène de la vapeur.",
          ar: "الكسكاس الذي لا غنى عنه في كل بيت جزائري. إينوكس 18/10 عالي الجودة يدوم مدى الحياة، مع قاعدة ثلاثية سميكة لطهي الكسكسي بالبخار بشكل مثالي.",
        },
        images: [
          "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop",
        ],
        category: categories[1]._id,
        brand: brands[2]._id,
        sku: "DB-COUSC-12L-INX",
        purchasePrice: 8500,
        price: 13900,
        salePrice: 12500,
        stock: 3, // Low stock demo
        lowStockThreshold: 5,
        tags: ["bestseller"],
        isPublished: true,
        soldCount: 88,
        attributes: {
          "Capacité": "12 Litres",
          "Matériau": "Inox 18/10 Triple Fond",
        },
      },
      {
        name: {
          fr: "Plateau Miroir Royal de Service Sculpté Dorure Or Baroque",
          ar: "صينية تقديم ملكية مع مرآة ونقوش ذهبية باروكية",
        },
        slug: "plateau-miroir-royal-dore-baroque",
        description: {
          fr: "Plateau de prestige pour servir le thé, le café ou présenter les dragées et parfums de bienvenue. Fond miroir biseauté et pourtour sculpté d'arabesques royales.",
          ar: "صينية ضيافة استثنائية لتقديم الشاي والقهوة وحلويات المناسبات. قاعدة مرآة نقية محاطة بإطار معدني مذهب بنقوش عربية عريقة.",
        },
        images: [
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop",
        ],
        category: categories[5]._id,
        brand: brands[0]._id,
        sku: "DB-PLAT-MIR-BAROQ",
        purchasePrice: 3200,
        price: 5900,
        salePrice: null,
        stock: 12,
        lowStockThreshold: 3,
        tags: ["new"],
        isPublished: true,
        soldCount: 27,
        attributes: {
          "Dimensions": "48 x 32 cm",
          "Finition": "Dorure or royal inaltérable",
        },
      },
    ]);
    console.log(`Created ${products.length} Products with rich descriptions & attributes.`);

    // 7. Hero Slides
    const slides = await HeroSlide.create([
      {
        image: {
          desktop: "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=1600&auto=format&fit=crop",
          mobile: "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=800&auto=format&fit=crop",
        },
        title: {
          fr: "3AMRI DAREK M3ANA",
          ar: "عمري دارك معانا بفخامة لا مثيل لها",
        },
        subtitle: {
          fr: "La plus prestigieuse sélection d'arts de la table & vaisselle à Tiaret. Livraison sécurisée dans les 58 Wilayas.",
          ar: "أرقى تشكيلات أطقم المائدة والقدور التركية في تيارت. توصيل سريع ومضمون حتى باب دارك في 58 ولاية.",
        },
        badge: "NOUVELLE COLLECTION 2026",
        ctaLabel: {
          fr: "Explorer la Collection",
          ar: "اكتشف التشكيلة الآن",
        },
        ctaLink: "/catalog",
        order: 1,
        isActive: true,
      },
      {
        image: {
          desktop: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=1600&auto=format&fit=crop",
          mobile: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop",
        },
        title: {
          fr: "La Beauté a Son Adresse",
          ar: "الجمال له عنوان واحد : داري بيل تيارت",
        },
        subtitle: {
          fr: "Batteries de cuisine granite & inox haute résistance. L'élégance culinaire garantie au meilleur prix d'Algérie.",
          ar: "أطقم طهي جرانيت وإينوكس أصلي مع ضمان الجودة والمتانة. ارتقي بمطبخك إلى المستوى الملكي.",
        },
        badge: "PROMOTIONS EXCLUSIVES",
        ctaLabel: {
          fr: "Profiter des Promos",
          ar: "استفد من التخفيضات",
        },
        ctaLink: "/catalog?tag=promo",
        order: 2,
        isActive: true,
      },
    ]);
    console.log(`Created ${slides.length} Hero Slides.`);

    // 8. Coupons
    const coupons = await Coupon.create([
      {
        code: "MARHABA10",
        type: "percent",
        value: 10,
        minOrder: 15000,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        usageLimit: 200,
        usedCount: 14,
        isActive: true,
      },
      {
        code: "TIARET500",
        type: "fixed",
        value: 500,
        minOrder: 10000,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        usedCount: 32,
        isActive: true,
      },
    ]);
    console.log(`Created ${coupons.length} promotional coupons.`);

    console.log("=======================================================");
    console.log("✅ DARI BELLE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("🔑 Superadmin Login : admin@daribelle.com | admin123456");
    console.log("📦 Stock Manager    : stock@daribelle.com | stock123456");
    console.log("=======================================================");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
