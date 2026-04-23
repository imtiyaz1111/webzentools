import React from 'react';
import { useParams } from 'react-router-dom';
import { allTools } from '../../data/toolsData';
import ToolLayout from '../../layout/ToolLayout';
import PlaceholderTool from '../../components/PlaceholderTool';

// Import tool components
const JSONFormatter = React.lazy(() => import('./ToolsDetails/DeveloperTools/JSONFormatterValidator/JSONFormatterValidator'));
const EmiCalculator = React.lazy(() => import('./ToolsDetails/Finance/EmiCalculator'));
const LoanCalculator = React.lazy(() => import('./ToolsDetails/Finance/LoanCalculator'));
const GstCalculator = React.lazy(() => import('./ToolsDetails/Finance/GstCalculator'));
const CurrencyConverter = React.lazy(() => import('./ToolsDetails/Finance/CurrencyConverter'));
const SipCalculator = React.lazy(() => import('./ToolsDetails/Finance/SipCalculator'));
const ProfitMarginCalculator = React.lazy(() => import('./ToolsDetails/Finance/ProfitMarginCalculator'));
const SalaryCalculator = React.lazy(() => import('./ToolsDetails/Finance/SalaryCalculator'));
const SimpleInterestCalculator = React.lazy(() => import('./ToolsDetails/Finance/SimpleInterestCalculator'));
const CagrCalculator = React.lazy(() => import('./ToolsDetails/Finance/CagrCalculator'));
const RoiCalculator = React.lazy(() => import('./ToolsDetails/Finance/RoiCalculator'));









