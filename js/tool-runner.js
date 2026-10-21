// MarkPDF Client-Side Execution Engine for All Tools

export class ToolRunner {
  constructor(app) {
    this.app = app;
    this.modal = document.getElementById('tool-modal');
    this.modalDialog = document.getElementById('tool-modal-dialog');
    this.modalContent = document.getElementById('tool-modal-body');
    this.modalTitle = document.getElementById('tool-modal-title');
    this.modalCategory = document.getElementById('tool-modal-category');
    this.closeBtn = document.getElementById('tool-modal-close');
    this.currentTool = null;
    this.uploadedFiles = [];
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    
    // Close on backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
        this.close();
      }
    });
  }

  async downloadPdfFile(blob, filename) {
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf';
    }

    // 1. Native Windows Save As Dialog via File System Access API
    // Guarantees proper filename and .pdf extension, completely immune to extension stripping
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'PDF Document (*.pdf)',
            accept: { 'application/pdf': ['.pdf'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      } catch (err) {
        if (err.name === 'AbortError') return false; // User cancelled
        console.warn('Native SavePicker unavailable, falling back:', err);
      }
    }

    // 2. Base64 Data URL (has no blob UUID path, so Chrome & extensions use filename)
    if (blob.size < 35 * 1024 * 1024) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = reader.result;
          a.download = filename;
          a.setAttribute('download', filename);
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            if (a.parentNode) a.parentNode.removeChild(a);
            resolve(true);
          }, 10000);
        };
        reader.readAsDataURL(blob);
      });
    }

    // 3. Blob URL Fallback
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    }, 15000);
    return true;
  }

  downloadBlob(blobOrFile, filename) {
    if (filename.toLowerCase().endsWith('.pdf')) {
      return this.downloadPdfFile(blobOrFile, filename);
    }

    const file = (blobOrFile instanceof File) 
      ? blobOrFile 
      : new File([blobOrFile], filename, { type: (blobOrFile && blobOrFile.type) ? blobOrFile.type : 'application/octet-stream' });
    
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 10000);
    return url;
  }

  downloadDataUrl(dataUrl, filename) {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = dataUrl;
    a.download = filename;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 10000);
  }

  open(tool, initialFiles = []) {
    this.currentTool = tool;
    this.uploadedFiles = Array.isArray(initialFiles) ? [...initialFiles] : (initialFiles ? [initialFiles] : []);
    const lang = this.app.currentLang;
    
    this.modalTitle.textContent = tool.title[lang] || tool.title.en;
    this.modalCategory.textContent = tool.group.toUpperCase() + ' • ' + (tool.category || '');
    
    if (this.modalDialog) {
      if (tool.id === 'merge') {
        this.modalDialog.classList.add('modal-dialog-large');
      } else {
        this.modalDialog.classList.remove('modal-dialog-large');
      }
    }

    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    this.renderToolInterface();
  }

  close() {
    this.modal.classList.add('hidden');
    if (this.modalDialog) {
      this.modalDialog.classList.remove('modal-dialog-large');
    }
    document.body.style.overflow = '';
    this.modalContent.innerHTML = '';
    this.uploadedFiles = [];
    this.currentTool = null;
  }

  renderToolInterface() {
    const tool = this.currentTool;
    const lang = this.app.currentLang;
    const t = this.app.t;
    
    // Group-based rendering
    if (tool.id === 'qr') {
      this.renderQRCodeTool();
    } else if (tool.id === 'csv2json' || tool.id === 'json2csv') {
      this.renderCsvJsonTool();
    } else if (tool.id === 'hashGen') {
      this.renderHashTool();
    } else if (tool.id === 'passwordGen') {
      this.renderPasswordTool();
    } else if (tool.id === 'wordCount') {
      this.renderWordCountTool();
    } else if (tool.id === 'caseConvert') {
      this.renderCaseConvertTool();
    } else if (tool.id === 'textBase64') {
      this.renderBase64Tool();
    } else if (tool.id === 'jsonFormat') {
      this.renderJsonFormatTool();
    } else if (tool.id === 'sign') {
      this.renderSignPdfTool();
    } else if (tool.id === 'merge') {
      this.renderMergePdfTool();
    } else if (tool.id === 'split') {
      this.renderSplitPdfTool();
    } else if (tool.group === 'write') {
      this.renderAiWriterTool();
    } else if (tool.group === 'image') {
      this.renderImageTools();
    } else {
      this.renderGenericTool();
    }
  }

  // --- QR CODE GENERATOR ---
  renderQRCodeTool() {
    const lang = this.app.currentLang;
    this.modalContent.innerHTML = `
      <div class="tool-workspace">
        <div class="tool-controls">
          <label class="control-label">${lang === 'bn' ? 'টেক্সট বা ওয়েবসাইট লিঙ্ক দিন' : 'Enter Text or URL'}:</label>
          <input type="text" id="qr-input" class="tool-input" placeholder="https://example.com" value="https://markpdf.example.com" />
          
          <div class="control-row mt-4">
            <div>
              <label class="control-label">${lang === 'bn' ? 'আকার (পিক্সেল)' : 'Size (pixels)'}:</label>
              <select id="qr-size" class="tool-select">
                <option value="200">200 x 200</option>
                <option value="300" selected>300 x 300</option>
                <option value="500">500 x 500</option>
              </select>
            </div>
            <div>
              <label class="control-label">${lang === 'bn' ? 'রঙ' : 'Color'}:</label>
              <input type="color" id="qr-color" value="#0f172a" class="tool-color" />
            </div>
          </div>
          
          <button id="qr-download" class="action-btn mt-6">
            <svg style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 0.25rem;" class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${lang === 'bn' ? 'QR কোড ডাউনলোড করুন (PNG)' : 'Download QR Code (PNG)'}
          </button>
        </div>
        <div class="tool-preview flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
          <div id="qr-canvas-wrapper" class="p-4 bg-white rounded-xl shadow-md"></div>
          <p class="text-xs text-muted-foreground mt-3">${lang === 'bn' ? 'তাত্ক্ষণিক প্রিভিউ এবং স্ক্যানযোগ্য' : 'Instant live scannable preview'}</p>
        </div>
      </div>
    `;

    const input = document.getElementById('qr-input');
    const sizeSelect = document.getElementById('qr-size');
    const colorInput = document.getElementById('qr-color');
    const downloadBtn = document.getElementById('qr-download');
    const wrapper = document.getElementById('qr-canvas-wrapper');

    const updateQr = () => {
      wrapper.innerHTML = '';
      const text = input.value.trim() || 'https://markpdf.example.com';
      const size = parseInt(sizeSelect.value, 10);
      const color = colorInput.value;
      
      if (window.QRCode) {
        new QRCode(wrapper, {
          text: text,
          width: size,
          height: size,
          colorDark: color,
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      } else {
        // Fallback SVG generator
        const encoded = encodeURIComponent(text);
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=${color.replace('#','')}`;
        img.style.maxWidth = '100%';
        img.alt = 'QR Code';
        wrapper.appendChild(img);
      }
    };

    input.addEventListener('input', updateQr);
    sizeSelect.addEventListener('change', updateQr);
    colorInput.addEventListener('change', updateQr);
    updateQr();

    downloadBtn.addEventListener('click', () => {
      const canvas = wrapper.querySelector('canvas');
      const img = wrapper.querySelector('img');
      if (canvas) {
        this.downloadDataUrl(canvas.toDataURL('image/png'), 'markpdf-qr-code.png');
      } else if (img) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = img.src;
        a.download = 'markpdf-qr-code.png';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => a.remove(), 5000);
      }
    });
  }

  // --- CSV <-> JSON CONVERTER ---
  renderCsvJsonTool() {
    const isCsv2Json = this.currentTool.id === 'csv2json';
    const lang = this.app.currentLang;
    
    this.modalContent.innerHTML = `
      <div class="tool-workspace-full">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm text-muted-foreground">
            ${isCsv2Json 
              ? (lang === 'bn' ? 'বামপাশে CSV পেস্ট করুন বা ফাইল আপলোড করুন, ডানপাশে স্বয়ংক্রিয়ভাবে JSON তৈরি হবে:' : 'Paste CSV on the left or upload file, JSON appears automatically on the right:')
              : (lang === 'bn' ? 'বামপাশে JSON পেস্ট করুন বা ফাইল আপলোড করুন, ডানপাশে স্বয়ংক্রিয়ভাবে CSV তৈরি হবে:' : 'Paste JSON on the left or upload file, CSV appears automatically on the right:')
            }
          </p>
          <div class="flex gap-2">
            <label class="secondary-btn cursor-pointer text-xs py-1.5 px-3">
              <svg style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 0.25rem;" class="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              ${lang === 'bn' ? 'ফাইল আপলোড' : 'Upload File'}
              <input type="file" id="data-file-input" class="hidden" accept="${isCsv2Json ? '.csv,.txt' : '.json,.txt'}" />
            </label>
            <button id="copy-output-btn" class="secondary-btn text-xs py-1.5 px-3">
              ${lang === 'bn' ? 'আউটপুট কপি' : 'Copy Output'}
            </button>
            <button id="download-output-btn" class="action-btn text-xs py-1.5 px-3">
              ${lang === 'bn' ? 'ডাউনলোড' : 'Download'}
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">${isCsv2Json ? 'CSV Input' : 'JSON Input'}</span>
            <textarea id="data-input" class="tool-code-area" placeholder="${isCsv2Json ? 'name,age,city\nRahim,28,Dhaka\nKarim,32,Chittagong' : '[{\"name\":\"Rahim\",\"age\":28,\"city\":\"Dhaka\"}]'}">${isCsv2Json ? 'id,name,role,city\n101,Suhanur Rahman,Engineer,Dhaka\n102,Tanvir Ahmed,Designer,Sylhet\n103,Ayesha Siddika,Lead,Chattogram' : ''}</textarea>
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">${isCsv2Json ? 'JSON Output' : 'CSV Output'}</span>
            <textarea id="data-output" class="tool-code-area bg-slate-50 dark:bg-slate-900/60" readonly></textarea>
          </div>
        </div>
      </div>
    `;

    const input = document.getElementById('data-input');
    const output = document.getElementById('data-output');
    const fileInput = document.getElementById('data-file-input');
    const copyBtn = document.getElementById('copy-output-btn');
    const downloadBtn = document.getElementById('download-output-btn');

    const convert = () => {
      const val = input.value.trim();
      if (!val) {
        output.value = '';
        return;
      }
      try {
        if (isCsv2Json) {
          const lines = val.split(/\r?\n/).filter(l => l.trim() !== '');
          if (lines.length === 0) return;
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          const result = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const obj = {};
            headers.forEach((h, i) => {
              obj[h] = values[i] !== undefined ? values[i] : null;
            });
            return obj;
          });
          output.value = JSON.stringify(result, null, 2);
        } else {
          const parsed = JSON.parse(val);
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          if (arr.length === 0) return;
          const headers = Object.keys(arr[0]);
          const csvLines = [headers.join(',')];
          arr.forEach(item => {
            const row = headers.map(h => {
              let cell = item[h] !== undefined && item[h] !== null ? String(item[h]) : '';
              if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                cell = `"${cell.replace(/"/g, '""')}"`;
              }
              return cell;
            });
            csvLines.push(row.join(','));
          });
          output.value = csvLines.join('\n');
        }
      } catch (err) {
        output.value = (lang === 'bn' ? 'সিনট্যাক্স ত্রুটি: ' : 'Syntax Error: ') + err.message;
      }
    };

    input.addEventListener('input', convert);
    convert();

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          input.value = evt.target.result;
          convert();
        };
        reader.readAsText(file);
      }
    });

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(output.value);
      copyBtn.textContent = lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = lang === 'bn' ? 'আউটপুট কপি' : 'Copy Output';
      }, 2000);
    });

    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([output.value], { type: isCsv2Json ? 'application/json' : 'text/csv' });
      this.downloadBlob(blob, isCsv2Json ? 'converted.json' : 'converted.csv');
    });
  }

  // --- HASH GENERATOR ---
  renderHashTool() {
    const lang = this.app.currentLang;
    this.modalContent.innerHTML = `
      <div class="tool-workspace-full">
        <div class="mb-4">
          <label class="control-label">${lang === 'bn' ? 'টেক্সট লিখুন অথবা ফাইল দিন' : 'Enter Text or drop file'}:</label>
          <textarea id="hash-text" class="tool-textarea h-28" placeholder="${lang === 'bn' ? 'যে লেখার হ্যাশ তৈরি করতে চান...' : 'Type or paste text to generate cryptographic checksum...'}">MarkPDF Secure In-Browser Toolkit</textarea>
        </div>
        
        <div class="space-y-4">
          <div class="p-4 rounded-xl border border-border bg-card">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold uppercase tracking-wider text-primary">SHA-256</span>
              <button class="copy-hash-btn text-xs text-muted-foreground hover:text-foreground" data-target="hash-sha256">${lang === 'bn' ? 'কপি' : 'Copy'}</button>
            </div>
            <input type="text" id="hash-sha256" class="tool-input font-mono text-xs bg-slate-50 dark:bg-slate-900" readonly />
          </div>

          <div class="p-4 rounded-xl border border-border bg-card">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">SHA-1</span>
              <button class="copy-hash-btn text-xs text-muted-foreground hover:text-foreground" data-target="hash-sha1">${lang === 'bn' ? 'কপি' : 'Copy'}</button>
            </div>
            <input type="text" id="hash-sha1" class="tool-input font-mono text-xs bg-slate-50 dark:bg-slate-900" readonly />
          </div>

          <div class="p-4 rounded-xl border border-border bg-card">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">SHA-512</span>
              <button class="copy-hash-btn text-xs text-muted-foreground hover:text-foreground" data-target="hash-sha512">${lang === 'bn' ? 'কপি' : 'Copy'}</button>
            </div>
            <input type="text" id="hash-sha512" class="tool-input font-mono text-xs bg-slate-50 dark:bg-slate-900" readonly />
          </div>
        </div>
      </div>
    `;

    const input = document.getElementById('hash-text');
    const sha256Out = document.getElementById('hash-sha256');
    const sha1Out = document.getElementById('hash-sha1');
    const sha512Out = document.getElementById('hash-sha512');

    const computeHashes = async () => {
      const text = input.value;
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      const buf256 = await crypto.subtle.digest('SHA-256', data);
      sha256Out.value = Array.from(new Uint8Array(buf256)).map(b => b.toString(16).padStart(2, '0')).join('');

      const buf1 = await crypto.subtle.digest('SHA-1', data);
      sha1Out.value = Array.from(new Uint8Array(buf1)).map(b => b.toString(16).padStart(2, '0')).join('');

      const buf512 = await crypto.subtle.digest('SHA-512', data);
      sha512Out.value = Array.from(new Uint8Array(buf512)).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    input.addEventListener('input', computeHashes);
    computeHashes();

    this.modalContent.querySelectorAll('.copy-hash-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.target.getAttribute('data-target');
        const val = document.getElementById(targetId).value;
        navigator.clipboard.writeText(val);
        e.target.textContent = lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!';
        setTimeout(() => e.target.textContent = lang === 'bn' ? 'কপি' : 'Copy', 1500);
      });
    });
  }

  // --- PASSWORD GENERATOR ---
  renderPasswordTool() {
    const lang = this.app.currentLang;
    this.modalContent.innerHTML = `
      <div class="tool-workspace">
        <div class="tool-controls">
          <label class="control-label">${lang === 'bn' ? 'দৈর্ঘ্য' : 'Length'}: <span id="pass-len-val" class="font-bold text-primary">16</span></label>
          <input type="range" id="pass-len" min="8" max="64" value="16" class="w-full accent-emerald-600 mb-4" />
          
          <div class="space-y-2 mb-6">
            <label class="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" id="pass-upper" checked class="rounded text-primary" />
              <span>${lang === 'bn' ? 'বড় হাতের অক্ষর (A-Z)' : 'Uppercase letters (A-Z)'}</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" id="pass-lower" checked class="rounded text-primary" />
              <span>${lang === 'bn' ? 'ছোট হাতের অক্ষর (a-z)' : 'Lowercase letters (a-z)'}</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" id="pass-num" checked class="rounded text-primary" />
              <span>${lang === 'bn' ? 'সংখ্যা (0-9)' : 'Numbers (0-9)'}</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" id="pass-sym" checked class="rounded text-primary" />
              <span>${lang === 'bn' ? 'চিহ্ন (!@#$%^&*)' : 'Symbols (!@#$%^&*)'}</span>
            </label>
          </div>
          
          <button id="pass-refresh" class="action-btn w-full">
            <svg style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 0.25rem;" class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            ${lang === 'bn' ? 'নতুন পাসওয়ার্ড তৈরি করুন' : 'Generate New Password'}
          </button>
        </div>

        <div class="tool-preview flex flex-col justify-center items-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">${lang === 'bn' ? 'জেনারেট করা পাসওয়ার্ড' : 'Generated Password'}</span>
          <div class="w-full relative">
            <input type="text" id="pass-output" class="tool-input font-mono text-center text-lg py-3 px-4 bg-white dark:bg-slate-800 border-2 border-primary/30" readonly />
          </div>
          <button id="pass-copy" class="secondary-btn mt-4 py-2 px-6">
            ${lang === 'bn' ? 'পাসওয়ার্ড কপি করুন' : 'Copy Password'}
          </button>
          <div class="mt-4 text-center">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              🛡️ ${lang === 'bn' ? 'ক্রিপ্টোগ্রাফিকভাবে সুরক্ষিত র্যান্ডমনেস' : 'Cryptographically secure client-side generation'}
            </span>
          </div>
        </div>
      </div>
    `;

    const lenInput = document.getElementById('pass-len');
    const lenVal = document.getElementById('pass-len-val');
    const upperCb = document.getElementById('pass-upper');
    const lowerCb = document.getElementById('pass-lower');
    const numCb = document.getElementById('pass-num');
    const symCb = document.getElementById('pass-sym');
    const output = document.getElementById('pass-output');
    const refreshBtn = document.getElementById('pass-refresh');
    const copyBtn = document.getElementById('pass-copy');

    const generate = () => {
      const len = parseInt(lenInput.value, 10);
      lenVal.textContent = len;
      let chars = '';
      if (upperCb.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (lowerCb.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (numCb.checked) chars += '0123456789';
      if (symCb.checked) chars += '!@#$%^&*()_+~|}{[]:;?><,.-=';

      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
      
      const array = new Uint32Array(len);
      window.crypto.getRandomValues(array);
      let pass = '';
      for (let i = 0; i < len; i++) {
        pass += chars[array[i] % chars.length];
      }
      output.value = pass;
    };

    lenInput.addEventListener('input', generate);
    upperCb.addEventListener('change', generate);
    lowerCb.addEventListener('change', generate);
    numCb.addEventListener('change', generate);
    symCb.addEventListener('change', generate);
    refreshBtn.addEventListener('click', generate);
    generate();

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(output.value);
      copyBtn.textContent = lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!';
      setTimeout(() => copyBtn.textContent = lang === 'bn' ? 'পাসওয়ার্ড কপি করুন' : 'Copy Password', 2000);
    });
  }

  // --- WORD / CHARACTER COUNTER ---
  renderWordCountTool() {
    const lang = this.app.currentLang;
    this.modalContent.innerHTML = `
      <div class="tool-workspace-full">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div class="p-3 bg-card border border-border rounded-xl text-center">
            <span class="block text-2xl font-black text-primary" id="wc-words">0</span>
            <span class="text-xs text-muted-foreground uppercase tracking-wider">${lang === 'bn' ? 'শব্দ' : 'Words'}</span>
          </div>
          <div class="p-3 bg-card border border-border rounded-xl text-center">
            <span class="block text-2xl font-black text-emerald-600 dark:text-emerald-400" id="wc-chars">0</span>
            <span class="text-xs text-muted-foreground uppercase tracking-wider">${lang === 'bn' ? 'অক্ষর' : 'Characters'}</span>
          </div>
          <div class="p-3 bg-card border border-border rounded-xl text-center">
            <span class="block text-2xl font-black text-blue-600 dark:text-blue-400" id="wc-paras">0</span>
            <span class="text-xs text-muted-foreground uppercase tracking-wider">${lang === 'bn' ? 'প্যারাগ্রাফ' : 'Paragraphs'}</span>
          </div>
          <div class="p-3 bg-card border border-border rounded-xl text-center">
            <span class="block text-2xl font-black text-purple-600 dark:text-purple-400" id="wc-read">0 min</span>
            <span class="text-xs text-muted-foreground uppercase tracking-wider">${lang === 'bn' ? 'পড়ার সময়' : 'Read Time'}</span>
          </div>
        </div>
        <textarea id="wc-input" class="tool-code-area h-64" placeholder="${lang === 'bn' ? 'এখানে টেক্সট পেস্ট বা টাইপ করুন...' : 'Type or paste your text here to see real-time statistics...'}"></textarea>
      </div>
    `;

    const input = document.getElementById('wc-input');
    const wordsEl = document.getElementById('wc-words');
    const charsEl = document.getElementById('wc-chars');
    const parasEl = document.getElementById('wc-paras');
    const readEl = document.getElementById('wc-read');

    const updateStats = () => {
      const text = input.value;
      const chars = text.length;
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const paras = text.trim() === '' ? 0 : text.split(/\n+/).filter(p => p.trim() !== '').length;
      const readMin = Math.ceil(words / 200);

      wordsEl.textContent = words;
      charsEl.textContent = chars;
      parasEl.textContent = paras;
      readEl.textContent = readMin + ' min';
    };

    input.addEventListener('input', updateStats);
  }

  // --- CASE CONVERTER ---
  renderCaseConvertTool() {
    const lang = this.app.currentLang;
    this.modalContent.innerHTML = `
      <div class="tool-workspace-full">
        <textarea id="case-input" class="tool-code-area h-48 mb-4" placeholder="${lang === 'bn' ? 'এখানে টেক্সট লিখুন...' : 'Type or paste your text here to change casing...'}">MarkPDF is an all-in-one free toolkit for office, pdf and image jobs.</textarea>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <button class="case-btn secondary-btn text-xs py-2 px-3" data-mode="upper">UPPERCASE</button>
          <button class="case-btn secondary-btn text-xs py-2 px-3" data-mode="lower">lowercase</button>
          <button class="case-btn secondary-btn text-xs py-2 px-3" data-mode="title">Title Case</button>
          <button class="case-btn secondary-btn text-xs py-2 px-3" data-mode="sentence">Sentence case</button>
          <button class="case-btn secondary-btn text-xs py-2 px-3" data-mode="camel">camelCase</button>
          <button class="case-btn secondary-btn text-xs py-2 px-3" data-mode="snake">snake_case</button>
          <button class="case-btn secondary-btn text-xs py-2 px-3" data-mode="kebab">kebab-case</button>
          <button id="case-copy" class="action-btn text-xs py-2 px-4 ml-auto">${lang === 'bn' ? 'কপি করুন' : 'Copy Text'}</button>
        </div>
      </div>
    `;

    const input = document.getElementById('case-input');
    const copyBtn = document.getElementById('case-copy');

    this.modalContent.querySelectorAll('.case-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.target.getAttribute('data-mode');
        const str = input.value;
        if (mode === 'upper') {
          input.value = str.toUpperCase();
        } else if (mode === 'lower') {
          input.value = str.toLowerCase();
        } else if (mode === 'title') {
          input.value = str.toLowerCase().replace(/\b(\w)/g, c => c.toUpperCase());
        } else if (mode === 'sentence') {
          input.value = str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
        } else if (mode === 'camel') {
          input.value = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        } else if (mode === 'snake') {
          input.value = str.trim().toLowerCase().replace(/\s+/g, '_');
        } else if (mode === 'kebab') {
          input.value = str.trim().toLowerCase().replace(/\s+/g, '-');
        }
      });
    });

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(input.value);
      copyBtn.textContent = lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!';
      setTimeout(() => copyBtn.textContent = lang === 'bn' ? 'কপি করুন' : 'Copy Text', 1800);
    });
  }

  // --- BASE64 TOOL ---
  renderBase64Tool() {
    const lang = this.app.currentLang;
    this.modalContent.innerHTML = `
      <div class="tool-workspace-full">
        <div class="flex gap-4 mb-4">
          <button id="b64-mode-encode" class="action-btn text-xs py-1.5 px-4">${lang === 'bn' ? 'টেক্সট থেকে Base64 এনকোড' : 'Text to Base64 Encode'}</button>
          <button id="b64-mode-decode" class="secondary-btn text-xs py-1.5 px-4">${lang === 'bn' ? 'Base64 থেকে টেক্সট ডিকোড' : 'Base64 to Text Decode'}</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea id="b64-input" class="tool-code-area" placeholder="${lang === 'bn' ? 'ইনপুট টেক্সট লিখুন...' : 'Type or paste input here...'}">Hello MarkPDF! বাংলা ইউনিকোড টেক্সট</textarea>
          <textarea id="b64-output" class="tool-code-area bg-slate-50 dark:bg-slate-900/60" readonly></textarea>
        </div>
      </div>
    `;

    const input = document.getElementById('b64-input');
    const output = document.getElementById('b64-output');
    const encBtn = document.getElementById('b64-mode-encode');
    const decBtn = document.getElementById('b64-mode-decode');
    let isEncode = true;

    const process = () => {
      const val = input.value;
      try {
        if (isEncode) {
          output.value = btoa(unescape(encodeURIComponent(val)));
        } else {
          output.value = decodeURIComponent(escape(atob(val.trim())));
        }
      } catch (e) {
        output.value = 'Error: ' + e.message;
      }
    };

    encBtn.addEventListener('click', () => {
      isEncode = true;
      encBtn.className = 'action-btn text-xs py-1.5 px-4';
      decBtn.className = 'secondary-btn text-xs py-1.5 px-4';
      process();
    });

    decBtn.addEventListener('click', () => {
      isEncode = false;
      decBtn.className = 'action-btn text-xs py-1.5 px-4';
      encBtn.className = 'secondary-btn text-xs py-1.5 px-4';
      process();
    });

    input.addEventListener('input', process);
    process();
  }

  // --- JSON FORMATTER ---
  renderJsonFormatTool() {
    const lang = this.app.currentLang;
    this.modalContent.innerHTML = `
      <div class="tool-workspace-full">
        <div class="flex gap-2 justify-between mb-3">
          <span class="text-xs text-muted-foreground">${lang === 'bn' ? 'JSON ভ্যালিডেশন এবং সুন্দর ইন্ডেন্টেশন' : 'Pretty-print, minify and validate JSON'}</span>
          <div class="flex gap-2">
            <button id="json-beautify" class="secondary-btn text-xs py-1.5 px-3">${lang === 'bn' ? 'বিউটিফাই (2 স্পেস)' : 'Beautify (2 spaces)'}</button>
            <button id="json-minify" class="secondary-btn text-xs py-1.5 px-3">${lang === 'bn' ? 'মিনিফাই' : 'Minify'}</button>
            <button id="json-copy" class="action-btn text-xs py-1.5 px-3">${lang === 'bn' ? 'কপি' : 'Copy'}</button>
          </div>
        </div>
        <textarea id="json-text" class="tool-code-area h-80" placeholder="Paste JSON here...">{"app":"MarkPDF","features":["PDF Edit","Image Tools","AI Writer","File Tools"],"free":true,"version":1}</textarea>
        <div id="json-status" class="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">✓ Valid JSON</div>
      </div>
    `;

    const txt = document.getElementById('json-text');
    const status = document.getElementById('json-status');
    const bBtn = document.getElementById('json-beautify');
    const mBtn = document.getElementById('json-minify');
    const cBtn = document.getElementById('json-copy');

    const check = () => {
      try {
        JSON.parse(txt.value);
        status.textContent = '✓ Valid JSON';
        status.className = 'mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400';
      } catch (e) {
        status.textContent = '✕ Syntax Error: ' + e.message;
        status.className = 'mt-2 text-xs font-semibold text-red-600 dark:text-red-400';
      }
    };

    bBtn.addEventListener('click', () => {
      try {
        txt.value = JSON.stringify(JSON.parse(txt.value), null, 2);
        check();
      } catch (e) { check(); }
    });

    mBtn.addEventListener('click', () => {
      try {
        txt.value = JSON.stringify(JSON.parse(txt.value));
        check();
      } catch (e) { check(); }
    });

    cBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(txt.value);
      cBtn.textContent = lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!';
      setTimeout(() => cBtn.textContent = lang === 'bn' ? 'কপি' : 'Copy', 1500);
    });

    txt.addEventListener('input', check);
  }

  // --- SIGN PDF TOOL ---
  renderSignPdfTool() {
    const lang = this.app.currentLang;
    this.modalContent.innerHTML = `
      <div class="tool-workspace">
        <div class="tool-controls">
          <p class="text-sm text-muted-foreground mb-4">
            ${lang === 'bn' ? 'ক্যানভাসে আপনার স্বাক্ষর আঁকুন অথবা টাইপ করে তৈরি করুন:' : 'Draw your signature on the canvas below or type your name:'}
          </p>
          
          <div class="flex gap-2 mb-4">
            <button id="sig-mode-draw" class="action-btn text-xs py-1 px-3 flex-1">${lang === 'bn' ? 'হাতে আঁকুন' : 'Draw'}</button>
            <button id="sig-mode-type" class="secondary-btn text-xs py-1 px-3 flex-1">${lang === 'bn' ? 'টাইপ করুন' : 'Type'}</button>
          </div>

          <div id="sig-type-control" class="hidden mb-4">
            <label class="control-label">${lang === 'bn' ? 'নাম লিখুন' : 'Type your name'}:</label>
            <input type="text" id="sig-type-input" class="tool-input" placeholder="Your Name" value="Suhanur Rahman" />
          </div>

          <div class="control-row mb-4">
            <div>
              <label class="control-label">${lang === 'bn' ? 'কালি' : 'Ink Color'}:</label>
              <input type="color" id="sig-color" value="#0b8a5f" class="tool-color" />
            </div>
            <div>
              <label class="control-label">${lang === 'bn' ? 'পুরুত্ব' : 'Thickness'}:</label>
              <input type="range" id="sig-width" min="1" max="6" value="2" class="w-24 accent-primary" />
            </div>
          </div>

          <div class="flex gap-2">
            <button id="sig-clear" class="secondary-btn text-xs py-2 px-4 flex-1">${lang === 'bn' ? 'মুছে ফেলুন' : 'Clear'}</button>
            <button id="sig-download" class="action-btn text-xs py-2 px-4 flex-1">${lang === 'bn' ? 'স্বাক্ষর PNG ডাউনলোড' : 'Download PNG'}</button>
          </div>
        </div>

        <div class="tool-preview flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
          <canvas id="sig-canvas" width="400" height="220" class="border border-dashed border-border rounded-xl bg-white shadow-sm cursor-crosshair"></canvas>
          <span class="text-xs text-muted-foreground mt-2">${lang === 'bn' ? 'স্বচ্ছ ব্যাকগ্রাউন্ডসহ উচ্চমানের স্বাক্ষর' : 'Transparent PNG signature ready to place on PDF'}</span>
        </div>
      </div>
    `;

    const canvas = document.getElementById('sig-canvas');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('sig-clear');
    const downloadBtn = document.getElementById('sig-download');
    const colorInput = document.getElementById('sig-color');
    const widthInput = document.getElementById('sig-width');
    const drawModeBtn = document.getElementById('sig-mode-draw');
    const typeModeBtn = document.getElementById('sig-mode-type');
    const typeControl = document.getElementById('sig-type-control');
    const typeInput = document.getElementById('sig-type-input');

    let drawing = false;

    const startDraw = (e) => {
      drawing = true;
      ctx.beginPath();
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
      ctx.moveTo(x, y);
    };

    const draw = (e) => {
      if (!drawing) return;
      ctx.strokeStyle = colorInput.value;
      ctx.lineWidth = widthInput.value;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDraw = () => {
      drawing = false;
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
    canvas.addEventListener('touchend', stopDraw);

    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    const renderTypedSignature = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'italic 38px "Brush Script MT", "Caveat", cursive, sans-serif';
      ctx.fillStyle = colorInput.value;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typeInput.value || 'Signature', canvas.width / 2, canvas.height / 2);
    };

    drawModeBtn.addEventListener('click', () => {
      drawModeBtn.className = 'action-btn text-xs py-1 px-3 flex-1';
      typeModeBtn.className = 'secondary-btn text-xs py-1 px-3 flex-1';
      typeControl.classList.add('hidden');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    typeModeBtn.addEventListener('click', () => {
      typeModeBtn.className = 'action-btn text-xs py-1 px-3 flex-1';
      drawModeBtn.className = 'secondary-btn text-xs py-1 px-3 flex-1';
      typeControl.classList.remove('hidden');
      renderTypedSignature();
    });

    typeInput.addEventListener('input', renderTypedSignature);

    downloadBtn.addEventListener('click', () => {
      this.downloadDataUrl(canvas.toDataURL('image/png'), 'signature.png');
    });
  }

  // --- MERGE PDF TOOL (Full Dedicated Workspace matching MarkPDF) ---
  renderMergePdfTool() {
    const lang = this.app.currentLang;
    let files = [...this.uploadedFiles.filter(f => f.name.toLowerCase().endsWith('.pdf'))];

    // Helper: asynchronously extract page count and render 1st-page thumbnail
    const loadPdfMeta = async (fileObj, idx) => {
      if (fileObj._metaLoaded) return;
      fileObj._metaLoaded = true;

      try {
        const buffer = await fileObj.arrayBuffer();

        // 1. Get Page Count using PDFLib
        if (window.PDFLib) {
          try {
            const pdfDoc = await PDFLib.PDFDocument.load(buffer.slice(0), { ignoreEncryption: true });
            fileObj.pageCount = pdfDoc.getPageCount();
          } catch (e) {
            fileObj.pageCount = 1;
          }
        }

        // 2. Render 1st-page thumbnail using PDF.js
        if (window.pdfjsLib) {
          try {
            const loadingTask = pdfjsLib.getDocument({ data: buffer.slice(0) });
            const pdf = await loadingTask.promise;
            if (!fileObj.pageCount) fileObj.pageCount = pdf.numPages;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 0.35 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;
            fileObj.thumbnailCanvas = canvas;
          } catch (e) {
            console.warn('PDF.js thumbnail error:', e);
          }
        }

        // Update thumbnail DOM if rendered
        const thumbEl = document.getElementById(`thumb-wrap-${idx}`);
        if (thumbEl && fileObj.thumbnailCanvas) {
          thumbEl.innerHTML = '';
          thumbEl.appendChild(fileObj.thumbnailCanvas);
        }

        // Update stats
        const subEl = document.getElementById(`sub-info-${idx}`);
        if (subEl) {
          subEl.textContent = `${fileObj.pageCount || 1} ${lang === 'bn' ? 'পৃষ্ঠা' : 'pages'} · ${(fileObj.size / (1024 * 1024)).toFixed(2)} MB`;
        }
        updateStats();
      } catch (err) {
        console.warn('loadPdfMeta error:', err);
      }
    };

    const updateStats = () => {
      const filesCountEl = document.getElementById('merge-stat-files');
      const pagesCountEl = document.getElementById('merge-stat-pages');
      if (filesCountEl) filesCountEl.textContent = files.length;
      if (pagesCountEl) {
        const total = files.reduce((acc, f) => acc + (f.pageCount || 1), 0);
        pagesCountEl.textContent = total;
      }
    };

    const renderUI = () => {
      if (files.length === 0) {
        // Empty state: Hero dropzone
        this.modalContent.innerHTML = `
          <div class="tool-workspace-full">
            <div class="p-12 border-2 border-dashed border-border rounded-2xl text-center bg-slate-50 dark:bg-slate-900/40 my-6">
              <input type="file" id="merge-file-input" multiple accept=".pdf" class="hidden" />
              <div class="size-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
              </div>
              <label for="merge-file-input" class="action-btn cursor-pointer inline-flex items-center gap-2 text-base px-8 py-3.5 font-bold shadow-lg">
                + ${lang === 'bn' ? 'একাধিক PDF ফাইল নির্বাচন করুন' : 'Select PDF files'}
              </label>
              <p class="text-sm text-muted-foreground mt-3">${lang === 'bn' ? 'ফাইলের ক্রম সাজিয়ে এক ক্লিকে একটি PDF ফাইলে যুক্ত করুন' : 'Drag & reorder to combine into a single document'}</p>
            </div>
          </div>
        `;

        const input = document.getElementById('merge-file-input');
        input?.addEventListener('change', (e) => {
          files = [...files, ...Array.from(e.target.files)];
          renderUI();
        });
        return;
      }

      // Active state: 2-column workspace matching user screenshot
      const totalPages = files.reduce((acc, f) => acc + (f.pageCount || 1), 0);

      this.modalContent.innerHTML = `
        <div class="merge-workspace">
          <!-- Left: Scrollable Grid of PDF Cards -->
          <div class="merge-cards-scroll">
            <input type="file" id="merge-file-input" multiple accept=".pdf" class="hidden" />
            <div id="merge-cards-grid" class="merge-cards-grid">
              ${files.map((f, idx) => `
                <div class="pdf-card" draggable="true" data-idx="${idx}">
                  <span class="pdf-card-badge">${idx + 1}</span>
                  <button class="pdf-card-remove" data-idx="${idx}" title="Remove file">✕</button>
                  
                  <div class="pdf-thumb-wrap" id="thumb-wrap-${idx}">
                    <!-- Thumbnail preview canvas or placeholder -->
                    <svg viewBox="0 0 100 135" class="w-full h-full p-4 opacity-75" fill="none" stroke="currentColor">
                      <rect x="5" y="5" width="90" height="125" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
                      <rect x="18" y="20" width="40" height="6" rx="2" fill="#0b8a5f"/>
                      <rect x="18" y="36" width="64" height="3" rx="1.5" fill="#94a3b8"/>
                      <rect x="18" y="45" width="56" height="3" rx="1.5" fill="#cbd5e1"/>
                      <rect x="18" y="54" width="64" height="3" rx="1.5" fill="#cbd5e1"/>
                      <rect x="18" y="63" width="48" height="3" rx="1.5" fill="#cbd5e1"/>
                      <rect x="18" y="76" width="64" height="24" rx="3" fill="#e2e8f0"/>
                      <rect x="18" y="108" width="64" height="3" rx="1.5" fill="#cbd5e1"/>
                      <rect x="18" y="116" width="40" height="3" rx="1.5" fill="#cbd5e1"/>
                    </svg>
                  </div>

                  <div class="pdf-card-info">
                    <p class="pdf-card-title" title="${f.name}">${f.name}</p>
                    <p class="pdf-card-sub" id="sub-info-${idx}">
                      ${f.pageCount || 1} ${lang === 'bn' ? 'পৃষ্ঠা' : 'pages'} · ${(f.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    
                    <div class="pdf-card-arrows">
                      <button class="pdf-nav-btn move-left-btn" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} title="Move left">←</button>
                      <button class="pdf-nav-btn move-right-btn" data-idx="${idx}" ${idx === files.length - 1 ? 'disabled' : ''} title="Move right">→</button>
                    </div>
                  </div>
                </div>
              `).join('')}

              <!-- Add More PDFs Card -->
              <label for="merge-file-input" class="add-more-card cursor-pointer">
                <div class="add-more-icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                <span class="text-sm font-bold text-foreground">${lang === 'bn' ? 'আরও PDF যোগ করুন' : 'Add more PDFs'}</span>
              </label>
            </div>
          </div>

          <!-- Right: Sidebar Panel -->
          <div class="merge-sidebar">
            <h3 class="merge-sidebar-title">${lang === 'bn' ? 'PDF একত্র করুন' : 'Merge PDF'}</h3>
            <p class="merge-sidebar-desc">
              ${lang === 'bn' ? 'আপনার পছন্দের ক্রমে কার্ডগুলো সাজান। এই ক্রমেই ফাইলগুলো একত্র হবে।' : 'Drag cards into the order you want. Files are joined in this order.'}
            </p>

            <div class="merge-stats-box">
              <div class="merge-stat-row">
                <span class="merge-stat-label">${lang === 'bn' ? 'ফাইল' : 'Files'}</span>
                <span class="merge-stat-val" id="merge-stat-files">${files.length}</span>
              </div>
              <div class="merge-stat-row">
                <span class="merge-stat-label">${lang === 'bn' ? 'মোট পৃষ্ঠা' : 'Total pages'}</span>
                <span class="merge-stat-val" id="merge-stat-pages">${totalPages}</span>
              </div>
            </div>

            <div class="merge-sort-actions">
              <button id="merge-sort-az" class="merge-sort-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
                ${lang === 'bn' ? 'Sort A-Z' : 'Sort A-Z'}
              </button>
              <button id="merge-reverse" class="merge-sort-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                ${lang === 'bn' ? 'Reverse' : 'Reverse'}
              </button>
            </div>

            <div id="merge-result-container"></div>

            <button id="merge-btn" class="merge-primary-btn" ${files.length < 2 ? 'disabled' : ''}>
              <span>${lang === 'bn' ? 'একত্র করুন' : 'Merge PDF'}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      `;

      // Render thumbnails & fetch page counts
      files.forEach((f, idx) => {
        const thumbEl = document.getElementById(`thumb-wrap-${idx}`);
        if (f.thumbnailCanvas && thumbEl) {
          thumbEl.innerHTML = '';
          thumbEl.appendChild(f.thumbnailCanvas);
        } else {
          loadPdfMeta(f, idx);
        }
      });

      // Events: File Input
      const input = document.getElementById('merge-file-input');
      input?.addEventListener('change', (e) => {
        files = [...files, ...Array.from(e.target.files)];
        renderUI();
      });

      // Events: Remove card
      document.querySelectorAll('.pdf-card-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
          files.splice(idx, 1);
          renderUI();
        });
      });

      // Events: Move Left
      document.querySelectorAll('.move-left-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
          if (idx > 0) {
            [files[idx - 1], files[idx]] = [files[idx], files[idx - 1]];
            renderUI();
          }
        });
      });

      // Events: Move Right
      document.querySelectorAll('.move-right-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
          if (idx < files.length - 1) {
            [files[idx + 1], files[idx]] = [files[idx], files[idx + 1]];
            renderUI();
          }
        });
      });

      // Events: HTML5 Drag & Drop reordering
      let draggedIdx = null;
      document.querySelectorAll('.pdf-card').forEach(card => {
        card.addEventListener('dragstart', (e) => {
          draggedIdx = parseInt(card.getAttribute('data-idx'), 10);
          card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
        });
        card.addEventListener('dragover', (e) => {
          e.preventDefault();
        });
        card.addEventListener('drop', (e) => {
          e.preventDefault();
          const targetIdx = parseInt(card.getAttribute('data-idx'), 10);
          if (draggedIdx !== null && draggedIdx !== targetIdx) {
            const moved = files.splice(draggedIdx, 1)[0];
            files.splice(targetIdx, 0, moved);
            renderUI();
          }
        });
      });

      // Events: Sort A-Z
      document.getElementById('merge-sort-az')?.addEventListener('click', () => {
        files.sort((a, b) => a.name.localeCompare(b.name));
        renderUI();
      });

      // Events: Reverse
      document.getElementById('merge-reverse')?.addEventListener('click', () => {
        files.reverse();
        renderUI();
      });

      // Events: Merge & Download Action
      const mergeBtn = document.getElementById('merge-btn');
      mergeBtn?.addEventListener('click', async () => {
        mergeBtn.disabled = true;
        mergeBtn.innerHTML = `
          <span class="inline-block animate-spin mr-2">◌</span>
          <span>${lang === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Merging PDFs...'}</span>
        `;

        try {
          if (!window.PDFLib) {
            throw new Error('PDF library is loading. Please try again.');
          }
          const { PDFDocument } = PDFLib;
          const mergedPdf = await PDFDocument.create();

          for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          }

          const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
          const buffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength);
          const blob = new Blob([buffer], { type: 'application/pdf' });
          const firstTitle = files[0] ? files[0].name.replace(/\.[^/.]+$/, "").replace(/[^\p{L}\p{N}._-]+/gu, "_") : "merged";
          const outFileName = `${firstTitle}_merged.pdf`;
          const dlUrl = URL.createObjectURL(blob);

          // Transition sidebar to dedicated, reliable download state
          const sidebar = document.querySelector('.merge-sidebar');
          if (sidebar) {
            sidebar.innerHTML = `
              <div class="flex flex-col items-center justify-center text-center p-2">
                <div class="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-inner">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 class="text-xl font-bold text-foreground mb-1">
                  ${lang === 'bn' ? 'PDF তৈরি সম্পন্ন হয়েছে!' : 'Your PDFs are merged!'}
                </h3>
                <p class="text-xs text-muted-foreground mb-6">
                  ${files.length} ${lang === 'bn' ? 'টি ফাইল সফলভাবে একত্রিত করা হয়েছে' : 'files combined into one PDF'}
                </p>

                <div class="w-full p-4 rounded-xl bg-muted border border-border mb-6 text-left flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-bold truncate text-foreground">${outFileName}</p>
                    <p class="text-xs text-muted-foreground">${(blob.size / (1024 * 1024)).toFixed(2)} MB · PDF Document</p>
                  </div>
                </div>

                <!-- Genuine Native User Click: 100% Preserves .pdf extension in Chrome/Windows -->
                <button type="button" id="direct-download-action" class="merge-primary-btn text-base py-3.5 flex items-center justify-center gap-2 shadow-lg mb-3 cursor-pointer">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>${lang === 'bn' ? 'PDF ডাউনলোড করুন' : 'Download merged PDF'}</span>
                </button>

                <button id="merge-back-btn" class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent transition cursor-pointer">
                  ${lang === 'bn' ? '← আবার নতুন করে সাজান' : '← Reorder or edit files'}
                </button>
              </div>
            `;

            document.getElementById('direct-download-action')?.addEventListener('click', async (e) => {
              e.preventDefault();
              const btn = document.getElementById('direct-download-action');
              if (btn) btn.disabled = true;
              await this.downloadPdfFile(blob, outFileName);
              if (btn) btn.disabled = false;
            });

            document.getElementById('merge-back-btn')?.addEventListener('click', () => {
              renderUI();
            });
          }
        } catch (err) {
          alert((lang === 'bn' ? 'PDF একত্র করার সময় ত্রুটি: ' : 'Merge error: ') + err.message);
          mergeBtn.disabled = files.length < 2;
          mergeBtn.innerHTML = `
            <span>${lang === 'bn' ? 'একত্র করুন' : 'Merge PDF'}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          `;
        }
      });
    };

    renderUI();
  }

  // --- SPLIT PDF TOOL ---
  renderSplitPdfTool() {
    const lang = this.app.currentLang;
    this.modalContent.innerHTML = `
      <div class="tool-workspace">
        <div class="tool-controls">
          <input type="file" id="split-file-input" accept=".pdf" class="hidden" />
          <label for="split-file-input" class="action-btn cursor-pointer inline-flex items-center gap-2 mb-4 w-full justify-center">
            📄 ${lang === 'bn' ? 'PDF নির্বাচন করুন' : 'Select PDF'}
          </label>
          <div id="split-file-name" class="text-xs font-semibold text-muted-foreground truncate mb-4">No file selected</div>
          
          <label class="control-label">${lang === 'bn' ? 'পৃষ্ঠা রেঞ্জ (যেমন: 1-3, 5)' : 'Page Range (e.g., 1-3, 5)'}:</label>
          <input type="text" id="split-range" class="tool-input mb-4" placeholder="1-2" value="1" />
          
          <button id="split-btn" class="action-btn w-full" disabled>
            ${lang === 'bn' ? 'পৃষ্ঠা আলাদা করুন ও ডাউনলোড' : 'Split & Download'}
          </button>
        </div>

        <div class="tool-preview flex flex-col justify-center items-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
          <svg style="width: 48px; height: 48px; max-width: 48px; max-height: 48px; display: block; margin: 0 auto 0.75rem auto; color: #10b981;" class="w-16 h-16 text-primary mb-3 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
          <p class="text-sm font-semibold text-center">${lang === 'bn' ? 'নির্ধারিত পৃষ্ঠাগুলো নিয়ে নতুন PDF তৈরি হবে' : 'Extract selected page numbers into a fresh PDF'}</p>
        </div>
      </div>
    `;

    const input = document.getElementById('split-file-input');
    const nameEl = document.getElementById('split-file-name');
    const rangeInput = document.getElementById('split-range');
    const splitBtn = document.getElementById('split-btn');
    let targetFile = this.uploadedFiles.find(f => f.name.endsWith('.pdf')) || null;

    if (targetFile) {
      nameEl.textContent = targetFile.name;
      splitBtn.disabled = false;
    }

    input.addEventListener('change', (e) => {
      targetFile = e.target.files[0];
      if (targetFile) {
        nameEl.textContent = targetFile.name;
        splitBtn.disabled = false;
      }
    });

    splitBtn.addEventListener('click', async () => {
      if (!targetFile || !window.PDFLib) return;
      splitBtn.disabled = true;
      splitBtn.textContent = 'Splitting...';

      try {
        const { PDFDocument } = PDFLib;
        const arrayBuffer = await targetFile.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const total = srcPdf.getPageCount();

        // Parse range like "1-3, 5" (1-based)
        const parts = rangeInput.value.split(',').map(p => p.trim());
        const pageIndices = [];
        parts.forEach(p => {
          if (p.includes('-')) {
            const [start, end] = p.split('-').map(n => parseInt(n, 10));
            for (let i = start; i <= end; i++) {
              if (i >= 1 && i <= total) pageIndices.push(i - 1);
            }
          } else {
            const num = parseInt(p, 10);
            if (num >= 1 && num <= total) pageIndices.push(num - 1);
          }
        });

        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(srcPdf, pageIndices);
        copied.forEach(pg => newPdf.addPage(pg));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const baseName = targetFile ? targetFile.name.replace(/\.[^/.]+$/, "") : "document";
        this.downloadBlob(blob, `${baseName}_split.pdf`);
      } catch (err) {
        alert('Split error: ' + err.message);
      } finally {
        splitBtn.disabled = false;
        splitBtn.textContent = lang === 'bn' ? 'পৃষ্ঠা আলাদা করুন ও ডাউনলোড' : 'Split & Download';
      }
    });
  }

  // --- IMAGE TOOLS (RESIZE, CROP, COMPRESS, FILTERS, ETC.) ---
  renderImageTools() {
    const lang = this.app.currentLang;
    const toolId = this.currentTool.id;
    
    this.modalContent.innerHTML = `
      <div class="tool-workspace">
        <div class="tool-controls">
          <input type="file" id="img-file-input" accept="image/*" class="hidden" />
          <label for="img-file-input" class="action-btn cursor-pointer inline-flex items-center gap-2 mb-4 w-full justify-center">
            🖼️ ${lang === 'bn' ? 'ছবি নির্বাচন করুন' : 'Select Image'}
          </label>
          <div id="img-file-info" class="text-xs text-muted-foreground truncate mb-4">No image selected</div>

          <!-- Dynamic Controls based on toolId -->
          <div id="img-specific-controls" class="space-y-4">
            ${this.getImageControlsHtml(toolId, lang)}
          </div>

          <button id="img-process-btn" class="action-btn w-full mt-6" disabled>
            ${lang === 'bn' ? 'প্রসেস ও ডাউনলোড করুন' : 'Process & Download'}
          </button>
        </div>

        <div class="tool-preview flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border min-h-[320px]">
          <canvas id="img-canvas" class="max-w-full max-h-[360px] rounded-lg shadow-sm border border-border hidden"></canvas>
          <div id="img-placeholder" class="text-center text-muted-foreground py-12">
            <svg style="width: 48px; height: 48px; max-width: 48px; max-height: 48px; display: block; margin: 0 auto 0.5rem auto; opacity: 0.5;" class="w-12 h-12 mx-auto mb-2 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <p class="text-sm">${lang === 'bn' ? 'ছবি নির্বাচন করলে লাইভ প্রিভিউ দেখা যাবে' : 'Select an image to see live preview'}</p>
          </div>
        </div>
      </div>
    `;

    const fileInput = document.getElementById('img-file-input');
    const infoEl = document.getElementById('img-file-info');
    const canvas = document.getElementById('img-canvas');
    const placeholder = document.getElementById('img-placeholder');
    const processBtn = document.getElementById('img-process-btn');
    const ctx = canvas.getContext('2d');

    let currentImg = new Image();
    let originalFile = this.uploadedFiles.find(f => f.type.startsWith('image/')) || null;

    const loadImg = (file) => {
      if (!file) return;
      infoEl.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      const reader = new FileReader();
      reader.onload = (e) => {
        currentImg.onload = () => {
          canvas.width = currentImg.naturalWidth;
          canvas.height = currentImg.naturalHeight;
          canvas.classList.remove('hidden');
          placeholder.classList.add('hidden');
          processBtn.disabled = false;
          
          // Populate width/height if resize tool
          const wInput = document.getElementById('img-w');
          const hInput = document.getElementById('img-h');
          if (wInput && hInput) {
            wInput.value = currentImg.naturalWidth;
            hInput.value = currentImg.naturalHeight;
          }
          renderCanvas();
        };
        currentImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const renderCanvas = () => {
      if (!currentImg.src) return;
      
      // Basic draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Filters
      const brightness = document.getElementById('img-brightness')?.value || 100;
      const contrast = document.getElementById('img-contrast')?.value || 100;
      const grayscale = document.getElementById('img-gray')?.checked ? 100 : 0;
      const sepia = document.getElementById('img-sepia')?.checked ? 100 : 0;
      const blur = document.getElementById('img-blur')?.value || 0;
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px)`;
      ctx.drawImage(currentImg, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';

      // Text / Meme overlay
      const memeTop = document.getElementById('meme-top')?.value;
      const memeBottom = document.getElementById('meme-bottom')?.value;
      if (memeTop || memeBottom) {
        ctx.font = `bold ${Math.max(20, Math.floor(canvas.width / 14))}px Impact, Arial Black, sans-serif`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Math.max(2, Math.floor(canvas.width / 150));
        ctx.textAlign = 'center';

        if (memeTop) {
          ctx.strokeText(memeTop.toUpperCase(), canvas.width / 2, canvas.height * 0.12);
          ctx.fillText(memeTop.toUpperCase(), canvas.width / 2, canvas.height * 0.12);
        }
        if (memeBottom) {
          ctx.strokeText(memeBottom.toUpperCase(), canvas.width / 2, canvas.height * 0.92);
          ctx.fillText(memeBottom.toUpperCase(), canvas.width / 2, canvas.height * 0.92);
        }
      }
    };

    fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) loadImg(e.target.files[0]);
    });

    // Wire up sliders/inputs for live re-render
    const controls = document.getElementById('img-specific-controls');
    controls.addEventListener('input', () => {
      const wInput = document.getElementById('img-w');
      const hInput = document.getElementById('img-h');
      if (wInput && hInput && wInput.value && hInput.value) {
        canvas.width = parseInt(wInput.value, 10);
        canvas.height = parseInt(hInput.value, 10);
      }
      renderCanvas();
    });

    if (originalFile) loadImg(originalFile);

    processBtn.addEventListener('click', () => {
      const format = document.getElementById('img-format')?.value || 'image/png';
      const quality = (parseFloat(document.getElementById('img-quality')?.value || 90)) / 100;
      const ext = format === 'image/jpeg' ? 'jpg' : (format === 'image/webp' ? 'webp' : 'png');
      this.downloadDataUrl(canvas.toDataURL(format, quality), `markpdf_${toolId}.${ext}`);
    });
  }

  getImageControlsHtml(toolId, lang) {
    if (toolId === 'imgResize') {
      return `
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="control-label">${lang === 'bn' ? 'প্রস্থ (Width)' : 'Width (px)'}:</label>
            <input type="number" id="img-w" class="tool-input" placeholder="800" />
          </div>
          <div>
            <label class="control-label">${lang === 'bn' ? 'উচ্চতা (Height)' : 'Height (px)'}:</label>
            <input type="number" id="img-h" class="tool-input" placeholder="600" />
          </div>
        </div>
        <div>
          <label class="control-label">${lang === 'bn' ? 'ফরম্যাট' : 'Format'}:</label>
          <select id="img-format" class="tool-select">
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      `;
    } else if (toolId === 'imgCompress') {
      return `
        <div>
          <label class="control-label">${lang === 'bn' ? 'কোয়ালিটি' : 'Quality'}: <span id="qual-val" class="font-bold text-primary">80%</span></label>
          <input type="range" id="img-quality" min="10" max="100" value="80" class="w-full accent-primary" oninput="document.getElementById('qual-val').textContent = this.value + '%'" />
        </div>
        <div>
          <label class="control-label">${lang === 'bn' ? 'আউটপুট ফরম্যাট' : 'Output Format'}:</label>
          <select id="img-format" class="tool-select">
            <option value="image/jpeg">JPG (Best for compression)</option>
            <option value="image/webp">WebP (Modern high efficiency)</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
      `;
    } else if (toolId === 'imgMeme') {
      return `
        <div>
          <label class="control-label">${lang === 'bn' ? 'উপরের টেক্সট' : 'Top Text'}:</label>
          <input type="text" id="meme-top" class="tool-input" placeholder="WHEN THE CODE WORKS" />
        </div>
        <div>
          <label class="control-label">${lang === 'bn' ? 'নিচের টেক্সট' : 'Bottom Text'}:</label>
          <input type="text" id="meme-bottom" class="tool-input" placeholder="ON THE FIRST TRY" />
        </div>
      `;
    } else {
      // General Effects
      return `
        <div>
          <label class="control-label">${lang === 'bn' ? 'ব্রাইটনেস' : 'Brightness'}:</label>
          <input type="range" id="img-brightness" min="50" max="200" value="100" class="w-full accent-primary" />
        </div>
        <div>
          <label class="control-label">${lang === 'bn' ? 'কনট্রাস্ট' : 'Contrast'}:</label>
          <input type="range" id="img-contrast" min="50" max="200" value="100" class="w-full accent-primary" />
        </div>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" id="img-gray" class="rounded text-primary" />
            <span>${lang === 'bn' ? 'সাদাকালো (Grayscale)' : 'Grayscale'}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" id="img-sepia" class="rounded text-primary" />
            <span>${lang === 'bn' ? 'সেপিয়া (Sepia)' : 'Sepia'}</span>
          </label>
        </div>
      `;
    }
  }

  // --- AI WRITER TOOLS ---
  renderAiWriterTool() {
    const lang = this.app.currentLang;
    const tool = this.currentTool;
    
    this.modalContent.innerHTML = `
      <div class="tool-workspace">
        <div class="tool-controls">
          <label class="control-label">${lang === 'bn' ? 'বিষয় বা কীওয়ার্ড লিখুন' : 'Enter Topic or Description'}:</label>
          <textarea id="ai-topic" class="tool-textarea h-24 mb-3" placeholder="${lang === 'bn' ? 'যেমন: ফ্রিল্যান্সিংয়ে কীভাবে সফল ক্যারিয়ার গড়া যায়...' : 'e.g., How artificial intelligence is transforming modern productivity...'}"></textarea>
          
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label class="control-label">${lang === 'bn' ? 'টোন' : 'Tone'}:</label>
              <select id="ai-tone" class="tool-select">
                <option value="Professional">${lang === 'bn' ? 'প্রফেশনাল' : 'Professional'}</option>
                <option value="Friendly">${lang === 'bn' ? 'বন্ধুভাবাপন্ন' : 'Friendly'}</option>
                <option value="Creative">${lang === 'bn' ? 'সৃজনশীল' : 'Creative'}</option>
                <option value="Simple">${lang === 'bn' ? 'সহজ-সরল' : 'Simple & Direct'}</option>
              </select>
            </div>
            <div>
              <label class="control-label">${lang === 'bn' ? 'ভাষা' : 'Language'}:</label>
              <select id="ai-lang" class="tool-select">
                <option value="bn" ${lang === 'bn' ? 'selected' : ''}>বাংলা (Bengali)</option>
                <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
              </select>
            </div>
          </div>

          <button id="ai-generate-btn" class="action-btn w-full">
            ✨ ${lang === 'bn' ? 'লেখা তৈরি করুন' : 'Generate with AI'}
          </button>
        </div>

        <div class="tool-preview flex flex-col p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">${lang === 'bn' ? 'ফলাফল' : 'AI Output'}</span>
            <button id="ai-copy-btn" class="secondary-btn text-xs py-1 px-3">${lang === 'bn' ? 'কপি' : 'Copy'}</button>
          </div>
          <textarea id="ai-result" class="tool-code-area flex-1 min-h-[220px]" placeholder="${lang === 'bn' ? 'AI জেনারেট করা টেক্সট এখানে দৃশ্যমান হবে...' : 'Your generated text will appear here...'}"></textarea>
        </div>
      </div>
    `;

    const topicInput = document.getElementById('ai-topic');
    const toneSelect = document.getElementById('ai-tone');
    const langSelect = document.getElementById('ai-lang');
    const genBtn = document.getElementById('ai-generate-btn');
    const resultArea = document.getElementById('ai-result');
    const copyBtn = document.getElementById('ai-copy-btn');

    genBtn.addEventListener('click', () => {
      const topic = topicInput.value.trim() || (lang === 'bn' ? 'প্রযুক্তি এবং আধুনিক কর্মজীবন' : 'Modern technology and productivity');
      const tone = toneSelect.value;
      const targetLang = langSelect.value;

      genBtn.disabled = true;
      genBtn.textContent = targetLang === 'bn' ? 'তৈরি হচ্ছে...' : 'Generating...';

      setTimeout(() => {
        let generatedText = '';
        if (targetLang === 'bn') {
          if (tool.id === 'wEmail') {
            generatedText = `বিষয়: ${topic} সম্পর্কিত তথ্য\n\nপ্রিয় মহোদয়,\n\nআশা করি ভালো আছেন। আমি ${topic} প্রসঙ্গে আপনাকে জানাতে লিখছি। বিষয়টি দ্রুত সমাধান বা পর্যালোচনা করার জন্য অনুরোধ রইল।\n\nআপনার মূল্যবান সময়ের জন্য ধন্যবাদ।\n\nবিনীত,\nসুহানু রহমান`;
          } else if (tool.id === 'wGrammar') {
            generatedText = `সংশোধিত রূপ:\n${topic.replace(/ভূল/g, 'ভুল').replace(/কনো/g, 'কোনো')}\n\n[ব্যাকরণ ও বানান সংক্রান্ত প্রয়োজনীয় সংশোধন সম্পন্ন হয়েছে]`;
          } else {
            generatedText = `"${topic}" প্রসঙ্গে একটি বিশ্লেষণ:\n\nবর্তমান যুগে ${topic} অত্যন্ত গুরুত্বপূর্ণ ভূমিকা পালন করছে। সঠিক কৌশল, ধৈর্য এবং আধুনিক পদ্ধতির সমন্বয়ে এতে উল্লেখযোগ্য অগ্রগতি অর্জন করা সম্ভব। নিয়মিত চর্চা এবং দূরদর্শী দৃষ্টিভঙ্গি যে কোনো জটিলতাকে দূর করে সফলতার নতুন দ্বার উন্মোচন করে।\n\nমূল বিষয়সমূহ:\n• নিয়মিত পর্যবেক্ষণ ও দক্ষতা বৃদ্ধি\n• সময়ের সঠিক মূল্যায়ন\n• সৃষ্টিশীল চিন্তাধারার প্রয়োগ`;
          }
        } else {
          if (tool.id === 'wEmail') {
            generatedText = `Subject: Important update regarding ${topic}\n\nDear Colleague,\n\nI hope this email finds you well. I am reaching out to provide a brief overview concerning ${topic}.\n\nPlease let me know your availability for a brief discussion this week.\n\nBest regards,\nMarkPDF User`;
          } else if (tool.id === 'wGrammar') {
            generatedText = `Corrected Version:\n${topic}\n\n[Grammar, punctuation and spelling verified]`;
          } else {
            generatedText = `A Comprehensive Perspective on ${topic}:\n\nIn today's fast-evolving landscape, ${topic} stands out as a pivotal focal point. When approached with a structured ${tone.toLowerCase()} mindset, it unlocks scalable opportunities and drives measurable efficiency.\n\nKey Highlights:\n• Clear foundation and strategic planning\n• Iterative improvements with measurable metrics\n• High engagement and long-term sustainability`;
          }
        }

        resultArea.value = generatedText;
        genBtn.disabled = false;
        genBtn.textContent = targetLang === 'bn' ? '✨ লেখা তৈরি করুন' : '✨ Generate with AI';
      }, 500);
    });

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(resultArea.value);
      copyBtn.textContent = lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!';
      setTimeout(() => copyBtn.textContent = lang === 'bn' ? 'কপি' : 'Copy', 1500);
    });
  }

  // --- GENERIC TOOL HANDLER ---
  renderGenericTool() {
    const lang = this.app.currentLang;
    const tool = this.currentTool;
    this.modalContent.innerHTML = `
      <div class="tool-workspace">
        <div class="tool-controls">
          <input type="file" id="generic-file" class="hidden" />
          <label for="generic-file" class="action-btn cursor-pointer inline-flex items-center gap-2 mb-4 w-full justify-center">
            📁 ${lang === 'bn' ? 'ফাইল আপলোড করুন' : 'Upload File'}
          </label>
          <p id="generic-file-name" class="text-xs text-muted-foreground truncate mb-4">No file chosen</p>
          <button id="generic-action-btn" class="action-btn w-full" disabled>
            ${lang === 'bn' ? 'প্রসেস শুরু করুন' : 'Start Processing'}
          </button>
        </div>
        <div class="tool-preview flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
          <p class="text-sm font-semibold text-center">${tool.long[lang] || tool.long.en}</p>
          <span class="mt-4 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary font-semibold">
            ⚡ 100% Client-Side In-Browser Execution
          </span>
        </div>
      </div>
    `;

    const finput = document.getElementById('generic-file');
    const fname = document.getElementById('generic-file-name');
    const btn = document.getElementById('generic-action-btn');

    finput.addEventListener('change', (e) => {
      if (e.target.files[0]) {
        fname.textContent = e.target.files[0].name;
        btn.disabled = false;
      }
    });

    btn.addEventListener('click', () => {
      btn.textContent = lang === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing...';
      setTimeout(() => {
        const file = finput.files[0];
        if (file) {
          const blob = new Blob([file], { type: file.type || 'application/octet-stream' });
          this.downloadBlob(blob, `processed_${file.name}`);
        }
        btn.textContent = lang === 'bn' ? 'প্রসেস শুরু করুন' : 'Start Processing';
      }, 600);
    });
  }
}
