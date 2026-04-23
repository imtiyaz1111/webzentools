import {
    FaCode, FaImage, FaRobot, FaCalculator, FaSearch,
    FaFont, FaShieldAlt, FaClock, FaVideo, FaGlobe
} from 'react-icons/fa';

export const categories = [
    { id: 'developer', name: 'Developer Tools', icon: FaCode, count: 10, color: 'text-blue-500' },
    { id: 'image', name: 'Image Tools', icon: FaImage, count: 10, color: 'text-purple-500' },
    { id: 'ai', name: 'AI Tools', icon: FaRobot, count: 10, color: 'text-indigo-500' },
    { id: 'finance', name: 'Finance Tools', icon: FaCalculator, count: 10, color: 'text-green-500' },
    { id: 'seo', name: 'SEO Tools', icon: FaSearch, count: 10, color: 'text-orange-500' },
    { id: 'text', name: 'Text Tools', icon: FaFont, count: 10, color: 'text-teal-500' },
    { id: 'security', name: 'Security Tools', icon: FaShieldAlt, count: 10, color: 'text-red-500' },
    { id: 'productivity', name: 'Productivity Tools', icon: FaClock, count: 10, color: 'text-yellow-500' },
    { id: 'media', name: 'Media Tools', icon: FaVideo, count: 10, color: 'text-pink-500' },
    { id: 'website', name: 'Website Tools', icon: FaGlobe, count: 10, color: 'text-cyan-500' }
];

