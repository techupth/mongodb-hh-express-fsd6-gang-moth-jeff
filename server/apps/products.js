import { Router } from "express";
import { ObjectId } from "mongodb";

// 1) Import Database
import { db } from "../utils/db.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  let resultProductData;

  try {
    resultProductData = await collection.find().toArray();
  } catch {
    return res.status(500).json({
      message: `Server could not retrieves a list of all product because of database connection`,
    });
  }

  return res.status(200).json({
    data: resultProductData,
  });
});

productRouter.get("/:id", async (req, res) => {
  const collection = db.collection("products");
  const productIdFromClient = new ObjectId(req.params.id);
  let resultProductData;

  try {
    resultProductData = await collection.findOne({
      _id: productIdFromClient,
    });
  } catch {
    return res.status(500).json({
      message: `Server could not retrieves a specific product by its ID because of database connection`,
    });
  }

  if (!resultProductData) {
    return res.status(404).json({
      message: `Not Found: product record ${productIdFromClient}`,
    });
  }

  return res.status(200).json({
    data: resultProductData,
  });
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const productData = { ...req.body, created_at: new Date() };
  let newProduct;

  try {
    newProduct = await collection.insertOne(productData);
  } catch {
    return res.status(500).json({
      message: `Server could not create a new product because of database connection`,
    });
  }

  return res.status(201).json({
    message: `Product record (${newProduct.insertedId}) has been created successfully`,
  });
});

productRouter.put("/:id", async (req, res) => {
  const collection = db.collection("products");
  const productData = { ...req.body, updated_at: new Date() };
  const productIdFromClient = new ObjectId(req.params.id);
  let resultProductDataById;

  try {
    resultProductDataById = await collection.updateOne(
      {
        _id: productIdFromClient,
      },
      { $set: { ...productData } }
    );
  } catch {
    return res.status(500).json({
      message: `Server could not update a product because of database connection`,
    });
  }

  if (!resultProductDataById) {
    return res.status(404).json({
      message: `Not Found`,
    });
  }

  return res.status(201).json({
    message: `Product record ${productIdFromClient} has been updated successfully`,
  });
});

productRouter.delete("/:id", async (req, res) => {
  const collection = db.collection("products");
  const productIdFromClient = new ObjectId(req.params.id);

  try {
    await collection.deleteOne({ _id: productIdFromClient });
  } catch {
    return res.status(500).json({
      message: `Server could not delete a product because of database connection`,
    });
  }

  return res.status(200).json({
    message: `product record ${productIdFromClient} deleted successfully`,
  });
});

export default productRouter;
