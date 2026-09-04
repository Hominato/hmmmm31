/**
 * Alta Federal Credit Union - DEMO Storage Engine
 * Manages LocalStorage persistence with realistic initial seed data.
 */

const STORAGE_KEYS = {
  USER: 'alta_demo_user',
  ACCOUNTS: 'alta_demo_accounts',
  TRANSACTIONS: 'alta_demo_transactions',
  CARDS: 'alta_demo_cards',
  BILLS: 'alta_demo_bills',
  TAXES: 'alta_demo_taxes',
  BENEFICIARIES: 'alta_demo_beneficiaries',
  NOTIFICATIONS: 'alta_demo_notifications',
  SETTINGS: 'alta_demo_settings',
  AUTH: 'alta_demo_auth'
};

/// Data Version — increment when seed data changes to force a reset
const DATA_VERSION = 'v6_meechie';

/// Seed Data Definition
const INITIAL_DATA = {
  user: {
    name: 'Meechie Demetrius',
    firstName: 'Meechie',
    lastName: 'Demetrius',
    email: 'meechiedemetrius333@gmail.com',
    phone: '213 805 9269',
    address: '332 W 13th St',
    city: 'Deer Park',
    state: 'NY',
    zip: '11729',
    username: 'meechiedemetrius',
    memberSince: '2021-03-15',
    securityStatus: 'Good',
    twoFactorEnabled: true
  },
  accounts: [
    {
      id: 'acc_checking',
      name: 'Everyday Checking',
      accountNumber: '**** 4821',
      fullNumber: '1029384821',
      routingNumber: '122000496',
      type: 'checking',
      balance: 150153.00,
      availableBalance: 150153.00,
      apy: '0.05%',
      created: '2021-03-15'
    },
    {
      id: 'acc_savings',
      name: 'Primary Savings',
      accountNumber: '**** 7392',
      fullNumber: '1029387392',
      routingNumber: '122000496',
      type: 'savings',
      balance: 350000.00,
      availableBalance: 350000.00,
      apy: '1.75%',
      created: '2021-03-15'
    }
  ],
  cards: [
    {
      id: 'card_debit_1',
      name: 'Everyday Debit Card',
      cardNumber: '4532 •••• •••• 4821',
      cardHolder: 'MEECHIE DEMETRIUS',
      expDate: '11/28',
      cvv: '•••',
      brand: 'VISA',
      type: 'Debit',
      status: 'active',
      dailyLimit: 2500,
      monthlyLimit: 10000,
      currentSpent: 642.10,
      linkedAccount: 'Everyday Checking ****4821'
    },
    {
      id: 'card_credit_1',
      name: 'Wells Fargo Active Cash Card',
      cardNumber: '5412 •••• •••• 9102',
      cardHolder: 'MEECHIE DEMETRIUS',
      expDate: '08/29',
      cvv: '•••',
      brand: 'MASTERCARD',
      type: 'Credit',
      status: 'active',
      creditLimit: 10000,
      currentSpent: 2550.00,
      availableCredit: 7450.00,
      linkedAccount: 'Primary Savings ****7392'
    }
  ],
  taxes: [
    {
      id: 'tax_1099_2025',
      name: 'Form 1099-INT — Interest Income Statement',
      formType: '1099-INT',
      taxYear: '2025',
      documentNumber: 'TAX-2025-1099-01',
      reportedAmount: 1250.00,
      taxWithheld: 0.00,
      payer: 'Wells Fargo Bank, N.A.',
      payerEin: 'XX-XXX4450',
      recipient: 'Meechie Demetrius',
      ssnMasked: '***-**-4450',
      status: 'Available',
      issueDate: 'Jan 31, 2026',
      description: 'Annual interest earned on Savings & Money Market accounts.',
      boxDetails: [
        { box: 'Box 1', title: 'Interest Income', amount: '$1,250.00' },
        { box: 'Box 2', title: 'Early Withdrawal Penalty', amount: '$0.00' },
        { box: 'Box 4', title: 'Federal Income Tax Withheld', amount: '$0.00' },
        { box: 'Box 8', title: 'Tax-Exempt Interest', amount: '$0.00' }
      ]
    },
    {
      id: 'tax_1098_2025',
      name: 'Form 1098 — Mortgage Interest Statement',
      formType: '1098',
      taxYear: '2025',
      documentNumber: 'TAX-2025-1098-02',
      reportedAmount: 3780.00,
      taxWithheld: 0.00,
      payer: 'Wells Fargo Bank, N.A.',
      payerEin: 'XX-XXX4450',
      recipient: 'Meechie Demetrius',
      ssnMasked: '***-**-4450',
      status: 'Available',
      issueDate: 'Jan 31, 2026',
      description: 'Mortgage interest and property tax payments reported to the IRS.',
      boxDetails: [
        { box: 'Box 1', title: 'Mortgage Interest Received', amount: '$3,780.00' },
        { box: 'Box 2', title: 'Outstanding Mortgage Principal', amount: '$142,500.00' },
        { box: 'Box 5', title: 'Mortgage Insurance Premiums', amount: '$0.00' },
        { box: 'Box 6', title: 'Points Paid on Purchase', amount: '$0.00' }
      ]
    },
    {
      id: 'tax_1099_2024',
      name: 'Form 1099-INT — 2024 Interest Income Statement',
      formType: '1099-INT',
      taxYear: '2024',
      documentNumber: 'TAX-2024-1099-01',
      reportedAmount: 980.50,
      taxWithheld: 0.00,
      payer: 'Wells Fargo Bank, N.A.',
      payerEin: 'XX-XXX4450',
      recipient: 'Meechie Demetrius',
      ssnMasked: '***-**-4450',
      status: 'Archived',
      issueDate: 'Jan 31, 2025',
      description: 'Prior tax year interest income statement for IRS filing.',
      boxDetails: [
        { box: 'Box 1', title: 'Interest Income', amount: '$980.50' },
        { box: 'Box 2', title: 'Early Withdrawal Penalty', amount: '$0.00' },
        { box: 'Box 4', title: 'Federal Income Tax Withheld', amount: '$0.00' }
      ]
    }
  ],
  bills: [
    {
      id: 'bill_1',
      biller: 'PSEG Long Island Electric',
      category: 'Utilities',
      accountNumber: 'ELEC-98214',
      dueDate: '2026-03-22',
      amount: 142.60,
      status: 'Unpaid',
      autoPay: false
    },
    {
      id: 'bill_2',
      biller: 'Optimum Fiber Internet',
      category: 'Internet',
      accountNumber: 'NET-44910',
      dueDate: '2026-03-25',
      amount: 79.99,
      status: 'Unpaid',
      autoPay: true
    },
    {
      id: 'bill_3',
      biller: 'Deer Park Water District',
      category: 'Utilities',
      accountNumber: 'WAT-10294',
      dueDate: '2026-03-28',
      amount: 45.20,
      status: 'Unpaid',
      autoPay: false
    }
  ],
  beneficiaries: [
    {
      id: 'ben_1',
      name: 'John Smith',
      nickname: 'Brother John',
      bankName: 'Chase Bank',
      accountNumberMasked: '**** 8821'
    },
    {
      id: 'ben_2',
      name: 'Sarah Williams',
      nickname: 'Sarah Freelance',
      bankName: 'Wells Fargo',
      accountNumberMasked: '**** 1942'
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      title: 'Account Statement Ready',
      message: 'Your February 2026 statement is now available to view.',
      date: '2026-03-01 08:00 AM',
      read: false,
      type: 'statement'
    },
    {
      id: 'notif_2',
      title: '2025 Tax Documents Available',
      message: 'Your 2025 Form 1099-INT and Form 1098 statements are now available for download in your Tax Dashboard.',
      date: '2026-02-25 02:30 PM',
      read: true,
      type: 'transaction'
    }
  ],
  settings: {
    theme: 'light',
    compactView: false,
    emailAlerts: true,
    smsAlerts: true,
    loginAlerts: true,
    billReminders: true,
    language: 'en-US',
    currency: 'USD'
  },
  transactions: [
    { id: 'trx_30', date: '2026-03-19', description: 'Amazon.com Purchase', category: 'Shopping', type: 'debit', amount: -84.23, balance: 65000.00, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_29', date: '2026-03-18', description: 'Payroll Direct Deposit - ACME Corp', category: 'Income', type: 'credit', amount: 4500.00, balance: 65084.23, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_28', date: '2026-03-16', description: 'PSEG Long Island Electric', category: 'Utilities', type: 'debit', amount: -142.60, balance: 60584.23, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_27', date: '2026-03-15', description: 'Trader Joes Groceries - Deer Park', category: 'Food & Dining', type: 'debit', amount: -126.42, balance: 60726.83, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_26', date: '2026-03-12', description: 'Transfer to Primary Savings', category: 'Transfers', type: 'debit', amount: -1000.00, balance: 60853.25, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_25', date: '2026-03-12', description: 'Transfer from Everyday Checking', category: 'Transfers', type: 'credit', amount: 1000.00, balance: 135000.00, accountId: 'acc_savings', status: 'Completed' },
    { id: 'trx_24', date: '2026-03-10', description: 'Starbucks Coffee', category: 'Food & Dining', type: 'debit', amount: -6.75, balance: 61853.25, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_23', date: '2026-03-08', description: 'Shell Oil Gas Station', category: 'Transportation', type: 'debit', amount: -48.50, balance: 61860.00, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_22', date: '2026-03-05', description: 'Netflix Subscription', category: 'Entertainment', type: 'debit', amount: -19.99, balance: 61908.50, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_21', date: '2026-03-02', description: 'Target Store Deer Park', category: 'Shopping', type: 'debit', amount: -112.30, balance: 61928.49, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_20', date: '2026-02-28', description: 'State Tax Estimated Payment', category: 'Taxes', type: 'debit', amount: -250.00, balance: 62040.79, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_19', date: '2026-02-25', description: 'ATM Cash Withdrawal', category: 'ATM', type: 'debit', amount: -100.00, balance: 62290.79, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_18', date: '2026-02-22', description: 'Whole Foods Market', category: 'Food & Dining', type: 'debit', amount: -145.80, balance: 62390.79, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_17', date: '2026-02-18', description: 'Optimum Fiber Internet Payment', category: 'Utilities', type: 'debit', amount: -79.99, balance: 62536.59, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_16', date: '2026-02-15', description: 'Payroll Direct Deposit', category: 'Income', type: 'credit', amount: 4500.00, balance: 62616.58, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_15', date: '2026-02-10', description: 'IRS Tax Preparation Fee', category: 'Taxes', type: 'debit', amount: -250.00, balance: 58116.58, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_14', date: '2026-02-01', description: 'Monthly Dividend Interest', category: 'Income', type: 'credit', amount: 196.85, balance: 134000.00, accountId: 'acc_savings', status: 'Completed' },
    { id: 'trx_13', date: '2026-01-28', description: 'State Tax Estimated Payment', category: 'Taxes', type: 'debit', amount: -250.00, balance: 58366.58, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_12', date: '2026-01-20', description: 'Home Depot Hardware', category: 'Shopping', type: 'debit', amount: -89.40, balance: 58616.58, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_11', date: '2026-01-15', description: 'Payroll Direct Deposit', category: 'Income', type: 'credit', amount: 4500.00, balance: 58705.98, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_10', date: '2026-01-10', description: 'Federal Tax Withholding', category: 'Taxes', type: 'debit', amount: -250.00, balance: 54205.98, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_9', date: '2025-12-28', description: 'State Tax Payment', category: 'Taxes', type: 'debit', amount: -250.00, balance: 54455.98, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_8', date: '2025-12-20', description: 'Apple Store Digital Purchase', category: 'Shopping', type: 'debit', amount: -4.99, balance: 54705.98, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_7', date: '2025-12-15', description: 'Payroll Direct Deposit', category: 'Income', type: 'credit', amount: 4500.00, balance: 54710.97, accountId: 'acc_checking', status: 'Completed' },
    { id: 'trx_6', date: '2025-11-28', description: 'Quarterly Tax Filing Payment', category: 'Taxes', type: 'debit', amount: -250.00, balance: 50210.97, accountId: 'acc_checking', status: 'Completed' }
  ]
};

// Storage Engine Implementation
class DemoStorage {
  static init() {
    // Clear stale data when seed version changes
    const storedVersion = localStorage.getItem('alta_demo_version');
    if (storedVersion !== DATA_VERSION) {
      localStorage.clear();
      localStorage.setItem('alta_demo_version', DATA_VERSION);
    }

    const existingUser = this.getUser();
    if (existingUser && existingUser.name !== 'Meechie Demetrius') {
      localStorage.clear();
      localStorage.setItem('alta_demo_version', DATA_VERSION);
    }

    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_DATA.user));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(INITIAL_DATA.accounts));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CARDS)) {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(INITIAL_DATA.cards));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TAXES)) {
      localStorage.setItem(STORAGE_KEYS.TAXES, JSON.stringify(INITIAL_DATA.taxes));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BILLS)) {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_DATA.bills));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BENEFICIARIES)) {
      localStorage.setItem(STORAGE_KEYS.BENEFICIARIES, JSON.stringify(INITIAL_DATA.beneficiaries));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_DATA.notifications));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_DATA.settings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_DATA.transactions));
    }
  }

  static get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getUser() {
    return this.get(STORAGE_KEYS.USER);
  }

  static updateUser(updatedUser) {
    const current = this.getUser();
    const merged = { ...current, ...updatedUser };
    this.set(STORAGE_KEYS.USER, merged);
    return merged;
  }

  static getAccounts() {
    return this.get(STORAGE_KEYS.ACCOUNTS) || [];
  }

  static getAccountById(id) {
    return this.getAccounts().find(a => a.id === id);
  }

  static updateAccountBalance(accountId, deltaAmount) {
    const accounts = this.getAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index !== -1) {
      accounts[index].balance += deltaAmount;
      accounts[index].availableBalance += deltaAmount;
      this.set(STORAGE_KEYS.ACCOUNTS, accounts);
      return accounts[index];
    }
    return null;
  }

  static getTransactions() {
    return this.get(STORAGE_KEYS.TRANSACTIONS) || [];
  }

  static addTransaction(trx) {
    const transactions = this.getTransactions();
    const newTrx = {
      id: 'trx_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      ...trx
    };
    transactions.unshift(newTrx);
    this.set(STORAGE_KEYS.TRANSACTIONS, transactions);
    return newTrx;
  }

  static getCards() {
    return this.get(STORAGE_KEYS.CARDS) || [];
  }

  static toggleCardFreeze(cardId) {
    const cards = this.getCards();
    const card = cards.find(c => c.id === cardId);
    if (card) {
      card.status = card.status === 'active' ? 'frozen' : 'active';
      this.set(STORAGE_KEYS.CARDS, cards);
      return card;
    }
    return null;
  }

  static getBills() {
    return this.get(STORAGE_KEYS.BILLS) || [];
  }

  static payBill(billId, accountId) {
    const bills = this.getBills();
    const bill = bills.find(b => b.id === billId);
    if (bill && bill.status !== 'Paid') {
      const account = this.getAccountById(accountId);
      if (!account || account.balance < bill.amount) {
        throw new Error('Insufficient balance to pay bill.');
      }
      // Deduct balance
      this.updateAccountBalance(accountId, -bill.amount);
      // Mark paid
      bill.status = 'Paid';
      this.set(STORAGE_KEYS.BILLS, bills);
      // Create transaction
      this.addTransaction({
        description: `Bill Payment - ${bill.biller}`,
        category: bill.category || 'Utilities',
        type: 'debit',
        amount: -bill.amount,
        balance: account.balance - bill.amount,
        accountId: accountId
      });
      return bill;
    }
    return null;
  }

  static getTaxes() {
    return this.get(STORAGE_KEYS.TAXES) || [];
  }

  static getTaxById(taxId) {
    const taxes = this.getTaxes();
    return taxes.find(t => t.id === taxId) || null;
  }

  static requestTaxDocument(reqData) {
    const taxes = this.getTaxes();
    const reqId = 'TAX-REQ-' + Math.floor(100000 + Math.random() * 900000);
    const newDoc = {
      id: 'tax_req_' + Date.now(),
      name: `${reqData.formType} — ${reqData.taxYear} Requested Copy`,
      formType: reqData.formType,
      taxYear: reqData.taxYear,
      documentNumber: reqId,
      reportedAmount: 0.00,
      taxWithheld: 0.00,
      payer: 'Wells Fargo Bank, N.A.',
      payerEin: 'XX-XXX4450',
      recipient: 'Meechie Demetrius',
      ssnMasked: '***-**-4450',
      status: 'Processing',
      issueDate: new Date().toISOString().split('T')[0],
      description: `Requested copy via ${reqData.deliveryMethod || 'Electronic Download'}`
    };
    taxes.unshift(newDoc);
    this.set(STORAGE_KEYS.TAXES, taxes);
    return newDoc;
  }

  static getBeneficiaries() {
    return this.get(STORAGE_KEYS.BENEFICIARIES) || [];
  }

  static addBeneficiary(ben) {
    const list = this.getBeneficiaries();
    const newBen = {
      id: 'ben_' + Date.now(),
      ...ben
    };
    list.push(newBen);
    this.set(STORAGE_KEYS.BENEFICIARIES, list);
    return newBen;
  }

  static deleteBeneficiary(id) {
    const list = this.getBeneficiaries().filter(b => b.id !== id);
    this.set(STORAGE_KEYS.BENEFICIARIES, list);
  }

  static getNotifications() {
    return this.get(STORAGE_KEYS.NOTIFICATIONS) || [];
  }

  static markNotificationRead(id) {
    const notifs = this.getNotifications();
    const item = notifs.find(n => n.id === id);
    if (item) {
      item.read = true;
      this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  static clearAllNotifications() {
    this.set(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  static getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS) || {};
  }

  static updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    this.set(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  static resetDemoData() {
    localStorage.clear();
    this.init();
  }
}

// Auto Initialize
DemoStorage.init();
