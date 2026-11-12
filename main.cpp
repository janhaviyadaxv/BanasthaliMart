/*
=========================================================================
             BANASTHALI  MART

  Campus Marketplace System  |  v3.0  |  C++98  |  Banasthali Vidyapith
==========================================================================  */

#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <iomanip>
#include <sstream>
#include <cstdlib>
#include <ctime>
#include <windows.h>

using namespace std;
//   COLOR PALETTE  — Windows Console 
#define BLK  0   // Black
#define BLU  1   // Blue
#define GRN  2   // Green
#define CYN  3   // Cyan
#define RED  4   // Red
#define MAG  5   // Magenta
#define YLW  6   // Yellow
#define WHT  7   // White
#define GRY  8   // Grey
#define BBLU 9   // Bright Blue
#define BGRN 10  // Bright Green
#define BCYN 11  // Bright Cyan
#define BRED 12  // Bright Red
#define BMAG 13  // Bright Magenta
#define BYLW 14  // Bright Yellow
#define BWHT 15  // Bright White
#define BG(x)    ((x) * 16)   // Background = fg * 16

HANDLE hCon = GetStdHandle(STD_OUTPUT_HANDLE);

void color(int c)  { SetConsoleTextAttribute(hCon, c); }
void reset()       { SetConsoleTextAttribute(hCon, BWHT); }
void clrscr()      { system("cls"); }

void cp(string t, int c) { color(c); cout << t; reset(); }  // Print colored text (no newline)

void cpl(string t, int c) { color(c); cout << t << "\n"; reset(); } // Print colored text with newline

//   BOX-DRAWING & SYMBOL CHARSET  (CP437 — Windows OEM)

// Double-line box
#define D_TL  char(201)  // +
#define D_TR  char(187)  // +
#define D_BL  char(200)  // +
#define D_BR  char(188)  // +
#define D_H   char(205)  // -
#define D_V   char(186)  // ¦
#define D_ML  char(204)  // ¦
#define D_MR  char(185)  // ¦
#define D_MT  char(203)  // -
#define D_MB  char(202)  // -
#define D_CR  char(206)  // +
// Single-line box
#define S_TL  char(218)  // +
#define S_TR  char(191)  // +
#define S_BL  char(192)  // +
#define S_BR  char(217)  // +
#define S_H   char(196)  // -
#define S_V   char(179)  // ¦
#define S_ML  char(195)  // +
#define S_MR  char(180)  // ¦
#define S_MT  char(194)  // -
#define S_MB  char(193)  // -
#define S_CR  char(197)  // +
// Symbols
#define ICO_ARROW   char(16)   // ?
#define ICO_BULLET  char(254)  // ¦
#define ICO_STAR    char(15)   // ¤
#define ICO_CHECK   char(251)  // v
#define ICO_CROSS   char(248)  // °  (used as X mark)
#define ICO_DIAMOND char(4)    // ?
#define ICO_HEART   char(3)    // ?
#define ICO_CLUB    char(5)    // ?
#define ICO_NOTE    char(14)   // ?
#define ICO_SUN     char(15)   // ¤
#define ICO_BLOCK   char(219)  // ¦
#define ICO_HBLOCK  char(220)  // _
#define ICO_SHADE1  char(176)  // ¦
#define ICO_SHADE2  char(177)  // ¦
#define ICO_SHADE3  char(178)  // ¦
#define ICO_UP      char(30)   // ?
#define ICO_DOWN    char(31)   // ?

const int SW = 78;   // Screen width

string intToStr(int n) {
    if (n == 0) return "0";
    string r = ""; bool neg = n < 0; if (neg) n = -n;
    while (n > 0) { r = char('0' + n % 10) + r; n /= 10; }
    return neg ? "-" + r : r;
}

string dblToStr(double d, int prec = 2) {
    stringstream ss; ss << fixed << setprecision(prec) << d; return ss.str();
}

string rep(char c, int n) { return n > 0 ? string(n, c) : ""; }

string center(string s, int w) {
    int pad = (w - (int)s.size()) / 2;
    if (pad < 0) pad = 0;
    string r = string(pad, ' ') + s;
    if ((int)r.size() < w) r += string(w - r.size(), ' ');
    return r;
}

string padRight(string s, int w) {
    if ((int)s.size() >= w) return s.substr(0, w);
    return s + string(w - s.size(), ' ');
}

//   ADVANCED UI PRIMITIVES
// -- Full-width double-box row ------
void dRow(string text, int borderC, int textC, bool cen = false) {
    int inner = SW - 4;
    string content = cen ? center(text, inner) : padRight(text, inner);
    color(borderC); cout << "  " << D_V << " ";
    color(textC);   cout << content;
    color(borderC); cout << " " << D_V << "\n";
    reset();
}

void dTop(int c = BYLW) {
    color(c); cout << "  " << D_TL << rep(D_H, SW-2) << D_TR << "\n"; reset();
}
void dBot(int c = BYLW) {
    color(c); cout << "  " << D_BL << rep(D_H, SW-2) << D_BR << "\n"; reset();
}
void dMid(int c = BYLW) {
    color(c); cout << "  " << D_ML << rep(D_H, SW-2) << D_MR << "\n"; reset();
}
void dEmpty(int c = BYLW) { dRow("", c, BWHT, false); }

// -- Single-box primitives ----------------------
void sTop(int c = BCYN, int w = SW) {
    color(c); cout << "  " << S_TL << rep(S_H, w-2) << S_TR << "\n"; reset();
}
void sBot(int c = BCYN, int w = SW) {
    color(c); cout << "  " << S_BL << rep(S_H, w-2) << S_BR << "\n"; reset();
}
void sMid(int c = BCYN, int w = SW) {
    color(c); cout << "  " << S_ML << rep(S_H, w-2) << S_MR << "\n"; reset();
}

void sRow(string text, int borderC, int textC, bool cen = false, int w = SW) {
    int inner = w - 4;
    string content = cen ? center(text, inner) : padRight(text, inner);
    color(borderC); cout << "  " << S_V << " ";
    color(textC);   cout << content;
    color(borderC); cout << " " << S_V << "\n";
    reset();
}

// -- Gradient shade bar -------------------------
void shadeBar(int w = SW) {
    color(GRY);
    cout << "  ";
    cout << ICO_SHADE3 << ICO_SHADE3;
    color(GRY); cout << rep(ICO_SHADE2, w - 6);
    cout << ICO_SHADE3 << ICO_SHADE3;
    cout << "\n"; reset();
}

// -- Progress / Loading bar -------------------
void progressBar(int pct, int barW = 40, string label = "") {
    int filled = (barW * pct) / 100;
    cout << "  ";
    if (!label.empty()) { color(BYLW); cout << label << " "; }
    color(BCYN); cout << S_V;
    color(BGRN);
    for (int i = 0; i < filled; i++) cout << ICO_BLOCK;
    color(GRY);
    for (int i = filled; i < barW; i++) cout << ICO_SHADE1;
    color(BCYN); cout << S_V << " ";
    color(BYLW); cout << pct << "%";
    reset(); cout << "\n";
}

// -- Animated loading sequence ------------------
void animLoad(string msg, int steps = 20) {
    cout << "\n  ";
    color(BCYN); cout << ICO_ARROW << " "; color(BWHT); cout << msg << "\n\n";
    for (int i = 0; i <= steps; i++) {
        // Overwrite line: move cursor up
        cout << "\033[A";
        progressBar(i * 100 / steps, 40, "  Loading");
        Sleep(40);
    }
    cout << "\n";
    reset();
}

