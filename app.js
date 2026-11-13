/* =========================================================================
   BANASTHALI MART WEB TERMINAL EDITION - ENGINE (app.js)
   100% C++98 Logic Port | Permanent Browser Deployment (GitHub Pages)
   ========================================================================= */

(function () {
  'use strict';

  // CP437 Box-Drawing & Symbol Set (matching main.cpp)
  const D_TL = '╔', D_TR = '╗', D_BL = '╚', D_BR = '╝', D_H = '═', D_V = '║';
  const D_ML = '╠', D_MR = '╣', D_MT = '╦', D_MB = '╩', D_CR = '╬';
  const S_TL = '┌', S_TR = '┐', S_BL = '└', S_BR = '┘', S_H = '─', S_V = '│';
  const S_ML = '├', S_MR = '┤', S_MT = '┬', S_MB = '┴', S_CR = '┼';
  const ICO_ARROW = '►', ICO_BULLET = '■', ICO_STAR = '☼', ICO_CHECK = '√';
  const ICO_CROSS = '×', ICO_DIAMOND = '♦', ICO_HEART = '♥', ICO_CLUB = '♣';
  const ICO_NOTE = '♪', ICO_SUN = '☼', ICO_BLOCK = '█', ICO_HBLOCK = '▄';
  const ICO_SHADE1 = '░', ICO_SHADE2 = '▒', ICO_SHADE3 = '▓';
  const SW = 78; // Screen width

  // Sound generator using Web Audio API (Zero external assets)
  let soundEnabled = true;
  let audioCtx = null;
  function playBeep(freq = 600, duration = 0.05, type = 'square') {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  }

  // Helpers
  function rep(ch, n) { return n > 0 ? ch.repeat(n) : ''; }
  function padRight(s, len) {
    s = String(s);
    return s.length >= len ? s.slice(0, len) : s + ' '.repeat(len - s.length);
  }
  function center(t, w) {
    const pad = Math.max(0, Math.floor((w - t.length) / 2));
    const r = ' '.repeat(pad) + t;
    return padRight(r, w);
  }

  // Model: Student
  class Student {
    constructor(studentId, name, contactInfo, password = '') {
      this.studentId = studentId;
      this.name = name;
      this.contactInfo = contactInfo;
      this.password = password;
    }
    hasPassword() { return Boolean(this.password && this.password.length > 0); }
    verifyPassword(p) { return this.password === p; }
  }

  // Model: Product
  class Product {
    constructor(productId, name, price, sellerId, isSold = false) {
      this.productId = productId;
      this.name = name;
      this.price = parseFloat(price);
      this.sellerId = sellerId;
      this.isSold = Boolean(isSold);
    }
    markAsSold() { this.isSold = true; }
  }

  // Engine State
  class BanasthaliMartEngine {
    constructor() {
      this.students = [];
      this.products = [];
      this.currentUser = null;
      this.historyBuffer = [];

      // State machine for step-by-step inputs
      this.state = 'MAIN_MENU';
      this.inputMode = 'text'; // 'text' or 'password'
      this.tempReg = {};
      this.tempLogin = {};
      this.tempAdd = {};
      this.tempPass = {};

      this.screenElem = document.getElementById('terminalScreen');
      this.promptElem = document.getElementById('inputPrompt');
      this.inputElem = document.getElementById('terminalInput');
      this.actionPadElem = document.getElementById('actionPad');

      this.loadData();
    }

    loadData() {
      try {
        const savedStudents = localStorage.getItem('bm_students_v3');
        const savedProducts = localStorage.getItem('bm_products_v3');

        if (savedStudents) {
          const arr = JSON.parse(savedStudents);
          this.students = arr.map(s => new Student(s.studentId, s.name, s.contactInfo, s.password));
        }
        if (savedProducts) {
          const arr = JSON.parse(savedProducts);
          this.products = arr.map(p => new Product(p.productId, p.name, p.price, p.sellerId, p.isSold));
        }

        // Fresh Seed Data if empty
        if (this.students.length === 0) {
          this.students = [
            new Student('BT2026001', 'Janhavi Yadav', 'janhavi@banasthali.in', 'janhavi123'),
            new Student('BT2026042', 'Priya Sharma', 'priya@banasthali.in', 'priya123'),
            new Student('BT2026108', 'Ananya Gupta', 'ananya@banasthali.in', 'ananya123')
          ];
          this.products = [
            new Product('P101', 'Data Structures in C++', 350.00, 'BT2026001', false),
            new Product('P102', 'Scientific Calculator fx-991EX', 750.00, 'BT2026042', false),
            new Product('P103', 'Mini Drafter with Case', 450.00, 'BT2026001', false),
            new Product('P104', 'Lab Coat / Apron (Size M)', 200.00, 'BT2026108', true),
            new Product('P105', 'Digital Multimeter DT830D', 280.00, 'BT2026042', false)
          ];
          this.saveData();
        }
      } catch (e) {
        console.error('Storage error:', e);
      }
    }

    saveData() {
      try {
        localStorage.setItem('bm_students_v3', JSON.stringify(this.students));
        localStorage.setItem('bm_products_v3', JSON.stringify(this.products));
      } catch (e) {
        console.error('Save failed:', e);
      }
    }

    findStudent(id) {
      return this.students.find(s => s.studentId.toUpperCase() === id.toUpperCase()) || null;
    }

    // Screen Render Methods
    clear() {
      this.screenElem.innerHTML = '';
    }

    printRaw(html) {
      const span = document.createElement('span');
      span.innerHTML = html;
      this.screenElem.appendChild(span);
      this.screenElem.scrollTop = this.screenElem.scrollHeight;
    }

    println(text = '', colorClass = 'c-bwht', bgClass = '') {
      const cls = `${colorClass} ${bgClass}`.trim();
      this.printRaw(`<span class="${cls}">${this.escapeHtml(text)}</span>\n`);
    }

    escapeHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    // UI Box Components
    dTop(color = 'c-bylw') {
      this.println('  ' + D_TL + rep(D_H, SW - 2) + D_TR, color);
    }
    dBot(color = 'c-bylw') {
      this.println('  ' + D_BL + rep(D_H, SW - 2) + D_BR, color);
    }
    dEmpty(color = 'c-bylw') {
      this.println('  ' + D_V + ' '.repeat(SW - 2) + D_V, color);
    }
    dMid(color = 'c-bylw') {
      this.println('  ' + D_ML + rep(D_H, SW - 2) + D_MR, color);
    }
    dRow(t, borderC = 'c-bylw', textC = 'c-bwht', isCentered = false) {
      const inner = isCentered ? center(t, SW - 4) : padRight('  ' + t, SW - 4);
      this.printRaw(`  <span class="${borderC}">${D_V}</span> <span class="${textC}">${this.escapeHtml(inner)}</span> <span class="${borderC}">${D_V}</span>\n`);
    }

    secTitle(t, color = 'c-bcyn') {
      const line = '  ' + ICO_DIAMOND + '  ' + t + '  ' + rep(S_H, Math.max(0, SW - 8 - t.length));
      this.println(line, color);
    }

    promptLine(label) {
      this.promptElem.innerText = `  ${label.padEnd(28)} : `;
      this.inputElem.value = '';
      this.inputElem.focus();
    }

    showSuccess(msg) {
      this.println(`  ${S_TL}${rep(S_H, SW-2)}${S_TR}`, 'c-bgrn');
      this.println(`  ${S_V}   ${ICO_CHECK}  SUCCESS  :  ${padRight(msg, SW - 20)}${S_V}`, 'c-bgrn');
      this.println(`  ${S_BL}${rep(S_H, SW-2)}${S_BR}`, 'c-bgrn');
      playBeep(880, 0.08);
    }

    showError(msg) {
      this.println(`  ${S_TL}${rep(S_H, SW-2)}${S_TR}`, 'c-bred');
      this.println(`  ${S_V}   ${ICO_CROSS}  ERROR    :  ${padRight(msg, SW - 20)}${S_V}`, 'c-bred');
      this.println(`  ${S_BL}${rep(S_H, SW-2)}${S_BR}`, 'c-bred');
      playBeep(240, 0.12, 'sawtooth');
    }

    showInfo(msg) {
      this.println(`  ${S_TL}${rep(S_H, SW-2)}${S_TR}`, 'c-bcyn');
      this.println(`  ${S_V}   ${ICO_DIAMOND}  INFO     :  ${padRight(msg, SW - 20)}${S_V}`, 'c-bcyn');
      this.println(`  ${S_BL}${rep(S_H, SW-2)}${S_BR}`, 'c-bcyn');
    }

    setQuickButtons(buttons) {
      this.actionPadElem.innerHTML = '<span class="action-pad-label">Quick Actions:</span>';
      buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.className = `action-btn ${b.class || ''}`;
        btn.innerText = b.label;
        btn.onclick = () => {
          this.inputElem.value = b.value;
          this.handleInput(b.value);
        };
        this.actionPadElem.appendChild(btn);
      });
    }

    // Startup Animation & Banner
    splashScreen(onComplete) {
      this.clear();
      this.println('  ' + rep(ICO_SHADE3, SW), 'c-gry');
      this.println('  ' + rep(ICO_SHADE3, SW), 'c-gry');

      this.dTop('c-bylw');
      this.dEmpty('c-bylw');

      const banner = [
        " ____    _    _   _    _    ____ _____ _   _    _    _     ___ ",
        "| __ )  / \\  | \\ | |  / \\  / ___|_   _| | | |  / \\  | |   |_ _|",
        "|  _ \\ / _ \\ |  \\| | / _ \\ \\___ \\ | | | |_| | / _ \\ | |    | | ",
        "| |_) / ___ \\| |\\  |/ ___ \\ ___) || | |  _  |/ ___ \\| |___ | | ",
        "|____/_/   \\_\\_| \\_/_/   \\_\\____/ |_| |_| |_/_/   \\_\\_____|___|"
      ];
      banner.forEach(l => {
        this.printRaw(`  <span class="c-bylw">${D_V}</span>   <span class="c-bcyn">${this.escapeHtml(padRight(l, SW - 8))}</span>   <span class="c-bylw">${D_V}</span>\n`);
      });

      this.dMid('c-bylw');
      const banner2 = [
        " __  __    _    ____ _____      __   ___    ___ ",
        "|  \\/  |  / \\  |  _ \\_   _|    \\ \\ / / \\  / _ \\",
        "| |\\/| | / _ \\ | |_) || |       \\ V / _ \\| | | |",
        "| |  | |/ ___ \\|  _ < | |        | / ___ \\ |_| |",
        "|_|  |_/_/   \\_\\_| \\_\\|_|        |_/_/   \\_\\___/ "
      ];
      banner2.forEach(l => {
        this.printRaw(`  <span class="c-bylw">${D_V}</span>   <span class="c-bmag">${this.escapeHtml(padRight(l, SW - 8))}</span>   <span class="c-bylw">${D_V}</span>\n`);
      });

      this.dMid('c-bylw');
      this.dRow(`  ${ICO_DIAMOND}  Language : C++98         ${ICO_DIAMOND}  Version : 3.0           ${ICO_DIAMOND}  College : Banasthali Vidyapith`, 'c-bylw', 'c-gry');
      this.dRow(`  ${ICO_STAR}  Features : Login | Password | My Products | Buy/Sell | Search | Colors`, 'c-bylw', 'c-bwht');
      this.dEmpty('c-bylw');
      this.dBot('c-bylw');
      this.println('  ' + rep(ICO_SHADE3, SW), 'c-gry');
      this.println('');

      this.println('    Initializing Banasthali_Mart...', 'c-bwht');
      playBeep(440, 0.05);

      setTimeout(() => {
        this.println('  >> Loading student database...', 'c-bcyn');
        this.println('  >> Loading product catalog...', 'c-bcyn');
        this.println('  >> Setting up secure session...', 'c-bcyn');
        this.println('  >> Initializing marketplace engine...', 'c-bcyn');
        this.println('  >> System ready!\n', 'c-bgrn');
        playBeep(660, 0.06);
        setTimeout(() => onComplete(), 700);
      }, 500);
    }

    // Main Menu
    showMainMenu() {
      this.state = 'MAIN_MENU';
      this.inputElem.type = 'text';
      this.clear();

      this.println('  ' + rep(ICO_SHADE3, SW), 'c-gry');
      this.dTop('c-bylw');
      this.dEmpty('c-bylw');
      this.printRaw(`  <span class="c-bylw">${D_V}</span>  <span class="c-bylw">${ICO_BLOCK}</span><span class="c-bcyn">${ICO_BLOCK}</span> <span class="c-bcyn">${center('B A N A S T H A L I _ M A R T   v3.0', SW - 14)}</span> <span class="c-bcyn">${ICO_BLOCK}</span><span class="c-bylw">${ICO_BLOCK}</span>  <span class="c-bylw">${D_V}</span>\n`);
      this.dRow('Campus Buy & Sell Marketplace  ~  Banasthali Vidyapith', 'c-bylw', 'c-bwht', true);
      this.dRow(`${ICO_DIAMOND}  by JANHAVI YADAV  ${ICO_DIAMOND}`, 'c-bylw', 'c-gry', true);
      this.dEmpty('c-bylw');
      this.dBot('c-bylw');
      this.println('  ' + rep(ICO_SHADE1, SW), 'c-gry');
      this.println('');

      this.println(`  ${S_TL}${rep(S_H, SW - 2)}${S_TR}`, 'c-bylw');
      this.println(`  ${S_V} ${ICO_STAR} ACCOUNT   (All features require registration & login)${' '.repeat(SW - 59)}${S_V}`, 'c-bylw');
      this.println(`  ${S_ML}${rep(S_H, SW - 2)}${S_MR}`, 'c-bylw');
      this.printRaw(`  <span class="c-bylw">${S_V}</span>   <span class="c-bylw">[1]</span>  <span class="c-bwht">${ICO_ARROW}  Register as New Student</span>  <span class="c-gry">(Password set during registration)</span>${' '.repeat(11)}<span class="c-bylw">${S_V}</span>\n`);
      this.printRaw(`  <span class="c-bylw">${S_V}</span>   <span class="c-bgrn">[2]</span>  <span class="c-bwht">${ICO_ARROW}  Login to Your Account</span>  <span class="c-gry">(Student ID + Password required)</span>${' '.repeat(13)}<span class="c-bylw">${S_V}</span>\n`);

      this.println(`  ${S_ML}${rep(S_H, SW - 2)}${S_MR}`, 'c-bcyn');
      this.println(`  ${S_V} ${ICO_DIAMOND} NOTICE${' '.repeat(SW - 11)}${S_V}`, 'c-bcyn');
      this.println(`  ${S_ML}${rep(S_H, SW - 2)}${S_MR}`, 'c-bcyn');
      this.println(`  ${S_V}   All marketplace features (Browse, Buy, Sell, Search) are${' '.repeat(SW - 62)}${S_V}`, 'c-bcyn');
      this.println(`  ${S_V}   available only after login. Please register or login first!${' '.repeat(SW - 65)}${S_V}`, 'c-bcyn');

      this.println(`  ${S_ML}${rep(S_H, SW - 2)}${S_MR}`, 'c-bred');
      this.println(`  ${S_V} ${ICO_STAR} EXIT${' '.repeat(SW - 9)}${S_V}`, 'c-bred');
      this.println(`  ${S_ML}${rep(S_H, SW - 2)}${S_MR}`, 'c-bred');
      this.printRaw(`  <span class="c-bred">${S_V}</span>   <span class="c-bylw">[3]</span>  <span class="c-bwht">${ICO_ARROW}  Exit / Reset Terminal</span>${' '.repeat(41)}<span class="c-bred">${S_V}</span>\n`);
      this.println(`  ${S_BL}${rep(S_H, SW - 2)}${S_BR}\n`, 'c-bred');

      this.promptLine('Your Choice');
      this.setQuickButtons([
        { label: '[1] Register as New Student', value: '1', class: 'accent-yellow' },
        { label: '[2] Login to Account', value: '2', class: 'accent-green' },
        { label: '[3] Reset Terminal', value: '3', class: 'accent-cyan' }
      ]);
    }

    // Student Dashboard
    showDashboard() {
      this.state = 'DASHBOARD';
      this.inputElem.type = 'text';
      this.clear();

      this.println('  ' + rep(ICO_SHADE3, SW), 'c-gry');
      this.dTop('c-bgrn');
      this.dEmpty('c-bgrn');
      this.printRaw(`  <span class="c-bgrn">${D_V}</span> <span class="c-bgrn">${center('STUDENT MARKETPLACE DASHBOARD', SW - 4)}</span> <span class="c-bgrn">${D_V}</span>\n`);
      this.dRow(`Logged in as : ${this.currentUser.name}  [${this.currentUser.studentId}]`, 'c-bgrn', 'c-bylw', true);
      this.dRow(`Contact : ${this.currentUser.contactInfo}`, 'c-bgrn', 'c-gry', true);
      this.dEmpty('c-bgrn');
      this.dBot('c-bgrn');
      this.println('  ' + rep(ICO_SHADE1, SW), 'c-gry');
      this.println('');

      this.println(`  ${S_TL}${rep(S_H, SW - 2)}${S_TR}`, 'c-bcyn');
      this.println(`  ${S_V} ${ICO_STAR} MARKETPLACE ACTIONS${' '.repeat(SW - 24)}${S_V}`, 'c-bcyn');
      this.println(`  ${S_ML}${rep(S_H, SW - 2)}${S_MR}`, 'c-bcyn');
      this.println(`  ${S_V}   [1]  ${ICO_ARROW}  Browse All Products in Marketplace${' '.repeat(SW - 45)}${S_V}`, 'c-bwht');
      this.println(`  ${S_V}   [2]  ${ICO_ARROW}  Buy a Product${' '.repeat(SW - 25)}${S_V}`, 'c-bgrn');
      this.println(`  ${S_V}   [3]  ${ICO_ARROW}  Sell / List a Product${' '.repeat(SW - 32)}${S_V}`, 'c-bylw');
      this.println(`  ${S_V}   [4]  ${ICO_ARROW}  Search Products by Keyword${' '.repeat(SW - 37)}${S_V}`, 'c-bcyn');
      this.println(`  ${S_V}   [5]  ${ICO_ARROW}  My Products & Sales Dashboard${' '.repeat(SW - 40)}${S_V}`, 'c-bmag');
      this.println(`  ${S_V}   [6]  ${ICO_ARROW}  View Student Directory${' '.repeat(SW - 34)}${S_V}`, 'c-bwht');
      this.println(`  ${S_V}   [7]  ${ICO_ARROW}  Change My Password${' '.repeat(SW - 30)}${S_V}`, 'c-bylw');
      this.println(`  ${S_ML}${rep(S_H, SW - 2)}${S_MR}`, 'c-bred');
      this.println(`  ${S_V}   [8]  ${ICO_ARROW}  Logout from Account${' '.repeat(SW - 31)}${S_V}`, 'c-bred');
      this.println(`  ${S_BL}${rep(S_H, SW - 2)}${S_BR}\n`, 'c-bred');

      this.promptLine('Your Choice');
      this.setQuickButtons([
        { label: '[1] Browse', value: '1', class: 'accent-cyan' },
        { label: '[2] Buy', value: '2', class: 'accent-green' },
        { label: '[3] Sell', value: '3', class: 'accent-yellow' },
        { label: '[4] Search', value: '4' },
        { label: '[5] My Listings', value: '5' },
        { label: '[6] Directory', value: '6' },
        { label: '[7] Password', value: '7' },
        { label: '[8] Logout', value: '8' }
      ]);
    }

    // Browse Table
    renderProductTable(list, borderColor = 'c-bcyn') {
      this.println(`  ${D_TL}${rep(D_H, 10)}${D_MT}${rep(D_H, 24)}${D_MT}${rep(D_H, 14)}${D_MT}${rep(D_H, 12)}${D_MT}${rep(D_H, 12)}${D_TR}`, borderColor);
      this.println(`  ${D_V} Prod.ID   ${D_V} Product Name            ${D_V} Price        ${D_V} Seller      ${D_V} Status     ${D_V}`, 'c-bylw');
      this.println(`  ${D_ML}${rep(D_H, 10)}${D_CR}${rep(D_H, 24)}${D_CR}${rep(D_H, 14)}${D_CR}${rep(D_H, 12)}${D_CR}${rep(D_H, 12)}${D_MR}`, borderColor);

      list.forEach(p => {
        const idCol = padRight(' ' + p.productId, 10);
        const nameCol = padRight(' ' + p.name, 24);
        const priceCol = padRight(' Rs.' + p.price.toFixed(2), 14);
        const sellerCol = padRight(' ' + p.sellerId, 12);
        const statusCol = p.isSold ? '  SOLD     ' : ' Available ';
        const statusCls = p.isSold ? 'c-bred' : 'c-bgrn';

        this.printRaw(`  <span class="${borderColor}">${D_V}</span><span class="c-bwht">${this.escapeHtml(idCol)}</span><span class="${borderColor}">${D_V}</span><span class="c-bwht">${this.escapeHtml(nameCol)}</span><span class="${borderColor}">${D_V}</span><span class="c-bylw">${this.escapeHtml(priceCol)}</span><span class="${borderColor}">${D_V}</span><span class="c-gry">${this.escapeHtml(sellerCol)}</span><span class="${borderColor}">${D_V}</span><span class="${statusCls}">${this.escapeHtml(statusCol)}</span><span class="${borderColor}">${D_V}</span>\n`);
      });

      this.println(`  ${D_BL}${rep(D_H, 10)}${D_MB}${rep(D_H, 24)}${D_MB}${rep(D_H, 14)}${D_MB}${rep(D_H, 12)}${D_MB}${rep(D_H, 12)}${D_BR}`, borderColor);
    }

    // Input Controller
    handleInput(rawVal) {
      const val = rawVal.trim();
      this.println(`  >> ${this.inputMode === 'password' ? '••••••••' : val}`, 'c-gry');

      switch (this.state) {
        case 'MAIN_MENU':
          if (val === '1') {
            this.state = 'REG_ID';
            this.tempReg = {};
            this.clear();
            this.secTitle('NEW STUDENT REGISTRATION - STEP 1 OF 2', 'c-bcyn');
            this.promptLine('Enter Student ID (e.g. BT2026099)');
            this.setQuickButtons([]);
          } else if (val === '2') {
            this.state = 'LOGIN_ID';
            this.tempLogin = {};
            this.clear();
            this.secTitle('SECURE STUDENT LOGIN', 'c-bgrn');
            this.promptLine('Enter Student ID');
            this.setQuickButtons([
              { label: 'Demo: BT2026001', value: 'BT2026001', class: 'accent-yellow' }
            ]);
          } else if (val === '3') {
            this.splashScreen(() => this.showMainMenu());
          } else {
            this.showError('Invalid choice! Please enter 1, 2, or 3.');
            this.promptLine('Your Choice');
          }
          break;

        // Registration Flow
        case 'REG_ID':
          if (!val) { this.showError('ID cannot be empty!'); this.promptLine('Enter Student ID'); return; }
          if (this.findStudent(val)) {
            this.showError(`Student ID '${val}' is already registered!`);
            setTimeout(() => this.showMainMenu(), 1500);
            return;
          }
          this.tempReg.id = val;
          this.state = 'REG_NAME';
          this.promptLine('Enter Full Name');
          break;

        case 'REG_NAME':
          if (!val) { this.showError('Name cannot be empty!'); this.promptLine('Enter Full Name'); return; }
          this.tempReg.name = val;
          this.state = 'REG_CONTACT';
          this.promptLine('Enter Contact Info (Email or Phone)');
          break;

        case 'REG_CONTACT':
          if (!val) { this.showError('Contact cannot be empty!'); this.promptLine('Enter Contact Info'); return; }
          this.tempReg.contact = val;
          this.state = 'REG_PASS1';
          this.inputMode = 'password';
          this.inputElem.type = 'password';
          this.println('');
          this.secTitle('STEP 2 OF 2 - CREATE MANDATORY PASSWORD', 'c-bmag');
          this.promptLine('Create Password');
          break;

        case 'REG_PASS1':
          if (!val) { this.showError('Password cannot be empty!'); this.promptLine('Create Password'); return; }
          this.tempReg.pass = val;
          this.state = 'REG_PASS2';
          this.promptLine('Confirm Password');
          break;

        case 'REG_PASS2':
          if (val !== this.tempReg.pass) {
            this.showError('Passwords do not match! Try again.');
            this.state = 'REG_PASS1';
            this.promptLine('Create Password');
            return;
          }
          this.inputMode = 'text';
          this.inputElem.type = 'text';
          const newStudent = new Student(this.tempReg.id, this.tempReg.name, this.tempReg.contact, val);
          this.students.push(newStudent);
          this.saveData();
          this.showSuccess(`'${this.tempReg.name}' registered successfully! You can now login.`);
          setTimeout(() => this.showMainMenu(), 1800);
          break;

        // Login Flow
        case 'LOGIN_ID':
          const s = this.findStudent(val);
          if (!s) {
            this.showError('Student ID not found in database!');
            setTimeout(() => this.showMainMenu(), 1500);
            return;
          }
          this.tempLogin.student = s;
          this.state = 'LOGIN_PASS';
          this.inputMode = 'password';
          this.inputElem.type = 'password';
          this.promptLine('Enter Password');
          if (s.studentId === 'BT2026001') {
            this.setQuickButtons([{ label: 'Demo Password: janhavi123', value: 'janhavi123', class: 'accent-yellow' }]);
          } else {
            this.setQuickButtons([]);
          }
          break;

        case 'LOGIN_PASS':
          this.inputMode = 'text';
          this.inputElem.type = 'text';
          if (!this.tempLogin.student.verifyPassword(val)) {
            this.showError('Incorrect password! Access denied.');
            setTimeout(() => this.showMainMenu(), 1600);
            return;
          }
          this.currentUser = this.tempLogin.student;
          this.showSuccess(`Welcome back, ${this.currentUser.name}!`);
          setTimeout(() => this.showDashboard(), 1200);
          break;

        // Dashboard Router
        case 'DASHBOARD':
          if (val === '1') {
            // Browse All Products
            this.clear();
            this.secTitle('ALL MARKETPLACE PRODUCTS', 'c-bcyn');
            this.renderProductTable(this.products);
            this.promptLine('Press Enter to Return');
            this.state = 'WAIT_RETURN';
            this.setQuickButtons([{ label: 'Return to Dashboard', value: 'enter', class: 'accent-cyan' }]);
          } else if (val === '2') {
            // Buy Product
            this.clear();
            this.secTitle('BUY A PRODUCT (Available items from other students)', 'c-bgrn');
            const available = this.products.filter(p => !p.isSold && p.sellerId !== this.currentUser.studentId);
            if (available.length === 0) {
              this.showInfo('No available products listed by other students right now.');
              this.promptLine('Press Enter to Return');
              this.state = 'WAIT_RETURN';
              this.setQuickButtons([{ label: 'Return to Dashboard', value: 'enter', class: 'accent-cyan' }]);
            } else {
              this.renderProductTable(available, 'c-bgrn');
              this.state = 'BUY_ID';
              this.promptLine('Enter Product ID to Buy');
              this.setQuickButtons(available.map(p => ({ label: `Buy ${p.productId} (${p.name.slice(0, 14)})`, value: p.productId })));
            }
          } else if (val === '3') {
            // Sell Product
            this.clear();
            this.secTitle('SELL / LIST A PRODUCT', 'c-bylw');
            this.println(`  Seller ID : ${this.currentUser.studentId} (${this.currentUser.name})`, 'c-bcyn');
            this.state = 'SELL_ID';
            this.tempAdd = { sellerId: this.currentUser.studentId };
            const nextId = 'P' + (100 + this.products.length + 1);
            this.promptLine(`Enter Product ID (or accept ${nextId})`);
            this.setQuickButtons([{ label: `Use ID ${nextId}`, value: nextId, class: 'accent-yellow' }]);
          } else if (val === '4') {
            // Search
            this.clear();
            this.secTitle('SEARCH PRODUCTS BY KEYWORD', 'c-bcyn');
            this.state = 'SEARCH_QUERY';
            this.promptLine('Enter keyword to search');
            this.setQuickButtons([]);
          } else if (val === '5') {
            // My Products
            this.clear();
            this.secTitle('MY PRODUCT LISTINGS & STATS', 'c-bmag');
            const myItems = this.products.filter(p => p.sellerId === this.currentUser.studentId);
            if (myItems.length === 0) {
              this.showInfo("You have not listed any products yet. Use Option [3] to sell!");
            } else {
              this.renderProductTable(myItems, 'c-bmag');
              const sold = myItems.filter(p => p.isSold);
              const avail = myItems.filter(p => !p.isSold);
              const earnings = sold.reduce((sum, p) => sum + p.price, 0);
              this.println(`  Total Listed: ${myItems.length}  |  Available: ${avail.length}  |  Sold: ${sold.length}  |  Earnings: Rs.${earnings.toFixed(2)}`, 'c-bylw');
            }
            this.promptLine('Press Enter to Return');
            this.state = 'WAIT_RETURN';
            this.setQuickButtons([{ label: 'Return to Dashboard', value: 'enter', class: 'accent-cyan' }]);
          } else if (val === '6') {
            // Directory
            this.clear();
            this.secTitle('BANASTHALI STUDENT DIRECTORY', 'c-bwht');
            this.println(`  ${D_TL}${rep(D_H, 14)}${D_MT}${rep(D_H, 26)}${D_MT}${rep(D_H, 32)}${D_TR}`, 'c-bcyn');
            this.println(`  ${D_V} Student ID   ${D_V} Full Name                ${D_V} Contact Information            ${D_V}`, 'c-bylw');
            this.println(`  ${D_ML}${rep(D_H, 14)}${D_CR}${rep(D_H, 26)}${D_CR}${rep(D_H, 32)}${D_MR}`, 'c-bcyn');
            this.students.forEach(s => {
              this.println(`  ${D_V} ${padRight(s.studentId, 12)} ${D_V} ${padRight(s.name, 24)} ${D_V} ${padRight(s.contactInfo, 30)} ${D_V}`, 'c-bwht');
            });
            this.println(`  ${D_BL}${rep(D_H, 14)}${D_MB}${rep(D_H, 26)}${D_MB}${rep(D_H, 32)}${D_BR}\n`, 'c-bcyn');
            this.promptLine('Press Enter to Return');
            this.state = 'WAIT_RETURN';
            this.setQuickButtons([{ label: 'Return to Dashboard', value: 'enter', class: 'accent-cyan' }]);
          } else if (val === '7') {
            // Change Password
            this.clear();
            this.secTitle('CHANGE PASSWORD', 'c-bylw');
            this.state = 'CHPASS_OLD';
            this.inputMode = 'password';
            this.inputElem.type = 'password';
            this.promptLine('Enter Current Password');
            this.setQuickButtons([]);
          } else if (val === '8') {
            // Logout
            this.currentUser = null;
            this.showSuccess('Logged out successfully. See you again!');
            setTimeout(() => this.showMainMenu(), 1400);
          } else {
            this.showError('Invalid option! Enter 1-8.');
            this.promptLine('Your Choice');
          }
          break;

        // Buy Flow
        case 'BUY_ID':
          const prodToBuy = this.products.find(p => p.productId.toUpperCase() === val.toUpperCase());
          if (!prodToBuy) {
            this.showError('Product ID not found!');
            this.promptLine('Enter Product ID to Buy');
            return;
          }
          if (prodToBuy.isSold) {
            this.showError('This product has already been sold!');
            setTimeout(() => this.showDashboard(), 1500);
            return;
          }
          if (prodToBuy.sellerId === this.currentUser.studentId) {
            this.showError('You cannot buy your own product!');
            setTimeout(() => this.showDashboard(), 1500);
            return;
          }
          prodToBuy.markAsSold();
          this.saveData();

          this.clear();
          this.println(`  ${D_TL}${rep(D_H, 50)}${D_TR}`, 'c-bylw');
          this.println(`  ${D_V} ${center(ICO_STAR + ' PURCHASE RECEIPT ' + ICO_STAR, 48)} ${D_V}`, 'c-bylw');
          this.println(`  ${D_ML}${rep(D_H, 50)}${D_MR}`, 'c-bylw');
          this.println(`  ${D_V}  Product   : ${padRight(prodToBuy.name, 35)} ${D_V}`, 'c-bwht');
          this.println(`  ${D_V}  Price     : Rs.${padRight(prodToBuy.price.toFixed(2), 33)} ${D_V}`, 'c-bgrn');
          this.println(`  ${D_V}  Buyer     : ${padRight(this.currentUser.name, 35)} ${D_V}`, 'c-bwht');
          this.println(`  ${D_V}  Seller ID : ${padRight(prodToBuy.sellerId, 35)} ${D_V}`, 'c-bwht');
          this.println(`  ${D_ML}${rep(D_H, 50)}${D_MR}`, 'c-bylw');
          this.println(`  ${D_V}  ${center('Contact seller to collect your item!', 48)} ${D_V}`, 'c-bcyn');
          this.println(`  ${D_BL}${rep(D_H, 50)}${D_BR}\n`, 'c-bylw');
          this.showSuccess(`Purchase successful for Rs.${prodToBuy.price.toFixed(2)}!`);

          this.promptLine('Press Enter to Return');
          this.state = 'WAIT_RETURN';
          this.setQuickButtons([{ label: 'Return to Dashboard', value: 'enter', class: 'accent-cyan' }]);
          break;

        // Sell Flow
        case 'SELL_ID':
          if (!val) { this.showError('Product ID required!'); return; }
          if (this.products.find(p => p.productId.toUpperCase() === val.toUpperCase())) {
            this.showError(`Product ID '${val}' is already used. Pick a different ID.`);
            return;
          }
          this.tempAdd.id = val;
          this.state = 'SELL_NAME';
          this.promptLine('Enter Product Name');
          break;

        case 'SELL_NAME':
          if (!val) { this.showError('Name cannot be empty!'); return; }
          this.tempAdd.name = val;
          this.state = 'SELL_PRICE';
          this.promptLine('Enter Price in Rs.');
          break;

        case 'SELL_PRICE':
          const pr = parseFloat(val);
          if (isNaN(pr) || pr <= 0) {
            this.showError('Please enter a valid price greater than 0!');
            this.promptLine('Enter Price in Rs.');
            return;
          }
          const newP = new Product(this.tempAdd.id, this.tempAdd.name, pr, this.tempAdd.sellerId, false);
          this.products.push(newP);
          this.saveData();
          this.showSuccess(`'${this.tempAdd.name}' listed for sale at Rs.${pr.toFixed(2)}!`);
          setTimeout(() => this.showDashboard(), 1600);
          break;

        // Search Flow
        case 'SEARCH_QUERY':
          this.clear();
          this.secTitle(`SEARCH RESULTS FOR "${val}"`, 'c-bcyn');
          const matched = this.products.filter(p => 
            p.name.toLowerCase().includes(val.toLowerCase()) || 
            p.productId.toLowerCase().includes(val.toLowerCase()) ||
            p.sellerId.toLowerCase().includes(val.toLowerCase())
          );
          if (matched.length === 0) {
            this.showInfo(`No products matching '${val}' found.`);
          } else {
            this.renderProductTable(matched, 'c-bcyn');
            this.println(`  Found ${matched.length} matching product(s).`, 'c-bgrn');
          }
          this.promptLine('Press Enter to Return');
          this.state = 'WAIT_RETURN';
          this.setQuickButtons([{ label: 'Return to Dashboard', value: 'enter', class: 'accent-cyan' }]);
          break;

        // Change Password Flow
        case 'CHPASS_OLD':
          if (!this.currentUser.verifyPassword(val)) {
            this.showError('Current password incorrect!');
            this.inputMode = 'text';
            this.inputElem.type = 'text';
            setTimeout(() => this.showDashboard(), 1500);
            return;
          }
          this.state = 'CHPASS_NEW1';
          this.promptLine('Enter New Password');
          break;

        case 'CHPASS_NEW1':
          if (!val) { this.showError('New password cannot be empty!'); return; }
          this.tempPass.new1 = val;
          this.state = 'CHPASS_NEW2';
          this.promptLine('Confirm New Password');
          break;

        case 'CHPASS_NEW2':
          this.inputMode = 'text';
          this.inputElem.type = 'text';
          if (val !== this.tempPass.new1) {
            this.showError('New passwords do not match! Password not changed.');
            setTimeout(() => this.showDashboard(), 1600);
            return;
          }
          this.currentUser.password = val;
          this.saveData();
          this.showSuccess('Password updated successfully!');
          setTimeout(() => this.showDashboard(), 1500);
          break;

        case 'WAIT_RETURN':
        default:
          this.showDashboard();
          break;
      }
    }

    start() {
      this.inputElem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleInput(this.inputElem.value);
        }
      });

      // Sound button toggle
      const sndBtn = document.getElementById('soundToggle');
      if (sndBtn) {
        sndBtn.addEventListener('click', () => {
          soundEnabled = !soundEnabled;
          sndBtn.innerText = soundEnabled ? '🔊 Sound: On' : '🔇 Sound: Off';
          playBeep(520, 0.05);
        });
      }

      // Reset Data button
      const resetBtn = document.getElementById('resetDataBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('Reset marketplace to default Banasthali Vidyapith demo data?')) {
            localStorage.removeItem('bm_students_v3');
            localStorage.removeItem('bm_products_v3');
            this.loadData();
            this.showSuccess('Database reset to fresh state.');
            setTimeout(() => this.showMainMenu(), 1000);
          }
        });
      }

      // Export Data button
      const exportBtn = document.getElementById('exportDataBtn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const exportObj = {
            students: this.students,
            products: this.products,
            exportedAt: new Date().toISOString()
          };
          const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `banasthali_mart_backup_${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
          this.showSuccess('Marketplace database exported!');
        });
      }

      this.splashScreen(() => this.showMainMenu());
    }
  }

  // Initialize on page load
  window.addEventListener('DOMContentLoaded', () => {
    const engine = new BanasthaliMartEngine();
    engine.start();
  });
})();
