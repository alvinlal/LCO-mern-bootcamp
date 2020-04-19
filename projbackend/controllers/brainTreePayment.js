var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "merchantId",
  publicKey: "publicKey",
  privateKey: "privateKey",
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromClient = req.body.paymentMethodNonce;
  let amountFromClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromClient,
      paymentMethodNonce: nonceFromClient,

      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    }
  );
};