// -- Status badge -----------------------
void badge(string text, int fg, int bg) {
    color(bg * 16 + fg); cout << " " << text << " "; reset();
}

// -- Section title with decorative line ---------------
void secTitle(string title, int c = BYLW) {
    cout << "\n";
    color(c);
    string line = "  " + string(1, ICO_DIAMOND) + "  " + title + "  " + string(1, ICO_DIAMOND);
    cout << line << "\n";
    cout << "  " << rep(S_H, (int)title.size() + 6) << "\n";
    reset();
}

// -- Input prompt --------------
void prompt(string label) {
    color(BYLW); cout << "\n  " << ICO_ARROW << " ";
    color(BWHT); cout << padRight(label, 28);
    color(BCYN); cout << " : ";
    reset();
}

// -- Notification boxes ----------
void showSuccess(string msg) {
    cout << "\n";
    sTop(BGRN);
    sRow(string("  ") + ICO_CHECK + "  SUCCESS  :  " + msg, BGRN, BGRN);
    sBot(BGRN);
}

void showError(string msg) {
    cout << "\n";
    sTop(BRED);
    sRow(string("  ") + ICO_CROSS + "  ERROR    :  " + msg, BRED, BRED);
    sBot(BRED);
}

void showWarning(string msg) {
    cout << "\n";
    sTop(BYLW);
    sRow(string("  ") + ICO_DIAMOND + "  WARNING  :  " + msg, BYLW, BYLW);
    sBot(BYLW);
}

void showInfo(string msg) {
    color(BCYN); cout << "  " << ICO_ARROW << " ";
    color(BWHT); cout << msg << "\n"; reset();
}

// -- Pause ---------------
void pause() {
    cout << "\n";
    sTop(GRY);
    color(GRY); cout << "  " << S_V << " ";
    color(BYLW); cout << ICO_ARROW;
    color(BWHT); cout << "  Press ";
    color(BCYN);  cout << "[ ENTER ]";
    color(BWHT); cout << " to continue...";
    color(GRY); cout << string(20, ' ') << S_V << "\n";
    sBot(GRY);
    reset();
    cin.ignore(); cin.get();
}

// -- Stat card (mini info box) --------
void statCard(string label, string val, int c) {
    color(c);
    cout << "  " << S_TL << rep(S_H, 30) << S_TR << "\n";
    cout << "  " << S_V << " ";
    color(BWHT); cout << padRight(label, 16);
    color(c); cout << " " << S_V << " ";
    color(BYLW); cout << padRight(val, 10);
    color(c); cout << S_V << "\n";
    cout << "  " << S_BL << rep(S_H, 30) << S_BR << "\n";
    reset();
}

// -- Two-column stat row -------------
void statRow2(string l1, string v1, int c1, string l2, string v2, int c2) {
    color(c1); cout << "  " << S_TL << rep(S_H, 30) << S_TR;
    color(c2); cout << "  " << S_TL << rep(S_H, 30) << S_TR << "\n";

    color(c1); cout << "  " << S_V << " ";
    color(BWHT); cout << padRight(l1, 16);
    color(c1); cout << " " << S_V << " "; color(BYLW); cout << padRight(v1, 10);
    color(c1); cout << S_V;

    color(c2); cout << "  " << S_V << " ";
    color(BWHT); cout << padRight(l2, 16);
    color(c2); cout << " " << S_V << " "; color(BYLW); cout << padRight(v2, 10);
    color(c2); cout << S_V << "\n";

    color(c1); cout << "  " << S_BL << rep(S_H, 30) << S_BR;
    color(c2); cout << "  " << S_BL << rep(S_H, 30) << S_BR << "\n";
    reset();
}

//   ASCII ART LOGOS
void drawShoppingCartArt() {
    color(BYLW);
    cout << "      ____\n";
    cout << "     |    |\n";
    cout << "  ___|____|___\n";
    cout << " /____________\\\n";
    color(BCYN);
    cout << " |  BANASTHALI |\n";
    cout << " |     MART    |\n";
    color(BYLW);
    cout << "  \\__________/\n";
    cout << "    (O)       (O)\n";
    reset();
}

void drawUserArt() {
    color(BCYN);
    cout << "        .--.\n";
    cout << "       |o_o|\n";
    cout << "       |:_/|\n";
    cout << "      //  \\ \\\n";
    cout << "     (|    | )\n";
    cout << "    /'\\_ _/`\\\n";
    cout << "    \\__)=(__/\n";
    reset();
}

void drawSuccessArt() {
    color(BGRN);
    cout << "      ___\n";
    cout << "     /   \\\n";
    cout << "    | ";
    color(BYLW); cout << ICO_CHECK; color(BGRN);
    cout << "    |\n";
    cout << "    |     |\n";
    cout << "    \\___/\n";
    reset();
}

void drawPackageArt() {
    color(BYLW);
    cout << "      _______\n";
    cout << "     /       \\\n";
    cout << "    |  ";
    color(BCYN); cout << "ITEM"; color(BYLW);
    cout << "  |\n";
    cout << "  |  ";
    color(BGRN); cout << "SOLD"; color(BYLW);
    cout << "  |\n";
    cout << "     \\_______/\n";
    reset();
}

//   MASTER SCREEN HEADER
void masterHeader(string pageTitle, string loggedIn = "", string subInfo = "") {
    clrscr();

    // Top gradient shading
    color(GRY);
    cout << "  " << rep(ICO_SHADE3, SW) << "\n";
    reset();

    // Main title box
    dTop(BYLW);
    dEmpty(BYLW);

    // Brand name row
    color(BYLW); cout << "  " << D_V << " ";
    color(BYLW); cout << ICO_BLOCK; color(BCYN); cout << ICO_BLOCK;
    color(BCYN);
    cout << center("B A N A S T H A L I _ M A R T   v3.0", SW - 12);
    color(BCYN); cout << ICO_BLOCK; color(BYLW); cout << ICO_BLOCK;
    color(BYLW); cout << " " << D_V << "\n";

    // Tagline row
    color(BYLW); cout << "  " << D_V << "  ";
    color(BWHT);
    cout << center("Campus Buy & Sell Marketplace  ~  Banasthali Vidyapith", SW - 6);
    color(BYLW); cout << "  " << D_V << "\n";

    dMid(BYLW);

    // Page title row
    color(BYLW); cout << "  " << D_V << "  ";
    color(BCYN); cout << ICO_DIAMOND << " ";
    color(BCYN); cout << center(pageTitle, SW - 12);
    color(BCYN); cout << " " << ICO_DIAMOND;
    color(BYLW); cout << "  " << D_V << "\n";

    // If logged in — show user info
    if (!loggedIn.empty()) {
        dMid(BYLW);
        color(BYLW); cout << "  " << D_V << "  ";
        color(BGRN); cout << ICO_CHECK << " Logged in: ";
        color(BWHT); cout << padRight(loggedIn, 20);
        if (!subInfo.empty()) {
            color(GRY); cout << "  |  ";
            color(BCYN); cout << subInfo;
        }
        string trailing = "";
        int usedLen = 14 + (int)loggedIn.size() + (subInfo.empty() ? 0 : 5 + (int)subInfo.size());
        int remaining = SW - 6 - usedLen;
        if (remaining > 0) cout << string(remaining, ' ');
        color(BYLW); cout << "  " << D_V << "\n";
    }

    dEmpty(BYLW);
    dBot(BYLW);

    // Bottom shade bar
    color(GRY);
    cout << "  " << rep(ICO_SHADE1, SW) << "\n";
    reset();
    cout << "\n";
}

