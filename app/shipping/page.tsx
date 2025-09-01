import React from "react";

export default function ShippingPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Shipping Options</h1>
      <ul className="list-disc ml-6 space-y-2">
        <li>Standard Shipping: 5-7 business days</li>
        <li>Express Shipping: 2-3 business days</li>
        <li>International Shipping available</li>
        <li>Tracking provided for all shipments</li>
      </ul>
    </div>
  );
}
