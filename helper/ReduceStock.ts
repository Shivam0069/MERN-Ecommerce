import Product from "@/models/products";
export type OrderItemsType = {
  name: string;
  price: number;
  quantity: number;
  photo: string;
  productId: string;
};
export async function ReduceStock(OrderItems: OrderItemsType[]) {
  for (let i = 0; i < OrderItems.length; i++) {
    const order = OrderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) {
      throw new Error("Product not found");
    }
    product.stock -= order.quantity;
    await product.save();
  }
}