//   SPLASH SCREEN (v3.0 — Full Art)
void splashScreen() {
    clrscr();
    SetConsoleOutputCP(437);

    // Top shading
    color(GRY);
    for (int i = 0; i < 2; i++)
        cout << "  " << rep(ICO_SHADE3, SW) << "\n";

    dTop(BYLW);
    dEmpty(BYLW);

    // ASCII logo rows
    color(BYLW); cout << "  " << D_V << "   ";
    color(BYLW);
    cout << "  ____    _    _   _    _    ____ _____ _   _    _    _     ___ ";
    color(BYLW); cout << "   " << D_V << "\n";

    color(BYLW); cout << "  " << D_V << "   ";
    color(BCYN);
    cout << " | __ )  / \\  | \\ | |  / \\  / ___|_   _| | | |  / \\  | |   |_ _|";
    color(BYLW); cout << "   " << D_V << "\n";

    color(BYLW); cout << "  " << D_V << "   ";
    color(BWHT);
    cout << " |  _ \\ / _ \\ |  \\| | / _ \\ \\___ \\ | | | |_| | / _ \\ | |    | | ";
    color(BYLW); cout << "   " << D_V << "\n";

    color(BYLW); cout << "  " << D_V << "   ";
    color(BCYN);
    cout << " | |_) / ___ \\| |\\  |/ ___ \\ ___) || | |  _  |/ ___ \\| |___ | | ";
    color(BYLW); cout << "   " << D_V << "\n";

    color(BYLW); cout << "  " << D_V << "   ";
    color(BYLW);
    cout << " |____/_/   \\_\\_| \\_/_/   \\_\\____/ |_| |_| |_/_/   \\_\\_____|___|";
    color(BYLW); cout << "   " << D_V << "\n";

    dMid(BYLW);

    // Sub-logo: MART
    color(BYLW); cout << "  " << D_V << "   ";
    color(BMAG);
    cout << "  __  __    _    ____ _____      __   ___    ___  ";
    color(BYLW); cout << "                  " << D_V << "\n";

    color(BYLW); cout << "  " << D_V << "   ";
    color(BMAG);
    cout << " |  \\/  |  / \\  |  _ \\_   _|    \\ \\ / / \\  / _ \\ ";
    color(BYLW); cout << "                  " << D_V << "\n";

    color(BYLW); cout << "  " << D_V << "   ";
    color(BWHT);
    cout << " | |\\/| | / _ \\ | |_) || |       \\ V / _ \\| | | |";
    color(BYLW); cout << "                  " << D_V << "\n";

    color(BYLW); cout << "  " << D_V << "   ";
    color(BMAG);
    cout << " | |  | |/ ___ \\|  _ < | |        | / ___ \\ |_| |";
    color(BYLW); cout << "                  " << D_V << "\n";

    color(BYLW); cout << "  " << D_V << "   ";
    color(BYLW);
    cout << " |_|  |_/_/   \\_\\_| \\_\\|_|        |_/_/   \\_\\___/ ";
    color(BYLW); cout << "                 " << D_V << "\n";

    dMid(BYLW);

    // Info row
    dRow("  " + string(1,ICO_DIAMOND) + "  Language : C++98         " +
         string(1,ICO_DIAMOND) + "  Version : 3.0           " +
         string(1,ICO_DIAMOND) + "  College : Banasthali Vidyapith",
         BYLW, GRY);

    dRow("  " + string(1,ICO_STAR) + "  Features : Login | Password | My Products | Buy/Sell | Search | Colors | ASCII Art",
         BYLW, BWHT);

    dEmpty(BYLW);
    dBot(BYLW);

    // Bottom shade
    color(GRY);
    for (int i = 0; i < 2; i++)
        cout << "  " << rep(ICO_SHADE3, SW) << "\n";
    reset();

    cout << "\n";
    animLoad("Initializing Banasthali_Mart...", 25);

    // Tech boot lines
    string bootLines[] = {
        "  >> Loading student database...",
        "  >> Loading product catalog...",
        "  >> Setting up secure session...",
        "  >> Initializing marketplace engine...",
        "  >> System ready!"
    };
    for (int i = 0; i < 5; i++) {
        color(i < 4 ? BCYN : BGRN);
        cout << bootLines[i];
        reset();
        cout << "\n";
        Sleep(180);
    }
    Sleep(600);
}

//   STUDENT CLASS
class Student {
private:
    string studentId, name, contactInfo, password;
public:
    Student() : password("") {}
    Student(string id, string n, string c)
        : studentId(id), name(n), contactInfo(c), password("") {}
    Student(string id, string n, string c, string p)
        : studentId(id), name(n), contactInfo(c), password(p) {}

    string getStudentId()   const { return studentId; }
    string getName()        const { return name; }
    string getContactInfo() const { return contactInfo; }
    bool   hasPassword()    const { return !password.empty(); }
    void   setPassword(string p)  { password = p; }
    bool   verifyPassword(string p) const { return password == p; }

    void displayRow(int rowNum) const {
        // Alternating row colors
        int rowC = (rowNum % 2 == 0) ? BG(BLU) + BWHT : BG(GRY) + BWHT;
        color(BCYN); cout << "  " << D_V;

        color(rowC); cout << " " << padRight(studentId, 11) << " ";
        color(BCYN); cout << D_V;
        color(rowC); cout << " " << padRight(name, 22) << " ";
        color(BCYN); cout << D_V;
        color(rowC); cout << " " << padRight(contactInfo, 22) << " ";
        color(BCYN); cout << D_V << " ";
        if (hasPassword()) { color(BG(GRN)+BWHT); cout << "  SET   "; }
        else               { color(BG(RED)+BWHT); cout << "NO PASS "; }
        color(BCYN); cout << D_V << "\n";
        reset();
    }

    void saveToFile(ofstream& out) const {
        out << studentId << "," << name << "," << contactInfo << "," << password << "\n";
    }
    static Student loadFromFile(string line) {
        size_t p1 = line.find(","), p2 = line.find(",", p1+1), p3 = line.find(",", p2+1);
        return Student(line.substr(0,p1),
                       line.substr(p1+1, p2-p1-1),
                       line.substr(p2+1, p3-p2-1),
                       p3 != string::npos ? line.substr(p3+1) : "");
    }
};

//   PRODUCT CLASS
class Product {
private:
    string productId, name, sellerId;
    double price;
    bool   isSold;
public:
    Product() : isSold(false) {}
    Product(string id, string n, double p, string sId, bool sold = false)
        : productId(id), name(n), price(p), sellerId(sId), isSold(sold) {}

    string getProductId() const { return productId; }
    string getName()      const { return name; }
    double getPrice()     const { return price; }
    string getSellerId()  const { return sellerId; }
    bool   getIsSold()    const { return isSold; }
    void   markAsSold()         { isSold = true; }

    void displayRow(int rowNum) const {
        int rowC = (rowNum % 2 == 0) ? BG(BLU)+BWHT : BG(GRY)+BWHT;
        color(BCYN); cout << "  " << D_V;

        color(rowC); cout << " " << padRight(productId, 9) << " ";
        color(BCYN); cout << D_V;
        color(rowC); cout << " " << padRight(name, 20) << " ";
        color(BCYN); cout << D_V;

        // Price in green
        color(isSold ? BG(GRY)+BWHT : BG(GRN)+BLK);
        stringstream ss; ss << fixed << setprecision(2) << price;
        cout << " Rs." << padRight(ss.str(), 9) << " ";
        color(BCYN); cout << D_V;

        color(rowC); cout << " " << padRight(sellerId, 10) << " ";
        color(BCYN); cout << D_V;

        if (isSold) { color(BG(RED)+BWHT);  cout << "  SOLD    "; }
        else        { color(BG(GRN)+BLK);   cout << " Available"; }

        color(BCYN); cout << D_V << "\n";
        reset();
    }