export const allTools = [
    // 1. Developer Tools
    { id: 1, slug: 'json-formatter', name: 'JSON Formatter', category: 'developer', desc: 'Format and beautify JSON data.', isPremium: false, componentKey: 'JsonFormatter' },
    { id: 2, slug: 'base64-encode-decode', name: 'Base64 Encoder/Decoder', category: 'developer', desc: 'Encode or decode strings to Base64 format.', isPremium: false, componentKey: 'Base64EncodeDecode' },
    { id: 3, slug: 'html-minifier', name: 'HTML Minifier', category: 'developer', desc: 'Minify HTML code to save bandwidth and improve site speed.', isPremium: false, componentKey: 'HTMLMinifier' },
    { id: 4, slug: 'css-beautifier', name: 'CSS Beautifier', category: 'developer', desc: 'Format minified CSS back to readable format.', isPremium: false, componentKey: 'CSSMinifierBeautifier' },
    { id: 5, slug: 'regex-tester', name: 'Regex Tester', category: 'developer', desc: 'Test regular expressions against target strings.', isPremium: false, componentKey: 'RegexTester' },
    { id: 6, slug: 'api-tester', name: 'API Tester', category: 'developer', desc: 'Send HTTP requests and view responses instantly.', isPremium: false, componentKey: 'Placeholder' },
    { id: 7, slug: 'uuid-generator', name: 'UUID Generator', category: 'developer', desc: 'Generate unique identifiers (v1 to v5) instantly.', isPremium: false, componentKey: 'UuidGenerator' },
    { id: 8, slug: 'jwt-decoder', name: 'JWT Decoder', category: 'developer', desc: 'Decode JSON Web Tokens securely inside your browser.', isPremium: false, componentKey: 'JwtDecoder' },
    { id: 9, slug: 'sql-formatter', name: 'SQL Formatter', category: 'developer', desc: 'Format messy SQL queries for better readability.', isPremium: false, componentKey: 'SqlFormatter' },
    { id: 10, slug: 'url-parser', name: 'URL Parser', category: 'developer', desc: 'Parse URLs into individual components and query params.', isPremium: false, componentKey: 'UrlParser' },

    // 2. Image Tools
    { id: 11, slug: 'image-compressor', name: 'Image Compressor', category: 'image', desc: 'Reduce image file sizes without quality loss.', isPremium: false, componentKey: 'ImageCompressor' },
    { id: 12, slug: 'background-remover', name: 'Background Remover', category: 'image', desc: 'Remove image backgrounds using AI.', isPremium: false, componentKey: 'BackgroundRemover' },
    { id: 13, slug: 'image-resizer', name: 'Image Resizer', category: 'image', desc: 'Resize images to exact dimensions for social media.', isPremium: false, componentKey: 'ImageResizer' },
    { id: 14, slug: 'image-converter', name: 'Image Converter', category: 'image', desc: 'Convert images to PNG, JPG, WEBP, or SVG.', isPremium: false, componentKey: 'ImageConverter' },
    { id: 15, slug: 'pdf-to-jpg', name: 'PDF to JPG', category: 'image', desc: 'Extract pages from PDF files as individual JPG images.', isPremium: false, componentKey: 'PdfToJpg' },
    { id: 16, slug: 'watermark-adder', name: 'Watermark Adder', category: 'image', desc: 'Add text or logo watermarks to protect your images.', isPremium: false, componentKey: 'WatermarkAdder' },
    { id: 17, slug: 'meme-generator', name: 'Meme Generator', category: 'image', desc: 'Create custom memes with text on popular templates.', isPremium: false, componentKey: 'MemeGenerator' },
    { id: 18, slug: 'favicon-generator', name: 'Favicon Generator', category: 'image', desc: 'Generate ICO and PNG favicons for websites.', isPremium: false, componentKey: 'FaviconGenerator' },
    { id: 19, slug: 'svg-optimizer', name: 'SVG Optimizer', category: 'image', desc: 'Clean and minify SVG files to reduce footprint.', isPremium: false, componentKey: 'SVGOptimizer' },
    { id: 20, slug: 'color-picker', name: 'Color Picker', category: 'image', desc: 'Extract specific colors (HEX/RGB) from an image.', isPremium: false, componentKey: 'ColorPicker' },

    // 3. AI Tools
    { id: 21, slug: 'ai-text-generator', name: 'AI Text Generator', category: 'ai', desc: 'Generate high-quality paragraphs using advanced AI.', isPremium: false, componentKey: 'AITextGenerator' },
    { id: 22, slug: 'ai-blog-writer', name: 'AI Blog Writer', category: 'ai', desc: 'Write complete, SEO-optimized blog posts in seconds.', isPremium: false, componentKey: 'Placeholder' },
    { id: 23, slug: 'ai-image-generator', name: 'Image Prompt Generator', category: 'ai', desc: 'Create detailed prompts for Midjourney and DALL-E.', isPremium: false, componentKey: 'Placeholder' },
    { id: 24, slug: 'ai-caption-generator', name: 'Caption Generator', category: 'ai', desc: 'Generate catchy captions for Instagram and TikTok.', isPremium: false, componentKey: 'Placeholder' },
    { id: 25, slug: 'ai-paraphraser', name: 'Paraphraser Tool', category: 'ai', desc: 'Rewrite sentences to improve flow and avoid plagiarism.', isPremium: false, componentKey: 'Placeholder' },
    { id: 26, slug: 'ai-email-writer', name: 'AI Email Writer', category: 'ai', desc: 'Draft professional emails for any situation.', isPremium: false, componentKey: 'Placeholder' },
    { id: 27, slug: 'ai-code-explainer', name: 'Code Explainer', category: 'ai', desc: 'Paste code and let AI explain what it does in plain English.', isPremium: false, componentKey: 'Placeholder' },
    { id: 28, slug: 'ai-grammar-fixer', name: 'Grammar Checker', category: 'ai', desc: 'Find and fix grammatical errors automatically.', isPremium: false, componentKey: 'Placeholder' },
    { id: 29, slug: 'ai-summarizer', name: 'Text Summarizer', category: 'ai', desc: 'Condense long articles into short, readable summaries.', isPremium: false, componentKey: 'Placeholder' },
    { id: 30, slug: 'ai-name-generator', name: 'Business Name Generator', category: 'ai', desc: 'Generate brandable names for your new startup.', isPremium: false, componentKey: 'Placeholder' },

    // 4. Finance Tools
    { id: 31, slug: 'emi-calculator', name: 'EMI Calculator', category: 'finance', desc: 'Calculate Equated Monthly Installment for loans.', isPremium: false, componentKey: 'EmiCalculator' },
    { id: 32, slug: 'loan-calculator', name: 'Loan Calculator', category: 'finance', desc: 'Estimate total interest and repayment schedules.', isPremium: false, componentKey: 'LoanCalculator' },
    { id: 33, slug: 'gst-calculator', name: 'GST Calculator', category: 'finance', desc: 'Calculate exact Goods and Services Tax inclusive/exclusive.', isPremium: false, componentKey: 'GstCalculator' },
    { id: 34, slug: 'currency-converter', name: 'Currency Converter', category: 'finance', desc: 'Convert between 150+ global currencies with live rates.', isPremium: false, componentKey: 'CurrencyConverter' },
    { id: 35, slug: 'sip-calculator', name: 'SIP Calculator', category: 'finance', desc: 'Calculate compounding returns for mutual funds.', isPremium: false, componentKey: 'SipCalculator' },
    { id: 36, slug: 'profit-margin', name: 'Profit Margin Calculator', category: 'finance', desc: 'Find gross and net profit margins instantly.', isPremium: false, componentKey: 'ProfitMarginCalculator' },
    { id: 37, slug: 'salary-calculator', name: 'Salary Calculator', category: 'finance', desc: 'Convert hourly wage to annual salary and vice-versa.', isPremium: false, componentKey: 'SalaryCalculator' },
    { id: 38, slug: 'simple-interest', name: 'Simple Interest Calculator', category: 'finance', desc: 'Calculate interest accrued on principal amounts.', isPremium: false, componentKey: 'SimpleInterestCalculator' },
    { id: 39, slug: 'cagr-calculator', name: 'CAGR Calculator', category: 'finance', desc: 'Calculate Compound Annual Growth Rate for investments.', isPremium: false, componentKey: 'CagrCalculator' },
    { id: 40, slug: 'roi-calculator', name: 'ROI Calculator', category: 'finance', desc: 'Calculate Return on Investment percentage and profit.', isPremium: false, componentKey: 'RoiCalculator' },

    // 5. SEO Tools
    { id: 41, slug: 'keyword-density', name: 'Keyword Density Checker', category: 'seo', desc: 'Analyze text to find the most frequently used words.', isPremium: false, componentKey: 'KeywordDensityChecker' },
    { id: 42, slug: 'meta-generator', name: 'Meta Tag Generator', category: 'seo', desc: 'Generate optimized meta tags for your HTML head.', isPremium: false, componentKey: 'MetaTagGenerator' },
    { id: 43, slug: 'seo-analyzer', name: 'SEO Analyzer', category: 'seo', desc: 'Analyze URLs for common on-page SEO issues.', isPremium: false, componentKey: 'SEOAnalyzer' },
    { id: 44, slug: 'backlink-checker', name: 'Backlink Checker', category: 'seo', desc: 'Discover referring domains pointing to your site.', isPremium: false, componentKey: 'BacklinkChecker' },
    { id: 45, slug: 'robots-txt-generator', name: 'Robots.txt Generator', category: 'seo', desc: 'Create robots.txt files to manage search crawlers.', isPremium: false, componentKey: 'RobotsTxtGenerator' },
    { id: 46, slug: 'sitemap-generator', name: 'Sitemap Generator', category: 'seo', desc: 'Generate XML sitemaps for Google Search Console.', isPremium: false, componentKey: 'SitemapGenerator' },
    { id: 47, slug: 'index-checker', name: 'Google Index Checker', category: 'seo', desc: 'Check if specific URLs are indexed in Google.', isPremium: false, componentKey: 'GoogleIndexChecker' },
    { id: 48, slug: 'serp-simulator', name: 'SERP Simulator', category: 'seo', desc: 'Preview how your site appears in Google search results.', isPremium: false, componentKey: 'SerpSimulator' },
    { id: 49, slug: 'open-graph-checker', name: 'Open Graph Checker', category: 'seo', desc: 'Test how your links look when shared on social media.', isPremium: false, componentKey: 'OpenGraphChecker' },
    { id: 50, slug: 'canonical-generator', name: 'Canonical Tag Generator', category: 'seo', desc: 'Generate canonical tags to prevent duplicate content.', isPremium: false, componentKey: 'CanonicalGenerator' },

    // 6. Text Tools
    { id: 51, slug: 'word-counter', name: 'Word Counter', category: 'text', desc: 'Count words, characters, and reading time instantly.', isPremium: false, componentKey: 'WordCounter' },
    { id: 52, slug: 'case-converter', name: 'Case Converter', category: 'text', desc: 'Transform text to uppercase, lowercase, camelCase, etc.', isPremium: false, componentKey: 'CaseConverter' },
    { id: 53, slug: 'duplicate-remover', name: 'Duplicate Line Remover', category: 'text', desc: 'Remove duplicate lines from text lists automatically.', isPremium: false, componentKey: 'DuplicateLineRemover' },
    { id: 54, slug: 'text-sorter', name: 'Text Line Sorter', category: 'text', desc: 'Alphabetize or reverse sort lists of words.', isPremium: false, componentKey: 'TextLineSorter' },
    { id: 55, slug: 'lorem-ipsum', name: 'Lorem Ipsum Generator', category: 'text', desc: 'Generate placeholder dummy text for mockups.', isPremium: false, componentKey: 'LoremIpsumGenerator' },
    { id: 56, slug: 'string-reverse', name: 'String Reverser', category: 'text', desc: 'Reverse the order of characters in any string.', isPremium: false, componentKey: 'StringReverser' },
    { id: 57, slug: 'whitespace-remover', name: 'Whitespace Remover', category: 'text', desc: 'Strip extra spaces, tabs, and newlines from text.', isPremium: false, componentKey: 'WhitespaceRemover' },
    { id: 58, slug: 'diff-checker', name: 'Diff Checker', category: 'text', desc: 'Compare two text files and highlight the differences.', isPremium: false, componentKey: 'DiffChecker' },
    { id: 59, slug: 'markdown-editor', name: 'Markdown Editor', category: 'text', desc: 'Write in Markdown and preview HTML instantly.', isPremium: false, componentKey: 'MarkdownEditor' },
    { id: 60, slug: 'text-to-binary', name: 'Text to Binary', category: 'text', desc: 'Convert ASCII text directly into binary format.', isPremium: false, componentKey: 'TextToBinary' },

    // 7. Security Tools
    { id: 61, slug: 'password-generator', name: 'Password Generator', category: 'security', desc: 'Generate highly secure, randomized passwords.', isPremium: false, componentKey: 'PasswordGenerator' },
    { id: 62, slug: 'hash-generator', name: 'Hash Generator', category: 'security', desc: 'Generate MD5, SHA-1, SHA-256 and other cryptographic hashes.', isPremium: false, componentKey: 'HashGenerator' },
    { id: 63, slug: 'url-encoder', name: 'URL Encoder/Decoder', category: 'security', desc: 'Safely encode URL parameters for HTTP requests.', isPremium: false, componentKey: 'UrlEncoderDecoder' },
    { id: 64, slug: 'ip-lookup', name: 'IP Address Lookup', category: 'security', desc: 'Find geolocation and ISP info for any IPv4 address.', isPremium: false, componentKey: 'IpLookup' },
    { id: 65, slug: 'whois-lookup', name: 'Whois Lookup', category: 'security', desc: 'Discover registration details of domain names.', isPremium: false, componentKey: 'WhoisLookup' },
    { id: 66, slug: 'ssl-checker', name: 'SSL Certificate Checker', category: 'security', desc: 'Verify SSL certificate validity and expiration dates.', isPremium: false, componentKey: 'SslChecker' },
    { id: 67, slug: 'mac-lookup', name: 'MAC Address Lookup', category: 'security', desc: 'Find the manufacturer behind a MAC address OUI.', isPremium: false, componentKey: 'MacLookup' },
    { id: 68, slug: 'port-scanner', name: 'Port Scanner', category: 'security', desc: 'Scan common ports to see if they are open.', isPremium: false, componentKey: 'PortScanner' },
    { id: 69, slug: 'bcrypt-generator', name: 'Bcrypt Hash Generator', category: 'security', desc: 'Generate strong Bcrypt hashes for password storage.', isPremium: false, componentKey: 'BcryptGenerator' },
    { id: 70, slug: 'base32-encoder', name: 'Base32 Encoder', category: 'security', desc: 'Encode data to Base32 (RFC 4648) format.', isPremium: false, componentKey: 'Base32Encoder' },

    // 8. Productivity Tools
    { id: 71, slug: 'pomodoro-timer', name: 'Pomodoro Timer', category: 'productivity', desc: 'Stay focused using the Pomodoro 25/5 technique.', isPremium: false, componentKey: 'PomodoroTimer' },
    { id: 72, slug: 'todo-list', name: 'To-do List', category: 'productivity', desc: 'A simple local storage-based task manager.', isPremium: false, componentKey: 'TodoList' },
    { id: 73, slug: 'secure-notes', name: 'Secure Notes', category: 'productivity', desc: 'Write and encrypt text notes right in your browser.', isPremium: false, componentKey: 'SecureNotes' },
    { id: 74, slug: 'timezone-converter', name: 'Timezone Converter', category: 'productivity', desc: 'Compare and convert times across global cities.', isPremium: false, componentKey: 'TimezoneConverter' },
    { id: 75, slug: 'unit-converter', name: 'Unit Converter', category: 'productivity', desc: 'Convert length, weight, temperature, and volume.', isPremium: false, componentKey: 'UnitConverter' },
    { id: 76, slug: 'age-calculator', name: 'Age Calculator', category: 'productivity', desc: 'Calculate exact age in years, months, and days.', isPremium: false, componentKey: 'AgeCalculator' },
    { id: 77, slug: 'days-between', name: 'Days Between Dates', category: 'productivity', desc: 'Find the exact number of days between two dates.', isPremium: false, componentKey: 'DaysBetweenDates' },
    { id: 78, slug: 'stopwatch', name: 'Online Stopwatch', category: 'productivity', desc: 'A digital stopwatch with split lap times.', isPremium: false, componentKey: 'Stopwatch' },
    { id: 79, slug: 'percentage-calculator', name: 'Percentage Calculator', category: 'productivity', desc: 'Easily calculate percentage increases or decreases.', isPremium: false, componentKey: 'PercentageCalculator' },
    { id: 80, slug: 'habit-tracker', name: 'Habit Tracker', category: 'productivity', desc: 'Track daily habits and maintain your streak.', isPremium: false, componentKey: 'HabitTracker' },

    // 9. Media Tools
    { id: 81, slug: 'video-to-mp3', name: 'Video to MP3', category: 'media', desc: 'Extract audio tracks from video files quickly.', isPremium: false, componentKey: 'Placeholder' },
    { id: 82, slug: 'video-compressor', name: 'Video Compressor', category: 'media', desc: 'Compress large video files for web usage.', isPremium: false, componentKey: 'Placeholder' },
    { id: 83, slug: 'thumbnail-downloader', name: 'Thumbnail Downloader', category: 'media', desc: 'Download high-res YouTube thumbnails instantly.', isPremium: false, componentKey: 'Placeholder' },
    { id: 84, slug: 'gif-maker', name: 'GIF Maker', category: 'media', desc: 'Convert small video clips into animated GIFs.', isPremium: false, componentKey: 'Placeholder' },
    { id: 85, slug: 'audio-cutter', name: 'Audio Cutter', category: 'media', desc: 'Trim MP3 and WAV files directly in browser.', isPremium: false, componentKey: 'Placeholder' },
    { id: 86, slug: 'screen-recorder', name: 'Screen Recorder', category: 'media', desc: 'Record your screen and download as webm.', isPremium: false, componentKey: 'Placeholder' },
    { id: 87, slug: 'audio-converter', name: 'Audio Converter', category: 'media', desc: 'Change audio formats between WAV, MP3, OGG.', isPremium: false, componentKey: 'Placeholder' },
    { id: 88, slug: 'screen-ruler', name: 'Screen Resolution Ruler', category: 'media', desc: 'Measure pixel dimensions of elements on screen.', isPremium: false, componentKey: 'Placeholder' },
    { id: 89, slug: 'color-palette', name: 'Color Palette Gen', category: 'media', desc: 'Generate harmonious color palettes for design.', isPremium: false, componentKey: 'Placeholder' },
    { id: 90, slug: 'video-downloader', name: 'Video Format Downloader', category: 'media', desc: 'Check and download available formats of videos.', isPremium: false, componentKey: 'Placeholder' },

    // 10. Website Tools
    { id: 91, slug: 'domain-checker', name: 'Domain Checker', category: 'website', desc: 'Check if a specific domain name is available.', isPremium: false, componentKey: 'Placeholder' },
    { id: 92, slug: 'dns-lookup', name: 'DNS Records Lookup', category: 'website', desc: 'Query A, MX, NS, and TXT DNS records for domains.', isPremium: false, componentKey: 'Placeholder' },
    { id: 93, slug: 'speed-test', name: 'Page Speed Test', category: 'website', desc: 'Analyze TTFB and page loading metrics.', isPremium: false, componentKey: 'Placeholder' },
    { id: 94, slug: 'header-checker', name: 'HTTP Headers Checker', category: 'website', desc: 'Inspect HTTP response headers for security issues.', isPremium: false, componentKey: 'Placeholder' },
    { id: 95, slug: 'status-checker', name: 'HTTP Status Checker', category: 'website', desc: 'Ping a URL to see if it returns 200 OK or errors.', isPremium: false, componentKey: 'Placeholder' },
    { id: 96, slug: 'open-graph-gen', name: 'Open Graph Generator', category: 'website', desc: 'Easily construct Open Graph HTML meta tags.', isPremium: false, componentKey: 'Placeholder' },
    { id: 97, slug: 'broken-link', name: 'Broken Link Checker', category: 'website', desc: 'Crawl a webpage to find 404 broken links.', isPremium: false, componentKey: 'Placeholder' },
    { id: 98, slug: 'ssl-generator', name: 'CSR/SSL Generator', category: 'website', desc: 'Generate Certificate Signing Requests for SSL.', isPremium: false, componentKey: 'Placeholder' },
    { id: 99, slug: 'base64-image', name: 'Base64 Image Encoder', category: 'website', desc: 'Convert an image directly to a base64 HTML string.', isPremium: false, componentKey: 'Placeholder' },
    { id: 100, slug: 'html-extractor', name: 'HTML Tag Extractor', category: 'website', desc: 'Extract all links or image tags from HTML source.', isPremium: false, componentKey: 'Placeholder' }
];
