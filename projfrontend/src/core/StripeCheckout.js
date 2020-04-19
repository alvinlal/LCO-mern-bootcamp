import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { loadCart, cartEmpty } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";
export default function StripeCheckout({
  products,
  setReload = (f) => f,
  reload = undefined,
}) {
  const [data, setdata] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });
  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        //do other stuff
        const { status } = response;
        console.log("STATUS", status);
        //cartEmpty();
      })
      .catch((err) => console.log(err));
  };
  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutButton
        stripeKey="pk_test_wV3cFIMaIEcQch5aLIhGLsqm00uno8HsV7"
        token={makePayment}
        amount={getFinalPrice(products) * 100}
        name="Buy Tshirt"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">pay with stripe</button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Signin</button>
      </Link>
    );
  };

  const getFinalPrice = (products) => {
    let amount = 0;
    products &&
      products.forEach((p) => {
        amount = amount + p.price;
      });
    return amount;
  };
  return (
    <div>
      <h1 className="text-white">stripe checkout {getFinalPrice(products)}</h1>
      {showStripeButton()}
    </div>
  );
}
