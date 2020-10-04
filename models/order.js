const mongoose = require("mongoose");

const { Schema } = mongoose;

const { ObjectId } = Schema;

const ProductOrderSchema = new Schema(
  {
    product: {
      type: ObjectId,
      ref: "Product",
    },
    name: String,
    count: Number,
    price: Number,
  },
  {
    timestamps: true,
  }
);

const ProductOrder = mongoose.model("ProductOrder", ProductOrderSchema);

const orderSchema = new Schema(
  {
    products: [ProductOrderSchema],
    transaction_id: {},
    amount: {
      type: Number,
    },
    address: String,
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductOrder };
