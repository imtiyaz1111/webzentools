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

const TextToBinary = React.lazy(() => import('./ToolsDetails/TextTools/TextToBinary'));
const AITextGenerator = React.lazy(() => import('./ToolsDetails/AITools/AITextGenerator'));
const AIBlogWriter = React.lazy(() => import('./ToolsDetails/AITools/AIBlogWriter'));
const ImagePromptGenerator = React.lazy(() => import('./ToolsDetails/AITools/ImagePromptGenerator'));
const AICaptionGenerator = React.lazy(() => import('./ToolsDetails/AITools/AICaptionGenerator'));
const AIParaphraser = React.lazy(() => import('./ToolsDetails/AITools/AIParaphraser'));
const AIEmailWriter = React.lazy(() => import('./ToolsDetails/AITools/AIEmailWriter'));
const AICodeExplainer = React.lazy(() => import('./ToolsDetails/AITools/AICodeExplainer'));
const AIGrammarChecker = React.lazy(() => import('./ToolsDetails/AITools/AIGrammarChecker'));
const AITextSummarizer = React.lazy(() => import('./ToolsDetails/AITools/AITextSummarizer'));
const AIBusinessNameGenerator = React.lazy(() => import('./ToolsDetails/AITools/AIBusinessNameGenerator'));









