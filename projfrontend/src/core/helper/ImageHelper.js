import React from "react";
import { API } from "../../backend";

export default function ImageHelper({ product }) {
  const imageurl = product
    ? `${API}/product/${product._id}/photo`
    : `https://images.yourstory.com/cs/wordpress/2016/08/125-fall-in-love.png?fm=png&auto=format`;
  return (
    <div>
      <div className="rounded border border-success p-2">
        <img
          src={imageurl}
          alt="item"
          style={{ maxHeight: "100%", maxWidth: "100%" }}
          className="mb-3 rounded"
        />
      </div>
    </div>
  );
}
