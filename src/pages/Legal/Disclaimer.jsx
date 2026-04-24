import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const Disclaimer = () => {
    return (
        <LegalPageLayout
            title="Disclaimer"
            description="The disclaimer outlines the limitations of liability for the tools and content provided on WebzenTools."
            keywords="disclaimer, liability, webzentools disclaimer"
            breadcrumb="Disclaimer"
        >
            <div className="mb-5">
                <h2 className="fw-bold mb-3">1. General Information</h2>
                <p>
                    The information and tools provided by WebzenTools are for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or tool on the site.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">2. No Professional Advice</h2>
                <p>
                    The tools provided on this website (such as financial calculators, code generators, or SEO tools) do not constitute professional advice (financial, legal, technical, or otherwise). Any reliance you place on such tools is strictly at your own risk. You should consult with the appropriate professionals before taking any actions based on the information provided by our tools.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">3. External Links Disclaimer</h2>
                <p>
                    The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">4. "As-Is" Tools</h2>
                <p>
                    Our tools are provided on an "as-is" and "as-available" basis. We do not guarantee that the tools will always be error-free, secure, or available at all times. We reserve the right to modify or discontinue any tool without notice.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">5. Errors and Omissions</h2>
                <p>
                    While we strive to ensure the accuracy of our tools, WebzenTools is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information and tools on this site are provided with no guarantee of completeness, accuracy, or timeliness.
                </p>
            </div>

            <div className="mb-5">
                <p className="text-muted italic">Last Modified: April 24, 2026</p>
            </div>
        </LegalPageLayout>
    );
};

export default Disclaimer;