    void displayMyRow(int serial) const {
        int rowC = (serial % 2 == 0) ? BG(BMAG)+BWHT : BG(MAG)+BWHT;
        color(BMAG); cout << "  " << D_V;

        color(rowC); cout << " " << padRight(intToStr(serial)+".", 4) << " ";
        color(BMAG); cout << D_V;
        color(rowC); cout << " " << padRight(productId, 10) << " ";
        color(BMAG); cout << D_V;
        color(rowC); cout << " " << padRight(name, 22) << " ";
        color(BMAG); cout << D_V;

        stringstream ss; ss << fixed << setprecision(2) << price;
        color(isSold ? BG(GRY)+BWHT : BG(GRN)+BLK);
        cout << " Rs." << padRight(ss.str(), 9) << " ";
        color(BMAG); cout << D_V;

        if (isSold) { color(BG(RED)+BWHT); cout << "  SOLD   "; }
        else        { color(BG(GRN)+BLK);  cout << " Avail.  "; }

        color(BMAG); cout << D_V << "\n";
        reset();
    }

    void saveToFile(ofstream& out) const {
        out << productId << "," << name << "," << price
            << "," << sellerId << "," << isSold << "\n";
    }
    static Product loadFromFile(string line) {
        size_t p1=line.find(","), p2=line.find(",",p1+1),
               p3=line.find(",",p2+1), p4=line.find(",",p3+1);
        stringstream ss(line.substr(p2+1, p3-p2-1)); double pr; ss >> pr;
        stringstream ss2(line.substr(p4+1)); int si; ss2 >> si;
        return Product(line.substr(0,p1), line.substr(p1+1,p2-p1-1),
                       pr, line.substr(p3+1,p4-p3-1), si != 0);
    }
};

//   TABLE DRAWING HELPERS
// Student table
void studentTableHeader(int borderC = BCYN) {
    color(borderC);
    cout << "  " << D_TL
         << rep(D_H,12) << D_MT << rep(D_H,23) << D_MT
         << rep(D_H,23) << D_MT << rep(D_H,9) << D_TR << "\n";
    cout << "  " << D_V << " "; color(BYLW);
    cout << padRight("Student ID",11); color(borderC); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Full Name",22); color(borderC); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Contact Info",22); color(borderC); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Pass",8); color(borderC); cout << D_V << "\n";
    cout << "  " << D_ML
         << rep(D_H,12) << D_CR << rep(D_H,23) << D_CR
         << rep(D_H,23) << D_CR << rep(D_H,9) << D_MR << "\n";
    reset();
}
void studentTableFooter(int borderC = BCYN) {
    color(borderC);
    cout << "  " << D_BL
         << rep(D_H,12) << D_MB << rep(D_H,23) << D_MB
         << rep(D_H,23) << D_MB << rep(D_H,9) << D_BR << "\n";
    reset();
}

// Product table
void productTableHeader(int borderC = BCYN) {
    color(borderC);
    cout << "  " << D_TL
         << rep(D_H,10) << D_MT << rep(D_H,21) << D_MT
         << rep(D_H,14) << D_MT << rep(D_H,11) << D_MT
         << rep(D_H,11) << D_TR << "\n";
    cout << "  " << D_V << " "; color(BYLW);
    cout << padRight("Prod.ID",9); color(borderC); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Product Name",20); color(borderC); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Price",13); color(borderC); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Seller",10); color(borderC); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Status",10); color(borderC); cout << D_V << "\n";
    cout << "  " << D_ML
         << rep(D_H,10) << D_CR << rep(D_H,21) << D_CR
         << rep(D_H,14) << D_CR << rep(D_H,11) << D_CR
         << rep(D_H,11) << D_MR << "\n";
    reset();
}
void productTableFooter(int borderC = BCYN) {
    color(borderC);
    cout << "  " << D_BL
         << rep(D_H,10) << D_MB << rep(D_H,21) << D_MB
         << rep(D_H,14) << D_MB << rep(D_H,11) << D_MB
         << rep(D_H,11) << D_BR << "\n";
    reset();
}

// My-product table
void myProductTableHeader() {
    color(BMAG);
    cout << "  " << D_TL
         << rep(D_H,5) << D_MT << rep(D_H,11) << D_MT
         << rep(D_H,23) << D_MT << rep(D_H,14) << D_MT
         << rep(D_H,10) << D_TR << "\n";
    cout << "  " << D_V << " "; color(BYLW);
    cout << padRight("No.",4); color(BMAG); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Prod.ID",10); color(BMAG); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Product Name",22); color(BMAG); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Price",13); color(BMAG); cout << " " << D_V << " ";
    color(BYLW); cout << padRight("Status",9); color(BMAG); cout << D_V << "\n";
    cout << "  " << D_ML
         << rep(D_H,5) << D_CR << rep(D_H,11) << D_CR
         << rep(D_H,23) << D_CR << rep(D_H,14) << D_CR
         << rep(D_H,10) << D_MR << "\n";
    reset();
}
void myProductTableFooter() {
    color(BMAG);
    cout << "  " << D_BL
         << rep(D_H,5) << D_MB << rep(D_H,11) << D_MB
         << rep(D_H,23) << D_MB << rep(D_H,14) << D_MB
         << rep(D_H,10) << D_BR << "\n";
    reset();
}

//   BANASTHALI MART — MAIN CLASS
class BanasthaliMart {
private:
    vector<Student> students;
    vector<Product> products;
    string          sfn, pfn;   // filenames
    Student*        me;         // logged in student

    void load() {
        ifstream si(sfn.c_str()); string ln;
        while (getline(si, ln)) if (!ln.empty()) students.push_back(Student::loadFromFile(ln));
        si.close();
        ifstream pi(pfn.c_str());
        while (getline(pi, ln)) if (!ln.empty()) products.push_back(Product::loadFromFile(ln));
        pi.close();
    }
    void save() {
        ofstream so(sfn.c_str());
        for (int i=0;i<(int)students.size();i++) students[i].saveToFile(so); so.close();
        ofstream po(pfn.c_str());
        for (int i=0;i<(int)products.size();i++) products[i].saveToFile(po); po.close();
    }
    bool exists(string id) {
        for (int i=0;i<(int)students.size();i++)
            if (students[i].getStudentId()==id) return true;
        return false;
    }
    Student* find(string id) {
        for (int i=0;i<(int)students.size();i++)
            if (students[i].getStudentId()==id) return &students[i];
        return NULL;
    }

public:
    BanasthaliMart() : sfn("students.txt"), pfn("products.txt"), me(NULL) { load(); }
    ~BanasthaliMart() { save(); }

