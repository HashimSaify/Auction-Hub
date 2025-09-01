import React from "react";

export default function FeesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Fees & Charges</h1>
      <ul className="list-disc ml-6 space-y-2">
        <li>Listing Fee: $1 per item</li>
        <li>Final Value Fee: 5% of the winning bid</li>
        <li>Payment Processing Fee: 2.9% + $0.30 per transaction</li>
        <li>Shipping fees are paid by the buyer unless otherwise specified.</li>
      </ul>
    </div>
  );
}
