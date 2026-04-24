import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const PrivacyPolicy = () => {
    return (
        <LegalPageLayout
            title="Privacy Policy"
            description="Our privacy policy details how we handle user data and our commitment to privacy-first tools."
            keywords="privacy policy, data protection, webzentools privacy"
            breadcrumb="Privacy Policy"
        >
            <div className="mb-5">
                <h2 className="fw-bold mb-3">1. Introduction</h2>
                <p>
                    Welcome to WebzenTools ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website and use our browser-based tools.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">2. Data Collection (Privacy by Design)</h2>
                <p>
                    Most of our tools are designed to run <strong>entirely in your browser</strong>. This means that for the majority of our services:
                </p>
                <ul>
                    <li>Your data never leaves your device.</li>
                    <li>We do not store, view, or process your input data on our servers.</li>
                    <li>Processing happens locally using client-side JavaScript.</li>
                </ul>
                <p>
                    We do not require user registration or accounts, which further minimizes the collection of personal data.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">3. Information We Collect Automatically</h2>
                <p>
                    When you visit WebzenTools, we may automatically collect certain information about your device and usage, including:
                </p>
                <ul>
                    <li>IP address and browser type.</li>
                    <li>Pages visited and time spent on the site.</li>
                    <li>Referring URLs.</li>
                </ul>
                <p>
                    This information is used solely for analytics and to improve the user experience.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">4. Google AdSense and Cookies</h2>
                <p>
                    We use Google AdSense to serve advertisements on our website. Google, as a third-party vendor, uses cookies to serve ads based on your prior visits to our website or other websites.
                </p>
                <ul>
                    <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
                    <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
                </ul>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">5. Third-Party Links</h2>
                <p>
                    Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to read the privacy policies of any website you visit.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">6. Security</h2>
                <p>
                    We implement reasonable security measures to protect the integrity of our website. However, please be aware that no method of transmission over the internet is 100% secure.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">7. Changes to This Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Modified" date.
                </p>
                <p className="text-muted mt-3 italic">Last Modified: April 24, 2026</p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">8. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at <strong>support@webzentools.com</strong>.
                </p>
            </div>
        </LegalPageLayout>
    );
};

export default PrivacyPolicy;
