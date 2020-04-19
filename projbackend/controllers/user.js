const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "user not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  // get back here
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  req.profile._v = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          error: "User not found",
        });
      }
      req.profile.salt = undefined;
      req.profile.encry_password = undefined;
      req.profile.createdAt = undefined;
      req.profile.updatedAt = undefined;
      req.profile._v = undefined;
      return res.json(user);
    }
  );
};

exports.userPurchaseList = () => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "Order not found",
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction: req.body.order.transaction_id,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: "can't update purchase list",
        });
      }
      next();
    }
  );
};
