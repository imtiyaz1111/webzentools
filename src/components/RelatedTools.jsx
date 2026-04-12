import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FaExchangeAlt, FaExpand, FaMagic } from 'react-icons/fa'

const RelatedTools = () => {
  return (
    <>
      <section className="related-section">

        <Container>

          {/* ===== SECTION HEADER ===== */}
          <div className="text-center mb-5">
            <h2 className="related-title">
              Explore More Tools
            </h2>

            <p className="related-subtitle">
              Try our other powerful image tools to boost your productivity.
            </p>
          </div>

          {/* ===== TOOLS GRID ===== */}
          <Row className="g-4">

            {/* ===== TOOL 1 ===== */}
            <Col md={6} lg={4}>
              <div className="tool-card">

                <div className="tool-icon">
                  <FaExpand />
                </div>

                <h6>Image Resizer</h6>

                <p>
                  Resize images to any dimension without losing quality.
                </p>

                <span className="tool-link">Try Tool →</span>

              </div>
            </Col>

            {/* ===== TOOL 2 ===== */}
            <Col md={6} lg={4}>
              <div className="tool-card">

                <div className="tool-icon">
                  <FaExchangeAlt />
                </div>

                <h6>JPG to PNG</h6>

                <p>
                  Convert JPG images to PNG format in seconds.
                </p>

                <span className="tool-link">Try Tool →</span>

              </div>
            </Col>

            {/* ===== TOOL 3 ===== */}
            <Col md={6} lg={4}>
              <div className="tool-card">

                <div className="tool-icon">
                  <FaMagic />
                </div>

                <h6>Background Remover</h6>

                <p>
                  Remove image backgrounds instantly with AI.
                </p>

                <span className="tool-link">Try Tool →</span>

              </div>
            </Col>

          </Row>

        </Container>

      </section>
    </>
  )
}

export default RelatedTools