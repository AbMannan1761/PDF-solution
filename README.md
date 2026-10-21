# PDF solution — Free Online PDF Editor, Image Tools, AI Writer & File Converters

A modern, fast, private, and client-side web application. It provides full PDF manipulation, image editing, AI writing assistants, and format converters — running 100% in your browser with zero watermark, zero sign-up, and bilingual support (বাংলা & English).

🔗 **Live Website**: [https://abmannan1761.github.io/PDF-solution/](https://abmannan1761.github.io/PDF-solution/)

---

## 🌟 Key Features

### 📄 PDF Tools
- **PDF Merge (একত্র করুন)**: Drag-and-drop workspace with 1st-page live thumbnails (PDF.js), reordering arrows, page counts, file sizes, and sorting (A-Z / Reverse).
- **Native Windows & Chrome PDF Download**: Powered by the File System Access API (`showSaveFilePicker`) to guarantee proper `.pdf` file saving without bare UUIDs or missing extensions.
- **PDF Split (আলাদা করুন)**: Extract selected pages or split documents into custom segments.
- **Digital Signatures (স্বাক্ষর)**: Draw or type signatures and export as clean transparent PNGs or stamp onto PDFs.
- **PDF Compress, Protect, Watermark, & Metadata Tools**.

### 🖼️ Image & Media Tools
- Image compressor, resizer, format converters (JPG/PNG/WebP), filters, and color adjustment tools.

### ✍️ AI Writer & Productivity Tools
- Smart paragraph writer, summarizer, tone adjusters, grammar checker, and content generators.
- QR Code Generator with customizable size and color palette.
- Word & character counter with real-time reading speed estimate.
- Hash generator (SHA-256, SHA-1, SHA-512) & password generator with cryptographically secure randomness.
- CSV ⇄ JSON format converters.

### 🎨 UI & UX Design
- **Bilingual Interface**: Seamless instant toggle between বাংলা and English.
- **Dark & Light Modes**: System preference auto-detection + persistent manual toggle.
- **Quick Search Palette (`/`)**: Instant modal search to access any of the 40+ tools instantly.
- **Categorized Navigation**: Interactive dropdowns and filters (Popular, PDF, Image, Write, Converter).

---

## 🚀 Getting Started

No build step or server dependencies required! You can open the project directly in any modern browser:

### Option 1: Using Python local server
```bash
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Using Node.js
```bash
npx serve .
```

---

## 🛠️ Built With

- **HTML5 & Vanilla CSS3**: Highly responsive, modern glassmorphic UI, custom utility classes, dark theme variables.
- **JavaScript (ES Modules)**: Modular architecture without framework overhead.
- **PDF-Lib**: Fast in-browser PDF manipulation and merging.
- **PDF.js**: Client-side PDF page rendering and thumbnail generation.
- **QRCode.js**: Scannable vector and canvas QR generation.

---

## 🔒 Privacy First

All operations are executed completely client-side in the user's browser. Files are never uploaded to any remote server or third-party cloud.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
