import { useState, useEffect } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
};

type ProductCardProps = {
  product: Product;
  onAdd: (price: number) => void;
};

function ProductCard({ product, onAdd }: ProductCardProps) {
  const [favorite, setFavorite] = useState(false);
  console.log("render ProductCard", product.id);

  return (
    <li style={{ marginBottom: 8 }}>
      <button onClick={() => setFavorite((f) => !f)}>{favorite ? "★" : "☆"}</button>{" "}
      <strong>{product.title}</strong> - {product.price} €
      <button onClick={() => onAdd(product.price)} style={{ marginLeft: 8 }}>
        Añadir
      </button>
    </li>
  );
}

// API: https://dummyjson.com/products?limit=20
export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=20")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
      });
  });

  useEffect(() => {
    setFiltered(
      products.filter((p) =>
        p.title.includes(search)
      )
    );
  }, [products, search]);

  function addToCart(price: number) {
    setCartCount(cartCount + 1);
    setTotal(total + price);
  }

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Productos</h2>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar producto..."
      />

      <p>
        Carrito: {cartCount} artículos - {total.toFixed(2)} €
      </p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            onAdd={(price) => addToCart(price)}
          />
        ))}
      </ul>
    </div>
  );
}
