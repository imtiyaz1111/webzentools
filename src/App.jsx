import Layouts from "./layout/Layouts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Category from "./pages/Category/Category";
import CategoryDetails from "./pages/Category/CategoryDetails";
import Tools from "./pages/Tools/Tools";
import ImageCompressor from "./pages/Tools/ToolsDetails/ImagesTools/ImageCompressor/ImageCompressor";
import { ImageConverter } from "./pages/Tools/ToolsDetails/ImagesTools/ImageConverter/ImageConverter";
import BackgroundRemover from "./pages/Tools/ToolsDetails/ImagesTools/BackgroundRemover/BackgroundRemover";
import { ImageUpscaler } from "./pages/Tools/ToolsDetails/ImagesTools/ImageUpscaler/ImageUpscaler";
import SEOAnalyzer from "./pages/Tools/ToolsDetails/Marketing&SEOTools/SEOAnalyzer/SEOAnalyzer";
import KeywordResearchTool from "./pages/Tools/ToolsDetails/Marketing&SEOTools/KeywordResearchTool/KeywordResearchTool";
import MetaTagGenerator from "./pages/Tools/ToolsDetails/Marketing&SEOTools/MetaTagGenerator/MetaTagGenerator";

// import Categories from "./pages/Categories";
// import Tools from "./pages/Tools";


function App() {
  return (
    <Router>
      <Layouts>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/developers" element={<CategoryDetails />} />
          <Route path="/tools" element={<Tools />} />
          {/* Image Tools */}
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
          <Route path="/tools/image-converter" element={<ImageConverter />} />
          <Route path="/tools/background-remover" element={<BackgroundRemover />} />
          <Route path="/tools/image-upscaler" element={<ImageUpscaler />} />

          {/* Marketing&SEOTools */}
          <Route path="/tools/seo-analyzer" element={<SEOAnalyzer />} />
          <Route path="/tools/keyword-research" element={<KeywordResearchTool />} />
          <Route path="/tools/meta-tag-generator" element={<MetaTagGenerator />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layouts>
    </Router>
  );
}

export default App;