    //  REGISTER  (Details + Mandatory Password in ONE step)
    void doRegister() {
        masterHeader("NEW STUDENT REGISTRATION");

        drawUserArt();
        cout << "\n";

        // -- STEP 1: Personal Details --------
        secTitle("STEP 1 OF 2  -  PERSONAL DETAILS", BCYN);
        cout << "\n";

        string id, name, contact;
        prompt("Enter Student ID");   cin >> id;
        if (exists(id)) {
            showError("Student ID '" + id + "' is already registered!");
            pause(); return;
        }
        cin.ignore();
        prompt("Enter Full Name");    getline(cin, name);
        prompt("Enter Contact Info"); getline(cin, contact);

        // -- STEP 2: Mandatory Password ----------
        cout << "\n";
        secTitle("STEP 2 OF 2  -  CREATE PASSWORD  (Compulsory)", BMAG);
        cout << "\n";
        showInfo("A password is MANDATORY to access Banasthali_Mart.");
        cout << "\n";

        string p1, p2;
        bool passOk = false;
        while (!passOk) {
            prompt("Set Password");     getline(cin, p1);
            prompt("Confirm Password"); getline(cin, p2);
            if (p1.empty())    { showError("Password cannot be empty! Try again."); cout << "\n"; }
            else if (p1 != p2) { showError("Passwords do not match! Try again.");   cout << "\n"; }
            else               { passOk = true; }
        }

        // Save student with password immediately
        students.push_back(Student(id, name, contact, p1));
        save();

        // Progress animation
        cout << "\n";
        for (int i = 0; i <= 100; i += 10) {
            cout << "\033[A";
            progressBar(i, 35, "  Saving  ");
            Sleep(50);
        }
        cout << "\n";
        drawSuccessArt();
        showSuccess("'" + name + "' registered successfully with password!");
        showInfo("You can now login with your Student ID and password.");
        pause();
    }

    //  LOGIN
    bool doLogin() {
        masterHeader("SECURE LOGIN");

        secTitle("AUTHENTICATION", BYLW);
        cout << "\n";
        drawUserArt();
        cout << "\n";

        string id, pw;
        prompt("Student ID"); cin >> id;
        Student* s = find(id);
        if (!s) { showError("Student ID not found!"); pause(); return false; }
        if (!s->hasPassword()) { showError("No password set! Use Option [2] first."); pause(); return false; }

        cin.ignore();
        prompt("Password"); getline(cin, pw);

        // Loading simulation
        cout << "\n";
        animLoad("Verifying credentials...", 15);

        if (!s->verifyPassword(pw)) {
            showError("Incorrect password! Access denied.");
            color(BRED);
            cout << "  " << D_TL << rep(D_H, SW-2) << D_TR << "\n";
            cout << "  " << D_V;
            cout << center("ACCESS DENIED  " + string(1,ICO_CROSS), SW-2);
            cout << D_V << "\n";
            cout << "  " << D_BL << rep(D_H, SW-2) << D_BR << "\n";
            reset();
            pause(); return false;
        }

        me = s;

        // Welcome screen
        clrscr();
        color(BGRN);
        cout << "\n\n";
        cout << "  " << D_TL << rep(D_H, SW-2) << D_TR << "\n";
        dRow("", BGRN, BWHT, true);
        dRow(string(2,ICO_STAR) + "  LOGIN SUCCESSFUL  " + string(2,ICO_STAR), BGRN, BGRN, true);
        dRow("", BGRN, BWHT, true);
        dRow("Welcome back,  " + s->getName() + "  !", BGRN, BWHT, true);
        dRow("ID : " + s->getStudentId(), BGRN, BYLW, true);
        dRow("", BGRN, BWHT, true);
        color(BGRN);
        cout << "  " << D_BL << rep(D_H, SW-2) << D_BR << "\n";
        reset();
        pause();
        return true;
    }

    //  CHANGE PASSWORD
    void doChangePassword() {
        if (!me) { showError("Not logged in!"); pause(); return; }
        masterHeader("CHANGE PASSWORD", me->getName(), "ID: " + me->getStudentId());

        secTitle("PASSWORD UPDATE", BMAG);
        string old, n1, n2;
        cin.ignore();
        prompt("Current Password");    getline(cin, old);
        if (!me->verifyPassword(old)) { showError("Current password incorrect!"); pause(); return; }
        prompt("New Password");        getline(cin, n1);
        prompt("Confirm New Password");getline(cin, n2);
        if (n1.empty())    { showError("Password cannot be empty!"); pause(); return; }
        if (n1 == old)     { showError("New password same as current!"); pause(); return; }
        if (n1 != n2)      { showError("Passwords do not match!"); pause(); return; }

        me->setPassword(n1);
        save();

        cout << "\n";
        for (int i = 0; i <= 100; i += 10) { cout << "\033[A"; progressBar(i, 35, "  Updating"); Sleep(60); }
        showSuccess("Password updated successfully!");
        pause();
    }

    //  MY PRODUCTS
    void doMyProducts() {
        if (!me) { showError("Login required!"); pause(); return; }
        masterHeader("MY PRODUCT LISTINGS", me->getName(), "ID: " + me->getStudentId());

        // Profile card
        secTitle("YOUR PROFILE", BCYN);
        sTop(BCYN, 55);
        sRow(string("  ") + ICO_DIAMOND + "  Student ID  :  " + me->getStudentId(), BCYN, BWHT, false, 55);
        sMid(BCYN, 55);
        sRow(string("  ") + ICO_DIAMOND + "  Name        :  " + me->getName(), BCYN, BWHT, false, 55);
        sMid(BCYN, 55);
        sRow(string("  ") + ICO_DIAMOND + "  Contact     :  " + me->getContactInfo(), BCYN, BWHT, false, 55);
        sBot(BCYN, 55);

        // Products
        secTitle("YOUR LISTINGS", BMAG);
        cout << "\n";

        int serial = 0, sold = 0, avail = 0;
        double total = 0.0, soldVal = 0.0;

        myProductTableHeader();
        for (int i = 0; i < (int)products.size(); i++) {
            if (products[i].getSellerId() == me->getStudentId()) {
                serial++;
                products[i].displayMyRow(serial);
                total += products[i].getPrice();
                if (products[i].getIsSold()) { sold++; soldVal += products[i].getPrice(); }
                else avail++;
            }
        }
        myProductTableFooter();

        if (serial == 0) {
            cout << "\n";
            showInfo("No products listed yet.");
            showWarning("Use 'Add Product' from the menu to list items!");
        } else {
            // Dashboard summary
            secTitle("SALES DASHBOARD", BYLW);
            cout << "\n";
            statRow2("Total Listed",  intToStr(serial),        BCYN,
                     "Available",     intToStr(avail),         BGRN);
            cout << "\n";
            statRow2("Total Sold",    intToStr(sold),          BRED,
                     "Revenue (Rs.)", dblToStr(soldVal),       BMAG);
            cout << "\n";

            // Progress bar: sold ratio
            int pct = serial > 0 ? (sold * 100) / serial : 0;
            cout << "\n";
            secTitle("SOLD RATIO", BYLW);
            progressBar(pct, 40, "  Progress");
        }
        pause();
    }

    //  ADD PRODUCT
    void doAddProduct() {
        if (!me) { showError("Login required!"); pause(); return; }
        masterHeader("LIST PRODUCT FOR SALE", me->getName(), "ID: " + me->getStudentId());

        // Auto-fill seller
        secTitle("SELLER INFORMATION", BCYN);
        sTop(BCYN, 45);
        sRow(string("  ") + ICO_CHECK + "  Seller ID  : " + me->getStudentId(), BCYN, BGRN, false, 45);
        sRow(string("  ") + ICO_CHECK + "  Name       : " + me->getName(),      BCYN, BWHT, false, 45);
        sBot(BCYN, 45);

        secTitle("PRODUCT DETAILS", BMAG);
        cout << "\n";

        string id, name; double price;
        prompt("Product ID");         cin >> id;
        cin.ignore();
        prompt("Product Name");       getline(cin, name);
        prompt("Asking Price (Rs.)"); cin >> price;

        if (price <= 0) { showError("Price must be greater than 0!"); pause(); return; }

        products.push_back(Product(id, name, price, me->getStudentId()));
        save();

        drawPackageArt();
        showSuccess("'" + name + "' listed at Rs." + dblToStr(price) + "!");
        showInfo("Check 'My Products' to view all your listings.");
        pause();
    }

