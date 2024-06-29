import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const products = await collection.find({}).limit(10).toArray();

    if (products.length === 0) {
      return res.json({
        message: "Could not find any product.",
      });
    }

    return res.json({ data: products });
  } catch {
    return res.json({
      message: "Could not get any product due to database connection.",
    });
  }
});

productRouter.get("/:id", async(req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);
    const products = await collection.findOne(
      {
        _id: productId,
      },
    );
    if(!products){
      return res.status(404).json({
        message: "This product is not available."
      })
    } else {
    return res.status(200).json({
      message: "successfully get the product.",
    })}
  } catch {
    return res.status(500).json({
      message: "Product can't be gotten due to database connection.",
    });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productData = { ...req.body, created_at: new Date() };
    const products = await collection.insertOne(productData);

    return res.json({
      message: `Product Id ${products.insertedId}  has been created successfully`,
    });
  } catch {
    return res.json({
      message: "Failed to post a new product due to database connection.",
    });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);
    const newProductData = { ...req.body };
    await collection.updateOne(
      {
        _id: productId,
      },
      {
        $set: newProductData,
      }
    );
    return res.status(200).json({
      message: "Product has been updated successfully.",
    });
  } catch {
    return res.status(500).json({
      message: "Product can't be updated due to database connection.",
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);
    await collection.deleteOne(
      {
        _id: productId,
      },
    );
    return res.status(200).json({
      message: "Product has been deleted successfully.",
    });
  } catch {
    return res.status(500).json({
      message: "Product can't be deleted due to database connection.",
    });
  }
});

export default productRouter;
