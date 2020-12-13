const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuid } = require("uuid");

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
