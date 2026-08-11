import { ProductCard } from "../productCard/ProductCard";
import type { Produto } from "../../types";
import "./ProductListing.css";

interface ProductListingProps {
  produtos: Produto[];
}

export function ProductListing({ produtos }: ProductListingProps) {
  return (
    <div className="product-grid">
      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} />
      ))}
    </div>
  );
}