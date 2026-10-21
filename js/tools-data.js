// MarkPDF Tools Database - 100 Tools across PDF, Image, AI Write, and File Utilities

export const TOOL_GROUPS = [
  { id: 'pdf', title: { bn: 'PDF টুলস', en: 'PDF tools' }, blurb: { bn: 'এডিট, একত্র, কমপ্রেস ও কনভার্ট', en: 'Edit, merge, compress and convert' }, color: '#6f56ec' },
  { id: 'image', title: { bn: 'ইমেজ টুলস', en: 'Image tools' }, blurb: { bn: 'রিসাইজ, ক্রপ, কমপ্রেস ও ইফেক্ট', en: 'Resize, crop, compress and style' }, color: '#d24a0b' },
  { id: 'write', title: { bn: 'AI রাইটিং', en: 'AI Write' }, blurb: { bn: 'লেখা, ঠিক করা ও সোশ্যাল পোস্ট', en: 'Write, improve and post' }, color: '#1c67ca' },
  { id: 'file', title: { bn: 'ফাইল টুলস', en: 'File tools' }, blurb: { bn: 'CSV, JSON, ZIP, QR ও আরও', en: 'CSV, JSON, ZIP, QR and more' }, color: '#247881' }
];

export const TOOL_CATEGORIES = [
  { id: 'organize', group: 'pdf', title: { bn: 'PDF সাজান', en: 'Organize PDF' }, color: '#6f56ec' },
  { id: 'optimize', group: 'pdf', title: { bn: 'PDF অপ্টিমাইজ', en: 'Optimize PDF' }, color: '#5a67e8' },
  { id: 'toPdf', group: 'pdf', title: { bn: 'PDF-এ কনভার্ট', en: 'Convert to PDF' }, color: '#7c5ae6' },
  { id: 'fromPdf', group: 'pdf', title: { bn: 'PDF থেকে কনভার্ট', en: 'Convert from PDF' }, color: '#4f6fe0' },
  { id: 'edit', group: 'pdf', title: { bn: 'PDF এডিট', en: 'Edit PDF' }, color: '#6a4fe0' },
  { id: 'security', group: 'pdf', title: { bn: 'PDF সিকিউরিটি', en: 'PDF Security' }, color: '#5b5bd6' },
  { id: 'ai', group: 'pdf', title: { bn: 'PDF ইন্টেলিজেন্স', en: 'PDF Intelligence' }, color: '#8b55e0' },
  { id: 'imgBasic', group: 'image', title: { bn: 'রিসাইজ ও কনভার্ট', en: 'Resize & convert' }, color: '#d24a0b' },
  { id: 'imgStyle', group: 'image', title: { bn: 'স্টাইল ও ডিজাইন', en: 'Style & design' }, color: '#e8438a' },
  { id: 'imgSmart', group: 'image', title: { bn: 'স্মার্ট ইমেজ টুলস', en: 'Smart image tools' }, color: '#e8890f' },
  { id: 'writeCreate', group: 'write', title: { bn: 'লিখুন', en: 'Write' }, color: '#1c67ca' },
  { id: 'writeImprove', group: 'write', title: { bn: 'ঠিক ও উন্নত করুন', en: 'Fix & improve' }, color: '#2d84e8' },
  { id: 'writeSocial', group: 'write', title: { bn: 'মার্কেটিং ও সোশ্যাল', en: 'Marketing & social' }, color: '#3a5fd0' },
  { id: 'fileConvert', group: 'file', title: { bn: 'ডেটা কনভার্টার', en: 'Data converters' }, color: '#247881' },
  { id: 'fileUtil', group: 'file', title: { bn: 'ইউটিলিটি', en: 'Utilities' }, color: '#2a8f6b' },
  { id: 'fileText', group: 'file', title: { bn: 'টেক্সট টুলস', en: 'Text tools' }, color: '#2f7f9e' }
];

