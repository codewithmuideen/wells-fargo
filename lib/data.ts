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
    userId: "naomi_wells",
    passwordHash: hashPassword("WellsFargo@2024"),
    firstName: "Naomi",
    lastName: "Carter",
    email: "codewitmui@gmail.com",
    phone: "+1 (415) 555-0198",
    avatar: "/wf_logo_white.webp",
    accountNumber: "100400870987",
    routingNumber: "121000248",
    accountType: "My Everyday Checking",
    balance: 4669.9,
    availableBalance: 4624.9,
    pendingBalance: 45.0,
    lastStatementDate: "02/28/2026",
    lastStatementBalance: 4419.9,
    memberSince: "March 2018",
    transactionKey: "user1",
  },
  {
    id: "user_002",
    userId: "marcus_fargo",
    passwordHash: hashPassword("WellsFargo@5678"),
    firstName: "Marcus",
    lastName: "Williams",
    email: "marcus.williams@outlook.com",
    phone: "+1 (312) 555-0142",
    avatar: "/wf_logo_white.webp",
    accountNumber: "200500233421",
    routingNumber: "121000248",
    accountType: "Preferred Checking",
    balance: 12450.75,
    availableBalance: 12360.76,
    pendingBalance: 89.99,
    lastStatementDate: "02/28/2026",
    lastStatementBalance: 11980.75,
    memberSince: "July 2019",
    transactionKey: "user2",
  },
  {
    id: "user_003",
    userId: "elena_wells",
    passwordHash: hashPassword("WellsFargo@9012"),
    firstName: "Elena",
    lastName: "Rodriguez",
    email: "elena.rodriguez@outlook.com",
    phone: "+1 (646) 555-0173",
    avatar: "/wf_logo_white.webp",
    accountNumber: "300600787834",
    routingNumber: "121000248",
    accountType: "Portfolio Checking",
    balance: 28920.5,
    availableBalance: 28845.5,
    pendingBalance: 75.0,
    lastStatementDate: "02/28/2026",
    lastStatementBalance: 27120.5,
    memberSince: "January 2020",
    transactionKey: "user3",
  },
];

