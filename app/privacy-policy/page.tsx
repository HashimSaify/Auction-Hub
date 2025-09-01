import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Your privacy is important to us. This policy explains how AuctionHub collects, uses, and protects your personal information:</p>
      <ul className="list-disc ml-6 space-y-2">
        <li>We collect information you provide when registering, bidding, or selling.</li>
        <li>Your data is used to facilitate auctions, process payments, and improve our services.</li>
        <li>We do not sell your personal information to third parties.</li>
        <li>We use industry-standard security measures to protect your data.</li>
        <li>You may request to view, update, or delete your data at any time.</li>
        <li>Contact us for any privacy-related concerns or questions.</li>
      </ul>
    </div>
  );
}
