const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuid } = require("uuid");
const brainTree = require("braintree");

const brainTreeGateway = new brainTree.BraintreeGateway({
  environment: brainTree.Environment.Sandbox,
  merchantId: process.env.BRAIN_TREE_MERCHANT_Id,
  publicKey: process.env.BRAIN_TREE_PUBLIC_KEY,
  privateKey: process.env.BRAIN_TREE_SECRET_KEY,
});

exports.makeStripePayment = (req, res) => {
  const { products, token } = req.body;

  let totalAmount = 0;
  products.forEach((p) => {
    totalAmount = totalAmount + ((p && p.price) || 0);
  });
  totalAmount = totalAmount * 100;

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            customer: customer.id,
            amount: totalAmount,
            currency: "inr",
            description: "A test account",

            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          console.log("stripe charges error", err);
        });
    });
};

exports.getBrainTreeToken = (req, res) => {
  brainTreeGateway.clientToken.generate({}, (err, response) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.send(response);
    }
  });
};

exports.processBrainTreePayment = (req, res) => {
  const nonceFromTheClient = req.body.payment_method_nonce;
  const amountFromTheClient = req.body.amount;

  brainTreeGateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        return res.json(result);
      }
    }
  );
};