    //  ALL PRODUCTS
    void doAllProducts() {
        string lg = me ? me->getName() : "";
        masterHeader("MARKETPLACE — ALL PRODUCTS", lg);

        if (products.empty()) {
            cout << "\n"; drawShoppingCartArt();
            showInfo("No products in the marketplace yet.");
            pause(); return;
        }

        // Available
        secTitle("AVAILABLE PRODUCTS", BGRN);
        cout << "\n";
        productTableHeader(BGRN);
        int avail = 0;
        for (int i = 0; i < (int)products.size(); i++)
            if (!products[i].getIsSold()) { products[i].displayRow(avail); avail++; }
        productTableFooter(BGRN);

        // Sold
        cout << "\n";
        secTitle("SOLD PRODUCTS", BRED);
        cout << "\n";
        productTableHeader(BRED);
        int sold = 0;
        for (int i = 0; i < (int)products.size(); i++)
            if (products[i].getIsSold()) { products[i].displayRow(sold); sold++; }
        productTableFooter(BRED);

        // Summary dashboard
        secTitle("MARKETPLACE STATS", BYLW);
        cout << "\n";
        statRow2("Available", intToStr(avail), BGRN,
                 "Sold",      intToStr(sold),  BRED);
        cout << "\n";
        statCard("Total Listed", intToStr((int)products.size()), BCYN);
        cout << "\n";
        int pct = (int)products.size() > 0 ? (sold * 100) / (int)products.size() : 0;
        progressBar(pct, 40, "  Sold %  ");
        pause();
    }

    //  BUY PRODUCT
    void doBuy() {
        if (!me) { showError("Login required to buy!"); pause(); return; }
        masterHeader("BUY A PRODUCT", me->getName(), "ID: " + me->getStudentId());

        if (products.empty()) {
            drawShoppingCartArt();
            showInfo("No products available.");
            pause(); return;
        }

        secTitle("AVAILABLE FOR YOU", BGRN);
        cout << "\n";
        productTableHeader(BGRN);
        bool any = false; int cnt = 0;
        for (int i = 0; i < (int)products.size(); i++) {
            if (!products[i].getIsSold() && products[i].getSellerId() != me->getStudentId()) {
                products[i].displayRow(cnt++); any = true;
            }
        }
        productTableFooter(BGRN);

        if (!any) { showInfo("No products available for you."); pause(); return; }

        cout << "\n";
        string pId;
        prompt("Enter Product ID to Buy"); cin >> pId;

        for (int i = 0; i < (int)products.size(); i++) {
            if (products[i].getProductId() == pId) {
                if (products[i].getIsSold())
                    { showError("Already sold!"); pause(); return; }
                if (products[i].getSellerId() == me->getStudentId())
                    { showError("Cannot buy your own product!"); pause(); return; }

                products[i].markAsSold();
                save();

                // Receipt
                cout << "\n";
                animLoad("Processing payment...", 15);
                drawPackageArt();
                cout << "\n";
                color(BYLW);
                cout << "  " << D_TL << rep(D_H, 50) << D_TR << "\n";
                dRow("", BYLW, BWHT, true);
                string receipt_title = string(2,ICO_STAR) + "  PURCHASE RECEIPT  " + string(2,ICO_STAR);
                color(BYLW); cout << "  " << D_V << " ";
                color(BYLW); cout << center(receipt_title, 48);
                color(BYLW); cout << " " << D_V << "\n";
                color(BYLW); cout << "  " << D_ML << rep(D_H, 50) << D_MR << "\n";

                string pr = dblToStr(products[i].getPrice());
                color(BYLW); cout << "  " << D_V << "  ";
                color(BWHT); cout << padRight("Product  : " + products[i].getName(), 48);
                color(BYLW); cout << D_V << "\n";
                color(BYLW); cout << "  " << D_V << "  ";
                color(BGRN); cout << padRight("Price    : Rs. " + pr, 48);
                color(BYLW); cout << D_V << "\n";
                color(BYLW); cout << "  " << D_V << "  ";
                color(BWHT); cout << padRight("Buyer    : " + me->getName(), 48);
                color(BYLW); cout << D_V << "\n";
                color(BYLW); cout << "  " << D_V << "  ";
                color(BWHT); cout << padRight("Seller ID: " + products[i].getSellerId(), 48);
                color(BYLW); cout << D_V << "\n";
                color(BYLW); cout << "  " << D_ML << rep(D_H, 50) << D_MR << "\n";
                color(BYLW); cout << "  " << D_V << "  ";
                color(BCYN); cout << center("Contact seller to collect your item!", 48);
                color(BYLW); cout << D_V << "\n";
                dRow("", BYLW, BWHT, true);
                color(BYLW); cout << "  " << D_BL << rep(D_H, 50) << D_BR << "\n";
                reset();
                pause(); return;
            }
        }
        showError("Product ID not found!"); pause();
    }

    //  SEARCH
    void doSearch() {
        string lg = me ? me->getName() : "";
        masterHeader("SEARCH PRODUCTS", lg);

        secTitle("KEYWORD SEARCH", BCYN);
        string q;
        prompt("Enter keyword"); cin.ignore(); getline(cin, q);

        cout << "\n";
        animLoad("Searching marketplace...", 10);

        secTitle("RESULTS FOR : \"" + q + "\"", BYLW);
        cout << "\n";
        productTableHeader(BYLW);
        bool found = false; int cnt = 0;
        for (int i = 0; i < (int)products.size(); i++) {
            if (products[i].getName().find(q) != string::npos)
                { products[i].displayRow(cnt++); found = true; }
        }
        productTableFooter(BYLW);

        if (!found) { cout << "\n"; showInfo("No products matching '" + q + "' found."); }
        else {
            cout << "\n";
            statCard("Results Found", intToStr(cnt), BGRN);
        }
        pause();
    }

    //  ALL STUDENTS
    void doStudents() {
        string lg = me ? me->getName() : "";
        masterHeader("REGISTERED STUDENTS", lg);

        if (students.empty()) {
            showInfo("No students registered yet."); pause(); return;
        }

        secTitle("STUDENT DIRECTORY", BCYN);
        cout << "\n";
        studentTableHeader(BCYN);
        for (int i = 0; i < (int)students.size(); i++) students[i].displayRow(i);
        studentTableFooter(BCYN);

        cout << "\n";
        statCard("Total Registered", intToStr((int)students.size()), BCYN);

        // Password stats
        int withPass = 0;
        for (int i = 0; i < (int)students.size(); i++)
            if (students[i].hasPassword()) withPass++;
        cout << "\n";
        statRow2("With Password", intToStr(withPass), BGRN,
                 "Without Pass", intToStr((int)students.size() - withPass), BRED);
        pause();
    }

