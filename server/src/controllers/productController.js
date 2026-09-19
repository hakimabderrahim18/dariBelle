import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      tag,
      inStock,
      search,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isPublished: true };

    if (category) {
      // Find category by slug or ID
      const catDoc = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (catDoc) {
        // Also include subcategories if any
        const subCats = await Category.find({ parent: catDoc._id }).select("_id");
        const catIds = [catDoc._id, ...subCats.map((c) => c._id)];
        query.category = { $in: catIds };
      }
    }

    if (brand) {
      query.brand = brand;
    }

    if (tag) {
      query.tags = tag;
    }

    if (inStock === "true") {
      query.stock = { $gt: 0 };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { "name.fr": { $regex: search, $options: "i" } },
        { "name.ar": { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { "description.fr": { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "price-asc") sortOptions = { price: 1 };
    else if (sort === "price-desc") sortOptions = { price: -1 };
    else if (sort === "bestseller" || sort === "popular") sortOptions = { soldCount: -1 };
    else if (sort === "oldest") sortOptions = { createdAt: 1 };

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * pageSize;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .populate("brand", "name logo")
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize),
      Product.countDocuments(query),
    ]);

    return sendSuccess(res, 200, "Produits récupérés.", products, {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      limit: pageSize,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
      .populate("category", "name slug")
      .populate("brand", "name logo");

    if (!product) {
      return sendError(res, 404, "Produit introuvable.");
    }

    // Related products in same category
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isPublished: true,
    })
      .limit(4)
      .select("name slug price salePrice images tags stock");

    return sendSuccess(res, 200, "Produit trouvé.", { product, related });
  } catch (error) {
    next(error);
  }
};

// Admin Endpoints
export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    if (!productData.slug && productData.name?.fr) {
      productData.slug = productData.name.fr
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4);
    }
    const product = await Product.create(productData);
    return sendSuccess(res, 201, "Produit créé avec succès.", product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return sendError(res, 404, "Produit non trouvé.");
    }
    return sendSuccess(res, 200, "Produit mis à jour avec succès.", updated);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return sendError(res, 404, "Produit introuvable.");
    }
    return sendSuccess(res, 200, "Produit supprimé avec succès.");
  } catch (error) {
    next(error);
  }
};
