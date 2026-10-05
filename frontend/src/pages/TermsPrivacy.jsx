import React, { useState, useEffect } from 'react';
import './TermsPrivacy.css';

export default function TermsPrivacy() {
  const [activeTab, setActiveTab] = useState('terms');

  // Scroll to top when switching tabs
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="terms-page animate-enter">
      <header className="terms-header">
        <span className="terms-eyebrow">Legal & Policies</span>
        <h1>{activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </header>

      <nav className="terms-nav">
        <button 
          className={`terms-tab ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveTab('terms')}
        >
          Terms of Service
        </button>
        <button 
          className={`terms-tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          Privacy Policy
        </button>
      </nav>

      <div className="terms-content">
        {activeTab === 'terms' ? (
          <>
            <h2>1. Introduction</h2>
            <p>Welcome to UniTrade! By using our platform, you agree to these Terms of Service. UniTrade is an exclusive student marketplace designed for safe and convenient campus trading.</p>
            
            <h2>2. User Eligibility</h2>
            <p>To use UniTrade, you must be a registered student with a valid university email address. We use this to verify your student status. By creating an account, you represent that all information provided is accurate.</p>

            <h2>3. Marketplace Rules</h2>
            <ul>
              <li><strong>Prohibited Items:</strong> You may not list illegal items, weapons, drugs, or academic work (such as completed assignments or past papers meant to cheat).</li>
              <li><strong>Transactions:</strong> UniTrade does not process payments. All transactions, whether EFT or cash, must be handled directly between the buyer and seller.</li>
              <li><strong>Meetups:</strong> For safety, we highly recommend that all exchanges take place in public campus areas (like the Student Centre or Library) during daylight hours.</li>
            </ul>

            <h2>4. User Conduct</h2>
            <p>We expect all students to treat each other with respect. Harassment, scams, or posting abusive content will result in an immediate and permanent ban from the platform.</p>

            <h2>5. Limitation of Liability</h2>
            <p>UniTrade acts solely as a platform to connect student buyers and sellers. We do not guarantee the quality, safety, or legality of any items listed. You agree to use the platform at your own risk.</p>
          </>
        ) : (
          <>
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, such as your name, university email address, and profile details. We also collect data related to your listings, messages, and order history on the platform.</p>

            <h2>2. How We Use Your Data</h2>
            <p>Your data is used to provide and improve the UniTrade experience. Specifically, we use it to:</p>
            <ul>
              <li>Verify your student status and maintain a safe marketplace.</li>
              <li>Facilitate communication between buyers and sellers.</li>
              <li>Show you relevant listings and personalize your dashboard.</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not sell your personal information to third parties. Your name, avatar, and university affiliation are visible to other verified students to build trust. Your private messages are only accessible to you and the recipient.</p>

            <h2>4. Data Security</h2>
            <p>We implement standard security measures to protect your personal information. However, please remember that no method of transmission over the Internet is 100% secure.</p>

            <h2>5. Your Rights</h2>
            <p>You have the right to access, update, or delete your account information at any time through your Profile settings. If you wish to completely remove your data, please contact our support team.</p>
          </>
        )}
      </div>
    </div>
  );
}
