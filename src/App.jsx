import React, { Suspense, lazy } from "react";
import Layouts from "./layout/Layouts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

// Lazy load page components for better performance
const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Category = lazy(() => import("./pages/Category/Category"));
const CategoryDetails = lazy(() => import("./pages/Category/CategoryDetails"));
const Tools = lazy(() => import("./pages/Tools/Tools"));
const ToolDetailPage = lazy(() => import("./pages/Tools/ToolDetailPage"));

// Legal Pages
const PrivacyPolicy = lazy(() => import("./pages/Legal/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/Legal/TermsAndConditions"));
const Disclaimer = lazy(() => import("./pages/Legal/Disclaimer"));
const CookiePolicy = lazy(() => import("./pages/Legal/CookiePolicy"));

// Common Loading Component
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Toaster position="top-center" />
        <Layouts>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category" element={<Category />} />
              <Route path="/category/:id" element={<CategoryDetails />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/:slug" element={<ToolDetailPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Legal Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
            </Routes>
          </Suspense>
        </Layouts>
      </Router>
    </HelmetProvider>
  );
}

export default App;