const Base64EncodeDecode = React.lazy(() => import('./ToolsDetails/DeveloperTools/Base64EncodeDecode/Base64EncodeDecode'));
const CSSMinifierBeautifier = React.lazy(() => import('./ToolsDetails/DeveloperTools/CSSMinifierBeautifier/CSSMinifierBeautifier'));
const HTMLMinifier = React.lazy(() => import('./ToolsDetails/DeveloperTools/HTMLMinifier/HTMLMinifier'));
const RegexTester = React.lazy(() => import('./ToolsDetails/DeveloperTools/RegexTester/RegexTester'));
const UuidGenerator = React.lazy(() => import('./ToolsDetails/DeveloperTools/UuidGenerator/UuidGenerator'));
const JwtDecoder = React.lazy(() => import('./ToolsDetails/DeveloperTools/JwtDecoder/JwtDecoder'));
const SqlFormatter = React.lazy(() => import('./ToolsDetails/DeveloperTools/SqlFormatter/SqlFormatter'));
const UrlParser = React.lazy(() => import('./ToolsDetails/DeveloperTools/UrlParser/UrlParser'));
const ApiTester = React.lazy(() => import('./ToolsDetails/DeveloperTools/ApiTester/ApiTester'));
const HTMLEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/HTMLEditor'));
const CSSEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/CSSEditor'));
const JavaScriptEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/JavaScriptEditor'));
const ReactJSXEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/ReactJSXEditor'));
const XMLEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/XMLEditor'));
const TypeScriptEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/TypeScriptEditor'));
const MarkdownEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/MarkdownEditor'));
const PythonEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/PythonEditor'));
const JavaEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/JavaEditor'));
const CEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/CEditor'));
const CPPEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/CPPEditor'));
const PHPEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/PHPEditor'));
const NodeJsEditor = React.lazy(() => import('./ToolsDetails/DeveloperTools/NodeJsEditor'));
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
const VideoToMP3 = React.lazy(() => import('./ToolsDetails/MediaTools/VideoToMP3'));
const VideoCompressor = React.lazy(() => import('./ToolsDetails/MediaTools/VideoCompressor'));
const ThumbnailDownloader = React.lazy(() => import('./ToolsDetails/MediaTools/ThumbnailDownloader'));
const GifMaker = React.lazy(() => import('./ToolsDetails/MediaTools/GifMaker'));
const AudioCutter = React.lazy(() => import('./ToolsDetails/MediaTools/AudioCutter'));
const ScreenRecorder = React.lazy(() => import('./ToolsDetails/MediaTools/ScreenRecorder'));
const AudioConverter = React.lazy(() => import('./ToolsDetails/MediaTools/AudioConverter'));
const ScreenRuler = React.lazy(() => import('./ToolsDetails/MediaTools/ScreenRuler'));
const ColorPaletteGenerator = React.lazy(() => import('./ToolsDetails/MediaTools/ColorPaletteGenerator'));
const VideoDownloader = React.lazy(() => import('./ToolsDetails/MediaTools/VideoDownloader'));
const HeadlineGenerator = React.lazy(() => import('./ToolsDetails/MarketingTools/HeadlineGenerator'));
const CTAGenerator = React.lazy(() => import('./ToolsDetails/MarketingTools/CTAGenerator'));
const ProductDescriptionGenerator = React.lazy(() => import('./ToolsDetails/MarketingTools/ProductDescriptionGenerator'));
const SalesCopyGenerator = React.lazy(() => import('./ToolsDetails/MarketingTools/SalesCopyGenerator'));
const LandingPageGenerator = React.lazy(() => import('./ToolsDetails/MarketingTools/LandingPageGenerator'));
const AdCopyGenerator = React.lazy(() => import('./ToolsDetails/MarketingTools/AdCopyGenerator'));
const EmailSubjectGenerator = React.lazy(() => import('./ToolsDetails/MarketingTools/EmailSubjectGenerator'));
const ColdEmailGenerator = React.lazy(() => import('./ToolsDetails/MarketingTools/ColdEmailGenerator'));
const ValuePropositionGenerator = React.lazy(() => import('./ToolsDetails/MarketingTools/ValuePropositionGenerator'));
const USPGenerator = React.lazy(() => import('./ToolsDetails/MarketingTools/USPGenerator'));
const MarketingFunnelBuilder = React.lazy(() => import('./ToolsDetails/MarketingTools/MarketingFunnelBuilder'));
const ConversionRateCalculator = React.lazy(() => import('./ToolsDetails/MarketingTools/ConversionRateCalculator'));
const BreakEvenCalculator = React.lazy(() => import('./ToolsDetails/MarketingTools/BreakEvenCalculator'));
const CLVCalculator = React.lazy(() => import('./ToolsDetails/MarketingTools/CLVCalculator'));
const CACCalculator = React.lazy(() => import('./ToolsDetails/MarketingTools/CACCalculator'));
const ABTestCalculator = React.lazy(() => import('./ToolsDetails/MarketingTools/ABTestCalculator'));
const CampaignPerformanceAnalyzer = React.lazy(() => import('./ToolsDetails/MarketingTools/CampaignPerformanceAnalyzer'));























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
            case 'AIBlogWriter':
                return <AIBlogWriter />;
            case 'ImagePromptGenerator':
                return <ImagePromptGenerator />;
            case 'AICaptionGenerator':
                return <AICaptionGenerator />;
            case 'AIParaphraser':
                return <AIParaphraser />;
            case 'AIEmailWriter':
                return <AIEmailWriter />;
            case 'AICodeExplainer':
                return <AICodeExplainer />;
            case 'AIGrammarChecker':
                return <AIGrammarChecker />;
            case 'AITextSummarizer':
                return <AITextSummarizer />;
            case 'AIBusinessNameGenerator':
                return <AIBusinessNameGenerator />;









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
            case 'ApiTester':
                return <ApiTester />;
            case 'HTMLEditor':
                return <HTMLEditor />;
            case 'CSSEditor':
                return <CSSEditor />;
            case 'JavaScriptEditor':
                return <JavaScriptEditor />;
            case 'ReactJSXEditor':
                return <ReactJSXEditor />;
            case 'XMLEditor':
                return <XMLEditor />;
            case 'TypeScriptEditor':
                return <TypeScriptEditor />;
            case 'MarkdownEditor':
                return <MarkdownEditor />;
            case 'PythonEditor':
                return <PythonEditor />;
            case 'JavaEditor':
                return <JavaEditor />;
            case 'CEditor':
                return <CEditor />;
            case 'CPPEditor':
                return <CPPEditor />;
            case 'PHPEditor':
                return <PHPEditor />;
            case 'NodeJsEditor':
                return <NodeJsEditor />;
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
            case 'VideoToMP3':
                return <VideoToMP3 />;
            case 'VideoCompressor':
                return <VideoCompressor />;
            case 'ThumbnailDownloader':
                return <ThumbnailDownloader />;
            case 'GifMaker':
                return <GifMaker />;
            case 'AudioCutter':
                return <AudioCutter />;
            case 'ScreenRecorder':
                return <ScreenRecorder />;
            case 'AudioConverter':
                return <AudioConverter />;
            case 'ScreenRuler':
                return <ScreenRuler />;
            case 'ColorPaletteGenerator':
                return <ColorPaletteGenerator />;
            case 'VideoDownloader':
                return <VideoDownloader />;
            case 'HeadlineGenerator':
                return <HeadlineGenerator />;
            case 'CTAGenerator':
                return <CTAGenerator />;
            case 'ProductDescriptionGenerator':
                return <ProductDescriptionGenerator />;
            case 'SalesCopyGenerator':
                return <SalesCopyGenerator />;
            case 'LandingPageGenerator':
                return <LandingPageGenerator />;
            case 'AdCopyGenerator':
                return <AdCopyGenerator />;
            case 'EmailSubjectGenerator':
                return <EmailSubjectGenerator />;
            case 'ColdEmailGenerator':
                return <ColdEmailGenerator />;
            case 'ValuePropositionGenerator':
                return <ValuePropositionGenerator />;
            case 'USPGenerator':
                return <USPGenerator />;
            case 'MarketingFunnelBuilder':
                return <MarketingFunnelBuilder />;
            case 'ConversionRateCalculator':
                return <ConversionRateCalculator />;
            case 'BreakEvenCalculator':
                return <BreakEvenCalculator />;
            case 'CLVCalculator':
                return <CLVCalculator />;
            case 'CACCalculator':
                return <CACCalculator />;
            case 'ABTestCalculator':
                return <ABTestCalculator />;
            case 'CampaignPerformanceAnalyzer':
                return <CampaignPerformanceAnalyzer />;






















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
