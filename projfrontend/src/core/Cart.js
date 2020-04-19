import React, { useState, useEffect } from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "../core/Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import StripeCheckout from "./StripeCheckout";
import BraintreeCheckout from "./BraintreeCheckout";

export default function Cart() {
  const [products, setproducts] = useState([]);
  const [reload, setreload] = useState(false);

  useEffect(() => {
    setproducts(loadCart());
  }, [reload]);

  const loadAllProducts = (products) => {
    // console.log(products);
    return (
      <div>
        <h2>all products</h2>
        {products.map((product, index) => (
          <Card
            key={index}
            product={product}
            removeFromCart={true}
            addtoCart={false}
            setReload={setreload}
            reload={reload}
          />
        ))}
      </div>
    );
  };
  const loadCheckout = () => {
    return (
      <div>
        <h2>loadCheckout</h2>
      </div>
    );
  };

  return (
    <Base title={"Cart"} description={"Ready to checkout"}>
      <div className="row text-center">
        <div className="col-6">
          {products?.length > 0 ? (
            loadAllProducts(products)
          ) : (
            <h3>No products in cart</h3>
          )}
        </div>
        <div className="col-3">
          <StripeCheckout products={products} setReload={setreload} />
        </div>
        <div className="col-3">
          <BraintreeCheckout products={products} setReload={setreload} />
        </div>
      </div>
    </Base>
  );
}
