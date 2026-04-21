import React from 'react';
import { Container, Row, Col, Badge, Accordion } from 'react-bootstrap';

/**
 * FAQ component for the landing page.
 * Displays common questions and answers using an accordion.
 */
const FAQ = () => {
    const faqData = [
        {
            question: "Is WebzenTools really 100% free?",
            answer: "Yes, absolutely! WebzenTools was built to provide professional utilities to developers and creators without any cost. There are no hidden fees, no credit card requirements, and no locked features for the standard tools."
        },
        {
            question: "How do you ensure my data remains private?",
            answer: "Our platform operates on a \"Client-Side First\" philosophy. This means almost all our tools run directly in your browser using JavaScript and WebAssembly. Your data never leaves your computer, and we don't store any of your inputs or outputs on our servers."
        },
        {
            question: "Do I need to install any software or extensions?",
            answer: "No installation is required. WebzenTools is a web-based platform. You can access all our tools instantly from any modern web browser on your desktop, tablet, or mobile device."
        },
        {
            question: "Are there any daily usage limits?",
            answer: "There are no daily limits for our free tools. You can process as many files or strings as you need. Our goal is to be your go-to daily utility belt without getting in your way."
        }
    ];

    return (
        <section className="premium-faq-section py-5">
            <Container>
                <div className="text-center mb-5">
                    <Badge bg="primary" className="bg-opacity-10 text-primary mb-2 rounded-pill px-3">Questions & Answers</Badge>
                    <h2 className="display-6 fw-bold mb-3">Frequently Asked <span className="text-gradient">Questions</span></h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Everything you need to know about using WebzenTools. Can't find an answer? Feel free to contact us.
                    </p>
                </div>

                <Row className="justify-content-center">
                    <Col lg={9}>
                        <Accordion className="wt-premium-accordion">
                            {faqData.map((item, index) => (
                                <Accordion.Item eventKey={index.toString()} key={index}>
                                    <Accordion.Header>{item.question}</Accordion.Header>
                                    <Accordion.Body>
                                        {item.answer}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default FAQ;
