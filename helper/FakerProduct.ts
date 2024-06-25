import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/products";
import { faker } from "@faker-js/faker";
connect();
export const generate = async (count: number = 10) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    const product = {
      name: faker.commerce.productName(),
      photo:
        "https://firebasestorage.googleapis.com/v0/b/e-commerce-user-44d36.appspot.com/o/images%2Fproducts%2F543c2c66-89d2-4994-84cd-17e4f1aac758?alt=media&token=1ab4f96a-798d-4546-9321-fab59e2b16c2",
      price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
      stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
      category: faker.commerce.department(),
      createdAt: new Date(faker.date.past()),
      updatedAt: new Date(faker.date.recent()),
      __v: 0,
    };
    products.push(product);
  }
  await Product.create(products);
  console.log({ success: true });
};

export const deleteProduct = async (count: number = 10) => {
  const products = await Product.find({}).skip(2);
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    await product.deleteOne();
  }
  console.log({ success: true });
};
