import React from "react";
import { Helmet } from "react-helmet-async";
import { HeroSlider } from "../../components/home/HeroSlider";
import { GuaranteeSection } from "../../components/home/GuaranteeSection";
import { CategoryShowcase } from "../../components/home/CategoryShowcase";
import { FeaturedProducts } from "../../components/home/FeaturedProducts";
import { BrandStory } from "../../components/home/BrandStory";

export const Home = () => {
  return (
    <>
      <Helmet>
        <title>Dari Belle | Luxury Lifestyle — Arts de la Table & Vaisselle (Tiaret, Algérie)</title>
        <meta
          name="description"
          content="Magasin d'arts de la table, porcelaine, marmites granite et couverts à Tiaret. Livraison 58 Wilayas et paiement à la livraison."
        />
      </Helmet>

      <div className="space-y-0">
        <HeroSlider />
        <GuaranteeSection />
        <CategoryShowcase />
        <FeaturedProducts />
        <BrandStory />
      </div>
    </>
  );
};
