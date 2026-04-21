import React from 'react';
import { useParams } from 'react-router-dom';
import { allTools } from '../../data/toolsData';
import ToolLayout from '../../layout/ToolLayout';
import PlaceholderTool from '../../components/PlaceholderTool';

// Import tool components
const JSONFormatter = React.lazy(() => import('./ToolsDetails/DeveloperTools/JSONFormatterValidator/JSONFormatterValidator'));
const EmiCalculator = React.lazy(() => import('./ToolsDetails/Finance/EmiCalculator'));
const WordCounter = React.lazy(() => import('./ToolsDetails/TextTools/WordCounter'));
const AITextGenerator = React.lazy(() => import('./ToolsDetails/AITools/AITextGenerator'));
const Base64EncodeDecode = React.lazy(() => import('./ToolsDetails/DeveloperTools/Base64EncodeDecode/Base64EncodeDecode'));
const CSSMinifierBeautifier = React.lazy(() => import('./ToolsDetails/DeveloperTools/CSSMinifierBeautifier/CSSMinifierBeautifier'));
const HTMLMinifier = React.lazy(() => import('./ToolsDetails/DeveloperTools/HTMLMinifier/HTMLMinifier'));
const RegexTester = React.lazy(() => import('./ToolsDetails/DeveloperTools/RegexTester/RegexTester'));
const UuidGenerator = React.lazy(() => import('./ToolsDetails/DeveloperTools/UuidGenerator/UuidGenerator'));
const JwtDecoder = React.lazy(() => import('./ToolsDetails/DeveloperTools/JwtDecoder/JwtDecoder'));
const SqlFormatter = React.lazy(() => import('./ToolsDetails/DeveloperTools/SqlFormatter/SqlFormatter'));
const UrlParser = React.lazy(() => import('./ToolsDetails/DeveloperTools/UrlParser/UrlParser'));
const ImageCompressor = React.lazy(() => import('./ToolsDetails/ImagesTools/ImageCompressor/ImageCompressor'));
const BackgroundRemover = React.lazy(() => import('./ToolsDetails/ImagesTools/BackgroundRemover/BackgroundRemover'));
const ImageResizer = React.lazy(() => import('./ToolsDetails/ImagesTools/ImageResizer/ImageResizer'));
const ImageConverter = React.lazy(() => import('./ToolsDetails/ImagesTools/ImageConverter/ImageConverter'));
const PdfToJpg = React.lazy(() => import('./ToolsDetails/ImagesTools/PdfToJpg/PdfToJpg'));
const WatermarkAdder = React.lazy(() => import('./ToolsDetails/ImagesTools/WatermarkAdder/WatermarkAdder'));









const ToolDetailPage = () => {
    const { slug } = useParams();
    const tool = allTools.find(t => t.slug === slug);

    if (!tool) {
        return <div className="py-5 text-center"><h1>Tool Not Found</h1></div>;
    }

    const renderTool = () => {
        switch (tool.componentKey) {
            case 'JsonFormatter':
                return <JSONFormatter />;
            case 'EmiCalculator':
                return <EmiCalculator />;
            case 'WordCounter':
                return <WordCounter />;
            case 'AITextGenerator':
                return <AITextGenerator />;
            case 'Base64EncodeDecode':
                return <Base64EncodeDecode />;
            case 'CSSMinifierBeautifier':
                return <CSSMinifierBeautifier />;
            case 'HTMLMinifier':
                return <HTMLMinifier />;
            case 'RegexTester':
                return <RegexTester />;
            case 'UuidGenerator':
                return <UuidGenerator />;
            case 'JwtDecoder':
                return <JwtDecoder />;
            case 'SqlFormatter':
                return <SqlFormatter />;
            case 'UrlParser':
                return <UrlParser />;
            case 'ImageCompressor':
                return <ImageCompressor />;
            case 'BackgroundRemover':
                return <BackgroundRemover />;
            case 'ImageResizer':
                return <ImageResizer />;
            case 'ImageConverter':
                return <ImageConverter />;
            case 'PdfToJpg':
                return <PdfToJpg />;
            case 'WatermarkAdder':
                return <WatermarkAdder />;








            default:
                return <PlaceholderTool toolName={tool.name} />;
        }
    };

    return (
        <ToolLayout tool={tool}>
            <React.Suspense fallback={<div className="text-center py-5">Loading tool interface...</div>}>
                {renderTool()}
            </React.Suspense>
        </ToolLayout>
    );
};

export default ToolDetailPage;
