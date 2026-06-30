export type TransactionType = "credit" | "debit";
export type TransactionStatus = "Pending" | "Completed" | "Failed";

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
}

export interface Payee {
  id: string;
  name: string;
  accountLast4: string;
  category: string;
}

export interface BillPayment {
  id: string;
  payee: string;
  amount: number;
  date: string;
  status: string;
}

export interface ScheduledPayment {
  id: string;
  payee: string;
  amount: number;
  date: string;
  status: string;
}

export interface Statement {
  id: string;
  period: string;
  date: string;
  balance: string;
  balanceRaw: number;
}

export interface UserRecord {
  id: string;
  userId: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  lastStatementDate: string;
  lastStatementBalance: number;
  memberSince: string;
  transactionKey: string;
}

export type TransactionKey = "user1" | "user2" | "user3";

// djb2-style hash (initial h=5381; per char: h = (Math.imul(31, h) + c) | 0)
export const hashPassword = (str: string): string => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16).padStart(8, "0");
};

export const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const PREDEFINED_USERS: UserRecord[] = [
  {
    id: "user_001",
    userId: "naomi",
    passwordHash: hashPassword("Mypassw0rd@1"),
    firstName: "Naomi",
    lastName: "Carter",
    email: "codewitmui@gmail.com",
    phone: "+1 (415) 555-0198",
    avatar: "/naomi.png",
    accountNumber: "100400870987",
    routingNumber: "121000248",
    accountType: "Premier Checking",
    balance: 53402785.25,
    availableBalance: 53387785.25,
    pendingBalance: 15000.0,
    lastStatementDate: "05/31/2026",
    lastStatementBalance: 53189240.18,
    memberSince: "March 2018",
    transactionKey: "user1",
  },
  {
    id: "user_002",
    userId: "marcus_fargo",
    passwordHash: hashPassword("WellsFargo@5678"),
    firstName: "Marcus",
    lastName: "Williams",
    email: "codewitmui@gmail.com",
    phone: "+1 (312) 555-0142",
    avatar: "/marcus.png",
    accountNumber: "200500233421",
    routingNumber: "121000248",
    accountType: "Portfolio by Wells Fargo",
    balance: 35215632.45,
    availableBalance: 35205632.45,
    pendingBalance: 10000.0,
    lastStatementDate: "05/31/2026",
    lastStatementBalance: 35042180.90,
    memberSince: "July 2019",
    transactionKey: "user2",
  },
  {
    id: "user_003",
    userId: "elena_wells",
    passwordHash: hashPassword("WellsFargo@9012"),
    firstName: "Elena",
    lastName: "Rodriguez",
    email: "codewitmui@gmail.com",
    phone: "+1 (646) 555-0173",
    avatar: "/elena.png",
    accountNumber: "300600787834",
    routingNumber: "121000248",
    accountType: "Private Bank Checking",
    balance: 73604602.10,
    availableBalance: 73589602.10,
    pendingBalance: 15000.0,
    lastStatementDate: "05/31/2026",
    lastStatementBalance: 73388741.55,
    memberSince: "January 2020",
    transactionKey: "user3",
  },
];

