import { NextRequest, NextResponse } from "next/server";
import pdf from "html-pdf-node";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { order } = reqBody;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #0472</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f3f4f6;
      padding: 2rem;
    }

    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }

    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 1rem;
    }

    .invoice-header h1 {
      font-size: 2rem;
      font-weight: bold;
      margin: 0;
    }

    .invoice-details {
      text-align: right;
    }

    .bill-to {
      margin-top: 1rem;
    }

    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      overflow-x: auto;
    }

    .invoice-table th,
    .invoice-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    .invoice-total {
      margin-top: 2rem;
      border-top: 1px solid #e2e8f0;
      
    }

    .total-table {
      background: linear-gradient(to right, #f6ad55, #f687b3);
      
      border-radius: 0.5rem;
      color: #ffffff;
      margin-top: 1rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
    }

    .total-cell {
      flex: 1;
      
    }

    .font-bold {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div>
        <h3>Invoice #${order._id || "123456"}</h3>
      </div>
      <div class="invoice-details">
        <h2>Flash-Buy</h2>
        <p>${order?.createdAt?.split("T")[0]}</p>
      </div>
    </div>
    <div class="bill-to">
      <h2>Bill To</h2>
      <p>${order.userName}</p>
      <p>${order?.shippingInfo.address}, ${order?.shippingInfo.city}</p>
      <p>${order?.shippingInfo.state}, ${order?.shippingInfo.country}</p>
      <p>Pin Code: ${order?.shippingInfo.pinCode}</p>
    </div>
    <div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems
            .map(
              (item: any, idx: number) =>
                `<tr>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="invoice-total">
      <div class="total-table">
        <div class="total-row">
          <div class="total-cell">
            <p>Subtotal</p>
          </div>
          <div class="total-cell">
            <p>${order?.subtotal}</p>
          </div>
        </div>
        <div class="total-row">
          <div class="total-cell">
            <p>Tax Rate</p>
          </div>
          <div class="total-cell">
            <p>${order?.tax}</p>
          </div>
        </div>
        <div class="total-row">
          <div class="total-cell">
            <p>Discount</p>
          </div>
          <div class="total-cell">
            <p>${order?.discount}</p>
          </div>
        </div>
        <div class="total-row">
          <div class="total-cell font-bold">
            <p>Total</p>
          </div>
          <div class="total-cell font-bold">
            <p>${order?.total}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

    // Convert the HTML content to a PDF
    const options = {
      format: "A4",
      margin: {
        top: "1cm",
        bottom: "1cm",
        left: "1cm",
        right: "1cm",
      },
    };

    const file = { content: htmlContent };
    const pdfBuffer = await pdf.generatePdf(file, options);

    // Prepare the NextResponse with the PDF buffer
    const response = new NextResponse(pdfBuffer!, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
      },
      status: 200,
    });

    return response;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