const WordCounter = React.lazy(() => import('./ToolsDetails/TextTools/WordCounter'));
const CaseConverter = React.lazy(() => import('./ToolsDetails/TextTools/CaseConverter'));
const DuplicateLineRemover = React.lazy(() => import('./ToolsDetails/TextTools/DuplicateLineRemover'));
const TextLineSorter = React.lazy(() => import('./ToolsDetails/TextTools/TextLineSorter'));
const LoremIpsumGenerator = React.lazy(() => import('./ToolsDetails/TextTools/LoremIpsumGenerator'));
const StringReverser = React.lazy(() => import('./ToolsDetails/TextTools/StringReverser'));
const WhitespaceRemover = React.lazy(() => import('./ToolsDetails/TextTools/WhitespaceRemover'));
const DiffChecker = React.lazy(() => import('./ToolsDetails/TextTools/DiffChecker'));
const MarkdownEditor = React.lazy(() => import('./ToolsDetails/TextTools/MarkdownEditor'));
const TextToBinary = React.lazy(() => import('./ToolsDetails/TextTools/TextToBinary'));
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
const MemeGenerator = React.lazy(() => import('./ToolsDetails/ImagesTools/MemeGenerator/MemeGenerator'));
const FaviconGenerator = React.lazy(() => import('./ToolsDetails/ImagesTools/FaviconGenerator/FaviconGenerator'));
const SVGOptimizer = React.lazy(() => import('./ToolsDetails/ImagesTools/SVGOptimizer/SVGOptimizer'));
const ColorPicker = React.lazy(() => import('./ToolsDetails/ImagesTools/ColorPicker/ColorPicker'));
const KeywordDensityChecker = React.lazy(() => import('./ToolsDetails/SEO/KeywordDensityChecker'));
const MetaTagGenerator = React.lazy(() => import('./ToolsDetails/SEO/MetaTagGenerator'));
const SEOAnalyzer = React.lazy(() => import('./ToolsDetails/SEO/SEOAnalyzer'));
const BacklinkChecker = React.lazy(() => import('./ToolsDetails/SEO/BacklinkChecker'));
const RobotsTxtGenerator = React.lazy(() => import('./ToolsDetails/SEO/RobotsTxtGenerator'));
const SitemapGenerator = React.lazy(() => import('./ToolsDetails/SEO/SitemapGenerator'));
const GoogleIndexChecker = React.lazy(() => import('./ToolsDetails/SEO/GoogleIndexChecker'));
const SerpSimulator = React.lazy(() => import('./ToolsDetails/SEO/SerpSimulator'));
const OpenGraphChecker = React.lazy(() => import('./ToolsDetails/SEO/OpenGraphChecker'));
const CanonicalGenerator = React.lazy(() => import('./ToolsDetails/SEO/CanonicalGenerator'));
const PasswordGenerator = React.lazy(() => import('./ToolsDetails/SecurityTools/PasswordGenerator'));
const HashGenerator = React.lazy(() => import('./ToolsDetails/SecurityTools/HashGenerator'));
const UrlEncoderDecoder = React.lazy(() => import('./ToolsDetails/SecurityTools/UrlEncoderDecoder'));
const IpLookup = React.lazy(() => import('./ToolsDetails/SecurityTools/IpLookup'));
const WhoisLookup = React.lazy(() => import('./ToolsDetails/SecurityTools/WhoisLookup'));
const SslChecker = React.lazy(() => import('./ToolsDetails/SecurityTools/SslChecker'));
const MacLookup = React.lazy(() => import('./ToolsDetails/SecurityTools/MacLookup'));
const PortScanner = React.lazy(() => import('./ToolsDetails/SecurityTools/PortScanner'));
const BcryptGenerator = React.lazy(() => import('./ToolsDetails/SecurityTools/BcryptGenerator'));
const Base32Encoder = React.lazy(() => import('./ToolsDetails/SecurityTools/Base32Encoder'));
const PomodoroTimer = React.lazy(() => import('./ToolsDetails/ProductivityTools/PomodoroTimer'));
const TodoList = React.lazy(() => import('./ToolsDetails/ProductivityTools/TodoList'));
const SecureNotes = React.lazy(() => import('./ToolsDetails/ProductivityTools/SecureNotes'));
const TimezoneConverter = React.lazy(() => import('./ToolsDetails/ProductivityTools/TimezoneConverter'));
const UnitConverter = React.lazy(() => import('./ToolsDetails/ProductivityTools/UnitConverter'));
const AgeCalculator = React.lazy(() => import('./ToolsDetails/ProductivityTools/AgeCalculator'));
const DaysBetweenDates = React.lazy(() => import('./ToolsDetails/ProductivityTools/DaysBetweenDates'));
const Stopwatch = React.lazy(() => import('./ToolsDetails/ProductivityTools/Stopwatch'));
const PercentageCalculator = React.lazy(() => import('./ToolsDetails/ProductivityTools/PercentageCalculator'));
const HabitTracker = React.lazy(() => import('./ToolsDetails/ProductivityTools/HabitTracker'));























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
            case 'LoanCalculator':
                return <LoanCalculator />;
            case 'GstCalculator':
                return <GstCalculator />;
            case 'CurrencyConverter':
                return <CurrencyConverter />;
            case 'SipCalculator':
                return <SipCalculator />;
            case 'ProfitMarginCalculator':
                return <ProfitMarginCalculator />;
            case 'SalaryCalculator':
                return <SalaryCalculator />;
            case 'SimpleInterestCalculator':
                return <SimpleInterestCalculator />;
            case 'CagrCalculator':
                return <CagrCalculator />;
            case 'RoiCalculator':
                return <RoiCalculator />;









            case 'WordCounter':
                return <WordCounter />;
            case 'CaseConverter':
                return <CaseConverter />;
            case 'DuplicateLineRemover':
                return <DuplicateLineRemover />;
            case 'TextLineSorter':
                return <TextLineSorter />;
            case 'LoremIpsumGenerator':
                return <LoremIpsumGenerator />;
            case 'StringReverser':
                return <StringReverser />;
            case 'WhitespaceRemover':
                return <WhitespaceRemover />;
            case 'DiffChecker':
                return <DiffChecker />;
            case 'MarkdownEditor':
                return <MarkdownEditor />;
            case 'TextToBinary':
                return <TextToBinary />;
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
            case 'MemeGenerator':
                return <MemeGenerator />;
            case 'FaviconGenerator':
                return <FaviconGenerator />;
            case 'SVGOptimizer':
                return <SVGOptimizer />;
            case 'ColorPicker':
                return <ColorPicker />;
            case 'KeywordDensityChecker':
                return <KeywordDensityChecker />;
            case 'MetaTagGenerator':
                return <MetaTagGenerator />;
            case 'SEOAnalyzer':
                return <SEOAnalyzer />;
            case 'BacklinkChecker':
                return <BacklinkChecker />;
            case 'RobotsTxtGenerator':
                return <RobotsTxtGenerator />;
            case 'SitemapGenerator':
                return <SitemapGenerator />;
            case 'GoogleIndexChecker':
                return <GoogleIndexChecker />;
            case 'SerpSimulator':
                return <SerpSimulator />;
            case 'OpenGraphChecker':
                return <OpenGraphChecker />;
            case 'CanonicalGenerator':
                return <CanonicalGenerator />;
            case 'PasswordGenerator':
                return <PasswordGenerator />;
            case 'HashGenerator':
                return <HashGenerator />;
            case 'UrlEncoderDecoder':
                return <UrlEncoderDecoder />;
            case 'IpLookup':
                return <IpLookup />;
            case 'WhoisLookup':
                return <WhoisLookup />;
            case 'SslChecker':
                return <SslChecker />;
            case 'MacLookup':
                return <MacLookup />;
            case 'PortScanner':
                return <PortScanner />;
            case 'BcryptGenerator':
                return <BcryptGenerator />;
            case 'Base32Encoder':
                return <Base32Encoder />;
            case 'PomodoroTimer':
                return <PomodoroTimer />;
            case 'TodoList':
                return <TodoList />;
            case 'SecureNotes':
                return <SecureNotes />;
            case 'TimezoneConverter':
                return <TimezoneConverter />;
            case 'UnitConverter':
                return <UnitConverter />;
            case 'AgeCalculator':
                return <AgeCalculator />;
            case 'DaysBetweenDates':
                return <DaysBetweenDates />;
            case 'Stopwatch':
                return <Stopwatch />;
            case 'PercentageCalculator':
                return <PercentageCalculator />;
            case 'HabitTracker':
                return <HabitTracker />;






















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