    //  MY STOREFRONT  (Auto-shown after every login)
    //  Shows personal product listings immediately after login
    void showMyStorefront() {
        clrscr();
        
        color(GRY); cout << "  " << rep(ICO_SHADE3, SW) << "\n"; reset();    // Gradient top

        // Storefront header — unique color: Bright Blue
        color(BBLU);
        cout << "  " << D_TL << rep(D_H, SW-2) << D_TR << "\n";
        dEmpty(BBLU);
        dRow(string(2, ICO_BLOCK) + "  MY PERSONAL STOREFRONT  " + string(2, ICO_BLOCK), BBLU, BYLW, true);
        dRow("All your products listed for sale in one place", BBLU, BWHT, true);
        dMid(BBLU);
        dRow(string(1,ICO_CHECK) + "  " + me->getName() + "   [" + me->getStudentId() + "]", BBLU, BGRN, false);
        dRow(string(1,ICO_DIAMOND) + "  Contact : " + me->getContactInfo(), BBLU, GRY, false);
        dEmpty(BBLU);
        color(BBLU); cout << "  " << D_BL << rep(D_H, SW-2) << D_BR << "\n";
        reset();

        color(GRY); cout << "  " << rep(ICO_SHADE1, SW) << "\n"; reset();
        cout << "\n";

        // Count products
        int serial = 0, sold = 0, avail = 0;
        double soldVal = 0.0, availVal = 0.0;
        for (int i = 0; i < (int)products.size(); i++) {
            if (products[i].getSellerId() == me->getStudentId()) {
                serial++;
                if (products[i].getIsSold()) { sold++; soldVal += products[i].getPrice(); }
                else { avail++; availVal += products[i].getPrice(); }
            }
        }

        if (serial == 0) {
            // Empty storefront
            color(BBLU);
            sTop(BBLU, 55);
            sRow(string("  ") + ICO_DIAMOND + "  Your storefront is empty!", BBLU, BYLW, false, 55);
            sMid(BBLU, 55);
            sRow(string("  ") + ICO_ARROW  + "  Use [2] Add Product to list your first item.", BBLU, BWHT, false, 55);
            sBot(BBLU, 55);
            reset();
        } else {
            // -- Available Products (Green table) -------------
            if (avail > 0) {
                secTitle("AVAILABLE FOR SALE  (" + intToStr(avail) + " item/s)", BGRN);
                cout << "\n";
                myProductTableHeader();
                int sn = 0;
                for (int i = 0; i < (int)products.size(); i++) {
                    if (products[i].getSellerId() == me->getStudentId() && !products[i].getIsSold()) {
                        sn++;
                        products[i].displayMyRow(sn);
                    }
                }
                myProductTableFooter();
                cout << "\n";
                statCard("Available Items", intToStr(avail), BGRN);
                cout << "  ";
                color(BGRN); cout << "  Total Value : Rs." << dblToStr(availVal) << "\n"; reset();
            }

            // -- Sold Products (Red table) ------
            if (sold > 0) {
                cout << "\n";
                secTitle("ALREADY SOLD  (" + intToStr(sold) + " item/s)", BRED);
                cout << "\n";
                myProductTableHeader();
                int sn = 0;
                for (int i = 0; i < (int)products.size(); i++) {
                    if (products[i].getSellerId() == me->getStudentId() && products[i].getIsSold()) {
                        sn++;
                        products[i].displayMyRow(sn);
                    }
                }
                myProductTableFooter();
                cout << "\n";
                statCard("Sold Items", intToStr(sold), BRED);
                cout << "  ";
                color(BRED); cout << "  Revenue     : Rs." << dblToStr(soldVal) << "\n"; reset();
            }

            // -- Summary Dashboard -----------
            cout << "\n";
            secTitle("STOREFRONT SUMMARY", BYLW);
            cout << "\n";
            statRow2("Total Listed", intToStr(serial), BBLU,
                     "Available",   intToStr(avail),  BGRN);
            cout << "\n";
            statRow2("Sold",         intToStr(sold),        BRED,
                     "Revenue",      "Rs."+dblToStr(soldVal), BMAG);
            cout << "\n";

            // Sold ratio progress bar
            int pct = (sold * 100) / serial;
            secTitle("SOLD PROGRESS", BYLW);
            progressBar(pct, 40, "  Sold %  ");
        }

        cout << "\n";
        // Bottom notice
        sTop(BBLU, SW);
        sRow(string("  ") + ICO_ARROW + "  Proceeding to Student Dashboard...", BBLU, BCYN, false, SW);
        sBot(BBLU, SW);
        cout << "\n";
        Sleep(1200);   // Show storefront for 1.2 sec before dashboard
    }

    //  LOGGED-IN MENU (Student Dashboard)
    void studentDashboard() {
        // Show personal storefront immediately upon every login
        showMyStorefront();

        int ch;
        do {
            clrscr();

            // Gradient top
            color(GRY); cout << "  " << rep(ICO_SHADE3, SW) << "\n"; reset();

            // Header
            dTop(BMAG);
            dEmpty(BMAG);
            dRow("  " + string(1,ICO_BLOCK) + string(1,ICO_BLOCK) +
                 "  B A N A S T H A L I _ M A R T   v3.0  " +
                 string(1,ICO_BLOCK) + string(1,ICO_BLOCK),
                 BMAG, BMAG, true);
            dRow("Campus Buy & Sell Marketplace", BMAG, BWHT, true);
            dMid(BMAG);
            dRow(string(1,ICO_CHECK) + "  Logged in as : " + me->getName() +
                 "   [" + me->getStudentId() + "]",
                 BMAG, BGRN, false);
            dEmpty(BMAG);
            dBot(BMAG);
            color(GRY); cout << "  " << rep(ICO_SHADE1, SW) << "\n"; reset();

            cout << "\n";

            // -- MY ACCOUNT group -------------
            color(BMAG);
            cout << "  " << S_TL << rep(S_H, SW-2) << S_TR << "\n";
            cout << "  " << S_V << " ";
            color(BYLW); cout << ICO_STAR << " MY ACCOUNT";
            color(BMAG); cout << string(SW - 15, ' ') << S_V << "\n";
            cout << "  " << S_ML << rep(S_H, SW-2) << S_MR << "\n";
            reset();

            color(BMAG); cout << "  " << S_V << "  ";
            color(BYLW); cout << "[1]"; color(BWHT); cout << "  " << ICO_ARROW << "  My Listed Products";
            color(BMAG); cout << string(38, ' ') << S_V << "\n";

            color(BMAG); cout << "  " << S_V << "  ";
            color(BYLW); cout << "[2]"; color(BWHT); cout << "  " << ICO_ARROW << "  Add Product for Sale";
            color(BMAG); cout << string(36, ' ') << S_V << "\n";

            color(BMAG); cout << "  " << S_V << "  ";
            color(BYLW); cout << "[7]"; color(BWHT); cout << "  " << ICO_ARROW << "  Change Password";
            color(BMAG); cout << string(41, ' ') << S_V << "\n";

            // -- MARKETPLACE group ----------
            color(BCYN);
            cout << "  " << S_ML << rep(S_H, SW-2) << S_MR << "\n";
            cout << "  " << S_V << " ";
            color(BYLW); cout << ICO_STAR << " MARKETPLACE";
            color(BCYN); cout << string(SW - 16, ' ') << S_V << "\n";
            cout << "  " << S_ML << rep(S_H, SW-2) << S_MR << "\n";
            reset();

            color(BCYN); cout << "  " << S_V << "  ";
            color(BYLW); cout << "[3]"; color(BWHT); cout << "  " << ICO_ARROW << "  View All Products";
            color(BCYN); cout << string(39, ' ') << S_V << "\n";

            color(BCYN); cout << "  " << S_V << "  ";
            color(BYLW); cout << "[4]"; color(BWHT); cout << "  " << ICO_ARROW << "  Buy a Product";
            color(BCYN); cout << string(43, ' ') << S_V << "\n";

            color(BCYN); cout << "  " << S_V << "  ";
            color(BYLW); cout << "[5]"; color(BWHT); cout << "  " << ICO_ARROW << "  Search Products";
            color(BCYN); cout << string(41, ' ') << S_V << "\n";

            color(BCYN); cout << "  " << S_V << "  ";
            color(BYLW); cout << "[6]"; color(BWHT); cout << "  " << ICO_ARROW << "  View All Students";
            color(BCYN); cout << string(39, ' ') << S_V << "\n";

            // -- SESSION group --------------
            color(BRED);
            cout << "  " << S_ML << rep(S_H, SW-2) << S_MR << "\n";
            cout << "  " << S_V << " ";
            color(BYLW); cout << ICO_STAR << " SESSION";
            color(BRED); cout << string(SW - 12, ' ') << S_V << "\n";
            cout << "  " << S_ML << rep(S_H, SW-2) << S_MR << "\n";
            reset();

            color(BRED); cout << "  " << S_V << "  ";
            color(BYLW); cout << "[8]"; color(BWHT); cout << "  " << ICO_ARROW << "  Logout";
            color(BRED); cout << string(50, ' ') << S_V << "\n";

            color(BRED);
            cout << "  " << S_BL << rep(S_H, SW-2) << S_BR << "\n";
            reset();

            cout << "\n";
            prompt("Your Choice");

            if (!(cin >> ch)) {
                showError("Invalid input!");
                cin.clear(); cin.ignore(1000,'\n'); continue;
            }

            switch (ch) {
                case 1: doMyProducts();    break;
                case 2: doAddProduct();    break;
                case 3: doAllProducts();   break;
                case 4: doBuy();           break;
                case 5: doSearch();        break;
                case 6: doStudents();      break;
                case 7: doChangePassword();break;
                case 8:
                    clrscr();
                    cout << "\n\n";
                    color(BRED);
                    cout << "  " << D_TL << rep(D_H, SW-2) << D_TR << "\n";
                    dEmpty(BRED);
                    dRow(string(2,ICO_DIAMOND) + "  LOGGED OUT SUCCESSFULLY  " + string(2,ICO_DIAMOND), BRED, BRED, true);
                    dRow("Goodbye,  " + me->getName() + "!", BRED, BWHT, true);
                    dEmpty(BRED);
                    color(BRED); cout << "  " << D_BL << rep(D_H, SW-2) << D_BR << "\n";
                    reset();
                    me = NULL;
                    Sleep(900);
                    break;
                default:
                    showError("Invalid choice! Select 1-8.");
                    pause();
            }
        } while (ch != 8);
    }

