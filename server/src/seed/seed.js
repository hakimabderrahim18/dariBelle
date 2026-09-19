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
import Order from "../models/Order.js";
import StockMovement from "../models/StockMovement.js";
import { ALGERIA_WILAYAS } from "../utils/wilayasAlgeria.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://hakimaitabderrahim18_db_user:EGoghmmqLaOL0OHm@cluster0.xppqnzk.mongodb.net/dari_belle?retryWrites=true&w=majority&appName=Cluster0";

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB Atlas for seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas successfully.");

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
      Order.deleteMany(),
      StockMovement.deleteMany(),
    ]);
    console.log("Cleared all 10 existing collections.");

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
      { name: "Nordic Atelier", logo: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=200" },
      { name: "Luminarc Imperial", logo: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200" },
    ]);
    console.log(`Created ${brands.length} Brands.`);

    // 5. Categories with meaningful, premium imagery
    const categories = await Category.create([
      {
        name: {
          fr: "Services de Table & Porcelaine",
          ar: "أطقم المائدة والبورسلان الفاخر",
        },
        slug: "services-de-table",
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop",
        order: 1,
      },
      {
        name: {
          fr: "Marmites & Batteries de Cuisine",
          ar: "القدور وطناجر الجرانيت الفاخرة",
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
          fr: "Rangement & Bocaux de Cuisine",
          ar: "برطمانات وتنظيم المطبخ العصري",
        },
        slug: "rangement-et-bocaux",
        image: "https://images.unsplash.com/photo-1601392740426-907c7b028119?w=600&auto=format&fit=crop",
        order: 4,
      },
      {
        name: {
          fr: "Verrerie & Tasses à Thé/Café",
          ar: "كؤوس وأطقم الشاي والقهوة",
        },
        slug: "verrerie-et-tasses",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop",
        order: 5,
      },
      {
        name: {
          fr: "Décoration & Mobilier Scandinave",
          ar: "ديكور وأثاث المائدة العصري",
        },
        slug: "decoration-et-mobilier",
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop",
        order: 6,
      },
    ]);
    console.log(`Created ${categories.length} Categories.`);

    // 6. Products directly inspired by user mockup
    const products = await Product.create([
      {
        name: {
          fr: "Ceramic Dinner Set 24 Pièces Grès Artisanal",
          ar: "طقم سفرة سيراميك يدوي نورديك 24 قطعة",
        },
        slug: "ceramic-dinner-set-gres-artisanal",
        description: {
          fr: "L'art de la table contemporain aux teintes naturelles. Grès céramique émaillé mat haute résistance avec rebord organique fait main. Comprend 6 assiettes plates, 6 assiettes à dessert, 6 bols profonds et 6 tasses assorties. Compatible lave-vaisselle et micro-ondes.",
          ar: "فن المائدة العصري بألوان ترابية طبيعية هادئة. سيراميك متين عالي الجودة بملمس مطفي ناعم وحواف عضوية يدوية. يتكون من 6 صحون عشاء، 6 صحون تحلية، 6 سلطانيات و6 أكواب أنيقة.",
        },
        images: [
          "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=800&auto=format&fit=crop",
        ],
        category: categories[0]._id,
        brand: brands[0]._id,
        sku: "DB-CERAM-24P-BEIGE",
        purchasePrice: 16500,
        price: 26500,
        salePrice: 22900,
        stock: 15,
        lowStockThreshold: 4,
        tags: ["bestseller", "promo"],
        isPublished: true,
        soldCount: 47,
        attributes: {
          "Nombre de pièces": "24 pièces",
          "Matériau": "Grès céramique naturel",
          "Couleur": "Beige Sable & Pierre Naturelle",
        },
      },
      {
        name: {
          fr: "Cocotte en Fonte Émaillée Crème Ivoire 6.5L",
          ar: "قدر طهي كوكوت كلاسيكي فرنسي إيفوار 6.5 لتر",
        },
        slug: "cocotte-fonte-emaillee-creme-65l",
        description: {
          fr: "La cocotte indispensable pour mijoter vos tajines, chorbas et ragoûts avec une cuisson lente parfaite. Fonte d'acier émaillée multicouche qui retient la chaleur de manière incomparable, bouton de couvercle doré thermo-résistant.",
          ar: "القدر المثالي لطهي أشهى الطواجن والشوربات واليخنات على نار هادئة. طبقات طلاء سيراميكي صحي غير لاصق مع مقبض غطاء مذهب فاخر يمنح مطبخك لمسة ملكية.",
        },
        images: [
          "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop",
        ],
        category: categories[1]._id,
        brand: brands[2]._id,
        sku: "DB-COCOT-65L-CRM",
        purchasePrice: 14000,
        price: 23500,
        salePrice: 19800,
        stock: 11,
        lowStockThreshold: 3,
        tags: ["bestseller", "promo"],
        isPublished: true,
        soldCount: 56,
        attributes: {
          "Capacité": "6.5 Litres",
          "Matériau": "Fonte émaillée haute résistance",
          "Compatibilité": "Tous feux, induction & four jusqu'à 260°C",
        },
      },
      {
        name: {
          fr: "Modern Dining Chair Scandinave en Tissu Bouclette Beige",
          ar: "كرسي سفرة عصري ومريح بقماش البوكليه البيج الفاخر",
        },
        slug: "modern-dining-chair-scandinave",
        description: {
          fr: "Fauteuil de table au design épuré et contemporain. Assise enveloppante en tissu bouclé texturé doux, pieds en bois de hêtre massif teinté chêne chaud. Offre un confort inégalé pour vos dîners en famille.",
          ar: "كرسي سفرة أنيق يجمع بين الراحة الفائقة والتصميم الإسكندنافي المعاصر. قماش بوكليه مريح وناعم مع أرجل خشبية صلبة متينة تضفي دفئاً وفخامة على غرفة الطعام.",
        },
        images: [
          "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop",
        ],
        category: categories[5]._id,
        brand: brands[3]._id,
        sku: "DB-CHAIR-SCAND-01",
        purchasePrice: 12000,
        price: 19500,
        salePrice: 17900,
        stock: 8,
        lowStockThreshold: 2,
        tags: ["new", "bestseller"],
        isPublished: true,
        soldCount: 22,
        attributes: {
          "Dimensions": "58 x 56 x 82 cm",
          "Revêtement": "Tissu bouclé texturé antitache",
          "Structure": "Bois massif et mousse haute résilience",
        },
      },
      {
        name: {
          fr: "Minimalist Side Table en Chêne Massif & Finition Cire",
          ar: "طاولة قهوة جانبية مينيماليست من خشب البلوط الطبيعي",
        },
        slug: "minimalist-side-table-chene",
        description: {
          fr: "Guéridon rond minimaliste aux lignes épurées et organiques. Plateau délicatement chanfreiné et piètement tripode robuste en chêne massif. S'intègre avec grâce auprès de votre canapé ou dans votre espace détente.",
          ar: "طاولة دائرية جانبية بخطوط طبيعية ناعمة وأرجل ثلاثية متوازنة من الخشب الطبيعي الصلب. مثالية لتقديم القهوة والشاي أو كقطعة ديكور فاخرة لغرفة المعيشة.",
        },
        images: [
          "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&auto=format&fit=crop",
        ],
        category: categories[5]._id,
        brand: brands[3]._id,
        sku: "DB-TABLE-SIDE-MIN",
        purchasePrice: 9500,
        price: 15900,
        salePrice: 13900,
        stock: 7,
        lowStockThreshold: 2,
        tags: ["new"],
        isPublished: true,
        soldCount: 18,
        attributes: {
          "Diamètre": "45 cm",
          "Hauteur": "50 cm",
          "Finition": "Vernis mat hydrofuge écologique",
        },
      },
      {
        name: {
          fr: "Wooden Kitchen Rack & Étagère de Présentation en Bambou",
          ar: "رف توابل وتنظيم مطبخ خشبي أنيق متعدد الطبقات",
        },
        slug: "wooden-kitchen-rack-organizer",
        description: {
          fr: "Présentoir et organiseur de cuisine à 2 niveaux en bois naturel. Idéal pour exposer vos épices, pots d'aromates, moulins à sel et tasses avec ordre et élégance.",
          ar: "منظم مطبخ خشبي فاخر بطبقتين يجمع بين الترتيب العصري والأناقة الدافئة. مثالي لتنظيم برطمانات البهارات والأعشاب وأواني الشاي على رخامة المطبخ.",
        },
        images: [
          "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop",
        ],
        category: categories[3]._id,
        brand: brands[0]._id,
        sku: "DB-RACK-WOOD-2T",
        purchasePrice: 4200,
        price: 7900,
        salePrice: 6800,
        stock: 20,
        lowStockThreshold: 5,
        tags: ["bestseller"],
        isPublished: true,
        soldCount: 64,
        attributes: {
          "Dimensions": "38 x 18 x 32 cm",
          "Matériau": "Bambou massif traité anti-humidité",
        },
      },
      {
        name: {
          fr: "Glass Storage Jar Borosilicate & Couvercle Acacia (Lot de 4)",
          ar: "طقم برطمانات زجاجية بوروسليكات 4 قطع بأغطية خشب الأكاسيا",
        },
        slug: "glass-storage-jar-borosilicate-lot-4",
        description: {
          fr: "Conservez vos légumineuses, café, thés et pâtes dans ces bocaux en verre borosilicate ultra-transparent munis d'un joint en silicone hermétique pour préserver toute la fraîcheur.",
          ar: "حافظي على جودة ونضارة البقوليات والقهوة والمكسرات مع طقم برطمانات الزجاج النقي المقاوم للحرارة بأغطية خشبية محكمة الإغلاق لمنع دخول الهواء والرطوبة.",
        },
        images: [
          "https://images.unsplash.com/photo-1601392740426-907c7b028119?w=800&auto=format&fit=crop",
        ],
        category: categories[3]._id,
        brand: brands[0]._id,
        sku: "DB-JAR-GLASS-4P",
        purchasePrice: 2900,
        price: 5400,
        salePrice: 4600,
        stock: 35,
        lowStockThreshold: 6,
        tags: ["promo"],
        isPublished: true,
        soldCount: 92,
        attributes: {
          "Contenances": "450ml, 750ml, 1100ml, 1600ml",
          "Joint": "Silicone hermétique alimentaire",
        },
      },
      {
        name: {
          fr: "Coffret Ménagère Prestige Or Miroir 72 Pièces en Valise Velours",
          ar: "حقيبة ملاعق وسكاكين برستيج ذهبية 72 قطعة بمخمل فاخر",
        },
        slug: "coffret-menagere-prestige-or-72-pieces",
        description: {
          fr: "Une ménagère de haute orfèvrerie en acier inoxydable 18/10 finition titane doré miroir. Présentée dans sa sublime mallette capitonnée de velours bordeaux. Parfait pour les trousseaux de mariée et les tables d'exception.",
          ar: "حقيبة ملاعق وسكاكين ملكية مصنوعة من الفولاذ المقاوم للصدأ 18/10 مطلي بطبقة تيتانيوم ذهبي لامع ومقاوم للخدش. تأتي داخل علبة مبطنة بالمخمل الفاخر.",
        },
        images: [
          "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop",
        ],
        category: categories[2]._id,
        brand: brands[1]._id,
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
          "Composition": "72 pièces complètes pour 12 personnes",
          "Acier": "Inox 18/10 Haute Qualité",
          "Finition": "Titane Or 24K Miroir",
        },
      },
      {
        name: {
          fr: "Ensemble Service à Thé & Café Sultan Cristal & Or 18 Pièces",
          ar: "طقم شاي وقهوة السلطان كريستال مذهب 18 قطعة",
        },
        slug: "service-the-cafe-sultan-cristal-or-18-pieces",
        description: {
          fr: "L'art de l'accueil traditionnel sublimé. Verres en cristal soufflé bouche décorés de motifs dorés, accompagnés de soucoupes festonnées et cuillères assorties pour servir le thé à la menthe et le café.",
          ar: "أصالة الضيافة في أبهى حلة. كؤوس كريستال مزخرفة بنقوش أندلسية عثمانية ذهبية، مع صحون تقديم متناسقة وملاعق سكر مذهبة لتقديم الشاي والقهوة لضيوفك.",
        },
        images: [
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop",
        ],
        category: categories[4]._id,
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
          "Nombre de pièces": "6 verres cristal + 6 soucoupes + 6 cuillères décoratives",
        },
      },
      {
        name: {
          fr: "Vase Sculptural Céramique Japandi Beige Sable",
          ar: "مزهرية سيراميك فنية بستايل ياباني بيج رملي",
        },
        slug: "vase-sculptural-ceramique-japandi",
        description: {
          fr: "Vase décoratif d'inspiration nordique et japandi en grès céramique texturé. Forme architecturale épurée qui sublime les fleurs séchées ou trône avec fierté en pièce maîtresse de votre console.",
          ar: "مزهرية فنية بلمسة نورديك هادئة من السيراميك الحبيبي الملمس. تصميم أنيق يعكس الذوق الرفيع ويضفي رونقاً فريداً على طاولات الصالون أو المداخل.",
        },
        images: [
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop",
        ],
        category: categories[5]._id,
        brand: brands[3]._id,
        sku: "DB-VASE-JAP-SND",
        purchasePrice: 2800,
        price: 4900,
        salePrice: 4200,
        stock: 14,
        lowStockThreshold: 3,
        tags: ["new"],
        isPublished: true,
        soldCount: 16,
        attributes: {
          "Hauteur": "28 cm",
          "Couleur": "Sable Chaud / Terracotta léger",
        },
      },
      {
        name: {
          fr: "Batterie de Cuisine Granite Royal 10 Pièces - Poignées Dorées",
          ar: "طقم طناجر وقدور جرانيت ملكي 10 قطع - مقابض ذهبية",
        },
        slug: "batterie-cuisine-granite-royal-10-pieces",
        description: {
          fr: "Préparez vos plats traditionnels avec un confort absolu. Revêtement antiadhésif multicouche granite écologique sans PFOA. Couvercles en verre trempé cerclés d'or.",
          ar: "أعدي أشهى الأطباق الجزائرية كالشوربة والكسكسي والطواجن. طبقات جرانيت ألماني عالي الجودة غير لاصق وصحي خالٍ من PFOA، مع أغطية زجاجية معززة بمقابض مقاومة للحرارة.",
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
          fr: "Service de Table Porcelaine Fine Impériale 60 Pièces",
          ar: "طقم مائدة بورسلان ملكي فاخر 60 قطعة بحواف ذهبية",
        },
        slug: "service-table-porcelaine-fine-imperiale-60-pieces",
        description: {
          fr: "Le chef-d'œuvre de la table Dari Belle. Porcelaine extra blanche translucide avec filets d'or incrustés à la main. Idéal pour les grandes réceptions, mariages et fêtes de l'Aïd.",
          ar: "طقم العروس الأسطوري من البورسلان النقي شديد البياض والمزين بنقوش ذهبية فخمة. يشمل جميع صحون التقديم والمقبلات وحساء الشوربة لضيافة ملكية مشرفة.",
        },
        images: [
          "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop",
        ],
        category: categories[0]._id,
        brand: brands[0]._id,
        sku: "DB-PORC-60P-GOLD",
        purchasePrice: 42000,
        price: 68000,
        salePrice: 59900,
        stock: 4,
        lowStockThreshold: 2,
        tags: ["bestseller", "promo"],
        isPublished: true,
        soldCount: 19,
        attributes: {
          "Nombre de pièces": "60 pièces (12 personnes)",
          "Matière": "Porcelaine Fine Bone China",
          "Entretien": "Lavage doux recommandé",
        },
      },
      {
        name: {
          fr: "Set 4 Verres à Eau en Cristal Cannelé Fumé",
          ar: "طقم 4 كؤوس ماء وعصائر كريستال مضلع دخاني فاخر",
        },
        slug: "set-4-verres-cristal-cannele-fume",
        description: {
          fr: "Verres à pied contemporains aux reflets ambrés et fumés. Silhouette cannelée architecturale inspirée des années 70 revisitée pour sublimer vos boissons fraîches.",
          ar: "أكواب تقديم عصرية بلمسات لونية دخانية ساحرة وتضليع عمودي أنيق يبرز نقاء المشروبات الباردة والعصائر الطازجة على مائدتك.",
        },
        images: [
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=800&auto=format&fit=crop",
        ],
        category: categories[4]._id,
        brand: brands[4]._id,
        sku: "DB-CRIST-4P-FUM",
        purchasePrice: 2200,
        price: 3900,
        salePrice: 3400,
        stock: 28,
        lowStockThreshold: 6,
        tags: ["new"],
        isPublished: true,
        soldCount: 33,
        attributes: {
          "Contenance": "380 ml",
          "Quantité": "Lot de 4 verres",
          "Style": "Ribbed Glassware Scandinave",
        },
      },
      {
        name: {
          fr: "Planche à Découper & Présentation en Bois d'Olivier Brut",
          ar: "لوح تقطيع وتقديم فاخر من خشب الزيتون الطبيعي الأصيل",
        },
        slug: "planche-presentation-bois-olivier-brut",
        description: {
          fr: "Sculptée d'une seule pièce dans du bois d'olivier méditerranéen centenaire. Chaque planche est unique par ses veinures chaudes et son rebord naturel écorce.",
          ar: "قطعة فنية فريدة منحوتة يدوياً من خشب الزيتون المتوسطي العريق. مثالية لتقديم الأجبان والمملحات والمقبلات الفاخرة لضيوفك.",
        },
        images: [
          "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop",
        ],
        category: categories[3]._id,
        brand: brands[3]._id,
        sku: "DB-WOOD-OLIV-BRUT",
        purchasePrice: 2400,
        price: 4500,
        salePrice: null,
        stock: 2, // Alerte stock faible
        lowStockThreshold: 3,
        tags: ["bestseller"],
        isPublished: true,
        soldCount: 41,
        attributes: {
          "Dimensions": "45 x 22 x 2.5 cm",
          "Traitement": "Huile d'olive biologique alimentaire",
          "Origine": "Artisanat méditerranéen",
        },
      },
      {
        name: {
          fr: "Ménagère Noir Mat & Or Brossé 24 Pièces Moderne",
          ar: "طقم ملاعق وسكاكين أسود مطفي مع ذهبي 24 قطعة مودرن",
        },
        slug: "menagere-noir-mat-or-brosse-24p",
        description: {
          fr: "Audacieuse alliance de l'acier noir titane et de l'or brossé satiné. Lignes graphiques modernes pour une table résolument contemporaine.",
          ar: "مزيج جريء يجمع بين الأسود الملكي المطفي والذهب المصقول. طقم ملاعق عصري يمنح طاولتك لمسة مطاعم الـ 5 نجوم.",
        },
        images: [
          "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop",
        ],
        category: categories[2]._id,
        brand: brands[0]._id,
        sku: "DB-MENAG-24P-BLKGOLD",
        purchasePrice: 6500,
        price: 11900,
        salePrice: 9900,
        stock: 12,
        lowStockThreshold: 3,
        tags: ["new"],
        isPublished: true,
        soldCount: 18,
        attributes: {
          "Pièces": "6 fourchettes, 6 couteaux, 6 cuillères soupe, 6 cuillères café",
          "Traitement": "PVD Titane inrayable",
        },
      },
      {
        name: {
          fr: "Théière en Verre Résistant avec Infuseur Inox & Chauffe-Plat",
          ar: "إبريق شاي زجاج حراري مع مصفاة إينوكس وقاعدة تسخين بالشمعة",
        },
        slug: "theiere-verre-infuseur-chauffe-plat",
        description: {
          fr: "Admirez l'infusion de votre thé à la menthe ou de vos tisanes. Verre haute température résistant à la flamme, filtre amovible en inox micro-perforé.",
          ar: "إبريق شاي زجاجي أنيق لمشاهدة أوراق الشاي والنعناع تتفتح بجمال. مزود بقاعدة تسخين بالشمعة للحفاظ على دفء الشاي طوال السهرة.",
        },
        images: [
          "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop",
        ],
        category: categories[4]._id,
        brand: brands[4]._id,
        sku: "DB-THEI-1200ML-GLS",
        purchasePrice: 2600,
        price: 4600,
        salePrice: 3900,
        stock: 20,
        lowStockThreshold: 4,
        tags: ["new", "promo"],
        isPublished: true,
        soldCount: 31,
        attributes: {
          "Capacité": "1200 ml (1.2 Litre)",
          "Accessoires": "Chauffe-plat bougie + filtre inox inclus",
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
          fr: "Sublimez Votre Intérieur avec Élégance",
          ar: "عمري دارك معانا بفخامة وأناقة عصرية",
        },
        subtitle: {
          fr: "La plus prestigieuse sélection d'arts de la table & vaisselle à Tiaret. Livraison sécurisée dans les 58 Wilayas.",
          ar: "أرقى تشكيلات أطقم المائدة والقدور التركية في تيارت. توصيل سريع ومضمون حتى باب دارك في 58 ولاية.",
        },
        badge: "NOUVELLE COLLECTION 2026 ✦",
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
          fr: "L'Élégance Culinaire au Quotidien",
          ar: "الجمال له عنوان واحد : داري بيل تيارت",
        },
        subtitle: {
          fr: "Batteries de cuisine granite & inox haute résistance. L'art culinaire garanti au meilleur prix d'Algérie.",
          ar: "أطقم طهي جرانيت وإينوكس أصلي مع ضمان الجودة والمتانة. ارتقي بمطبخك إلى المستوى الملكي.",
        },
        badge: "OFFRES SPÉCIALES -40%",
        ctaLabel: {
          fr: "Profiter des Promos",
          ar: "استفد من التخفيضات",
        },
        ctaLink: "/catalog?tag=promo",
        order: 2,
        isActive: true,
      },
      {
        image: {
          desktop: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1600&auto=format&fit=crop",
          mobile: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop",
        },
        title: {
          fr: "Art de Vivre & Porcelaine de Luxe",
          ar: "فن العيش الملكي وأرقى البورسلان لدارك",
        },
        subtitle: {
          fr: "Des services de table conçus pour traverser les générations. Visitez notre showroom exclusif à Tiaret.",
          ar: "تشكيلات حصرية منتقاة بعناية لتدوم طويلاً. شرفونا بزيارة صالة العرض الخاصة بنا في تيارت.",
        },
        badge: "DARI BELLE TIARET ✦",
        ctaLabel: {
          fr: "Découvrir la Porcelaine",
          ar: "شاهد أطقم البورسلان",
        },
        ctaLink: "/catalog?category=services-de-table",
        order: 3,
        isActive: true,
      },
    ]);
    console.log(`Created ${slides.length} Hero Slides.`);

    // 8. Coupons
    const coupons = await Coupon.create([
      {
        code: "DARIBELLE10",
        type: "percent",
        value: 10,
        minOrder: 10000,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: "TIARET2026",
        type: "fixed",
        value: 1500,
        minOrder: 15000,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: "RAMADAN2026",
        type: "percent",
        value: 15,
        minOrder: 20000,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: "BIENVENUE",
        type: "fixed",
        value: 1000,
        minOrder: 8000,
        expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ]);
    console.log(`Created ${coupons.length} Discount Coupons.`);

    // 9. Orders
    const sampleOrders = [
      {
        orderNumber: "DB-ORD-2026-001",
        items: [
          {
            product: products[0]._id,
            name: products[0].name.fr,
            image: products[0].images[0],
            price: products[0].salePrice || products[0].price,
            quantity: 1,
            variantSku: products[0].sku,
          },
          {
            product: products[4]._id,
            name: products[4].name.fr,
            image: products[4].images[0],
            price: products[4].salePrice || products[4].price,
            quantity: 2,
            variantSku: products[4].sku,
          },
        ],
        customer: {
          name: "Karim Benali",
          phone: "0661234567",
          wilaya: "14 - Tiaret",
          commune: "Tiaret",
          address: "Cité Volani, Rue 12, N° 45",
          note: "Appeler avant la livraison svp",
        },
        shippingFee: 400,
        subtotal: (products[0].salePrice || products[0].price) + (products[4].salePrice || products[4].price) * 2,
        discount: 0,
        total: (products[0].salePrice || products[0].price) + (products[4].salePrice || products[4].price) * 2 + 400,
        status: "delivered",
        paymentMethod: "COD",
        statusHistory: [
          { status: "pending", note: "Commande passée en ligne", date: new Date(Date.now() - 5 * 24 * 3600 * 1000) },
          { status: "confirmed", note: "Confirmée par téléphone", date: new Date(Date.now() - 4 * 24 * 3600 * 1000) },
          { status: "shipped", note: "Expédiée par Yalidine Express", date: new Date(Date.now() - 3 * 24 * 3600 * 1000) },
          { status: "delivered", note: "Livrée et encaissée avec succès", date: new Date(Date.now() - 1 * 24 * 3600 * 1000) },
        ],
      },
      {
        orderNumber: "DB-ORD-2026-002",
        items: [
          {
            product: products[1]._id,
            name: products[1].name.fr,
            image: products[1].images[0],
            price: products[1].salePrice || products[1].price,
            quantity: 1,
            variantSku: products[1].sku,
          },
        ],
        customer: {
          name: "Amina Mansouri",
          phone: "0550987654",
          wilaya: "16 - Alger",
          commune: "Hydra",
          address: "Résidence Les Pins, Bâtiment C, Apt 14",
          note: "Livraison à domicile le matin",
        },
        shippingFee: 650,
        subtotal: products[1].salePrice || products[1].price,
        discount: 1500,
        total: (products[1].salePrice || products[1].price) - 1500 + 650,
        coupon: "TIARET2026",
        status: "shipped",
        paymentMethod: "COD",
        statusHistory: [
          { status: "pending", note: "Commande enregistrée", date: new Date(Date.now() - 2 * 24 * 3600 * 1000) },
          { status: "confirmed", note: "Validée par le service client", date: new Date(Date.now() - 1 * 24 * 3600 * 1000) },
          { status: "shipped", note: "Colis pris en charge par le livreur", date: new Date() },
        ],
      },
      {
        orderNumber: "DB-ORD-2026-003",
        items: [
          {
            product: products[3]._id,
            name: products[3].name.fr,
            image: products[3].images[0],
            price: products[3].salePrice || products[3].price,
            quantity: 1,
            variantSku: products[3].sku,
          },
        ],
        customer: {
          name: "Nadia Boukhalfa",
          phone: "0770334455",
          wilaya: "31 - Oran",
          commune: "Bir El Djir",
          address: "Boulevard Millenium 2, Résidence El Bahdja",
          note: "Trousseau de mariée, emballage soigné svp",
        },
        shippingFee: 600,
        subtotal: products[3].salePrice || products[3].price,
        discount: 0,
        total: (products[3].salePrice || products[3].price) + 600,
        status: "confirmed",
        paymentMethod: "COD",
        statusHistory: [
          { status: "pending", note: "Nouvelle commande", date: new Date(Date.now() - 12 * 3600 * 1000) },
          { status: "confirmed", note: "Vérification disponibilité effectuée", date: new Date(Date.now() - 6 * 3600 * 1000) },
        ],
      },
      {
        orderNumber: "DB-ORD-2026-004",
        items: [
          {
            product: products[5]._id,
            name: products[5].name.fr,
            image: products[5].images[0],
            price: products[5].salePrice || products[5].price,
            quantity: 2,
            variantSku: products[5].sku,
          },
          {
            product: products[6]._id,
            name: products[6].name.fr,
            image: products[6].images[0],
            price: products[6].salePrice || products[6].price,
            quantity: 1,
            variantSku: products[6].sku,
          },
        ],
        customer: {
          name: "Sofiane Brahimi",
          phone: "0670112233",
          wilaya: "25 - Constantine",
          commune: "Ali Mendjeli",
          address: "UV 05, Îlot 18, Logement 22",
          note: "",
        },
        shippingFee: 700,
        subtotal: (products[5].salePrice || products[5].price) * 2 + (products[6].salePrice || products[6].price),
        discount: 0,
        total: (products[5].salePrice || products[5].price) * 2 + (products[6].salePrice || products[6].price) + 700,
        status: "pending",
        paymentMethod: "COD",
        statusHistory: [
          { status: "pending", note: "En attente de confirmation téléphonique", date: new Date() },
        ],
      },
    ];

    const orders = await Order.create(sampleOrders);
    console.log(`Created ${orders.length} Sample Orders with complete status history.`);

    // 10. Stock Movements
    const stockMovements = [
      {
        product: products[0]._id,
        type: "in",
        quantity: 30,
        reason: "Arrivage conteneur porcelaine Turquie",
        reference: "BL-TURK-2026-01",
        stockBefore: 0,
        stockAfter: 30,
        performedBy: users[0]._id,
      },
      {
        product: products[0]._id,
        type: "out",
        quantity: 15,
        reason: "Ventes cumulées boutique & commandes en ligne",
        reference: "CMD-HISTORIQUE-01",
        stockBefore: 30,
        stockAfter: 15,
        performedBy: users[1]._id,
      },
      {
        product: products[1]._id,
        type: "in",
        quantity: 20,
        reason: "Réception palettes cocottes fonte",
        reference: "BL-KORKMAZ-442",
        stockBefore: 0,
        stockAfter: 20,
        performedBy: users[0]._id,
      },
      {
        product: products[3]._id,
        type: "in",
        quantity: 10,
        reason: "Importation ménagères dorées prestige",
        reference: "BL-GOLD-84P-09",
        stockBefore: 0,
        stockAfter: 10,
        performedBy: users[0]._id,
      },
      {
        product: products[10]._id,
        type: "adjustment",
        quantity: -3,
        reason: "Ajustement inventaire physique (exposition showroom)",
        reference: "INV-PHY-2026-03",
        stockBefore: 5,
        stockAfter: 2,
        performedBy: users[1]._id,
      },
    ];

    await StockMovement.create(stockMovements);
    console.log(`Created ${stockMovements.length} Stock Movement audit records.`);

    console.log("=================================================");
    console.log("  ALL 10 MONGODB ATLAS COLLECTIONS SEEDED 100% !  ");
    console.log("=================================================");
    console.log("👤 Admin Superuser: admin@daribelle.com / admin123456");
    console.log("👤 Stock Manager:   stock@daribelle.com / stock123456");
    console.log(`📦 Products:        ${products.length}`);
    console.log(`🏷️  Categories:      ${categories.length}`);
    console.log(`✨ Brands:          ${brands.length}`);
    console.log(`🚚 Wilayas Zones:   ${zones.length}`);
    console.log(`🖼️  Hero Slides:     ${slides.length}`);
    console.log(`🎟️  Coupons:         ${coupons.length}`);
    console.log(`📋 Orders:          ${orders.length}`);
    console.log(`📊 Stock Movements: ${stockMovements.length}`);
    console.log("=================================================");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding MongoDB Atlas database:", error);
    process.exit(1);
  }
};

seedData();