// ─── USER 1 — Naomi Carter ─────────────────────────────────────────────────
const user1Transactions: Transaction[] = [
  { id: "u1_001", date: daysAgo(1), merchant: "Online Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Pending", description: "Direct Deposit - Payroll" },
  { id: "u1_002", date: daysAgo(2), merchant: "Mobile Deposit", category: "Income", type: "credit", amount: 50.0, status: "Completed", description: "Mobile Check Deposit" },
  { id: "u1_003", date: daysAgo(3), merchant: "Home Depot", category: "Shopping", type: "debit", amount: 61.84, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_004", date: daysAgo(5), merchant: "Mobile Deposit", category: "Income", type: "credit", amount: 123.45, status: "Completed", description: "Mobile Check Deposit" },
  { id: "u1_005", date: daysAgo(6), merchant: "Amazon.com", category: "Shopping", type: "debit", amount: 49.56, status: "Completed", description: "Online Sale" },
  { id: "u1_006", date: daysAgo(7), merchant: "Wire Transfer", category: "Transfer", type: "credit", amount: 300.0, status: "Completed", description: "Incoming Wire Transfer" },
  { id: "u1_007", date: daysAgo(8), merchant: "Online Transfer", category: "Transfer", type: "credit", amount: 30.0, status: "Completed", description: "Transfer In" },
  { id: "u1_008", date: daysAgo(10), merchant: "Starbucks #4821", category: "Dining", type: "debit", amount: 8.45, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_009", date: daysAgo(12), merchant: "Shell Gas Station", category: "Gas", type: "debit", amount: 72.3, status: "Completed", description: "Fuel Purchase" },
  { id: "u1_010", date: daysAgo(14), merchant: "Netflix", category: "Subscription", type: "debit", amount: 22.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u1_011", date: daysAgo(17), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_012", date: daysAgo(19), merchant: "Whole Foods Market", category: "Groceries", type: "debit", amount: 134.72, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_013", date: daysAgo(21), merchant: "Target", category: "Shopping", type: "debit", amount: 87.43, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_014", date: daysAgo(23), merchant: "AT&T Wireless", category: "Utilities", type: "debit", amount: 145.0, status: "Completed", description: "Monthly Bill Payment" },
  { id: "u1_015", date: daysAgo(25), merchant: "Spotify", category: "Subscription", type: "debit", amount: 11.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u1_016", date: daysAgo(28), merchant: "Zelle Transfer", category: "Transfer", type: "debit", amount: 200.0, status: "Completed", description: "Zelle Payment to Alex K." },
  { id: "u1_017", date: daysAgo(30), merchant: "CVS Pharmacy", category: "Health", type: "debit", amount: 34.18, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_018", date: daysAgo(32), merchant: "Wells Fargo ATM", category: "ATM", type: "debit", amount: 200.0, status: "Completed", description: "ATM Withdrawal" },
  { id: "u1_019", date: daysAgo(35), merchant: "Best Buy", category: "Shopping", type: "debit", amount: 100.0, status: "Completed", description: "Hold - Online Purchase" },
  { id: "u1_020", date: daysAgo(38), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_021", date: daysAgo(42), merchant: "Walmart Supercenter", category: "Groceries", type: "debit", amount: 156.34, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_022", date: daysAgo(45), merchant: "McDonald's #2371", category: "Dining", type: "debit", amount: 14.22, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_023", date: daysAgo(48), merchant: "Google Play", category: "Subscription", type: "debit", amount: 9.99, status: "Completed", description: "Digital Purchase" },
  { id: "u1_024", date: daysAgo(51), merchant: "PG&E", category: "Utilities", type: "debit", amount: 112.5, status: "Completed", description: "Bill Pay - Electric" },
  { id: "u1_025", date: daysAgo(55), merchant: "Amazon.com", category: "Shopping", type: "debit", amount: 238.99, status: "Completed", description: "Online Sale" },
  { id: "u1_026", date: daysAgo(58), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_027", date: daysAgo(62), merchant: "Costco Wholesale", category: "Groceries", type: "debit", amount: 312.45, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_028", date: daysAgo(65), merchant: "Uber Eats", category: "Dining", type: "debit", amount: 43.6, status: "Completed", description: "Food Delivery" },
  { id: "u1_029", date: daysAgo(72), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_030", date: daysAgo(75), merchant: "Apple Store", category: "Shopping", type: "debit", amount: 999.0, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_031", date: daysAgo(78), merchant: "Best Buy", category: "Shopping", type: "debit", amount: 249.99, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_032", date: daysAgo(82), merchant: "Zelle Transfer", category: "Transfer", type: "credit", amount: 500.0, status: "Completed", description: "Zelle Received from Tom W." },
  { id: "u1_033", date: daysAgo(87), merchant: "Planet Fitness", category: "Health", type: "debit", amount: 24.99, status: "Completed", description: "Monthly Membership" },
  { id: "u1_034", date: daysAgo(92), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_035", date: daysAgo(97), merchant: "Safeway", category: "Groceries", type: "debit", amount: 98.23, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_036", date: daysAgo(101), merchant: "Shell Gas Station", category: "Gas", type: "debit", amount: 61.5, status: "Completed", description: "Fuel Purchase" },
  { id: "u1_037", date: daysAgo(107), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_038", date: daysAgo(111), merchant: "Wells Fargo ATM", category: "ATM", type: "debit", amount: 200.0, status: "Completed", description: "ATM Withdrawal" },
  { id: "u1_039", date: daysAgo(115), merchant: "Hulu", category: "Subscription", type: "debit", amount: 17.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u1_040", date: daysAgo(120), merchant: "Whole Foods Market", category: "Groceries", type: "debit", amount: 142.8, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_041", date: daysAgo(124), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_042", date: daysAgo(129), merchant: "Chevron", category: "Gas", type: "debit", amount: 65.4, status: "Completed", description: "Fuel Purchase" },
  { id: "u1_043", date: daysAgo(132), merchant: "Amazon.com", category: "Shopping", type: "debit", amount: 89.99, status: "Completed", description: "Online Purchase" },
  { id: "u1_044", date: daysAgo(137), merchant: "Home Depot", category: "Shopping", type: "debit", amount: 187.23, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_045", date: daysAgo(140), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_046", date: daysAgo(144), merchant: "Shell Gas Station", category: "Gas", type: "debit", amount: 95.4, status: "Completed", description: "Fuel Purchase" },
  { id: "u1_047", date: daysAgo(148), merchant: "Walmart Supercenter", category: "Groceries", type: "debit", amount: 134.2, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_048", date: daysAgo(153), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_049", date: daysAgo(157), merchant: "Netflix", category: "Subscription", type: "debit", amount: 22.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u1_050", date: daysAgo(161), merchant: "Chipotle Mexican Grill", category: "Dining", type: "debit", amount: 21.45, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_051", date: daysAgo(163), merchant: "CVS Pharmacy", category: "Health", type: "debit", amount: 38.9, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_052", date: daysAgo(168), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_053", date: daysAgo(172), merchant: "Whole Foods Market", category: "Groceries", type: "debit", amount: 118.7, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_054", date: daysAgo(176), merchant: "Target", category: "Shopping", type: "debit", amount: 87.0, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u1_055", date: daysAgo(180), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
  { id: "u1_056", date: daysAgo(183), merchant: "Amazon.com", category: "Shopping", type: "debit", amount: 189.45, status: "Completed", description: "Online Sale" },
  { id: "u1_057", date: daysAgo(188), merchant: "Spotify", category: "Subscription", type: "debit", amount: 11.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u1_058", date: daysAgo(191), merchant: "Shell Gas Station", category: "Gas", type: "debit", amount: 42.2, status: "Completed", description: "Fuel Purchase" },
  { id: "u1_059", date: daysAgo(194), merchant: "Olive Garden", category: "Dining", type: "debit", amount: 78.3, status: "Completed", description: "Restaurant Dining" },
  { id: "u1_060", date: daysAgo(199), merchant: "Direct Deposit", category: "Income", type: "credit", amount: 2450.0, status: "Completed", description: "Direct Deposit - Payroll" },
];

// ─── USER 2 — Marcus Williams ───────────────────────────────────────────────
const user2Transactions: Transaction[] = [
  { id: "u2_001", date: daysAgo(1), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Pending", description: "Direct Deposit - Salary" },
  { id: "u2_002", date: daysAgo(3), merchant: "Trader Joe's", category: "Groceries", type: "debit", amount: 92.14, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_003", date: daysAgo(4), merchant: "Zelle Payment", category: "Transfer", type: "credit", amount: 150.0, status: "Completed", description: "Received from Mike P." },
  { id: "u2_004", date: daysAgo(6), merchant: "Amazon Prime", category: "Subscription", type: "debit", amount: 14.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u2_005", date: daysAgo(8), merchant: "Verizon Wireless", category: "Utilities", type: "debit", amount: 89.99, status: "Completed", description: "Monthly Bill Payment" },
  { id: "u2_006", date: daysAgo(10), merchant: "Nordstrom", category: "Shopping", type: "debit", amount: 245.8, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_007", date: daysAgo(12), merchant: "Panera Bread", category: "Dining", type: "debit", amount: 18.74, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_008", date: daysAgo(15), merchant: "Wells Fargo ATM", category: "ATM", type: "debit", amount: 400.0, status: "Completed", description: "ATM Withdrawal" },
  { id: "u2_009", date: daysAgo(17), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_010", date: daysAgo(19), merchant: "Cheesecake Factory", category: "Dining", type: "debit", amount: 87.45, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_011", date: daysAgo(21), merchant: "Sephora", category: "Shopping", type: "debit", amount: 67.0, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_012", date: daysAgo(24), merchant: "Disney+", category: "Subscription", type: "debit", amount: 13.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u2_013", date: daysAgo(27), merchant: "Uber Technologies", category: "Transport", type: "debit", amount: 22.5, status: "Completed", description: "Ride Share" },
  { id: "u2_014", date: daysAgo(30), merchant: "Whole Foods Market", category: "Groceries", type: "debit", amount: 178.35, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_015", date: daysAgo(33), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_016", date: daysAgo(36), merchant: "Macy's", category: "Shopping", type: "debit", amount: 132.6, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_017", date: daysAgo(40), merchant: "BP Gas Station", category: "Gas", type: "debit", amount: 54.8, status: "Completed", description: "Fuel Purchase" },
  { id: "u2_018", date: daysAgo(44), merchant: "Mobile Deposit", category: "Income", type: "credit", amount: 250.0, status: "Completed", description: "Mobile Check Deposit" },
  { id: "u2_019", date: daysAgo(48), merchant: "Spotify", category: "Subscription", type: "debit", amount: 11.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u2_020", date: daysAgo(52), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_021", date: daysAgo(56), merchant: "Target", category: "Shopping", type: "debit", amount: 201.44, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_022", date: daysAgo(60), merchant: "Zara", category: "Shopping", type: "debit", amount: 159.9, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_023", date: daysAgo(68), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_024", date: daysAgo(73), merchant: "Instacart", category: "Groceries", type: "debit", amount: 124.99, status: "Completed", description: "Grocery Delivery" },
  { id: "u2_025", date: daysAgo(78), merchant: "Netflix", category: "Subscription", type: "debit", amount: 22.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u2_026", date: daysAgo(85), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_027", date: daysAgo(90), merchant: "Equinox", category: "Health", type: "debit", amount: 95.0, status: "Completed", description: "Monthly Membership" },
  { id: "u2_028", date: daysAgo(95), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_029", date: daysAgo(100), merchant: "Wells Fargo ATM", category: "ATM", type: "debit", amount: 300.0, status: "Completed", description: "ATM Withdrawal" },
  { id: "u2_030", date: daysAgo(105), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_031", date: daysAgo(110), merchant: "Southwest Airlines", category: "Travel", type: "debit", amount: 342.0, status: "Completed", description: "Flight Booking" },
  { id: "u2_032", date: daysAgo(115), merchant: "Marriott Hotels", category: "Travel", type: "debit", amount: 487.5, status: "Completed", description: "Hotel Stay" },
  { id: "u2_033", date: daysAgo(120), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_034", date: daysAgo(126), merchant: "Macy's", category: "Shopping", type: "debit", amount: 189.9, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_035", date: daysAgo(131), merchant: "Whole Foods Market", category: "Groceries", type: "debit", amount: 134.45, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_036", date: daysAgo(136), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_037", date: daysAgo(140), merchant: "Apple Store", category: "Shopping", type: "debit", amount: 549.0, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_038", date: daysAgo(144), merchant: "Nordstrom", category: "Shopping", type: "debit", amount: 224.5, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_039", date: daysAgo(150), merchant: "PG&E", category: "Utilities", type: "debit", amount: 98.4, status: "Completed", description: "Bill Pay - Electric" },
  { id: "u2_040", date: daysAgo(154), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_041", date: daysAgo(158), merchant: "Panera Bread", category: "Dining", type: "debit", amount: 67.45, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_042", date: daysAgo(162), merchant: "Trader Joe's", category: "Groceries", type: "debit", amount: 122.3, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_043", date: daysAgo(166), merchant: "Verizon Wireless", category: "Utilities", type: "debit", amount: 89.99, status: "Completed", description: "Monthly Bill Payment" },
  { id: "u2_044", date: daysAgo(170), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_045", date: daysAgo(175), merchant: "Macy's", category: "Shopping", type: "debit", amount: 89.99, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_046", date: daysAgo(179), merchant: "Cheesecake Factory", category: "Dining", type: "debit", amount: 78.5, status: "Completed", description: "Restaurant Dining" },
  { id: "u2_047", date: daysAgo(183), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_048", date: daysAgo(187), merchant: "Whole Foods Market", category: "Groceries", type: "debit", amount: 134.2, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_049", date: daysAgo(191), merchant: "BP Gas Station", category: "Gas", type: "debit", amount: 44.0, status: "Completed", description: "Fuel Purchase" },
  { id: "u2_050", date: daysAgo(194), merchant: "Amazon Prime", category: "Subscription", type: "debit", amount: 14.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u2_051", date: daysAgo(197), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
  { id: "u2_052", date: daysAgo(201), merchant: "Target", category: "Shopping", type: "debit", amount: 156.7, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_053", date: daysAgo(206), merchant: "Nordstrom", category: "Shopping", type: "debit", amount: 312.8, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u2_054", date: daysAgo(210), merchant: "Payroll - Sunrise Corp", category: "Income", type: "credit", amount: 3800.0, status: "Completed", description: "Direct Deposit - Salary" },
];

// ─── USER 3 — Elena Rodriguez ────────────────────────────────────────────────
const user3Transactions: Transaction[] = [
  { id: "u3_001", date: daysAgo(1), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Pending", description: "Direct Deposit - Biweekly" },
  { id: "u3_002", date: daysAgo(2), merchant: "H Mart", category: "Groceries", type: "debit", amount: 143.22, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_003", date: daysAgo(4), merchant: "T-Mobile", category: "Utilities", type: "debit", amount: 75.0, status: "Completed", description: "Monthly Bill Payment" },
  { id: "u3_004", date: daysAgo(5), merchant: "GitHub Copilot", category: "Subscription", type: "debit", amount: 19.0, status: "Completed", description: "Monthly Subscription" },
  { id: "u3_005", date: daysAgo(7), merchant: "Amazon Web Services", category: "Business", type: "debit", amount: 127.43, status: "Completed", description: "Cloud Services" },
  { id: "u3_006", date: daysAgo(9), merchant: "Chipotle Mexican Grill", category: "Dining", type: "debit", amount: 16.35, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_007", date: daysAgo(11), merchant: "Tesla Supercharger", category: "Transport", type: "debit", amount: 18.4, status: "Completed", description: "Vehicle Charging" },
  { id: "u3_008", date: daysAgo(14), merchant: "Wells Fargo ATM", category: "ATM", type: "debit", amount: 500.0, status: "Completed", description: "ATM Withdrawal" },
  { id: "u3_009", date: daysAgo(15), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_010", date: daysAgo(17), merchant: "Nvidia Store", category: "Shopping", type: "debit", amount: 799.0, status: "Completed", description: "Online Purchase" },
  { id: "u3_011", date: daysAgo(20), merchant: "Trader Joe's", category: "Groceries", type: "debit", amount: 87.66, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_012", date: daysAgo(22), merchant: "Netflix", category: "Subscription", type: "debit", amount: 22.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u3_013", date: daysAgo(25), merchant: "Dropbox", category: "Subscription", type: "debit", amount: 11.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u3_014", date: daysAgo(28), merchant: "The Capital Grille", category: "Dining", type: "debit", amount: 127.8, status: "Completed", description: "Restaurant Dining" },
  { id: "u3_015", date: daysAgo(29), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_016", date: daysAgo(32), merchant: "Apple Services", category: "Subscription", type: "debit", amount: 29.99, status: "Completed", description: "iCloud+ Storage Plan" },
  { id: "u3_017", date: daysAgo(35), merchant: "Whole Foods Market", category: "Groceries", type: "debit", amount: 204.5, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_018", date: daysAgo(38), merchant: "Zelle Transfer", category: "Transfer", type: "debit", amount: 350.0, status: "Completed", description: "Zelle Payment - Rent Split" },
  { id: "u3_019", date: daysAgo(42), merchant: "Tesla Service Center", category: "Transport", type: "debit", amount: 550.0, status: "Completed", description: "Vehicle Maintenance" },
  { id: "u3_020", date: daysAgo(43), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_021", date: daysAgo(47), merchant: "Airbnb", category: "Travel", type: "debit", amount: 420.0, status: "Completed", description: "Accommodation Booking" },
  { id: "u3_022", date: daysAgo(51), merchant: "Amazon.com", category: "Shopping", type: "debit", amount: 312.67, status: "Completed", description: "Online Purchase" },
  { id: "u3_023", date: daysAgo(56), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_024", date: daysAgo(60), merchant: "OpenAI", category: "Subscription", type: "debit", amount: 20.0, status: "Completed", description: "ChatGPT Plus" },
  { id: "u3_025", date: daysAgo(65), merchant: "Microsoft 365", category: "Subscription", type: "debit", amount: 9.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u3_026", date: daysAgo(70), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_027", date: daysAgo(75), merchant: "Nobu", category: "Dining", type: "debit", amount: 188.4, status: "Completed", description: "Restaurant Dining" },
  { id: "u3_028", date: daysAgo(80), merchant: "Wells Fargo ATM", category: "ATM", type: "debit", amount: 400.0, status: "Completed", description: "ATM Withdrawal" },
  { id: "u3_029", date: daysAgo(85), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_030", date: daysAgo(90), merchant: "REI", category: "Shopping", type: "debit", amount: 287.5, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_031", date: daysAgo(95), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_032", date: daysAgo(98), merchant: "Delta Airlines", category: "Travel", type: "debit", amount: 612.0, status: "Completed", description: "Flight Booking" },
  { id: "u3_033", date: daysAgo(101), merchant: "PG&E", category: "Utilities", type: "debit", amount: 138.7, status: "Completed", description: "Bill Pay - Electric" },
  { id: "u3_034", date: daysAgo(107), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_035", date: daysAgo(113), merchant: "Best Buy", category: "Shopping", type: "debit", amount: 1899.0, status: "Completed", description: "Electronics Purchase" },
  { id: "u3_036", date: daysAgo(118), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_037", date: daysAgo(122), merchant: "City Parking", category: "Transport", type: "debit", amount: 45.0, status: "Completed", description: "Parking Fee" },
  { id: "u3_038", date: daysAgo(128), merchant: "Amazon.com", category: "Shopping", type: "debit", amount: 423.9, status: "Completed", description: "Online Purchase" },
  { id: "u3_039", date: daysAgo(132), merchant: "Spotify", category: "Subscription", type: "debit", amount: 11.99, status: "Completed", description: "Monthly Subscription" },
  { id: "u3_040", date: daysAgo(137), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_041", date: daysAgo(141), merchant: "Whole Foods Market", category: "Groceries", type: "debit", amount: 188.7, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_042", date: daysAgo(145), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_043", date: daysAgo(150), merchant: "PG&E", category: "Utilities", type: "debit", amount: 138.7, status: "Completed", description: "Bill Pay - Electric" },
  { id: "u3_044", date: daysAgo(155), merchant: "City Parking", category: "Transport", type: "debit", amount: 45.0, status: "Completed", description: "Parking Fee" },
  { id: "u3_045", date: daysAgo(159), merchant: "Apple Store", category: "Shopping", type: "debit", amount: 245.8, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_046", date: daysAgo(162), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_047", date: daysAgo(166), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_048", date: daysAgo(170), merchant: "Apple Store", category: "Shopping", type: "debit", amount: 2499.0, status: "Completed", description: "MacBook Pro Purchase" },
  { id: "u3_049", date: daysAgo(172), merchant: "H Mart", category: "Groceries", type: "debit", amount: 143.22, status: "Completed", description: "Point of Sale Purchase" },
  { id: "u3_050", date: daysAgo(178), merchant: "Amazon Web Services", category: "Business", type: "debit", amount: 127.43, status: "Completed", description: "Cloud Services" },
  { id: "u3_051", date: daysAgo(181), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_052", date: daysAgo(186), merchant: "Nobu", category: "Dining", type: "debit", amount: 188.4, status: "Completed", description: "Restaurant Dining" },
  { id: "u3_053", date: daysAgo(190), merchant: "T-Mobile", category: "Utilities", type: "debit", amount: 75.0, status: "Completed", description: "Monthly Bill Payment" },
  { id: "u3_054", date: daysAgo(193), merchant: "Zelle Transfer", category: "Transfer", type: "debit", amount: 350.0, status: "Completed", description: "Zelle Payment - Rent Split" },
  { id: "u3_055", date: daysAgo(197), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
  { id: "u3_056", date: daysAgo(201), merchant: "Airbnb", category: "Travel", type: "debit", amount: 420.0, status: "Completed", description: "Accommodation Booking" },
  { id: "u3_057", date: daysAgo(206), merchant: "Amazon.com", category: "Shopping", type: "debit", amount: 312.67, status: "Completed", description: "Online Purchase" },
  { id: "u3_058", date: daysAgo(210), merchant: "TechCorp Inc Payroll", category: "Income", type: "credit", amount: 6500.0, status: "Completed", description: "Direct Deposit - Biweekly" },
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
    user1: [{ id: "s1_001", payee: "Auto Loan Payment", amount: 381.31, date: daysAgo(-3), status: "Scheduled" }],
    user2: [{ id: "s2_001", payee: "Rent Payment", amount: 1850.0, date: daysAgo(-5), status: "Scheduled" }],
    user3: [
      { id: "s3_001", payee: "Student Loan", amount: 612.0, date: daysAgo(-2), status: "Scheduled" },
      { id: "s3_002", payee: "Car Insurance", amount: 180.0, date: daysAgo(-7), status: "Scheduled" },
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