    //  MAIN MENU
    void run() {
        SetConsoleOutputCP(437);
        splashScreen();

        int ch;
        do {
            clrscr();

            // Top shade
            color(GRY); cout << "  " << rep(ICO_SHADE3, SW) << "\n"; reset();

            // Main header
            dTop(BYLW);
            dEmpty(BYLW);
            color(BYLW); cout << "  " << D_V << "  ";
            color(BYLW); cout << ICO_BLOCK; color(BCYN); cout << ICO_BLOCK;
            color(BCYN); cout << center("B A N A S T H A L I _ M A R T   v3.0", SW-14);
            color(BCYN); cout << ICO_BLOCK; color(BYLW); cout << ICO_BLOCK;
            color(BYLW); cout << "  " << D_V << "\n";
            dRow("Campus Buy & Sell Marketplace  ~  Banasthali Vidyapith", BYLW, BWHT, true);
            dRow(string(2,ICO_DIAMOND) + "  by JANHAVI YADAV  " + string(2,ICO_DIAMOND), BYLW, GRY, true);
            dEmpty(BYLW);
            dBot(BYLW);
            color(GRY); cout << "  " << rep(ICO_SHADE1, SW) << "\n"; reset();

            cout << "\n";

            // -- ACCOUNT group ---------
            color(BYLW);
            cout << "  " << S_TL << rep(S_H, SW-2) << S_TR << "\n";
            cout << "  " << S_V << " "; color(BCYN); cout << ICO_STAR << " ACCOUNT";
            color(GRY); cout << "   (All features require registration & login)";
            color(BYLW); cout << string(SW - 57, ' ') << S_V << "\n";
            cout << "  " << S_ML << rep(S_H, SW-2) << S_MR << "\n";
            reset();

            color(BYLW); cout << "  " << S_V << "   ";
            color(BYLW); cout << "[1]"; color(BWHT); cout << "  " << ICO_ARROW << "  Register as New Student";
            color(GRY);  cout << "  (Password set during registration)";
            color(BYLW); cout << string(12, ' ') << S_V << "\n";

            color(BYLW); cout << "  " << S_V << "   ";
            color(BGRN); cout << "[2]"; color(BWHT); cout << "  " << ICO_ARROW << "  Login to Your Account";
            color(GRY);  cout << "  (Student ID + Password required)";
            color(BYLW); cout << string(14, ' ') << S_V << "\n";

            // -- NOTICE box ---------
            color(BCYN);
            cout << "  " << S_ML << rep(S_H, SW-2) << S_MR << "\n";
            cout << "  " << S_V << " ";
            color(BCYN); cout << ICO_DIAMOND << " NOTICE";
            color(BCYN); cout << string(SW - 11, ' ') << S_V << "\n";
            cout << "  " << S_ML << rep(S_H, SW-2) << S_MR << "\n";
            reset();

            color(BCYN); cout << "  " << S_V << "   ";
            color(GRY); cout << "All marketplace features (Browse, Buy, Sell, Search) are";
            color(BCYN); cout << string(SW - 62, ' ') << S_V << "\n";
            color(BCYN); cout << "  " << S_V << "   ";
            color(GRY); cout << "available only after login. Please register first!";
            color(BCYN); cout << string(SW - 55, ' ') << S_V << "\n";

            // -- EXIT group ---------------
            color(BRED);
            cout << "  " << S_ML << rep(S_H, SW-2) << S_MR << "\n";
            cout << "  " << S_V << " "; color(BYLW); cout << ICO_STAR << " ";
            color(BRED); cout << "EXIT";
            color(BRED); cout << string(SW - 9, ' ') << S_V << "\n";
            cout << "  " << S_ML << rep(S_H, SW-2) << S_MR << "\n";
            reset();

            color(BRED); cout << "  " << S_V << "   ";
            color(BYLW); cout << "[3]"; color(BWHT); cout << "  " << ICO_ARROW << "  Exit Application";
            color(BRED); cout << string(39, ' ') << S_V << "\n";

            color(BRED);
            cout << "  " << S_BL << rep(S_H, SW-2) << S_BR << "\n";
            reset();

            cout << "\n";
            prompt("Your Choice");

            if (!(cin >> ch)) {
                showError("Enter a valid number! (1, 2 or 3)");
                cin.clear(); cin.ignore(1000,'\n'); continue;
            }

            switch (ch) {
                case 1: doRegister();     break;
                case 2: if (doLogin()) studentDashboard(); break;
                case 3:
                    clrscr();
                    cout << "\n\n";
                    dTop(BCYN);
                    dEmpty(BCYN);
                    dRow(string(2,ICO_STAR) + "  Thank you for using BANASTHALI_MART v3.0!  " + string(2,ICO_STAR), BCYN, BCYN, true);
                    dRow("All data saved. See you again!", BCYN, BWHT, true);
                    dRow(string(1,ICO_HEART) + "  Banasthali Vidyapith  ~  C++ OOPs Project  " + string(1,ICO_HEART), BCYN, BYLW, true);
                    dEmpty(BCYN);
                    dBot(BCYN);
                    cout << "\n\n";
                    reset();
                    break;
                default:
                    showError("Invalid choice! Select 1-7.");
                    pause();
            }
        } while (ch != 3);
    }
};

int main() {
    SetConsoleOutputCP(437);
    BanasthaliMart mart;
    mart.run();
    return 0;
}
