import React from "react";

export default function FAQPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">How do I register?</h2>
          <p>Click the Sign Up button and fill out the registration form to create your account.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">How do I sell an item?</h2>
          <p>Go to the Start Selling page and follow the instructions to list your item.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">How do I bid on an auction?</h2>
          <p>Browse auctions, select an item, and enter your bid on the auction detail page.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Where can I contact support?</h2>
          <p>Visit the Contact page for support and assistance.</p>
        </div>
      </div>
    </div>
  );
}
