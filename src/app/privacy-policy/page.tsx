"use client";

import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        
        <div className="border-b border-slate-100 pb-5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Legal & Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            How Bhai Jeweller UK protects and processes your personal data.
          </p>
        </div>

        <div className="mt-8 space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Information We Collect</h2>
            <p>
              When you browse our live rates, utilize our Zakat or scrap calculators, or contact us via WhatsApp or message forms, we only collect essential information required to fulfill your inquiry or complete your bullion transaction in compliance with UK anti-money laundering (AML) and KYC regulations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Bullion Transactions & Identification</h2>
            <p>
              Under UK regulations, buying or selling high-value precious metals may require valid photographic government ID (Passport or Driving Licence) and proof of address. All records are stored securely in encrypted systems.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Data Protection & Sharing</h2>
            <p>
              We never sell or disclose your personal details to third parties. Your data is strictly used for order processing, client communication, and statutory accounting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Contacting Our Data Controller</h2>
            <p>
              For questions regarding our privacy practices or to request data removal, please reach out via our official contact desk at <strong>Bhai Jeweller UK</strong>.
            </p>
          </section>
        </div>

      </main>
    </div>
  );
}
