import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">Welcome to AuctionHub. By using our platform, you agree to the following terms and conditions:</p>
      <ul className="list-disc ml-6 space-y-2">
        <li>You must be at least 18 years old to use this site.</li>
        <li>All items listed must comply with our seller guidelines and applicable laws.</li>
        <li>Bids placed are binding and cannot be retracted.</li>
        <li>Payment must be made promptly after winning an auction.</li>
        <li>We reserve the right to suspend accounts for violations of our terms.</li>
        <li>See our Privacy Policy for details on how your data is handled.</li>
      </ul>
    </div>
  );
}
