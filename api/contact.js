import nodemailer from 'nodemailer';

/**
 * Vercel Serverless Function: api/contact.js
 * Handles form submissions and sends emails using SMTP.
 */
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }

    try {
        const { name, email, phone, subject, message, hidden_field } = req.body;

        // ================= ANTI-SPAM (Honeypot) =================
        if (hidden_field) {
            console.warn("Spam detected from:", email);
            return res.status(200).json({ success: false, message: "Spam detected." });
        }

        // ================= VALIDATION =================
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "Required fields (Name, Email, Message) are missing." });
        }

        // ================= EMAIL CONFIGURATION =================
        // For Gmail, use an App Password (not your regular password)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: true, 
            auth: {
                user: process.env.SMTP_USER || 'webzentools@gmail.com',
                pass: process.env.SMTP_PASS  // Set this in Vercel environment variables
            },
        });

        // ================= EMAIL CONTENT =================
        const mailOptions = {
            from: `"WebzenTools System" <${process.env.SMTP_USER || 'webzentools@gmail.com'}>`,
            to: 'mdimtiyazalam630@gmail.com',
            replyTo: email,
            subject: `🔥 New Contact: ${subject || 'No Subject'}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); color: #fff; padding: 20px; text-align: center;">
                        <h2 style="margin: 0; color: white;">New Lead Received</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hello,</p>
                        <p>You have received a new message through the WebzenTools contact form.</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 100px;">Name</td><td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${name}</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${email}</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${phone || 'Not provided'}</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Subject</td><td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${subject}</td></tr>
                        </table>
                        <p style="font-weight: bold; margin-top: 20px;">Message:</p>
                        <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #0ea5e9; font-style: italic;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    <div style="background: #f1f5f9; color: #94a3b8; padding: 15px; text-align: center; font-size: 12px;">
                        Sent from WebzenTools Website
                    </div>
                </div>
            `,
        };

        // ================= SEND EMAIL =================
        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ success: true, message: "Your message has been sent successfully!" });

    } catch (error) {
        console.error('Submission Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: "The server encountered an error while sending the email. Please check your SMTP configuration." 
        });
    }
}
