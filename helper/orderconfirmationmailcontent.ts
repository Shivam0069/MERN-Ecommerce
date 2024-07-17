import { CartItem } from "@/types/types";

export type orderDetail = {
  orderItems: CartItem[];
  orderId: string;
  total: number;
};

export const generateOrderConfirmationEmail = (orderDetails: orderDetail) => {
  const productRows = orderDetails.orderItems
    .map(
      (product) => `
      <tr>
        <td><img src="${product.photo}" alt="${product.name}" width="50"></td>
        <td>${product.name}</td>
        <td>&#8377;${product.price.toFixed(2)}</td>
        <td>${product.quantity}</td>
        <td>&#8377;${(product.price * product.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  return `
    <div>
      <p>Dear User,</p>
      <p>Thank you for your order at Flash Buy. Here are the details of your order:</p>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>
      <p>Total Price: &#8377;${orderDetails.total.toFixed(2)}</p>
      <p>Order ID: ${orderDetails.orderId}</p>
      <p>If you have any questions or concerns, please contact our support team.</p>
      <p>Thank you,</p>
      <p>The Flash Buy Team</p>
    </div>
  `;
};