export const ALL_TOOLS = [
  // --- PDF TOOLS: Organize & Optimize ---
  {
    id: 'edit',
    group: 'pdf',
    category: 'edit',
    icon: 'edit-3',
    popular: true,
    title: { bn: 'PDF এডিট', en: 'Edit PDF' },
    short: { bn: 'টেক্সট, ছবি, আকার, আঁকা ও হাইলাইট।', en: 'Add text, images, shapes, drawings and highlights.' },
    long: { bn: 'পৃষ্ঠায় টেক্সট, ছবি, আয়তক্ষেত্র, বৃত্ত, তীর, হাতে আঁকা ও হাইলাইট যোগ করুন — সবই টেনে সরানো যায়।', en: 'Place text, images, rectangles, ellipses, arrows, freehand drawings and highlights on any page, all draggable.' },
    keywords: ['edit', 'text', 'shape', 'draw', 'highlight', 'annotate', 'এডিট']
  },
  {
    id: 'merge',
    group: 'pdf',
    category: 'organize',
    icon: 'combine',
    popular: true,
    title: { bn: 'PDF একত্র করুন', en: 'Merge PDF' },
    short: { bn: 'একাধিক PDF জুড়ে একটি ফাইল বানান।', en: 'Combine PDFs in the order you want.' },
    long: { bn: 'একাধিক PDF টেনে সাজিয়ে এক ক্লিকে একটি ডকুমেন্টে জুড়ুন।', en: 'Drag your PDFs into the right order and join them into one document in a click.' },
    keywords: ['join', 'combine', 'merge', 'যুক্ত', 'জোড়া']
  },
  {
    id: 'compress',
    group: 'pdf',
    category: 'optimize',
    icon: 'minimize-2',
    popular: true,
    title: { bn: 'PDF কমপ্রেস', en: 'Compress PDF' },
    short: { bn: 'ফাইলের আকার ছোট করুন।', en: 'Reduce file size, keep it readable.' },
    long: { bn: 'তিনটি লেভেলে PDF ছোট করুন এবং আগে-পরের আকার তুলনা করুন।', en: 'Shrink a PDF at three levels and compare the size before and after.' },
    keywords: ['compress', 'reduce', 'optimize', 'ছোট', 'কমপ্রেস']
  },
  {
    id: 'pdf2word',
    group: 'pdf',
    category: 'fromPdf',
    icon: 'file-text',
    popular: true,
    title: { bn: 'PDF থেকে Word', en: 'PDF to Word' },
    short: { bn: 'এডিটযোগ্য DOCX ফাইল।', en: 'Editable DOCX from your PDF.' },
    long: { bn: 'PDF-এর লেখা, শিরোনাম ও ছবি দিয়ে এডিটযোগ্য Word ফাইল বানান।', en: 'Rebuild a PDF as an editable Word file with its text, headings and images.' },
    keywords: ['word', 'docx', 'doc', 'editable', 'ওয়ার্ড']
  },
  {
    id: 'split',
    group: 'pdf',
    category: 'organize',
    icon: 'scissors',
    popular: true,
    title: { bn: 'PDF ভাগ করুন', en: 'Split PDF' },
    short: { bn: 'পৃষ্ঠা, বুকমার্ক, সাইজ বা ফাঁকা পৃষ্ঠা ধরে ভাগ।', en: 'Split by pages, bookmarks, size or blank pages.' },
    long: { bn: 'কাঁচি ক্লিক করে, রেঞ্জ লিখে, প্রতি N পৃষ্ঠায় বা সাইজ অনুযায়ী PDF ভাগ করুন।', en: 'Click between pages, type ranges, split every N pages, or by bookmarks.' },
    keywords: ['split', 'separate', 'cut', 'smart', 'ভাগ']
  },
  {
    id: 'sign',
    group: 'pdf',
    category: 'security',
    icon: 'pen-tool',
    popular: true,
    title: { bn: 'সিগনেচার', en: 'Sign PDF' },
    short: { bn: 'আঁকুন, টাইপ করুন বা ছবি দিন।', en: 'Draw, type or upload your signature.' },
    long: { bn: 'হাতে এঁকে, নাম টাইপ করে বা ছবি আপলোড করে সিগনেচার বসান।', en: 'Place a signature you drew, typed or uploaded anywhere on the page.' },
    keywords: ['sign', 'signature', 'সই', 'সিগনেচার']
  },
  {
    id: 'pdf2jpg',
    group: 'pdf',
    category: 'fromPdf',
    icon: 'image',
    popular: true,
    title: { bn: 'PDF থেকে JPG', en: 'PDF to JPG' },
    short: { bn: 'পৃষ্ঠা বা ভেতরের ছবি JPG হিসেবে।', en: 'Save pages or embedded images as JPG.' },
    long: { bn: 'পছন্দের পৃষ্ঠা JPG ছবিতে নিন, অথবা PDF-এর ভেতরে থাকা ছবিগুলো আলাদা করে বের করুন।', en: 'Convert pages to JPG, or pull out the images embedded inside the PDF.' },
    keywords: ['jpg', 'jpeg', 'image', 'extract images', 'ছবি']
  },
  {
    id: 'pdf2png',
    group: 'pdf',
    category: 'fromPdf',
    icon: 'image',
    title: { bn: 'PDF থেকে PNG', en: 'PDF to PNG' },
    short: { bn: 'স্বচ্ছ ব্যাকগ্রাউন্ডসহ উচ্চমানের ছবি।', en: 'Lossless, high-resolution page images.' },
    long: { bn: 'পৃষ্ঠাগুলো ক্ষতিহীন PNG ছবিতে নামান।', en: 'Export pages as lossless PNG images.' },
    keywords: ['png', 'image', 'ছবি']
  },
  {
    id: 'jpg2pdf',
    group: 'pdf',
    category: 'toPdf',
    icon: 'file-plus',
    title: { bn: 'ছবি থেকে PDF', en: 'Image to PDF' },
    short: { bn: 'JPG, PNG, WebP ছবি দিয়ে PDF।', en: 'Turn JPG, PNG or WebP into a PDF.' },
    long: { bn: 'ছবি সাজিয়ে, ঘুরিয়ে, পৃষ্ঠার মাপ ও মার্জিন ঠিক করে PDF বানান।', en: 'Arrange and rotate images, pick a page size and margin, and build a PDF.' },
    keywords: ['jpg', 'png', 'image', 'photo', 'ছবি']
  },
  {
    id: 'word2pdf',
    group: 'pdf',
    category: 'toPdf',
    icon: 'file-text',
    title: { bn: 'Word থেকে PDF', en: 'Word to PDF' },
    short: { bn: 'DOCX ফাইল PDF-এ।', en: 'Convert DOCX documents to PDF.' },
    long: { bn: 'Word (.docx) ডকুমেন্টের টেক্সট, শিরোনাম, তালিকা ও ছবি PDF-এ নিন।', en: 'Turn a Word (.docx) file into a PDF, keeping headings, lists and images.' },
    keywords: ['word', 'docx', 'doc', 'document', 'ওয়ার্ড']
  },
  {
    id: 'excel2pdf',
    group: 'pdf',
    category: 'toPdf',
    icon: 'table',
    title: { bn: 'Excel থেকে PDF', en: 'Excel to PDF' },
    short: { bn: 'XLSX স্প্রেডশিট PDF-এ।', en: 'Convert XLSX spreadsheets to PDF.' },
    long: { bn: 'Excel (.xlsx) শিটগুলো পরিপাটি টেবিল হিসেবে PDF-এ নিন।', en: 'Turn Excel (.xlsx) sheets into neatly laid-out PDF tables.' },
    keywords: ['excel', 'xlsx', 'spreadsheet', 'csv', 'এক্সেল']
  },
  {
    id: 'ppt2pdf',
    group: 'pdf',
    category: 'toPdf',
    icon: 'presentation',
    title: { bn: 'PowerPoint থেকে PDF', en: 'PowerPoint to PDF' },
    short: { bn: 'PPTX স্লাইড PDF-এ।', en: 'Convert PPTX slides to PDF.' },
    long: { bn: 'PowerPoint (.pptx) স্লাইডের লেখা, ছবি ও আকার PDF পৃষ্ঠা হিসেবে নিন।', en: 'Turn PowerPoint (.pptx) slides into PDF pages.' },
    keywords: ['powerpoint', 'pptx', 'slides', 'presentation', 'পাওয়ারপয়েন্ট']
  },
  {
    id: 'removePages',
    group: 'pdf',
    category: 'organize',
    icon: 'trash-2',
    title: { bn: 'পৃষ্ঠা মুছুন', en: 'Remove pages' },
    short: { bn: 'অপ্রয়োজনীয় পৃষ্ঠা বাদ দিন।', en: 'Delete the pages you don\'t need.' },
    long: { bn: 'যে পৃষ্ঠাগুলো লাগবে না সেগুলোতে ক্লিক করুন, বাকিগুলো থেকে নতুন PDF হবে।', en: 'Click the pages you don\'t want. The rest become your new PDF.' },
    keywords: ['delete', 'remove', 'মুছ']
  },
  {
    id: 'extract',
    group: 'pdf',
    category: 'organize',
    icon: 'download',
    title: { bn: 'পৃষ্ঠা বের করুন', en: 'Extract pages' },
    short: { bn: 'শুধু দরকারি পৃষ্ঠা নিয়ে নতুন PDF।', en: 'Keep only the pages you pick.' },
    long: { bn: 'থাম্বনেইলে ক্লিক করে পৃষ্ঠা বেছে নিন, তারপর নতুন PDF হিসেবে নামান।', en: 'Click thumbnails to pick pages, then download them as a new PDF.' },
    keywords: ['extract', 'select pages', 'বের']
  },
  {
    id: 'organize',
    group: 'pdf',
    category: 'organize',
    icon: 'grid',
    title: { bn: 'পৃষ্ঠা সাজান', en: 'Organize PDF' },
    short: { bn: 'টেনে সরান, ঘোরান, মুছুন, যোগ করুন।', en: 'Reorder, rotate, delete and add pages.' },
    long: { bn: 'থাম্বনেইল টেনে পৃষ্ঠার ক্রম বদলান, ঘোরান, মুছুন বা নতুন ফাঁকা পৃষ্ঠা যোগ করুন।', en: 'Drag page thumbnails to reorder them, rotate, delete them or insert blank pages.' },
    keywords: ['reorder', 'sort', 'arrange', 'সাজান']
  },
  {
    id: 'rotate',
    group: 'pdf',
    category: 'edit',
    icon: 'rotate-cw',
    title: { bn: 'PDF ঘোরান', en: 'Rotate PDF' },
    short: { bn: 'একটি বা সব পৃষ্ঠা ঘুরিয়ে সোজা করুন।', en: 'Rotate one page or all of them.' },
    long: { bn: 'প্রতিটি পৃষ্ঠার থাম্বনেইলে ঘুরিয়ে দেখুন, তারপর সেভ করুন।', en: 'Rotate any thumbnail and see the result straight away, then save.' },
    keywords: ['rotate', 'turn', 'orientation', 'ঘোরান']
  },
  {
    id: 'watermark',
    group: 'pdf',
    category: 'edit',
    icon: 'stamp',
    title: { bn: 'ওয়াটারমার্ক', en: 'Watermark' },
    short: { bn: 'লেখা বা ছবির ওয়াটারমার্ক দিন।', en: 'Stamp text or an image on every page.' },
    long: { bn: 'টেক্সট বা ছবি টেনে বসান, স্বচ্ছতা ও কোণ ঠিক করুন।', en: 'Drag a text or image watermark into place and tune its opacity and angle.' },
    keywords: ['watermark', 'stamp', 'confidential', 'ওয়াটারমার্ক']
  },
  {
    id: 'pageNumbers',
    group: 'pdf',
    category: 'edit',
    icon: 'hash',
    title: { bn: 'পৃষ্ঠা নম্বর', en: 'Page numbers' },
    short: { bn: 'পছন্দের জায়গায় নম্বর বসান।', en: 'Number your pages anywhere on the sheet.' },
    long: { bn: 'অবস্থান, ফরম্যাট ও বাংলা অঙ্ক বেছে নিয়ে লাইভ প্রিভিউ দেখুন।', en: 'Pick the position, format and Bengali digits, with a live preview.' },
    keywords: ['number', 'pagination', 'নম্বর']
  },
  {
    id: 'protect',
    group: 'pdf',
    category: 'security',
    icon: 'lock',
    title: { bn: 'PDF সুরক্ষিত করুন', en: 'Protect PDF' },
    short: { bn: 'AES-256 পাসওয়ার্ড দিয়ে এনক্রিপ্ট।', en: 'Encrypt with an AES-256 password.' },
    long: { bn: 'পাসওয়ার্ড দিয়ে PDF এনক্রিপ্ট করুন এবং প্রিন্ট বা কপি নিয়ন্ত্রণ করুন।', en: 'Encrypt a PDF with a password and control printing or copying permissions.' },
    keywords: ['protect', 'password', 'encrypt', 'lock', 'সুরক্ষা']
  },
  {
    id: 'unlock',
    group: 'pdf',
    category: 'security',
    icon: 'unlock',
    title: { bn: 'PDF আনলক', en: 'Unlock PDF' },
    short: { bn: 'পাসওয়ার্ড ও বিধিনিষেধ সরান।', en: 'Remove the password and restrictions.' },
    long: { bn: 'পাসওয়ার্ড জানা থাকলে সুরক্ষা সরিয়ে PDF-কে মুক্ত করুন।', en: 'Remove password protection from a PDF you know the password for.' },
    keywords: ['unlock', 'password', 'decrypt', 'remove protection', 'আনলক']
  },
  {
    id: 'ocr',
    group: 'pdf',
    category: 'optimize',
    icon: 'scan-text',
    title: { bn: 'OCR PDF', en: 'OCR PDF' },
    short: { bn: 'স্ক্যান করা PDF-কে সার্চযোগ্য করুন।', en: 'Make scanned PDFs searchable and copyable.' },
    long: { bn: 'বাংলা ও ইংরেজি OCR দিয়ে স্ক্যান করা PDF-এ টেক্সট স্তর যোগ করুন।', en: 'Add an invisible text layer to scanned PDFs using Bengali and English OCR.' },
    keywords: ['ocr', 'scan', 'searchable', 'recognize', 'text']
  },
  {
    id: 'crop',
    group: 'pdf',
    category: 'edit',
    icon: 'crop',
    title: { bn: 'PDF ক্রপ', en: 'Crop PDF' },
    short: { bn: 'টেনে ক্রপের সীমা ঠিক করুন।', en: 'Drag the crop frame over the page.' },
    long: { bn: 'ক্রপ ফ্রেম টেনে ঠিক করুন অথবা এক ক্লিকে সাদা মার্জিন কেটে ফেলুন।', en: 'Drag the crop frame, or trim white margins automatically in one click.' },
    keywords: ['crop', 'trim', 'margin', 'ক্রপ']
  },
  {
    id: 'pdf2txt',
    group: 'pdf',
    category: 'fromPdf',
    icon: 'file-text',
    title: { bn: 'PDF থেকে Text', en: 'PDF to Text' },
    short: { bn: 'PDF থেকে সব লেখা কপি বা সেভ করুন।', en: 'Copy all the text out of a PDF.' },
    long: { bn: 'PDF-এর পৃষ্ঠা থেকে সরাসরি টেক্সট বের করে .txt ফাইলে সেভ করুন।', en: 'Pull the text out of every page of a PDF and save it as a plain .txt file.' },
    keywords: ['extract text', 'txt', 'copy text', 'plain text']
  },
  {
    id: 'txt2pdf',
    group: 'pdf',
    category: 'toPdf',
    icon: 'file-plus',
    title: { bn: 'Text থেকে PDF', en: 'Text to PDF' },
    short: { bn: 'টাইপ বা পেস্ট করা লেখা থেকে PDF।', en: 'Turn typed or pasted text into a PDF.' },
    long: { bn: 'টেক্সট পেস্ট করুন, ফন্ট সাইজ বেছে নিন এবং পরিষ্কার PDF নামান।', en: 'Type or paste text, choose a font size, and download a clean PDF.' },
    keywords: ['create pdf', 'text', 'txt', 'notes']
  },
  {
    id: 'pdf2md',
    group: 'pdf',
    category: 'ai',
    icon: 'file-code',
    title: { bn: 'PDF থেকে Markdown', en: 'PDF to Markdown' },
    short: { bn: 'বাংলা ও ইংরেজি PDF থেকে এডিটযোগ্য টেক্সট।', en: 'Editable Markdown from Bengali or English PDFs.' },
    long: { bn: 'PDF থেকে টেক্সট বের করে Markdown-এ সম্পাদনা ও প্রিভিউ করুন।', en: 'Extract text from a PDF, then edit and preview it as Markdown.' },
    keywords: ['markdown', 'text', 'ocr', 'extract', 'টেক্সট']
  },
  {
    id: 'compare',
    group: 'pdf',
    category: 'security',
    icon: 'columns',
    title: { bn: 'PDF তুলনা', en: 'Compare PDF' },
    short: { bn: 'দুই PDF-এর পার্থক্য পাশাপাশি দেখুন।', en: 'See what changed between two PDFs.' },
    long: { bn: 'দুটি সংস্করণ পাশাপাশি দেখুন; বদলানো অংশ হাইলাইট হবে।', en: 'View two versions side by side with the changes highlighted.' },
    keywords: ['compare', 'diff', 'difference', 'version', 'তুলনা']
  },
  {
    id: 'flatten',
    group: 'pdf',
    category: 'optimize',
    icon: 'layers',
    title: { bn: 'Flatten PDF', en: 'Flatten PDF' },
    short: { bn: 'ফর্ম ও নোট পৃষ্ঠার সাথে স্থায়ী করুন।', en: 'Make form fields and notes part of the page.' },
    long: { bn: 'ফর্মের ফিল্ড ও অ্যানোটেশনগুলো পৃষ্ঠায় ফ্ল্যাট করে দিন যাতে কেউ বদলাতে না পারে।', en: 'Bake form fields, stamps and annotations into the page so they can\'t be edited.' },
    keywords: ['flatten', 'forms', 'annotations', 'lock']
  },
  {
    id: 'grayscale',
    group: 'pdf',
    category: 'optimize',
    icon: 'sun',
    title: { bn: 'PDF ব্ল্যাক & হোয়াইট', en: 'PDF to Grayscale' },
    short: { bn: 'কালি বাঁচাতে সাদাকালো করুন।', en: 'Make a PDF black and white to save ink.' },
    long: { bn: 'কম খরচে প্রিন্ট করার জন্য রঙিন পৃষ্ঠাকে গ্রেস্কেলে রূপান্তর করুন।', en: 'Convert colour pages to grayscale for cheaper printing and smaller files.' },
    keywords: ['black and white', 'gray', 'grey', 'monochrome', 'print']
  },
  {
    id: 'metadata',
    group: 'pdf',
    category: 'edit',
    icon: 'info',
    title: { bn: 'PDF মেটাডাটা', en: 'Edit metadata' },
    short: { bn: 'টাইটেল, লেখক, কীওয়ার্ড বদলান।', en: 'Edit title, author and keywords.' },
    long: { bn: 'বর্তমান তথ্য দেখে সম্পাদনা করুন বা সব তথ্য মুছে ফেলুন।', en: 'See the current document properties, edit them, or clear them all.' },
    keywords: ['metadata', 'properties', 'title', 'author', 'তথ্য']
  },

  // --- IMAGE TOOLS ---
  {
    id: 'imgResize',
    group: 'image',
    category: 'imgBasic',
    icon: 'maximize-2',
    popular: true,
    title: { bn: 'ছবি রিসাইজ', en: 'Resize image' },
    short: { bn: 'ছবির প্রস্থ ও উচ্চতা পরিবর্তন করুন।', en: 'Change an image\'s width and height.' },
    long: { bn: 'নির্দিষ্ট পিক্সেল বা শতাংশে সাইজ ঠিক করুন, অনুপাত বজায় রেখে JPG/PNG/WebP ডাউনলোড করুন।', en: 'Set an exact size in pixels or a percentage, keep the proportions, and download JPG, PNG or WebP.' },
    keywords: ['resize', 'dimensions', 'pixels', 'scale', 'size', 'রিসাইজ']
  },
  {
    id: 'imgCompress',
    group: 'image',
    category: 'imgBasic',
    icon: 'minimize',
    popular: true,
    title: { bn: 'ছবি কমপ্রেস', en: 'Compress image' },
    short: { bn: 'কোয়ালিটি নষ্ট না করে ছবির সাইজ কমান।', en: 'Make photos smaller without spoiling them.' },
    long: { bn: 'JPG, PNG ও WebP ফাইলের সাইজ কমান এবং ডাউনলোডের আগে কত সাইজ বাঁচল তা দেখুন।', en: 'Shrink JPG, PNG and WebP files and see exactly how much space you saved before you download.' },
    keywords: ['compress', 'reduce size', 'optimize', 'kb', 'smaller', 'কমপ্রেস']
  },
  {
    id: 'imgCrop',
    group: 'image',
    category: 'imgBasic',
    icon: 'crop',
    popular: true,
    title: { bn: 'ছবি ক্রপ', en: 'Crop image' },
    short: { bn: 'ছবির দরকারি অংশ কেটে নিন।', en: 'Cut an image to the part you want.' },
    long: { bn: 'ছবির উপর ফ্রেম টেনে অথবা ১:১, ৪:৩ বা ১৬:৯ অনুপাতে ক্রপ করুন।', en: 'Drag a box over the photo or pick a ratio such as 1:1, 4:3 or 16:9, then crop.' },
    keywords: ['crop', 'trim', 'cut', 'aspect ratio', 'ক্রপ']
  },
  {
    id: 'imgConvert',
    group: 'image',
    category: 'imgBasic',
    icon: 'refresh-cw',
    title: { bn: 'ছবি কনভার্ট', en: 'Convert image' },
    short: { bn: 'JPG, PNG ও WebP-এর মধ্যে রূপান্তর।', en: 'Switch between JPG, PNG and WebP.' },
    long: { bn: 'ব্রাউজারেই যেকোনো ছবি JPG, PNG বা WebP ফরম্যাটে রূপান্তর করুন।', en: 'Convert images between JPG, PNG and WebP in your browser, several at a time.' },
    keywords: ['convert', 'jpg', 'png', 'webp', 'format', 'jpeg']
  },
  {
    id: 'imgRotate',
    group: 'image',
    category: 'imgBasic',
    icon: 'rotate-cw',
    title: { bn: 'ছবি ঘোরান ও ফ্লিপ', en: 'Rotate & flip image' },
    short: { bn: 'ছবি ঘোরান বা আয়নার মতো উল্টান।', en: 'Turn a photo or mirror it.' },
    long: { bn: '৯০ ডিগ্রি ঘুরিয়ে সোজা করুন এবং অনুভূমিক বা উল্লম্বভাবে ফ্লিপ করুন।', en: 'Rotate by 90 degrees or any angle and flip horizontally or vertically.' },
    keywords: ['rotate', 'flip', 'mirror', 'turn']
  },
  {
    id: 'imgUpscale',
    group: 'image',
    category: 'imgBasic',
    icon: 'zoom-in',
    title: { bn: 'ছবি বড় করুন', en: 'Enlarge image' },
    short: { bn: 'ছবি ২x, ৩x বা ৪x বড় করুন।', en: 'Make an image 2x, 3x or 4x bigger.' },
    long: { bn: 'স্মুথ রিস্যাম্পলিং দিয়ে ছবি বড় করুন এবং শার্পনেস বৃদ্ধি করুন।', en: 'Enlarge a picture with smooth resampling and optional sharpening.' },
    keywords: ['upscale', 'enlarge', 'resolution', 'bigger', 'hd']
  },
  {
    id: 'imgText',
    group: 'image',
    category: 'imgStyle',
    icon: 'type',
    title: { bn: 'ছবিতে লেখা যোগ', en: 'Add text to image' },
    short: { bn: 'ছবিতে ক্যাপশন বা ওয়াটারমার্ক দিন।', en: 'Write a caption or watermark on a photo.' },
    long: { bn: 'পছন্দের ফন্ট, সাইজ ও রঙে ছবিতে লেখা বসান।', en: 'Place text on a picture with the font, size, colour and outline you choose.' },
    keywords: ['text', 'caption', 'watermark', 'write on photo']
  },
  {
    id: 'imgBorder',
    group: 'image',
    category: 'imgStyle',
    icon: 'square',
    title: { bn: 'বর্ডার যোগ করুন', en: 'Add border' },
    short: { bn: 'ছবিতে রঙিন বর্ডার বা ফ্রেম দিন।', en: 'Frame a picture with a colour border.' },
    long: { bn: 'পছন্দমতো রঙের ও পুরুত্বের বর্ডার দিন, সাথে গোলাকার কোণ যোগ করুন।', en: 'Add a border of any thickness and colour, with optional rounded corners.' },
    keywords: ['border', 'frame', 'outline', 'padding']
  },
  {
    id: 'imgRound',
    group: 'image',
    category: 'imgStyle',
    icon: 'circle',
    title: { bn: 'বৃত্তাকার ছবি', en: 'Round image' },
    short: { bn: 'বৃত্ত বা গোল কোণার প্রোফাইল ছবি।', en: 'Make a circle or rounded-corner picture.' },
    long: { bn: 'প্রোফাইল পিকচারের জন্য ছবিকে সুন্দর বৃত্ত বা গোল কোণায় কেটে নিন।', en: 'Crop a photo into a circle or rounded square with transparent background.' },
    keywords: ['round', 'circle', 'profile picture', 'avatar', 'rounded']
  },
  {
    id: 'imgEffects',
    group: 'image',
    category: 'imgStyle',
    icon: 'sliders',
    title: { bn: 'ফটো ফিল্টার ও ইফেক্ট', en: 'Photo effects' },
    short: { bn: 'সাদাকালো, ব্লার, সেপিয়া ও ব্রাইটনেস।', en: 'Black & white, blur, pixelate and more.' },
    long: { bn: 'লাইভ প্রিভিউ দেখে ব্রাইটনেস, কনট্রাস্ট, স্যাচুরেশন, ব্লার ও সেপিয়া প্রয়োগ করুন।', en: 'Apply black & white, sepia, blur, brightness, contrast and saturation with live preview.' },
    keywords: ['filter', 'black and white', 'sepia', 'blur', 'effects']
  },
  {
    id: 'imgMeme',
    group: 'image',
    category: 'imgStyle',
    icon: 'smile',
    title: { bn: 'মিম মেকার', en: 'Meme maker' },
    short: { bn: 'উপরে ও নিচে বোল্ড টেক্সট যোগ করুন।', en: 'Add top and bottom text to a picture.' },
    long: { bn: 'যেকোনো ছবিতে ক্লাসিক বোল্ড মিম ক্যাপশন দিন এবং ডাউনলোড করুন।', en: 'Put classic bold meme captions on any image and download it.' },
    keywords: ['meme', 'caption', 'funny', 'top text', 'bottom text']
  },
  {
    id: 'imgColors',
    group: 'image',
    category: 'imgSmart',
    icon: 'pipette',
    title: { bn: 'কালার পিকার ও প্যালেট', en: 'Colour picker & palette' },
    short: { bn: 'ছবি থেকে যেকোনো রঙ বের করুন।', en: 'Pick colours from a photo.' },
    long: { bn: 'ছবির যেকোনো অংশে ক্লিক করে HEX, RGB ও HSL মান পান এবং প্যালেট দেখুন।', en: 'Click anywhere on an image to get its HEX, RGB and HSL value, and see the palette.' },
    keywords: ['color picker', 'colour', 'palette', 'hex', 'eyedropper', 'rgb']
  },
  {
    id: 'imgBase64',
    group: 'image',
    category: 'imgSmart',
    icon: 'code',
    title: { bn: 'ছবি থেকে Base64', en: 'Image to Base64' },
    short: { bn: 'ছবিকে Base64 কোডে রূপান্তর।', en: 'Get an image as a Base64 data URL.' },
    long: { bn: 'এইচটিএমএল ও সিএসএসে সরাসরি ব্যবহারের জন্য ছবি থেকে Base64 টেক্সট বানান।', en: 'Turn an image into a Base64 string for HTML, CSS or JSON.' },
    keywords: ['base64', 'data url', 'encode', 'embed']
  },

  // --- AI WRITE TOOLS ---
  {
    id: 'wParagraph',
    group: 'write',
    category: 'writeCreate',
    icon: 'edit-2',
    popular: true,
    title: { bn: 'প্যারাগ্রাফ রাইটার', en: 'Paragraph writer' },
    short: { bn: 'যেকোনো বিষয়ে সুন্দর অনুচ্ছেদ লিখুন।', en: 'Write a paragraph about any topic.' },
    long: { bn: 'বিষয় লিখে পছন্দের টোনে সাজানো প্যারাগ্রাফ পান — বাংলা ও ইংরেজিতে।', en: 'Give a topic and get a clear, well-structured paragraph in the tone you choose.' },
    keywords: ['paragraph', 'write', 'text generator', 'content', 'অনুচ্ছেদ']
  },
  {
    id: 'wRewrite',
    group: 'write',
    category: 'writeImprove',
    icon: 'repeat',
    popular: true,
    title: { bn: 'বাক্য রিরাইটার', en: 'Sentence rewriter' },
    short: { bn: 'একই কথা ভিন্ন সুন্দর শব্দে লিখুন।', en: 'Say the same thing in different words.' },
    long: { bn: 'ভাব ঠিক রেখে বাক্য বা প্যারাগ্রাফ নতুন স্টাইলে রিরাইট করুন।', en: 'Paraphrase sentences or paragraphs while keeping the meaning.' },
    keywords: ['paraphrase', 'rewrite', 'reword', 'rephrase', 'spin']
  },
  {
    id: 'wGrammar',
    group: 'write',
    category: 'writeImprove',
    icon: 'check-circle-2',
    popular: true,
    title: { bn: 'ব্যাকরণ ও বানান ঠিক', en: 'Grammar fixer' },
    short: { bn: 'বানান, ব্যাকরণ ও যতিচিহ্ন শুধরান।', en: 'Fix spelling, grammar and punctuation.' },
    long: { bn: 'টেক্সট পেস্ট করে বানান ও ব্যাকরণের ভুল সংশোধন করে নিন।', en: 'Paste your text and get a corrected version with spelling, grammar and punctuation fixed.' },
    keywords: ['grammar', 'spelling', 'proofread', 'punctuation', 'correct']
  },
  {
    id: 'wEssay',
    group: 'write',
    category: 'writeCreate',
    icon: 'book-open',
    title: { bn: 'প্রবন্ধ লেখক', en: 'Essay writer' },
    short: { bn: 'ভূমিকা, মূল বক্তব্য ও উপসংহারসহ প্রবন্ধ।', en: 'Draft an essay with an intro and conclusion.' },
    long: { bn: 'যেকোনো বিষয়ে তথ্যবহুল ও সুশৃঙ্খল প্রবন্ধের ড্রাফট তৈরি করুন।', en: 'Get a structured essay draft with an introduction, body and conclusion.' },
    keywords: ['essay', 'school', 'assignment', 'draft', 'প্রবন্ধ']
  },
  {
    id: 'wArticle',
    group: 'write',
    category: 'writeCreate',
    icon: 'file-text',
    title: { bn: 'আর্টিকেল ও ব্লগ রাইটার', en: 'Article writer' },
    short: { bn: 'শিরোনাম ও সাবহেডিং দিয়ে সম্পূর্ণ নিবন্ধ।', en: 'Write a full article from a topic.' },
    long: { bn: 'ব্লগ ও ওয়েবসাইটের জন্য এসইও বান্ধব নিবন্ধ লিখুন।', en: 'Turn a topic and a few keywords into an article with headings you can edit.' },
    keywords: ['article', 'blog', 'seo', 'long form', 'নিবন্ধ']
  },
  {
    id: 'wEmail',
    group: 'write',
    category: 'writeCreate',
    icon: 'mail',
    title: { bn: 'ইমেইল রাইটার', en: 'Email writer' },
    short: { bn: 'কয়েক সেকেন্ডে প্রফেশনাল ইমেইল।', en: 'Draft a clear email in seconds.' },
    long: { bn: 'কার উদ্দেশ্যে ও কী বিষয়ে ইমেইল চান লিখে দিলেই চমৎকার ইমেইল তৈরি হবে।', en: 'Say who it is for and what you need, and get a polite, ready-to-send email.' },
    keywords: ['email', 'mail', 'letter', 'message', 'professional', 'ইমেইল']
  },
  {
    id: 'wSummary',
    group: 'write',
    category: 'writeImprove',
    icon: 'align-left',
    title: { bn: 'টেক্সট সারসংক্ষেপ', en: 'Text summarizer' },
    short: { bn: 'বড় লেখার প্রধান মূল পয়েন্ট পান।', en: 'Boil long text down to the key points.' },
    long: { bn: 'দীর্ঘ আর্টিকেল বা নোট পেস্ট করে বুলেট পয়েন্টে সারসংক্ষেপ বের করুন।', en: 'Paste an article or notes and get a short summary or bullet points.' },
    keywords: ['summary', 'summarize', 'tldr', 'key points', 'shorten', 'সারাংশ']
  },
  {
    id: 'wTone',
    group: 'write',
    category: 'writeImprove',
    icon: 'message-square',
    title: { bn: 'টোন চেঞ্জার', en: 'Tone changer' },
    short: { bn: 'ফরমাল, ফ্রেন্ডলি বা প্রফেশনাল টোনে রূপান্তর।', en: 'Make text formal, friendly, bold or simple.' },
    long: { bn: 'লেখার মূল বার্তা অক্ষুণ্ণ রেখে বাচনভঙ্গি পরিবর্তন করুন।', en: 'Rewrite your text in a different tone of voice without changing what it says.' },
    keywords: ['tone', 'formal', 'casual', 'friendly', 'voice']
  },
  {
    id: 'wInstagram',
    group: 'write',
    category: 'writeSocial',
    icon: 'instagram',
    title: { bn: 'ইনস্টাগ্রাম ক্যাপশন', en: 'Instagram caption generator' },
    short: { bn: 'হ্যাশট্যাগসহ আকর্ষণীয় ক্যাপশন।', en: 'Write captions with hashtags.' },
    long: { bn: 'ছবির বর্ণনা দিন এবং ট্রেন্ডিং হ্যাশট্যাগসহ একাধিক ক্যাপশন পান।', en: 'Describe your photo or post and get several caption options with hashtags.' },
    keywords: ['instagram', 'caption', 'hashtags', 'social media', 'ক্যাপশন']
  },
  {
    id: 'wLinkedin',
    group: 'write',
    category: 'writeSocial',
    icon: 'linkedin',
    title: { bn: 'লিঙ্কডইন পোস্ট রাইটার', en: 'LinkedIn post generator' },
    short: { bn: 'আকর্ষণীয় প্রফেশনাল লিঙ্কডইন পোস্ট।', en: 'Draft a professional LinkedIn post.' },
    long: { bn: 'আপনার সাফল্য বা মতামত দিয়ে প্রফেশনাল ও ভাইরাল লিঙ্কডইন পোস্ট লিখুন।', en: 'Turn an idea or achievement into a LinkedIn post with a strong opening line.' },
    keywords: ['linkedin', 'post', 'professional', 'social media']
  },
  {
    id: 'wHeadline',
    group: 'write',
    category: 'writeSocial',
    icon: 'megaphone',
    title: { bn: 'বিজ্ঞাপনের হেডলাইন', en: 'Ad headline generator' },
    short: { bn: 'ফেসবুক ও গুগলের জন্য নজরকাড়া হেডলাইন।', en: 'Write headlines for Facebook and other ads.' },
    long: { bn: 'পণ্য ও অডিয়েন্স লিখে ক্লিক আনার মতো হেডলাইন জেনারেট করুন।', en: 'Describe your product and audience and get punchy headlines to test.' },
    keywords: ['headline', 'facebook ads', 'ads', 'copywriting', 'title']
  },
  {
    id: 'wFaq',
    group: 'write',
    category: 'writeSocial',
    icon: 'help-circle',
    title: { bn: 'FAQ জেনারেটর', en: 'FAQ generator' },
    short: { bn: 'পণ্য বা সার্ভিসের প্রশ্ন ও উত্তর।', en: 'Create questions and answers for a page.' },
    long: { bn: 'টপিক বা বিজনেস নাম দিলে সম্ভাব্য প্রশ্ন ও উত্তরমালা পান।', en: 'Enter a product or topic and get a ready-to-use FAQ section.' },
    keywords: ['faq', 'questions', 'answers', 'support']
  },
  {
    id: 'wBusinessName',
    group: 'write',
    category: 'writeSocial',
    icon: 'briefcase',
    title: { bn: 'ব্র্যান্ড ও ব্যবসার নাম', en: 'Business name generator' },
    short: { bn: 'ব্যবসা ও স্টার্টআপের জন্য ক্যাচি নাম।', en: 'Find a name for your brand.' },
    long: { bn: 'ব্যবসার বিবরণ দিলে আধুনিক ও সহজে মনে রাখার মতো ব্র্যান্ড নাম তৈরি হয়।', en: 'Describe your business and get catchy name ideas.' },
    keywords: ['business name', 'brand', 'company name', 'naming', 'startup']
  },

  // --- FILE UTILITY TOOLS ---
  {
    id: 'qr',
    group: 'file',
    category: 'fileUtil',
    icon: 'qr-code',
    popular: true,
    title: { bn: 'QR কোড জেনারেটর', en: 'QR code generator' },
    short: { bn: 'লিঙ্ক বা টেক্সটের জন্য QR কোড বানান।', en: 'Make a QR code for a link or text.' },
    long: { bn: 'ওয়েবসাইট লিঙ্ক, ওয়াইফাই বা টেক্সট লিখে সাথে সাথে QR কোড পান এবং PNG/SVG নামান।', en: 'Create a QR code for a URL, Wi-Fi, text or contact and download it as PNG or SVG.' },
    keywords: ['qr', 'qr code', 'barcode', 'link', 'wifi', 'কিউআর']
  },
  {
    id: 'csv2json',
    group: 'file',
    category: 'fileConvert',
    icon: 'file-spreadsheet',
    popular: true,
    title: { bn: 'CSV থেকে JSON', en: 'CSV to JSON' },
    short: { bn: 'CSV টেবিলকে JSON ফরম্যাটে নিন।', en: 'Turn a CSV table into JSON.' },
    long: { bn: 'CSV ফাইল বা পেস্ট করা টেক্সট থেকে প্রথম সারি হেডার ধরে সাজানো JSON তৈরি করুন।', en: 'Convert CSV files or pasted text into JSON, with the first row as keys.' },
    keywords: ['csv', 'json', 'convert', 'table']
  },
  {
    id: 'json2csv',
    group: 'file',
    category: 'fileConvert',
    icon: 'table',
    title: { bn: 'JSON থেকে CSV', en: 'JSON to CSV' },
    short: { bn: 'JSON লিস্টকে স্প্রেডশিট টেবিলে নিন।', en: 'Turn a JSON list into a CSV table.' },
    long: { bn: 'JSON অবজেক্টের অ্যারেকে এক্সেল উপযোগী CSV রো ও কলামে রূপান্তর করুন।', en: 'Flatten an array of JSON objects into rows and columns you can open in Excel.' },
    keywords: ['json', 'csv', 'convert', 'spreadsheet']
  },
  {
    id: 'zipCreate',
    group: 'file',
    category: 'fileUtil',
    icon: 'archive',
    popular: true,
    title: { bn: 'ZIP তৈরি করুন', en: 'Create ZIP' },
    short: { bn: 'একাধিক ফাইল এক ZIP ফাইলে গুছিয়ে নিন।', en: 'Put files into one ZIP archive.' },
    long: { bn: 'যেকোনো ফাইল যুক্ত করে এক ক্লিকে কম্প্রেসড জিপ আর্কাইভ নামান।', en: 'Add any files and download them together as a single ZIP.' },
    keywords: ['zip', 'archive', 'compress files', 'bundle']
  },
  {
    id: 'unzip',
    group: 'file',
    category: 'fileUtil',
    icon: 'folder-open',
    title: { bn: 'Unzip ফাইল', en: 'Unzip files' },
    short: { bn: 'ZIP ফাইলের ভেতরের ফাইল বের করুন।', en: 'Open a ZIP and download what\'s inside.' },
    long: { bn: 'ZIP আপলোড করে ভেতরের প্রতিটি ফাইল আলাদা বা সব একসাথে এক্সট্র্যাক্ট করুন।', en: 'Browse the contents of a ZIP file and download single files or everything.' },
    keywords: ['unzip', 'extract', 'open zip', 'archive']
  },
  {
    id: 'hashGen',
    group: 'file',
    category: 'fileUtil',
    icon: 'fingerprint',
    title: { bn: 'হ্যাশ জেনারেটর', en: 'Hash generator' },
    short: { bn: 'SHA-256, SHA-1, MD5 চেকসাম পান।', en: 'Get SHA-256 or SHA-1 of text or a file.' },
    long: { bn: 'ব্রাউজারেই টেক্সট বা ফাইলের ক্রিপ্টোগ্রাফিক হ্যাশ তৈরি করে সত্যতা যাচাই করুন।', en: 'Calculate a checksum of text or a file in your browser to verify integrity.' },
    keywords: ['hash', 'sha256', 'sha1', 'checksum', 'md5']
  },
  {
    id: 'passwordGen',
    group: 'file',
    category: 'fileUtil',
    icon: 'key',
    title: { bn: 'পাসওয়ার্ড জেনারেটর', en: 'Password generator' },
    short: { bn: 'সুরক্ষিত ও শক্তিশালী পাসওয়ার্ড।', en: 'Create strong random passwords.' },
    long: { bn: 'অক্ষর, সংখ্যা ও চিহ্নসহ ব্রাউজারের ক্রিপ্টো সিকিউর র্যান্ডম পাসওয়ার্ড বানান।', en: 'Generate random passwords of any length with letters, numbers and symbols.' },
    keywords: ['password', 'random', 'secure', 'generator', 'পাসওয়ার্ড']
  },
  {
    id: 'jsonFormat',
    group: 'file',
    category: 'fileText',
    icon: 'code-2',
    title: { bn: 'JSON ফরম্যাটার', en: 'JSON formatter' },
    short: { bn: 'JSON বিউটিফাই ও ভ্যালিডেট করুন।', en: 'Pretty-print, minify and validate JSON.' },
    long: { bn: 'JSON পেস্ট করে সুন্দর করে সাজান, মিনিফাই করুন বা সিনট্যাক্স ভুল শনাক্ত করুন।', en: 'Paste JSON to format it, shrink it or find the exact line with an error.' },
    keywords: ['json', 'format', 'beautify', 'minify', 'validate']
  },
  {
    id: 'wordCount',
    group: 'file',
    category: 'fileText',
    icon: 'file-text',
    title: { bn: 'শব্দ ও অক্ষর গণনা', en: 'Word counter' },
    short: { bn: 'শব্দ, অক্ষর ও পড়ার সময় হিসাব।', en: 'Count words, characters and reading time.' },
    long: { bn: 'শব্দ, বর্ণ, লাইন, প্যারাগ্রাফ ও আনুমানিক পড়ার সময় লাইভ দেখুন।', en: 'Count words, characters, sentences and paragraphs, and estimate reading time.' },
    keywords: ['word count', 'characters', 'counter', 'reading time', 'শব্দ']
  },
  {
    id: 'caseConvert',
    group: 'file',
    category: 'fileText',
    icon: 'type',
    title: { bn: 'কেস কনভার্টার', en: 'Case converter' },
    short: { bn: 'UPPERCASE, lowercase, Title Case।', en: 'UPPERCASE, lowercase, Title Case and more.' },
    long: { bn: 'টেক্সটকে ক্যাপিটাল, ছোট হাতের, টাইটেল কেস, camelCase বা snake_case-এ রূপান্তর করুন।', en: 'Change text to upper, lower, title, sentence, camel, snake or kebab case.' },
    keywords: ['case', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake_case']
  },
  {
    id: 'textBase64',
    group: 'file',
    category: 'fileText',
    icon: 'binary',
    title: { bn: 'Base64 এনকোড / ডিকোড', en: 'Base64 encode & decode' },
    short: { bn: 'টেক্সটকে Base64-এ রূপান্তর ও উদ্ধার।', en: 'Convert text to and from Base64.' },
    long: { bn: 'বাংলা ইউনিকোড টেক্সট সুন্দরভাবে Base64 এনকোড করুন এবং পুনরায় ডিকোড করুন।', en: 'Encode text to Base64 or decode it back, with proper Unicode and Bengali support.' },
    keywords: ['base64', 'encode', 'decode', 'text']
  },
  {
    id: 'lorem',
    group: 'file',
    category: 'fileUtil',
    icon: 'align-left',
    title: { bn: 'লরেম ইপসাম জেনারেটর', en: 'Lorem ipsum generator' },
    short: { bn: 'ডিজাইনের জন্য ডামি টেক্সট।', en: 'Placeholder text for designs.' },
    long: { bn: 'পছন্দমতো প্যারাগ্রাফ বা বাক্য ধরে প্লেসহোল্ডার ডামি লেখা তৈরি করুন।', en: 'Generate placeholder paragraphs, sentences or words.' },
    keywords: ['lorem ipsum', 'placeholder', 'dummy text', 'filler']
  }
];