// ─── USER 1 — Naomi Carter (Premier Checking · Beverly Hills, CA) ──────────
const user1Transactions: Transaction[] = [
  { id: "u1_001", date: daysAgo(1),  merchant: "Carter Ventures LLC",       category: "Income",       type: "credit", amount: 185000.00, status: "Pending",   description: "Business Revenue - Direct Deposit" },
  { id: "u1_002", date: daysAgo(2),  merchant: "Nobu Restaurant",           category: "Dining",       type: "debit",  amount: 487.30,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_003", date: daysAgo(3),  merchant: "Wells Fargo Mortgage",      category: "Housing",      type: "debit",  amount: 18500.00, status: "Completed", description: "Mortgage Payment - Acc. #BH-7821" },
  { id: "u1_004", date: daysAgo(4),  merchant: "Whole Foods Market - BH",   category: "Groceries",    type: "debit",  amount: 612.44,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_005", date: daysAgo(5),  merchant: "SoulCycle",                 category: "Health",       type: "debit",  amount: 360.00,   status: "Completed", description: "Monthly Membership - 12 classes" },
  { id: "u1_006", date: daysAgo(6),  merchant: "BMW Financial Services",    category: "Auto",         type: "debit",  amount: 2140.00,  status: "Completed", description: "Auto Loan Payment - BMW 7 Series" },
  { id: "u1_007", date: daysAgo(7),  merchant: "Southern California Edison","category": "Utilities",   type: "debit",  amount: 487.20,   status: "Completed", description: "Bill Pay - Electric Service" },
  { id: "u1_008", date: daysAgo(8),  merchant: "Netflix",                   category: "Subscription", type: "debit",  amount: 22.99,    status: "Completed", description: "Monthly Subscription" },
  { id: "u1_009", date: daysAgo(9),  merchant: "Gelson's Market",           category: "Groceries",    type: "debit",  amount: 294.18,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_010", date: daysAgo(10), merchant: "Spectrum Cable & Internet", category: "Utilities",    type: "debit",  amount: 249.99,   status: "Completed", description: "Bill Pay - Internet & TV Bundle" },
  { id: "u1_011", date: daysAgo(11), merchant: "Zelle — Sarah M.",          category: "Transfer",     type: "credit", amount: 5000.00,  status: "Completed", description: "Zelle Received" },
  { id: "u1_012", date: daysAgo(12), merchant: "The Ivy Restaurant",        category: "Dining",       type: "debit",  amount: 382.60,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_013", date: daysAgo(14), merchant: "AT&T Wireless",             category: "Utilities",    type: "debit",  amount: 345.00,   status: "Completed", description: "Bill Pay - 3 Lines Family Plan" },
  { id: "u1_014", date: daysAgo(15), merchant: "Erewhon Market",            category: "Groceries",    type: "debit",  amount: 178.55,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_015", date: daysAgo(16), merchant: "Allstate Insurance",        category: "Insurance",    type: "debit",  amount: 1240.00,  status: "Completed", description: "Bill Pay - Home & Auto Bundle" },
  { id: "u1_016", date: daysAgo(17), merchant: "Cedars-Sinai Medical",      category: "Health",       type: "debit",  amount: 850.00,   status: "Completed", description: "Medical Copay - Specialist Visit" },
  { id: "u1_017", date: daysAgo(18), merchant: "Carter Ventures LLC",       category: "Income",       type: "credit", amount: 185000.00,status: "Completed", description: "Business Revenue - Direct Deposit" },
  { id: "u1_018", date: daysAgo(19), merchant: "Amazon.com",                category: "Shopping",     type: "debit",  amount: 1248.96,  status: "Completed", description: "Online Purchase" },
  { id: "u1_019", date: daysAgo(20), merchant: "IRS USATAXPYMT",           category: "Taxes",        type: "debit",  amount: 24500.00, status: "Completed", description: "Quarterly Estimated Tax Payment" },
  { id: "u1_020", date: daysAgo(21), merchant: "Montessori School LA",      category: "Education",    type: "debit",  amount: 4800.00,  status: "Completed", description: "Tuition - Monthly Payment" },
  { id: "u1_021", date: daysAgo(22), merchant: "Bristol Farms",             category: "Groceries",    type: "debit",  amount: 221.43,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_022", date: daysAgo(23), merchant: "Wells Fargo ATM",           category: "ATM",          type: "debit",  amount: 1000.00,  status: "Completed", description: "ATM Withdrawal" },
  { id: "u1_023", date: daysAgo(24), merchant: "HOA Beverly Hills",         category: "Housing",      type: "debit",  amount: 1850.00,  status: "Completed", description: "Bill Pay - Monthly HOA Fee" },
  { id: "u1_024", date: daysAgo(25), merchant: "Saks Fifth Avenue",         category: "Shopping",     type: "debit",  amount: 2340.00,  status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_025", date: daysAgo(27), merchant: "SoCal Gas",                 category: "Utilities",    type: "debit",  amount: 312.80,   status: "Completed", description: "Bill Pay - Natural Gas" },
  { id: "u1_026", date: daysAgo(28), merchant: "Spotify Premium",           category: "Subscription", type: "debit",  amount: 17.99,    status: "Completed", description: "Monthly Subscription - Family Plan" },
  { id: "u1_027", date: daysAgo(30), merchant: "Apple Services",            category: "Subscription", type: "debit",  amount: 32.95,    status: "Completed", description: "iCloud+ & Apple One Family" },
  { id: "u1_028", date: daysAgo(32), merchant: "Chateau Marmont",           category: "Dining",       type: "debit",  amount: 645.90,   status: "Completed", description: "Restaurant & Lounge" },
  { id: "u1_029", date: daysAgo(35), merchant: "Carter Ventures LLC",       category: "Income",       type: "credit", amount: 185000.00,status: "Completed", description: "Business Revenue - Direct Deposit" },
  { id: "u1_030", date: daysAgo(37), merchant: "CVS Pharmacy",              category: "Health",       type: "debit",  amount: 124.56,   status: "Completed", description: "Prescription & Health Items" },
  { id: "u1_031", date: daysAgo(38), merchant: "Wells Fargo Mortgage",      category: "Housing",      type: "debit",  amount: 18500.00, status: "Completed", description: "Mortgage Payment - Acc. #BH-7821" },
  { id: "u1_032", date: daysAgo(39), merchant: "American Express",          category: "Transfer",     type: "debit",  amount: 18240.00, status: "Completed", description: "Credit Card Payment - AMEX Platinum" },
  { id: "u1_033", date: daysAgo(40), merchant: "Delta Air Lines",           category: "Travel",       type: "debit",  amount: 4820.00,  status: "Completed", description: "First Class - LAX to JFK" },
  { id: "u1_034", date: daysAgo(42), merchant: "Four Seasons Hotel NYC",    category: "Travel",       type: "debit",  amount: 3480.00,  status: "Completed", description: "Hotel Stay - 3 Nights" },
  { id: "u1_035", date: daysAgo(44), merchant: "Whole Foods Market",        category: "Groceries",    type: "debit",  amount: 387.22,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_036", date: daysAgo(46), merchant: "SoulCycle",                 category: "Health",       type: "debit",  amount: 360.00,   status: "Completed", description: "Monthly Membership" },
  { id: "u1_037", date: daysAgo(48), merchant: "LA Department of Water",    category: "Utilities",    type: "debit",  amount: 198.40,   status: "Completed", description: "Bill Pay - Water & Sewer" },
  { id: "u1_038", date: daysAgo(50), merchant: "BMW Financial Services",    category: "Auto",         type: "debit",  amount: 2140.00,  status: "Completed", description: "Auto Loan Payment" },
  { id: "u1_039", date: daysAgo(52), merchant: "Hulu",                      category: "Subscription", type: "debit",  amount: 17.99,    status: "Completed", description: "Monthly Subscription" },
  { id: "u1_040", date: daysAgo(53), merchant: "Carter Ventures LLC",       category: "Income",       type: "credit", amount: 185000.00,status: "Completed", description: "Business Revenue - Direct Deposit" },
  { id: "u1_041", date: daysAgo(55), merchant: "Gucci - Rodeo Drive",       category: "Shopping",     type: "debit",  amount: 3890.00,  status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_042", date: daysAgo(58), merchant: "Southern California Edison","category": "Utilities",   type: "debit",  amount: 512.60,   status: "Completed", description: "Bill Pay - Electric Service" },
  { id: "u1_043", date: daysAgo(60), merchant: "Montessori School LA",      category: "Education",    type: "debit",  amount: 4800.00,  status: "Completed", description: "Tuition - Monthly Payment" },
  { id: "u1_044", date: daysAgo(62), merchant: "State Farm Insurance",      category: "Insurance",    type: "debit",  amount: 880.00,   status: "Completed", description: "Bill Pay - Life Insurance Premium" },
  { id: "u1_045", date: daysAgo(65), merchant: "Nobu Malibu",               category: "Dining",       type: "debit",  amount: 728.40,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_046", date: daysAgo(67), merchant: "Gelson's Market",           category: "Groceries",    type: "debit",  amount: 318.20,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_047", date: daysAgo(70), merchant: "Wells Fargo Mortgage",      category: "Housing",      type: "debit",  amount: 18500.00, status: "Completed", description: "Mortgage Payment - Acc. #BH-7821" },
  { id: "u1_048", date: daysAgo(72), merchant: "HOA Beverly Hills",         category: "Housing",      type: "debit",  amount: 1850.00,  status: "Completed", description: "Bill Pay - Monthly HOA Fee" },
  { id: "u1_049", date: daysAgo(74), merchant: "Wells Fargo Investment",    category: "Transfer",     type: "debit",  amount: 50000.00, status: "Completed", description: "Transfer to Brokerage Account" },
  { id: "u1_050", date: daysAgo(76), merchant: "Carter Ventures LLC",       category: "Income",       type: "credit", amount: 185000.00,status: "Completed", description: "Business Revenue - Direct Deposit" },
  { id: "u1_051", date: daysAgo(78), merchant: "Spectrum Cable & Internet", category: "Utilities",    type: "debit",  amount: 249.99,   status: "Completed", description: "Bill Pay - Internet & TV Bundle" },
  { id: "u1_052", date: daysAgo(80), merchant: "AT&T Wireless",             category: "Utilities",    type: "debit",  amount: 345.00,   status: "Completed", description: "Bill Pay - Family Plan" },
  { id: "u1_053", date: daysAgo(82), merchant: "Barneys New York",          category: "Shopping",     type: "debit",  amount: 1640.00,  status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_054", date: daysAgo(85), merchant: "IRS USATAXPYMT",           category: "Taxes",        type: "debit",  amount: 24500.00, status: "Completed", description: "Quarterly Estimated Tax Payment" },
  { id: "u1_055", date: daysAgo(88), merchant: "Erewhon Market",            category: "Groceries",    type: "debit",  amount: 204.88,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_056", date: daysAgo(90), merchant: "Netflix",                   category: "Subscription", type: "debit",  amount: 22.99,    status: "Completed", description: "Monthly Subscription" },
  { id: "u1_057", date: daysAgo(94), merchant: "Wells Fargo Mortgage",      category: "Housing",      type: "debit",  amount: 18500.00, status: "Completed", description: "Mortgage Payment - Acc. #BH-7821" },
  { id: "u1_058", date: daysAgo(96), merchant: "Allstate Insurance",        category: "Insurance",    type: "debit",  amount: 1240.00,  status: "Completed", description: "Bill Pay - Home & Auto Bundle" },
  { id: "u1_059", date: daysAgo(99), merchant: "Carter Ventures LLC",       category: "Income",       type: "credit", amount: 185000.00,status: "Completed", description: "Business Revenue - Direct Deposit" },
  { id: "u1_060", date: daysAgo(102), merchant: "Zelle — Sarah M.",         category: "Transfer",     type: "debit",  amount: 8000.00,  status: "Completed", description: "Zelle Payment" },
];

// ─── USER 2 — Marcus Williams (Portfolio · Chicago, IL) ─────────────────────
const user2Transactions: Transaction[] = [
  { id: "u2_001", date: daysAgo(1),  merchant: "Williams Capital Group",    category: "Income",       type: "credit", amount: 125000.00, status: "Pending",   description: "Direct Deposit - Executive Salary" },
  { id: "u2_002", date: daysAgo(2),  merchant: "Gibsons Bar & Steakhouse", category: "Dining",       type: "debit",  amount: 892.40,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_003", date: daysAgo(3),  merchant: "Chase Mortgage",            category: "Housing",      type: "debit",  amount: 12400.00, status: "Completed", description: "Mortgage Payment - Property #CH-4419" },
  { id: "u2_004", date: daysAgo(4),  merchant: "Mariano's Fresh Market",   category: "Groceries",    type: "debit",  amount: 348.60,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_005", date: daysAgo(5),  merchant: "Equinox Gold Coast",        category: "Health",       type: "debit",  amount: 265.00,   status: "Completed", description: "Monthly Membership - Premium" },
  { id: "u2_006", date: daysAgo(6),  merchant: "Mercedes-Benz Financial",   category: "Auto",         type: "debit",  amount: 2890.00,  status: "Completed", description: "Lease Payment - S-Class 580" },
  { id: "u2_007", date: daysAgo(7),  merchant: "ComEd",                     category: "Utilities",    type: "debit",  amount: 342.80,   status: "Completed", description: "Bill Pay - Electric Service" },
  { id: "u2_008", date: daysAgo(8),  merchant: "Verizon Wireless",          category: "Utilities",    type: "debit",  amount: 398.00,   status: "Completed", description: "Bill Pay - Business & Personal Lines" },
  { id: "u2_009", date: daysAgo(9),  merchant: "Zelle — David R.",          category: "Transfer",     type: "credit", amount: 15000.00, status: "Completed", description: "Zelle Received - Business" },
  { id: "u2_010", date: daysAgo(10), merchant: "Alinea Restaurant",         category: "Dining",       type: "debit",  amount: 1240.00,  status: "Completed", description: "Fine Dining - Private Party" },
  { id: "u2_011", date: daysAgo(11), merchant: "Peoples Gas",               category: "Utilities",    type: "debit",  amount: 284.40,   status: "Completed", description: "Bill Pay - Natural Gas" },
  { id: "u2_012", date: daysAgo(12), merchant: "Williams Capital Group",    category: "Income",       type: "credit", amount: 125000.00,status: "Completed", description: "Direct Deposit - Executive Salary" },
  { id: "u2_013", date: daysAgo(13), merchant: "Comcast Xfinity Business",  category: "Utilities",    type: "debit",  amount: 289.99,   status: "Completed", description: "Bill Pay - Internet & Phone Bundle" },
  { id: "u2_014", date: daysAgo(14), merchant: "Nordstrom Michigan Ave",    category: "Shopping",     type: "debit",  amount: 3240.00,  status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_015", date: daysAgo(15), merchant: "IRS USATAXPYMT",           category: "Taxes",        type: "debit",  amount: 38000.00, status: "Completed", description: "Federal Tax Payment - Quarterly" },
  { id: "u2_016", date: daysAgo(16), merchant: "Illinois Dept of Revenue",  category: "Taxes",        type: "debit",  amount: 8400.00,  status: "Completed", description: "State Income Tax - Q2" },
  { id: "u2_017", date: daysAgo(17), merchant: "Lurie Children's Hospital", category: "Health",       type: "debit",  amount: 1200.00,  status: "Completed", description: "Medical Services Copay" },
  { id: "u2_018", date: daysAgo(18), merchant: "HOA Gold Coast Towers",     category: "Housing",      type: "debit",  amount: 2400.00,  status: "Completed", description: "Bill Pay - Monthly HOA Assessment" },
  { id: "u2_019", date: daysAgo(19), merchant: "Fidelity Investments",      category: "Transfer",     type: "debit",  amount: 75000.00, status: "Completed", description: "Transfer to Investment Account" },
  { id: "u2_020", date: daysAgo(21), merchant: "Jewel-Osco",                category: "Groceries",    type: "debit",  amount: 276.44,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_021", date: daysAgo(23), merchant: "Amazon.com",                category: "Shopping",     type: "debit",  amount: 2148.96,  status: "Completed", description: "Online Purchase" },
  { id: "u2_022", date: daysAgo(24), merchant: "United Airlines",           category: "Travel",       type: "debit",  amount: 8640.00,  status: "Completed", description: "Business Class - ORD to LHR" },
  { id: "u2_023", date: daysAgo(25), merchant: "Chase Mortgage",            category: "Housing",      type: "debit",  amount: 12400.00, status: "Completed", description: "Mortgage Payment" },
  { id: "u2_024", date: daysAgo(27), merchant: "Williams Capital Group",    category: "Income",       type: "credit", amount: 125000.00,status: "Completed", description: "Direct Deposit - Executive Salary" },
  { id: "u2_025", date: daysAgo(29), merchant: "Ritz-Carlton Chicago",      category: "Travel",       type: "debit",  amount: 2860.00,  status: "Completed", description: "Hotel Stay - 4 Nights" },
  { id: "u2_026", date: daysAgo(31), merchant: "Aon Insurance",             category: "Insurance",    type: "debit",  amount: 4200.00,  status: "Completed", description: "Bill Pay - Executive Umbrella Policy" },
  { id: "u2_027", date: daysAgo(33), merchant: "Apple Services",            category: "Subscription", type: "debit",  amount: 32.95,    status: "Completed", description: "Apple One Premier" },
  { id: "u2_028", date: daysAgo(35), merchant: "Sushi-San",                 category: "Dining",       type: "debit",  amount: 548.80,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_029", date: daysAgo(37), merchant: "Mercedes-Benz Financial",   category: "Auto",         type: "debit",  amount: 2890.00,  status: "Completed", description: "Lease Payment" },
  { id: "u2_030", date: daysAgo(40), merchant: "Mariano's Fresh Market",   category: "Groceries",    type: "debit",  amount: 412.30,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_031", date: daysAgo(42), merchant: "Williams Capital Group",    category: "Income",       type: "credit", amount: 125000.00,status: "Completed", description: "Direct Deposit - Executive Salary" },
  { id: "u2_032", date: daysAgo(44), merchant: "ComEd",                     category: "Utilities",    type: "debit",  amount: 318.40,   status: "Completed", description: "Bill Pay - Electric Service" },
  { id: "u2_033", date: daysAgo(46), merchant: "Chase Mortgage",            category: "Housing",      type: "debit",  amount: 12400.00, status: "Completed", description: "Mortgage Payment" },
  { id: "u2_034", date: daysAgo(48), merchant: "HOA Gold Coast Towers",     category: "Housing",      type: "debit",  amount: 2400.00,  status: "Completed", description: "Bill Pay - HOA Assessment" },
  { id: "u2_035", date: daysAgo(50), merchant: "Netflix",                   category: "Subscription", type: "debit",  amount: 22.99,    status: "Completed", description: "Monthly Subscription" },
  { id: "u2_036", date: daysAgo(52), merchant: "Spotify Premium",           category: "Subscription", type: "debit",  amount: 17.99,    status: "Completed", description: "Monthly Subscription" },
  { id: "u2_037", date: daysAgo(54), merchant: "Fidelity Investments",      category: "Transfer",     type: "debit",  amount: 75000.00, status: "Completed", description: "Transfer to Investment Account" },
  { id: "u2_038", date: daysAgo(56), merchant: "Wells Fargo ATM",           category: "ATM",          type: "debit",  amount: 2000.00,  status: "Completed", description: "ATM Withdrawal" },
  { id: "u2_039", date: daysAgo(58), merchant: "Peoples Gas",               category: "Utilities",    type: "debit",  amount: 296.60,   status: "Completed", description: "Bill Pay - Natural Gas" },
  { id: "u2_040", date: daysAgo(60), merchant: "Williams Capital Group",    category: "Income",       type: "credit", amount: 125000.00,status: "Completed", description: "Direct Deposit - Executive Salary" },
  { id: "u2_041", date: daysAgo(62), merchant: "Quartino Ristorante",       category: "Dining",       type: "debit",  amount: 624.40,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_042", date: daysAgo(64), merchant: "IRS USATAXPYMT",           category: "Taxes",        type: "debit",  amount: 38000.00, status: "Completed", description: "Federal Tax Payment - Quarterly" },
  { id: "u2_043", date: daysAgo(67), merchant: "Verizon Wireless",          category: "Utilities",    type: "debit",  amount: 398.00,   status: "Completed", description: "Bill Pay - Lines" },
  { id: "u2_044", date: daysAgo(70), merchant: "Chase Mortgage",            category: "Housing",      type: "debit",  amount: 12400.00, status: "Completed", description: "Mortgage Payment" },
  { id: "u2_045", date: daysAgo(72), merchant: "Equinox Gold Coast",        category: "Health",       type: "debit",  amount: 265.00,   status: "Completed", description: "Monthly Membership" },
  { id: "u2_046", date: daysAgo(75), merchant: "Jewel-Osco",                category: "Groceries",    type: "debit",  amount: 318.22,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_047", date: daysAgo(78), merchant: "Williams Capital Group",    category: "Income",       type: "credit", amount: 125000.00,status: "Completed", description: "Direct Deposit - Executive Salary" },
  { id: "u2_048", date: daysAgo(80), merchant: "Comcast Xfinity Business",  category: "Utilities",    type: "debit",  amount: 289.99,   status: "Completed", description: "Bill Pay - Internet & Phone" },
  { id: "u2_049", date: daysAgo(82), merchant: "Amazon.com",                category: "Shopping",     type: "debit",  amount: 1642.00,  status: "Completed", description: "Online Purchase" },
  { id: "u2_050", date: daysAgo(85), merchant: "Aon Insurance",             category: "Insurance",    type: "debit",  amount: 4200.00,  status: "Completed", description: "Bill Pay - Insurance Premium" },
  { id: "u2_051", date: daysAgo(88), merchant: "Mercedes-Benz Financial",   category: "Auto",         type: "debit",  amount: 2890.00,  status: "Completed", description: "Lease Payment" },
  { id: "u2_052", date: daysAgo(90), merchant: "Fidelity Investments",      category: "Transfer",     type: "debit",  amount: 75000.00, status: "Completed", description: "Transfer to Investment Account" },
  { id: "u2_053", date: daysAgo(95), merchant: "Chase Mortgage",            category: "Housing",      type: "debit",  amount: 12400.00, status: "Completed", description: "Mortgage Payment" },
  { id: "u2_054", date: daysAgo(98), merchant: "Williams Capital Group",    category: "Income",       type: "credit", amount: 125000.00,status: "Completed", description: "Direct Deposit - Executive Salary" },
];

// ─── USER 3 — Elena Rodriguez (Private Bank · San Francisco, CA) ─────────────
const user3Transactions: Transaction[] = [
  { id: "u3_001", date: daysAgo(1),  merchant: "NovaTech Solutions — Payroll", category: "Income",       type: "credit", amount: 280000.00, status: "Pending",   description: "Direct Deposit - CEO Compensation" },
  { id: "u3_002", date: daysAgo(2),  merchant: "Bix Restaurant SF",            category: "Dining",       type: "debit",  amount: 1240.80,  status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_003", date: daysAgo(3),  merchant: "Wells Fargo Home Mortgage",    category: "Housing",      type: "debit",  amount: 24000.00, status: "Completed", description: "Mortgage - Pacific Heights Property" },
  { id: "u3_004", date: daysAgo(4),  merchant: "Bi-Rite Market",               category: "Groceries",    type: "debit",  amount: 428.90,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_005", date: daysAgo(5),  merchant: "Equinox SF",                   category: "Health",       type: "debit",  amount: 300.00,   status: "Completed", description: "Monthly Membership - Premium" },
  { id: "u3_006", date: daysAgo(6),  merchant: "Tesla Financial Services",     category: "Auto",         type: "debit",  amount: 2480.00,  status: "Completed", description: "Loan Payment - Model S Plaid" },
  { id: "u3_007", date: daysAgo(7),  merchant: "PG&E",                         category: "Utilities",    type: "debit",  amount: 638.40,   status: "Completed", description: "Bill Pay - Electric & Gas" },
  { id: "u3_008", date: daysAgo(8),  merchant: "AT&T Business",                category: "Utilities",    type: "debit",  amount: 420.00,   status: "Completed", description: "Bill Pay - Business Lines & Fiber" },
  { id: "u3_009", date: daysAgo(9),  merchant: "Zelle — James W.",             category: "Transfer",     type: "credit", amount: 25000.00, status: "Completed", description: "Zelle Received - Board Distribution" },
  { id: "u3_010", date: daysAgo(10), merchant: "Saison Restaurant",            category: "Dining",       type: "debit",  amount: 2840.00,  status: "Completed", description: "Private Dining - 8 Guests" },
  { id: "u3_011", date: daysAgo(11), merchant: "Vanguard Brokerage",           category: "Transfer",     type: "debit",  amount: 200000.00,status: "Completed", description: "Transfer to Investment Portfolio" },
  { id: "u3_012", date: daysAgo(12), merchant: "NovaTech Solutions — Payroll", category: "Income",       type: "credit", amount: 280000.00,status: "Completed", description: "Direct Deposit - CEO Compensation" },
  { id: "u3_013", date: daysAgo(13), merchant: "Comcast Business",             category: "Utilities",    type: "debit",  amount: 389.99,   status: "Completed", description: "Bill Pay - Internet & Media" },
  { id: "u3_014", date: daysAgo(14), merchant: "IRS USATAXPYMT",              category: "Taxes",        type: "debit",  amount: 95000.00, status: "Completed", description: "Quarterly Estimated Tax - Federal" },
  { id: "u3_015", date: daysAgo(15), merchant: "CA Franchise Tax Board",       category: "Taxes",        type: "debit",  amount: 28000.00, status: "Completed", description: "Quarterly Estimated Tax - State" },
  { id: "u3_016", date: daysAgo(16), merchant: "UCSF Medical Center",          category: "Health",       type: "debit",  amount: 2400.00,  status: "Completed", description: "Specialist Consultation" },
  { id: "u3_017", date: daysAgo(17), merchant: "HOA Pacific Heights",          category: "Housing",      type: "debit",  amount: 3200.00,  status: "Completed", description: "Bill Pay - Monthly HOA Dues" },
  { id: "u3_018", date: daysAgo(18), merchant: "Tesla Supercharger",           category: "Transport",    type: "debit",  amount: 42.60,    status: "Completed", description: "Vehicle Charging" },
  { id: "u3_019", date: daysAgo(19), merchant: "Apple Services",               category: "Subscription", type: "debit",  amount: 49.95,    status: "Completed", description: "Apple One Premier & iCloud" },
  { id: "u3_020", date: daysAgo(20), merchant: "Amazon.com",                   category: "Shopping",     type: "debit",  amount: 4248.90,  status: "Completed", description: "Online Purchase - Electronics" },
  { id: "u3_021", date: daysAgo(21), merchant: "Eataly SF",                    category: "Groceries",    type: "debit",  amount: 618.44,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_022", date: daysAgo(22), merchant: "United Airlines - Business",   category: "Travel",       type: "debit",  amount: 12480.00, status: "Completed", description: "Business Class - SFO to CDG" },
  { id: "u3_023", date: daysAgo(23), merchant: "Wells Fargo Home Mortgage",    category: "Housing",      type: "debit",  amount: 24000.00, status: "Completed", description: "Mortgage - Pacific Heights Property" },
  { id: "u3_024", date: daysAgo(25), merchant: "NovaTech Solutions — Payroll", category: "Income",       type: "credit", amount: 280000.00,status: "Completed", description: "Direct Deposit - CEO Compensation" },
  { id: "u3_025", date: daysAgo(27), merchant: "The St. Regis San Francisco",  category: "Travel",       type: "debit",  amount: 8400.00,  status: "Completed", description: "Hotel Stay - Client Entertainment" },
  { id: "u3_026", date: daysAgo(29), merchant: "AXA Insurance",                category: "Insurance",    type: "debit",  amount: 6800.00,  status: "Completed", description: "Bill Pay - Executive Life Policy" },
  { id: "u3_027", date: daysAgo(31), merchant: "Netflix",                       category: "Subscription", type: "debit",  amount: 22.99,    status: "Completed", description: "Monthly Subscription" },
  { id: "u3_028", date: daysAgo(33), merchant: "PG&E",                         category: "Utilities",    type: "debit",  amount: 614.80,   status: "Completed", description: "Bill Pay - Electric & Gas" },
  { id: "u3_029", date: daysAgo(35), merchant: "Tesla Financial Services",     category: "Auto",         type: "debit",  amount: 2480.00,  status: "Completed", description: "Loan Payment" },
  { id: "u3_030", date: daysAgo(37), merchant: "Bi-Rite Market",               category: "Groceries",    type: "debit",  amount: 392.10,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_031", date: daysAgo(40), merchant: "NovaTech Solutions — Payroll", category: "Income",       type: "credit", amount: 280000.00,status: "Completed", description: "Direct Deposit - CEO Compensation" },
  { id: "u3_032", date: daysAgo(42), merchant: "IRS USATAXPYMT",              category: "Taxes",        type: "debit",  amount: 95000.00, status: "Completed", description: "Quarterly Estimated Tax - Federal" },
  { id: "u3_033", date: daysAgo(44), merchant: "Wells Fargo Home Mortgage",    category: "Housing",      type: "debit",  amount: 24000.00, status: "Completed", description: "Mortgage - Pacific Heights Property" },
  { id: "u3_034", date: daysAgo(46), merchant: "HOA Pacific Heights",          category: "Housing",      type: "debit",  amount: 3200.00,  status: "Completed", description: "Bill Pay - HOA Dues" },
  { id: "u3_035", date: daysAgo(48), merchant: "Vanguard Brokerage",           category: "Transfer",     type: "debit",  amount: 200000.00,status: "Completed", description: "Transfer to Investment Portfolio" },
  { id: "u3_036", date: daysAgo(50), merchant: "Amazon Web Services",          category: "Business",     type: "debit",  amount: 4840.20,  status: "Completed", description: "AWS Business Account - Cloud Infra" },
  { id: "u3_037", date: daysAgo(52), merchant: "Equinox SF",                   category: "Health",       type: "debit",  amount: 300.00,   status: "Completed", description: "Monthly Membership" },
  { id: "u3_038", date: daysAgo(54), merchant: "GitHub Enterprise",            category: "Business",     type: "debit",  amount: 2100.00,  status: "Completed", description: "Annual Subscription - Pro Team" },
  { id: "u3_039", date: daysAgo(56), merchant: "Spotify Premium",              category: "Subscription", type: "debit",  amount: 17.99,    status: "Completed", description: "Monthly Subscription" },
  { id: "u3_040", date: daysAgo(58), merchant: "NovaTech Solutions — Payroll", category: "Income",       type: "credit", amount: 280000.00,status: "Completed", description: "Direct Deposit - CEO Compensation" },
  { id: "u3_041", date: daysAgo(60), merchant: "Quince Restaurant SF",         category: "Dining",       type: "debit",  amount: 1840.60,  status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_042", date: daysAgo(63), merchant: "CA Franchise Tax Board",       category: "Taxes",        type: "debit",  amount: 28000.00, status: "Completed", description: "Quarterly Estimated Tax - State" },
  { id: "u3_043", date: daysAgo(66), merchant: "AT&T Business",                category: "Utilities",    type: "debit",  amount: 420.00,   status: "Completed", description: "Bill Pay - Business Lines" },
  { id: "u3_044", date: daysAgo(70), merchant: "Wells Fargo Home Mortgage",    category: "Housing",      type: "debit",  amount: 24000.00, status: "Completed", description: "Mortgage - Pacific Heights Property" },
  { id: "u3_045", date: daysAgo(73), merchant: "AXA Insurance",                category: "Insurance",    type: "debit",  amount: 6800.00,  status: "Completed", description: "Bill Pay - Insurance Premium" },
  { id: "u3_046", date: daysAgo(75), merchant: "Eataly SF",                    category: "Groceries",    type: "debit",  amount: 524.80,   status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_047", date: daysAgo(78), merchant: "NovaTech Solutions — Payroll", category: "Income",       type: "credit", amount: 280000.00,status: "Completed", description: "Direct Deposit - CEO Compensation" },
  { id: "u3_048", date: daysAgo(80), merchant: "Comcast Business",             category: "Utilities",    type: "debit",  amount: 389.99,   status: "Completed", description: "Bill Pay - Internet & Media" },
  { id: "u3_049", date: daysAgo(82), merchant: "Amazon.com",                   category: "Shopping",     type: "debit",  amount: 6840.00,  status: "Completed", description: "Online Purchase - Home Tech" },
  { id: "u3_050", date: daysAgo(85), merchant: "Tesla Financial Services",     category: "Auto",         type: "debit",  amount: 2480.00,  status: "Completed", description: "Loan Payment" },
  { id: "u3_051", date: daysAgo(88), merchant: "Vanguard Brokerage",           category: "Transfer",     type: "debit",  amount: 200000.00,status: "Completed", description: "Transfer to Investment Portfolio" },
  { id: "u3_052", date: daysAgo(92), merchant: "Wells Fargo Home Mortgage",    category: "Housing",      type: "debit",  amount: 24000.00, status: "Completed", description: "Mortgage - Pacific Heights Property" },
  { id: "u3_053", date: daysAgo(96), merchant: "NovaTech Solutions — Payroll", category: "Income",       type: "credit", amount: 280000.00,status: "Completed", description: "Direct Deposit - CEO Compensation" },
  { id: "u3_054", date: daysAgo(99), merchant: "PG&E",                         category: "Utilities",    type: "debit",  amount: 588.40,   status: "Completed", description: "Bill Pay - Electric & Gas" },
];

const TX_OFFSET_MS = 180 * 24 * 60 * 60 * 1000;

const shiftDates = (txns: Transaction[]): Transaction[] =>
  txns.map((t) => ({
    ...t,
    date: new Date(new Date(t.date).getTime() - TX_OFFSET_MS).toISOString(),
  }));

const TRANSACTIONS: Record<string, Transaction[]> = {
  user1: shiftDates(user1Transactions),
  user2: shiftDates(user2Transactions),
  user3: shiftDates(user3Transactions),
};

export const getTransactions = (transactionKey: string): Transaction[] => {
  return TRANSACTIONS[transactionKey] || [];
};

export const getStatements = (
  transactionKey: string,
  currentBalance: number
): Statement[] => {
  if (!currentBalance) return [];
  const txns = TRANSACTIONS[transactionKey] || [];
  const now = new Date();
  const result: Statement[] = [];

  for (let i = 1; i <= 6; i++) {
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const netAfter = txns
      .filter((t) => new Date(t.date) > monthEnd)
      .reduce((sum, t) => sum + (t.type === "credit" ? t.amount : -t.amount), 0);

    const bal = currentBalance - netAfter;
    const period = monthEnd.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const dateStr = monthEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const balStr =
      "$" + bal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    result.push({ id: `s${i}`, period, date: dateStr, balance: balStr, balanceRaw: bal });
  }

  return result;
};

export const getScheduledPayments = (transactionKey: string): ScheduledPayment[] => {
  const schedules: Record<string, ScheduledPayment[]> = {
    user1: [
      { id: "s1_001", payee: "Wells Fargo Mortgage — BH-7821", amount: 18500.00, date: daysAgo(-3), status: "Scheduled" },
      { id: "s1_002", payee: "BMW Financial Services",          amount: 2140.00,  date: daysAgo(-5), status: "Scheduled" },
      { id: "s1_003", payee: "Montessori School LA — Tuition",  amount: 4800.00,  date: daysAgo(-8), status: "Scheduled" },
      { id: "s1_004", payee: "HOA Beverly Hills",               amount: 1850.00,  date: daysAgo(-10),status: "Scheduled" },
    ],
    user2: [
      { id: "s2_001", payee: "Chase Mortgage — CH-4419",        amount: 12400.00, date: daysAgo(-3), status: "Scheduled" },
      { id: "s2_002", payee: "Mercedes-Benz Financial",         amount: 2890.00,  date: daysAgo(-6), status: "Scheduled" },
      { id: "s2_003", payee: "Fidelity Investments Transfer",   amount: 75000.00, date: daysAgo(-9), status: "Scheduled" },
      { id: "s2_004", payee: "HOA Gold Coast Towers",           amount: 2400.00,  date: daysAgo(-11),status: "Scheduled" },
    ],
    user3: [
      { id: "s3_001", payee: "WF Home Mortgage — Pacific Hts", amount: 24000.00, date: daysAgo(-2), status: "Scheduled" },
      { id: "s3_002", payee: "Tesla Financial Services",        amount: 2480.00,  date: daysAgo(-5), status: "Scheduled" },
      { id: "s3_003", payee: "Vanguard Investment Transfer",    amount: 200000.00,date: daysAgo(-7), status: "Scheduled" },
      { id: "s3_004", payee: "HOA Pacific Heights",             amount: 3200.00,  date: daysAgo(-9), status: "Scheduled" },
    ],
  };
  return schedules[transactionKey] || [];
};

export const getPayees = (transactionKey: string): Payee[] => {
  const payees: Record<string, Payee[]> = {
    user1: [
      { id: "p1_001", name: "AT&T", accountLast4: "1234", category: "Phone" },
      { id: "p1_002", name: "Comcast Internet", accountLast4: "5678", category: "Internet" },
      { id: "p1_003", name: "PG&E", accountLast4: "0909", category: "Utilities" },
      { id: "p1_004", name: "State Farm Insurance", accountLast4: "3333", category: "Insurance" },
    ],
    user2: [
      { id: "p2_001", name: "Verizon", accountLast4: "4521", category: "Phone" },
      { id: "p2_002", name: "Comcast", accountLast4: "7890", category: "Internet" },
      { id: "p2_003", name: "PG&E", accountLast4: "2345", category: "Utilities" },
    ],
    user3: [
      { id: "p3_001", name: "T-Mobile", accountLast4: "6677", category: "Phone" },
      { id: "p3_002", name: "PG&E", accountLast4: "8899", category: "Utilities" },
      { id: "p3_003", name: "Sallie Mae", accountLast4: "4411", category: "Loan" },
      { id: "p3_004", name: "Progressive", accountLast4: "2233", category: "Insurance" },
    ],
  };
  return payees[transactionKey] || [];
};

export const getBillPayments = (transactionKey: string): BillPayment[] => {
  const payments: Record<string, BillPayment[]> = {
    user1: [
      { id: "bp1_001", payee: "AT&T", amount: 145.0, date: daysAgo(23), status: "Paid" },
      { id: "bp1_002", payee: "PG&E", amount: 112.5, date: daysAgo(51), status: "Paid" },
    ],
    user2: [
      { id: "bp2_001", payee: "Verizon", amount: 89.99, date: daysAgo(8), status: "Paid" },
      { id: "bp2_002", payee: "PG&E", amount: 98.4, date: daysAgo(150), status: "Paid" },
    ],
    user3: [
      { id: "bp3_001", payee: "T-Mobile", amount: 75.0, date: daysAgo(4), status: "Paid" },
      { id: "bp3_002", payee: "PG&E", amount: 138.7, date: daysAgo(101), status: "Paid" },
    ],
  };
  return payments[transactionKey] || [];
};

export const formatCurrency = (n: number): string =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
