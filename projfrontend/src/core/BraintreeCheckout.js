import React, { useState, useEffect } from "react";
import { loadCart, cartEmpty } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import { getmeToken, processPayment } from "./helper/brainTreeHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";

import DropIn from "braintree-web-drop-in-react";

export default function BraintreeCheckout({
  products,
  setReload = (f) => f,
  reload = undefined,
}) {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    error: "",
    clientToken: null,
  });
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getmeToken(userId, token).then((info) => {
      console.log("GETTOKEN INFO", info);
      if (info.error) {
        setInfo({ ...info, error: info.error });
      } else {
        const clientToken = info.clientToken;
        setInfo({ clientToken });
      }
    });
  };
  const showBrainTreeDropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button
              className="btn btn-success"
              onClick={() => {
                onPurchase();
              }}
            >
              Buy
            </button>
          </div>
        ) : (
          <h3>Signin</h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce = info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount(),
      };
      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, success: response.success, loading: false });
          console.log("PAYMENT SUCESS");
          //empty cart
          //force reload
          const orderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount,
          };
          createOrder(userId, token, orderData);
          cartEmpty(() => {
            console.log("Did we got a crash");
            setReload(!reload);
          });
        })
        .catch((err) => {
          setInfo({ loading: false, success: false });
          console.log(err);
        });
    });
  };
  const getAmount = () => {
    let amount = 0;
    products &&
      products.forEach((p) => {
        amount += p.price;
      });
    return amount;
  };
  return (
    <div>
      <h3>brainy checkout</h3>
      <h3>{getAmount()}</h3>

      {showBrainTreeDropIn()}
    </div>
  );
}
