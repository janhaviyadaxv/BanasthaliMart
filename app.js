// Banasthali Mart Web Terminal Engine
(function() {
  'use strict';
  const D_TL = '╔', D_TR = '╗', D_BL = '╚', D_BR = '╝', D_H = '═', D_V = '║';
  const D_ML = '╠', D_MR = '╣', D_MT = '╦', D_MB = '╩', D_CR = '╬';
  const S_TL = '┌', S_TR = '┐', S_BL = '└', S_BR = '┘', S_H = '─', S_V = '│';
  const S_ML = '├', S_MR = '┤';
  const ICO_ARROW = '►', ICO_STAR = '☼', ICO_CHECK = '√', ICO_CROSS = '×', ICO_DIAMOND = '♦', ICO_BLOCK = '█', ICO_SHADE = '▓';
  const SW = 78;

  const rep = (c, n) => (n > 0 ? c.repeat(n) : '');
  const pad = (s, n) => { s = String(s); return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length); };
  const center = (t, w) => pad(' '.repeat(Math.max(0, Math.floor((w - t.length) / 2))) + t, w);

  class Student {
    constructor(id, n, c, p = '') { this.studentId = id; this.name = n; this.contactInfo = c; this.password = p; }
    verifyPassword(p) { return this.password === p; }
  }
  class Product {
    constructor(id, n, pr, s, sold = false) { this.productId = id; this.name = n; this.price = parseFloat(pr); this.sellerId = s; this.isSold = !!sold; }
  }

  class Mart {
    constructor() {
      this.students = [];
      this.products = [];
      this.user = null;
      this.state = 'MAIN_MENU';
      this.reg = {};
      this.elScr = document.getElementById('terminalScreen');
      this.elPr = document.getElementById('inputPrompt');
      this.elIn = document.getElementById('terminalInput');
      this.elAct = document.getElementById('actionPad');
      this.load();
    }
    load() {
      try {
        const s = localStorage.getItem('bm_students_v3'), p = localStorage.getItem('bm_products_v3');
        if (s) this.students = JSON.parse(s).map(x => new Student(x.studentId, x.name, x.contactInfo, x.password));
        if (p) this.products = JSON.parse(p).map(x => new Product(x.productId, x.name, x.price, x.sellerId, x.isSold));
      } catch(e){}
      if (!this.students.length) {
        this.students = [
          new Student('BT2026001', 'Janhavi Yadav', 'janhavi@banasthali.in', 'janhavi123'),
          new Student('BT2026042', 'Priya Sharma', 'priya@banasthali.in', 'priya123')
        ];
        this.products = [
          new Product('P101', 'Data Structures in C++', 350.00, 'BT2026001', false),
          new Product('P102', 'Scientific Calculator fx-991EX', 750.00, 'BT2026042', false),
          new Product('P103', 'Mini Drafter with Sheet Case', 450.00, 'BT2026001', false),
          new Product('P104', 'Lab Coat / Apron (Size M)', 200.00, 'BT2026042', true)
        ];
        this.save();
      }
    }
    save() {
      try {
        localStorage.setItem('bm_students_v3', JSON.stringify(this.students));
        localStorage.setItem('bm_products_v3', JSON.stringify(this.products));
      }catch(e){}
    }
    print(h) {
      const sp = document.createElement('span'); sp.innerHTML = h;
      this.elScr.appendChild(sp);
      this.elScr.scrollTop = this.elScr.scrollHeight;
    }
    println(t = '', c = 'c-bwht') { this.print(`<span class="${c}">${this.esc(t)}</span>\n`); }
    esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    dBox(t, bC = 'c-bylw', tC = 'c-bwht') {
      this.print(`  <span class="${bC}">${D_V}</span> <span class="${tC}">${this.esc(center(t, SW - 4))}</span> <span class="${bC}">${D_V}</span>\n`);
    }
    title(t, c = 'c-bcyn') { this.println(`  ${ICO_DIAMOND}  ${t}  ${rep(S_H, Math.max(0, SW - 8 - t.length))}`, c); }
    msg(t, c, ico) {
      this.println(`  ${S_TL}${rep(S_H, SW-2)}${S_TR}`, c);
      this.println(`  ${S_V}   ${ico}  ${pad(t, SW - 10)}${S_V}`, c);
      this.println(`  ${S_BL}${rep(S_H, SW-2)}${S_BR}`, c);
    }
    prompt(lbl, isPass = false) {
      this.elPr.innerText = `  ${lbl.padEnd(28)} : `;
      this.elIn.type = isPass ? 'password' : 'text';
      this.elIn.value = '';
      this.elIn.focus();
    }
    actions(arr) {
      this.elAct.innerHTML = '<span class="action-pad-label">Options:</span>';
      arr.forEach(b => {
        const btn = document.createElement('button');
        btn.className = `action-btn ${b.c || ''}`;
        btn.innerText = b.l;
        btn.onclick = () => { this.elIn.value = b.v; this.route(b.v); };
        this.elAct.appendChild(btn);
      });
    }

    splash(cb) {
      this.elScr.innerHTML = '';
      this.println('  ' + rep(ICO_SHADE, SW), 'c-gry');
      this.println(`  ${D_TL}${rep(D_H, SW-2)}${D_TR}`, 'c-bylw');
      this.dBox('BANASTHALI MART v3.0', 'c-bylw', 'c-bcyn');
      this.dBox('Campus Buy & Sell Marketplace ~ Banasthali Vidyapith', 'c-bylw', 'c-bwht');
      this.dBox('Developer : Janhavi Yadav', 'c-bylw', 'c-bmag');
      this.println(`  ${D_BL}${rep(D_H, SW-2)}${D_BR}`, 'c-bylw');
      this.println('  ' + rep(ICO_SHADE, SW), 'c-gry');
      this.println('\n  Loading marketplace system...', 'c-bcyn');
      setTimeout(cb, 600);
    }

    menu() {
      this.state = 'MAIN_MENU';
      this.elScr.innerHTML = '';
      this.println('  ' + rep(ICO_SHADE, SW), 'c-gry');
      this.println(`  ${D_TL}${rep(D_H, SW-2)}${D_TR}`, 'c-bylw');
      this.dBox('B A N A S T H A L I   M A R T', 'c-bylw', 'c-bcyn');
      this.dBox('Banasthali Vidyapith  •  Student Marketplace', 'c-bylw', 'c-bwht');
      this.println(`  ${D_BL}${rep(D_H, SW-2)}${D_BR}\n`, 'c-bylw');

      this.println(`  ${S_TL}${rep(S_H, SW-2)}${S_TR}`, 'c-bylw');
      this.println(`  ${S_V} [1]  ${ICO_ARROW}  Register as New Student${' '.repeat(SW - 33)}${S_V}`, 'c-bylw');
      this.println(`  ${S_V} [2]  ${ICO_ARROW}  Login to Your Account${' '.repeat(SW - 31)}${S_V}`, 'c-bgrn');
      this.println(`  ${S_V} [3]  ${ICO_ARROW}  Reset / Restart System${' '.repeat(SW - 32)}${S_V}`, 'c-bred');
      this.println(`  ${S_BL}${rep(S_H, SW-2)}${S_BR}\n`, 'c-bylw');

      this.prompt('Your Choice');
      this.actions([
        { l: '[1] Register', v: '1', c: 'accent-yellow' },
        { l: '[2] Login', v: '2', c: 'accent-green' },
        { l: '[3] Reset', v: '3' }
      ]);
    }

    dash() {
      this.state = 'DASHBOARD';
      this.elScr.innerHTML = '';
      this.println(`  ${D_TL}${rep(D_H, SW-2)}${D_TR}`, 'c-bgrn');
      this.dBox(`STUDENT DASHBOARD  -  ${this.user.name} [${this.user.studentId}]`, 'c-bgrn', 'c-bylw');
      this.println(`  ${D_BL}${rep(D_H, SW-2)}${D_BR}\n`, 'c-bgrn');

      this.println(`  ${S_TL}${rep(S_H, SW-2)}${S_TR}`, 'c-bcyn');
      this.println(`  ${S_V}   [1] Browse All Products in Marketplace${' '.repeat(SW - 45)}${S_V}`, 'c-bwht');
      this.println(`  ${S_V}   [2] Buy a Product${' '.repeat(SW - 24)}${S_V}`, 'c-bgrn');
      this.println(`  ${S_V}   [3] Sell / List an Item${' '.repeat(SW - 30)}${S_V}`, 'c-bylw');
      this.println(`  ${S_V}   [4] Search Products by Keyword${' '.repeat(SW - 37)}${S_V}`, 'c-bcyn');
      this.println(`  ${S_V}   [5] My Listings & Sales Stats${' '.repeat(SW - 36)}${S_V}`, 'c-bmag');
      this.println(`  ${S_V}   [6] Student Directory${' '.repeat(SW - 28)}${S_V}`, 'c-bwht');
      this.println(`  ${S_V}   [7] Logout${' '.repeat(SW - 17)}${S_V}`, 'c-bred');
      this.println(`  ${S_BL}${rep(S_H, SW-2)}${S_BR}\n`, 'c-bcyn');

      this.prompt('Your Choice');
      this.actions([
        { l: '[1] Browse', v: '1', c: 'accent-cyan' },
        { l: '[2] Buy', v: '2', c: 'accent-green' },
        { l: '[3] Sell', v: '3', c: 'accent-yellow' },
        { l: '[4] Search', v: '4' },
        { l: '[5] My Items', v: '5' },
        { l: '[6] Directory', v: '6' },
        { l: '[7] Logout', v: '7' }
      ]);
    }

    tbl(items, bC = 'c-bcyn') {
      this.println(`  ${D_TL}${rep(D_H, 10)}${D_MT}${rep(D_H, 26)}${D_MT}${rep(D_H, 14)}${D_MT}${rep(D_H, 12)}${D_MT}${rep(D_H, 10)}${D_TR}`, bC);
      this.println(`  ${D_V} ID       ${D_V} Product Name             ${D_V} Price        ${D_V} Seller      ${D_V} Status   ${D_V}`, 'c-bylw');
      this.println(`  ${D_ML}${rep(D_H, 10)}${D_CR}${rep(D_H, 26)}${D_CR}${rep(D_H, 14)}${D_CR}${rep(D_H, 12)}${D_CR}${rep(D_H, 10)}${D_MR}`, bC);
      items.forEach(p => {
        const st = p.isSold ? ' SOLD   ' : ' Available';
        const sc = p.isSold ? 'c-bred' : 'c-bgrn';
        this.print(`  <span class="${bC}">${D_V}</span> <span class="c-bwht">${pad(p.productId, 8)}</span> <span class="${bC}">${D_V}</span> <span class="c-bwht">${pad(p.name, 24)}</span> <span class="${bC}">${D_V}</span> <span class="c-bylw">${pad('Rs.' + p.price.toFixed(2), 12)}</span> <span class="${bC}">${D_V}</span> <span class="c-gry">${pad(p.sellerId, 10)}</span> <span class="${bC}">${D_V}</span> <span class="${sc}">${st}</span> <span class="${bC}">${D_V}</span>\n`);
      });
      this.println(`  ${D_BL}${rep(D_H, 10)}${D_MB}${rep(D_H, 26)}${D_MB}${rep(D_H, 14)}${D_MB}${rep(D_H, 12)}${D_MB}${rep(D_H, 10)}${D_BR}\n`, bC);
    }

    route(raw) {
      const v = raw.trim();
      this.println(`  >> ${this.elIn.type === 'password' ? '••••••••' : v}`, 'c-gry');

      switch(this.state) {
        case 'MAIN_MENU':
          if (v === '1') {
            this.state = 'REG_ID'; this.reg = {}; this.elScr.innerHTML = '';
            this.title('STUDENT REGISTRATION'); this.prompt('Student ID (e.g. BT2026100)'); this.actions([]);
          } else if (v === '2') {
            this.state = 'LOG_ID'; this.elScr.innerHTML = '';
            this.title('STUDENT LOGIN'); this.prompt('Enter Student ID');
            this.actions([{ l: 'Demo: BT2026001', v: 'BT2026001', c: 'accent-yellow' }]);
          } else if (v === '3') {
            this.splash(() => this.menu());
          } else {
            this.msg('Invalid selection! Choose 1, 2, or 3.', 'c-bred', ICO_CROSS);
            this.prompt('Your Choice');
          }
          break;

        case 'REG_ID':
          if (!v) return;
          if (this.students.find(s => s.studentId.toUpperCase() === v.toUpperCase())) {
            this.msg(`Student ID '${v}' already exists!`, 'c-bred', ICO_CROSS);
            return setTimeout(() => this.menu(), 1200);
          }
          this.reg.id = v; this.state = 'REG_NAME'; this.prompt('Full Name');
          break;

        case 'REG_NAME':
          if (!v) return;
          this.reg.name = v; this.state = 'REG_CONTACT'; this.prompt('Contact (Email or Phone)');
          break;

        case 'REG_CONTACT':
          if (!v) return;
          this.reg.contact = v; this.state = 'REG_PASS'; this.prompt('Create Password', true);
          break;

        case 'REG_PASS':
          if (!v) return;
          this.students.push(new Student(this.reg.id, this.reg.name, this.reg.contact, v));
          this.save();
          this.msg(`'${this.reg.name}' registered successfully!`, 'c-bgrn', ICO_CHECK);
          setTimeout(() => this.menu(), 1200);
          break;

        case 'LOG_ID':
          const found = this.students.find(s => s.studentId.toUpperCase() === v.toUpperCase());
          if (!found) {
            this.msg('Student ID not found!', 'c-bred', ICO_CROSS);
            return setTimeout(() => this.menu(), 1200);
          }
          this.tempUser = found; this.state = 'LOG_PASS'; this.prompt('Password', true);
          if (found.studentId === 'BT2026001') this.actions([{ l: 'Demo: janhavi123', v: 'janhavi123', c: 'accent-yellow' }]);
          break;

        case 'LOG_PASS':
          if (!this.tempUser.verifyPassword(v)) {
            this.msg('Incorrect password! Access denied.', 'c-bred', ICO_CROSS);
            return setTimeout(() => this.menu(), 1200);
          }
          this.user = this.tempUser;
          this.msg(`Welcome, ${this.user.name}!`, 'c-bgrn', ICO_CHECK);
          setTimeout(() => this.dash(), 1000);
          break;

        case 'DASHBOARD':
          if (v === '1') {
            this.elScr.innerHTML = ''; this.title('MARKETPLACE CATALOG');
            this.tbl(this.products);
            this.prompt('Press Enter to Return'); this.state = 'WAIT_RET';
            this.actions([{ l: 'Return', v: 'ret', c: 'accent-cyan' }]);
          } else if (v === '2') {
            this.elScr.innerHTML = ''; this.title('BUY PRODUCT');
            const avail = this.products.filter(p => !p.isSold && p.sellerId !== this.user.studentId);
            if (!avail.length) {
              this.msg('No available items to buy from other students.', 'c-bcyn', ICO_DIAMOND);
              this.prompt('Press Enter to Return'); this.state = 'WAIT_RET';
              this.actions([{ l: 'Return', v: 'ret', c: 'accent-cyan' }]);
            } else {
              this.tbl(avail, 'c-bgrn');
              this.state = 'BUY_ID'; this.prompt('Product ID to Buy');
              this.actions(avail.map(p => ({ l: `${p.productId}`, v: p.productId })));
            }
          } else if (v === '3') {
            this.elScr.innerHTML = ''; this.title('LIST NEW PRODUCT FOR SALE');
            this.state = 'SELL_ID';
            const nid = 'P' + (101 + this.products.length);
            this.prompt(`Product ID (e.g. ${nid})`);
            this.actions([{ l: `Use ${nid}`, v: nid, c: 'accent-yellow' }]);
          } else if (v === '4') {
            this.elScr.innerHTML = ''; this.title('SEARCH PRODUCTS');
            this.state = 'SEARCH_Q'; this.prompt('Keyword'); this.actions([]);
          } else if (v === '5') {
            this.elScr.innerHTML = ''; this.title('MY LISTINGS & SALES');
            const my = this.products.filter(p => p.sellerId === this.user.studentId);
            if (!my.length) this.msg('You have no active listings.', 'c-bcyn', ICO_DIAMOND);
            else this.tbl(my, 'c-bmag');
            this.prompt('Press Enter to Return'); this.state = 'WAIT_RET';
            this.actions([{ l: 'Return', v: 'ret', c: 'accent-cyan' }]);
          } else if (v === '6') {
            this.elScr.innerHTML = ''; this.title('STUDENT DIRECTORY');
            this.println(`  ${D_TL}${rep(D_H, 14)}${D_MT}${rep(D_H, 26)}${D_MT}${rep(D_H, 32)}${D_TR}`, 'c-bcyn');
            this.println(`  ${D_V} Student ID   ${D_V} Full Name                ${D_V} Contact Info                   ${D_V}`, 'c-bylw');
            this.println(`  ${D_ML}${rep(D_H, 14)}${D_CR}${rep(D_H, 26)}${D_CR}${rep(D_H, 32)}${D_MR}`, 'c-bcyn');
            this.students.forEach(s => {
              this.println(`  ${D_V} ${pad(s.studentId, 12)} ${D_V} ${pad(s.name, 24)} ${D_V} ${pad(s.contactInfo, 30)} ${D_V}`, 'c-bwht');
            });
            this.println(`  ${D_BL}${rep(D_H, 14)}${D_MB}${rep(D_H, 26)}${D_MB}${rep(D_H, 32)}${D_BR}\n`, 'c-bcyn');
            this.prompt('Press Enter to Return'); this.state = 'WAIT_RET';
            this.actions([{ l: 'Return', v: 'ret', c: 'accent-cyan' }]);
          } else if (v === '7') {
            this.user = null; this.msg('Logged out.', 'c-bgrn', ICO_CHECK);
            setTimeout(() => this.menu(), 1000);
          } else {
            this.msg('Select 1-7.', 'c-bred', ICO_CROSS); this.prompt('Your Choice');
          }
          break;

        case 'BUY_ID':
          const target = this.products.find(p => p.productId.toUpperCase() === v.toUpperCase());
          if (!target || target.isSold || target.sellerId === this.user.studentId) {
            this.msg('Invalid or unavailable product ID.', 'c-bred', ICO_CROSS);
            return setTimeout(() => this.dash(), 1200);
          }
          target.isSold = true; this.save();
          this.msg(`Purchased '${target.name}' for Rs.${target.price.toFixed(2)}!`, 'c-bgrn', ICO_CHECK);
          setTimeout(() => this.dash(), 1400);
          break;

        case 'SELL_ID':
          if (!v) return;
          this.tempP = { id: v }; this.state = 'SELL_NAME'; this.prompt('Product Name');
          break;

        case 'SELL_NAME':
          if (!v) return;
          this.tempP.name = v; this.state = 'SELL_PRICE'; this.prompt('Price (Rs.)');
          break;

        case 'SELL_PRICE':
          const pr = parseFloat(v);
          if (isNaN(pr) || pr <= 0) return this.prompt('Valid Price (Rs.)');
          this.products.push(new Product(this.tempP.id, this.tempP.name, pr, this.user.studentId));
          this.save();
          this.msg(`Listed '${this.tempP.name}' for Rs.${pr.toFixed(2)}!`, 'c-bgrn', ICO_CHECK);
          setTimeout(() => this.dash(), 1200);
          break;

        case 'SEARCH_Q':
          this.elScr.innerHTML = ''; this.title(`SEARCH RESULTS FOR "${v}"`);
          const matched = this.products.filter(p => p.name.toLowerCase().includes(v.toLowerCase()) || p.productId.toLowerCase().includes(v.toLowerCase()));
          if (!matched.length) this.msg('No matching items found.', 'c-bcyn', ICO_DIAMOND);
          else this.tbl(matched);
          this.prompt('Press Enter to Return'); this.state = 'WAIT_RET';
          this.actions([{ l: 'Return', v: 'ret', c: 'accent-cyan' }]);
          break;

        case 'WAIT_RET':
        default:
          this.dash();
          break;
      }
    }

    init() {
      this.elIn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); this.route(this.elIn.value); }
      });
      const resBtn = document.getElementById('resetDataBtn');
      if (resBtn) {
        resBtn.onclick = () => {
          if (confirm('Reset to default items?')) {
            localStorage.clear(); this.students = []; this.products = []; this.load();
            this.msg('Data reset.', 'c-bgrn', ICO_CHECK); setTimeout(() => this.menu(), 800);
          }
        };
      }
      this.splash(() => this.menu());
    }
  }

  window.addEventListener('DOMContentLoaded', () => new Mart().init());
})();
