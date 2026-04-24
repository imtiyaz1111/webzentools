import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const TermsAndConditions = () => {
    return (
        <LegalPageLayout
            title="Terms & Conditions"
            description="Our terms and conditions govern your use of the WebzenTools website and its services."
            keywords="terms and conditions, user agreement, webzentools terms"
            breadcrumb="Terms & Conditions"
        >
            <div className="mb-5">
                <h2 className="fw-bold mb-3">1. Acceptance of Terms</h2>
                <p>
                    By accessing and using WebzenTools, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">2. Use License</h2>
                <p>
                    Permission is granted to temporarily use the tools on WebzenTools for personal or commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul>
                    <li>Attempt to decompile or reverse engineer any software contained on WebzenTools.</li>
                    <li>Remove any copyright or other proprietary notations from the materials.</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                    <li>Use the tools for any illegal or unauthorized purpose.</li>
                </ul>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">3. Disclaimer</h2>
                <p>
                    The materials on WebzenTools are provided on an 'as is' basis. WebzenTools makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">4. Limitations</h2>
                <p>
                    In no event shall WebzenTools or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on WebzenTools, even if WebzenTools or a WebzenTools authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">5. Accuracy of Materials</h2>
                <p>
                    The materials appearing on WebzenTools could include technical, typographical, or photographic errors. WebzenTools does not warrant that any of the materials on its website are accurate, complete or current. WebzenTools may make changes to the materials contained on its website at any time without notice.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">6. Links</h2>
                <p>
                    WebzenTools has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by WebzenTools of the site. Use of any such linked website is at the user's own risk.
                </p>
            </div>

            <div className="mb-5">
                <h2 className="fw-bold mb-3">7. Governing Law</h2>
                <p>
                    These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
            </div>

            <div className="mb-5">
                <p className="text-muted italic">Last Modified: April 24, 2026</p>
            </div>
        </LegalPageLayout>
    );
};

export default TermsAndConditions;
