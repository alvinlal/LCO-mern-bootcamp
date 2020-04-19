import React, { useState, useEffect } from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "../core/Base";
import Card from "./Card";
import { getAllProducts } from "./helper/coreapicalls";

export default function Home() {
  const [products, setproducts] = useState([]);
  const [error, setError] = useState(false);
  const loadAllProduct = () => {
    getAllProducts().then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        setproducts(data);
      }
    });
  };

  useEffect(() => {
    loadAllProduct();
  }, []);
  return (
    <Base title={"Home page"} description={"Welcome to store"}>
      <div className="row text-center">
        <div className="row">
          {products.map((product, index) => (
            <div key={index} className="col-4 mb-4">
              <Card product={product} />
            </div>
          ))}
        </div>
      </div>
    </Base>
  );
}
