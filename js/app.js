// MarkPDF Main Application Orchestrator

import { ALL_TOOLS, TOOL_GROUPS } from './tools-data.js?v=13.0';
import { translations } from './translations.js?v=13.0';
import { ToolRunner } from './tool-runner.js?v=13.0';

class MarkPDFApp {
  constructor() {
    this.currentLang = localStorage.getItem('markpdf:lang') || 'en';
    this.currentTheme = localStorage.getItem('markpdf:theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.currentFilter = 'popular';
    this.toolRunner = null;
    
    this.init();
  }

  init() {
    this.toolRunner = new ToolRunner(this);
    this.applyTheme(this.currentTheme);
    this.setupThemeToggle();
    this.setupLanguageToggle();
    this.setupBentoPanels();
    this.setupHeroDropzone();
    this.setupCategoryTabs();
    this.setupSearchPalette();
    this.setupNavigationDropdowns();
    this.setupFaqAccordion();
    this.setupTellFriend();
    
    this.updateLanguageUI();
    this.renderToolCards();
  }

  // --- THEME MANAGEMENT ---
  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('markpdf:theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(newTheme);
    });
  }

  // --- LANGUAGE MANAGEMENT ---
  setLanguage(lang) {
    if (this.currentLang === lang) return;
    this.currentLang = lang;
    localStorage.setItem('markpdf:lang', lang);
    this.updateLanguageUI();
    this.renderToolCards();
  }

  setupLanguageToggle() {
    const btnEn = document.getElementById('lang-btn-en');
    const btnBn = document.getElementById('lang-btn-bn');

    if (btnEn && btnBn) {
      btnEn.addEventListener('click', () => this.setLanguage('en'));
      btnBn.addEventListener('click', () => this.setLanguage('bn'));
    }
  }

  get t() {
    return translations[this.currentLang] || translations.en;
  }

  updateLanguageUI() {
    const t = this.t;
    const lang = this.currentLang;

    // Update active state on language buttons
    const btnEn = document.getElementById('lang-btn-en');
    const btnBn = document.getElementById('lang-btn-bn');
    if (btnEn && btnBn) {
      if (lang === 'en') {
        btnEn.classList.add('seg-on');
        btnEn.setAttribute('aria-pressed', 'true');
        btnBn.classList.remove('seg-on');
        btnBn.setAttribute('aria-pressed', 'false');
      } else {
        btnBn.classList.add('seg-on');
        btnBn.setAttribute('aria-pressed', 'true');
        btnEn.classList.remove('seg-on');
        btnEn.setAttribute('aria-pressed', 'false');
      }
    }

    // Header & Brand
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Update Bento titles & tool count suffixes
    const bentoPdfCount = document.getElementById('bento-pdf-count');
    const bentoImgCount = document.getElementById('bento-img-count');
    const bentoAiCount = document.getElementById('bento-ai-count');
    const bentoFileCount = document.getElementById('bento-file-count');

    if (bentoPdfCount) bentoPdfCount.textContent = (lang === 'bn' ? '৪৩' : '43') + ' ' + t.toolsCountSuffix;
    if (bentoImgCount) bentoImgCount.textContent = (lang === 'bn' ? '১৮' : '18') + ' ' + t.toolsCountSuffix;
    if (bentoAiCount) bentoAiCount.textContent = (lang === 'bn' ? '২১' : '21') + ' ' + t.toolsCountSuffix;
    if (bentoFileCount) bentoFileCount.textContent = (lang === 'bn' ? '১৮' : '18') + ' ' + t.toolsCountSuffix;

    // Update FAQ text
    this.renderFaqSection();

    // Update Dropdown Item Titles
    document.querySelectorAll('[data-tool-title]').forEach(el => {
      const toolId = el.getAttribute('data-tool-title');
      const tool = ALL_TOOLS.find(t => t.id === toolId);
      if (tool) {
        el.textContent = tool.title[lang] || tool.title.en;
      }
    });

    // Refresh active panel dropzone text
    this.refreshPanelDropzoneText();
  }

  // --- TOOL CARDS RENDERING ---
  renderToolCards() {
    const container = document.getElementById('tools-grid');
    if (!container) return;
    
    const lang = this.currentLang;
    let filteredTools = ALL_TOOLS;

    if (this.currentFilter === 'popular') {
      filteredTools = ALL_TOOLS.filter(t => t.popular);
    } else if (this.currentFilter !== 'all') {
      filteredTools = ALL_TOOLS.filter(t => t.group === this.currentFilter);
    }

    container.innerHTML = '';

    filteredTools.forEach(tool => {
      const card = document.createElement('div');
      card.className = 'glass glass-hover group flex min-w-0 cursor-pointer flex-col rounded-2xl p-4 transition-all duration-200 border border-border';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const title = tool.title[lang] || tool.title.en;
      const desc = tool.short[lang] || tool.short.en;
      const groupName = this.t[tool.group + 'Tools'] || tool.group;

      card.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="tool-icon-wrapper size-11 rounded-xl flex items-center justify-center shrink-0" style="background: var(--tool-bg, #ecfdf5); color: var(--tool-color, #059669);">
            ${this.getToolIconSvg(tool.icon)}
          </div>
          <div class="min-w-0">
            <h3 class="text-base font-bold leading-tight group-hover:text-primary transition-colors truncate">${title}</h3>
            <span class="mt-0.5 block truncate text-xs font-medium text-muted-foreground">${groupName}</span>
          </div>
        </div>
        <p class="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">${desc}</p>
      `;

      card.addEventListener('click', () => {
        this.toolRunner.open(tool);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toolRunner.open(tool);
        }
      });

      container.appendChild(card);
    });
  }

  getToolIconSvg(iconName) {
    const icons = {
      'edit-3': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
      'combine': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M14 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1"/><path d="M19 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1"/></svg>`,
      'minimize-2': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
      'minimize': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`,
      'file-text': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      'scissors': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
      'pen-tool': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>`,
      'image': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
      'maximize-2': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
      'crop': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>`,
      'edit-2': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
      'repeat': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>`,
      'check-circle-2': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
      'qr-code': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/></svg>`,
      'file-spreadsheet': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/></svg>`,
      'archive': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`,
      'fingerprint': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/></svg>`,
      'key': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`,
      'lock': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      'rotate-cw': `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`
    };

    return icons[iconName] || icons['file-text'];
  }

  // --- BENTO PANELS & CONDITIONAL DROPZONE ---
  setupBentoPanels() {
    this.activePanelCategory = null;
    const tiles = document.querySelectorAll('.bento-tile[data-panel-category]');
    tiles.forEach(tile => {
      const category = tile.getAttribute('data-panel-category');
      
      const activate = () => {
        this.openPanelDropzone(category, true);
      };

      tile.addEventListener('click', activate);
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });

    const closeBtn = document.getElementById('dropzone-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closePanelDropzone());
    }
  }

  openPanelDropzone(category, smoothScroll = true) {
    this.activePanelCategory = category;

    // Highlight active bento tile
    document.querySelectorAll('.bento-tile[data-panel-category]').forEach(tile => {
      if (tile.getAttribute('data-panel-category') === category) {
        tile.classList.add('active-panel');
      } else {
        tile.classList.remove('active-panel');
      }
    });

    // Reveal dropzone section
    const section = document.getElementById('panel-dropzone-section');
    if (section) {
      section.classList.remove('hidden');
    }

    // Refresh dynamic texts for this category
    this.refreshPanelDropzoneText();

    // Synchronize tools filter below
    this.currentFilter = category;
    const tabs = document.querySelectorAll('.category-tab-btn');
    tabs.forEach(t => {
      if (t.getAttribute('data-category') === category) {
        t.classList.add('seg-on');
        t.setAttribute('aria-selected', 'true');
      } else {
        t.classList.remove('seg-on');
        t.setAttribute('aria-selected', 'false');
      }
    });
    this.renderToolCards();

    // Smooth scroll into view
    if (smoothScroll && section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }

  closePanelDropzone() {
    this.activePanelCategory = null;
    const section = document.getElementById('panel-dropzone-section');
    if (section) {
      section.classList.add('hidden');
    }
    document.querySelectorAll('.bento-tile[data-panel-category]').forEach(tile => {
      tile.classList.remove('active-panel');
    });
  }

  refreshPanelDropzoneText() {
    if (!this.activePanelCategory) return;
    const cat = this.activePanelCategory;
    const t = this.t;

    const badge = document.getElementById('dropzone-badge');
    const title = document.getElementById('dropzone-title');
    const desc = document.getElementById('dropzone-desc');
    const btnText = document.getElementById('hero-choose-btn-text');
    const fileInput = document.getElementById('hero-file-input');

    const config = {
      pdf: {
        badge: t.panelPdfBadge,
        title: t.panelPdfTitle,
        desc: t.panelPdfDesc,
        btn: t.panelPdfBtn,
        accept: '.pdf,application/pdf'
      },
      image: {
        badge: t.panelImageBadge,
        title: t.panelImageTitle,
        desc: t.panelImageDesc,
        btn: t.panelImageBtn,
        accept: 'image/*,.jpg,.jpeg,.png,.webp,.svg,.gif'
      },
      write: {
        badge: t.panelAiBadge,
        title: t.panelAiTitle,
        desc: t.panelAiDesc,
        btn: t.panelAiBtn,
        accept: '.txt,.doc,.docx,.pdf,text/*'
      },
      file: {
        badge: t.panelFileBadge,
        title: t.panelFileTitle,
        desc: t.panelFileDesc,
        btn: t.panelFileBtn,
        accept: '*/*'
      }
    };

    const cfg = config[cat] || config.pdf;
    if (badge) badge.textContent = cfg.badge;
    if (title) title.textContent = cfg.title;
    if (desc) desc.textContent = cfg.desc;
    if (btnText) btnText.textContent = cfg.btn;
    if (fileInput) fileInput.setAttribute('accept', cfg.accept);
  }

  // --- HERO DRAG & DROP ZONE ---
  setupHeroDropzone() {
    const dropzone = document.getElementById('hero-dropzone');
    const fileInput = document.getElementById('hero-file-input');
    const chooseBtn = document.getElementById('hero-choose-btn');

    if (!dropzone || !fileInput) return;

    if (chooseBtn) {
      chooseBtn.addEventListener('click', () => fileInput.click());
    }

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleDroppedFiles(e.target.files);
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('border-primary', 'bg-emerald-500/5');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-primary', 'bg-emerald-500/5');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt.files && dt.files.length > 0) {
        this.handleDroppedFiles(dt.files);
      }
    });
  }

  handleDroppedFiles(files) {
    const fileList = Array.from(files);
    const firstFile = fileList[0];
    const name = firstFile.name.toLowerCase();

    // Smart file-type routing
    if (name.endsWith('.pdf')) {
      if (fileList.length > 1) {
        const mergeTool = ALL_TOOLS.find(t => t.id === 'merge');
        this.toolRunner.open(mergeTool, fileList);
      } else {
        const editTool = ALL_TOOLS.find(t => t.id === 'edit');
        this.toolRunner.open(editTool, fileList);
      }
    } else if (name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)) {
      const resizeTool = ALL_TOOLS.find(t => t.id === 'imgResize');
      this.toolRunner.open(resizeTool, fileList);
    } else if (name.endsWith('.csv')) {
      const csvTool = ALL_TOOLS.find(t => t.id === 'csv2json');
      this.toolRunner.open(csvTool, fileList);
    } else if (name.endsWith('.json')) {
      const jsonTool = ALL_TOOLS.find(t => t.id === 'json2csv');
      this.toolRunner.open(jsonTool, fileList);
    } else {
      // Default to compress or generic
      const compressTool = ALL_TOOLS.find(t => t.id === 'compress');
      this.toolRunner.open(compressTool, fileList);
    }
  }

  // --- CATEGORY TABS ---
  setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('seg-on');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('seg-on');
        tab.setAttribute('aria-selected', 'true');
        
        this.currentFilter = tab.getAttribute('data-category');
        this.renderToolCards();
      });
    });
  }

  // --- SEARCH PALETTE ---
  setupSearchPalette() {
    const searchModal = document.getElementById('search-modal');
    const searchTriggerButtons = document.querySelectorAll('.search-trigger-btn');
    const searchInput = document.getElementById('search-palette-input');
    const searchResults = document.getElementById('search-palette-results');
    const searchClose = document.getElementById('search-palette-close');

    if (!searchModal || !searchInput || !searchResults) return;

    const openSearch = () => {
      searchModal.classList.remove('hidden');
      searchInput.value = '';
      this.filterSearchTools('');
      setTimeout(() => searchInput.focus(), 50);
      document.body.style.overflow = 'hidden';
    };

    const closeSearch = () => {
      searchModal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    searchTriggerButtons.forEach(btn => btn.addEventListener('click', openSearch));
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        openSearch();
      } else if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
        closeSearch();
      }
    });

    searchInput.addEventListener('input', (e) => {
      this.filterSearchTools(e.target.value.trim().toLowerCase());
    });
  }

  filterSearchTools(query) {
    const resultsContainer = document.getElementById('search-palette-results');
    const lang = this.currentLang;
    resultsContainer.innerHTML = '';

    const matches = ALL_TOOLS.filter(tool => {
      if (!query) return true;
      const titleEn = (tool.title.en || '').toLowerCase();
      const titleBn = (tool.title.bn || '').toLowerCase();
      const descEn = (tool.short.en || '').toLowerCase();
      const descBn = (tool.short.bn || '').toLowerCase();
      const kw = (tool.keywords || []).map(k => k.toLowerCase()).join(' ');

      return titleEn.includes(query) || titleBn.includes(query) || descEn.includes(query) || descBn.includes(query) || kw.includes(query);
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-8 text-center text-muted-foreground text-sm">
          ${this.t.noResults} "${query}"
        </div>
      `;
      return;
    }

    matches.slice(0, 16).forEach(tool => {
      const item = document.createElement('div');
      item.className = 'search-result-item flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors';
      item.innerHTML = `
        <div class="size-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary">
          ${this.getToolIconSvg(tool.icon)}
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-foreground truncate">${tool.title[lang] || tool.title.en}</h4>
            <span class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">${tool.group}</span>
          </div>
          <p class="text-xs text-muted-foreground truncate">${tool.short[lang] || tool.short.en}</p>
        </div>
      `;

      item.addEventListener('click', () => {
        document.getElementById('search-modal').classList.add('hidden');
        document.body.style.overflow = '';
        this.toolRunner.open(tool);
      });

      resultsContainer.appendChild(item);
    });
  }

  // --- NAVIGATION DROPDOWNS ---
  setupNavigationDropdowns() {
    const navDropdownBtns = document.querySelectorAll('.nav-dropdown-btn');
    navDropdownBtns.forEach(btn => {
      const dropdown = btn.nextElementSibling;
      if (!dropdown) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !dropdown.classList.contains('hidden');
        document.querySelectorAll('.nav-dropdown-menu').forEach(d => d.classList.add('hidden'));
        document.querySelectorAll('.nav-dropdown-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
        if (!isOpen) {
          dropdown.classList.remove('hidden');
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      // Handle clicking on dropdown items
      dropdown.querySelectorAll('.nav-dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.add('hidden');
          btn.setAttribute('aria-expanded', 'false');

          const toolId = item.getAttribute('data-tool');
          if (toolId) {
            const tool = ALL_TOOLS.find(t => t.id === toolId);
            if (tool) {
              this.toolRunner.open(tool);
            }
          }
        });
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.nav-dropdown-menu').forEach(d => d.classList.add('hidden'));
      document.querySelectorAll('.nav-dropdown-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
    });
  }

  // --- FAQ ACCORDION ---
  renderFaqSection() {
    const faqContainer = document.getElementById('faq-accordion-list');
    if (!faqContainer) return;

    const t = this.t;
    faqContainer.innerHTML = '';

    t.faqs.forEach((item, index) => {
      const details = document.createElement('details');
      details.className = 'group border-b border-border py-4 transition-all';
      if (index === 0) details.open = true;

      details.innerHTML = `
        <summary class="flex cursor-pointer items-center justify-between font-semibold text-base sm:text-lg select-none list-none">
          <span>${item.q}</span>
          <svg class="size-5 transition-transform duration-200 group-open:rotate-180 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </summary>
        <p class="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground pr-6">${item.a}</p>
      `;

      faqContainer.appendChild(details);
    });
  }

  setupFaqAccordion() {
    this.renderFaqSection();
  }

  setupTellFriend() {
    const btn = document.getElementById('tell-friend-btn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const shareData = {
        title: 'PDF solution — Free online PDF editor & tools',
        text: 'Check out PDF solution, free client-side PDF and office tools with no watermark or sign-up!',
        url: 'https://abmannan1761.github.io/PDF-solution/'
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (e) {
          if (e.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(shareData.url);
        const span = btn.querySelector('span');
        const orig = span ? span.textContent : '';
        if (span) span.textContent = this.currentLang === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link copied!';
        setTimeout(() => {
          if (span) span.textContent = orig;
        }, 2500);
      } catch (err) {
        prompt('Copy this link:', shareData.url);
      }
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.markPdfApp = new MarkPDFApp();
});
