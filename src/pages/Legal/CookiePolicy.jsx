import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const CookiePolicy = () => {
    return (
        <LegalPageLayout
            title="Cookie Policy"
            description="Our cookie policy explains how we use cookies and similar technologies on our website."
            keywords="cookie policy, cookies, webzentools cookies"
            breadcrumb="Cookie Policy"
        >
            <div className="mb-5">
                <h2 className="fw-bold mb-3">1. What Are Cookies?</h2>
                <p>
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide reporting information.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">2. How We Use Cookies</h2>
                <p>
                    WebzenTools uses cookies for several reasons:
                </p>
                <ul>
                    <li><strong>Essential Cookies:</strong> These are necessary for the website to function correctly.</li>
                    <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
                    <li><strong>Advertising Cookies:</strong> These are used to make advertising messages more relevant to you and your interests.</li>
                </ul>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">3. Google AdSense Cookies</h2>
                <p>
                    We use Google AdSense to serve ads. Google uses cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the internet.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">4. Controlling Cookies</h2>
                <p>
                    You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                </p>
                <p>
                    To opt out of personalized advertising from Google, you can visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">5. Third-Party Cookies</h2>
                <p>
                    In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on.
                </p>
            </div>

            <div className="mb-5">
                <p className="text-muted italic">Last Modified: April 24, 2026</p>
            </div>
        </LegalPageLayout>
    );
};

export default CookiePolicy;
