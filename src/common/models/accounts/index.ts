import { BaseResponseError, Status } from "../base-response";

export interface Account {
    accountnumber: string;
    accountstatus: string;
    accounttype: string;
    accountuid: string;
    contactuid: string;
    created: string;
    dateclosing: string;
    dateeffective: string;
    datesold: string;
    dealuid: string;
    downpayment: string;
    index: number;
    inventoryuid: string;
    isactive: number;
    isdeleted: number;
    itemuid: string;
    name: string;
    notes: string;
    startingballance: string;
    updated: string;
    useruid: string;
}

export interface AccountPayment {
    status: string;
    error: string;
    info: string;
    message: string;
    index: number;
    extindex: number;
    deleted: number;
    useruid: string;
    ACCT_NUM: string;
    Date: number;
    PTPDate: number;
    NoteBy: string;
    Status: number;
    Amount: number;
    Note: string;
    created: number;
    updated: number;
    itemuid: string;
    accountuid: string;
}

export interface AccountDownPayments {
    status: "string";
    error: "string";
    info: "string";
    message: "string";
    index: number;
    created: number;
    updated: number;
    deleted: 0 | 1;
    itemuid: "string";
    useruid: "string";
    Receipt: "string";
    Date: "string";
    Amount: "string";
    Paid: "string";
}

export interface AccountListActivity {
    ACCT_NUM: string;
    ActType: number;
    Balance: number;
    Cost: number;
    Credit: number;
    Date: number;
    Debit: number;
    Demo: number;
    Description: string;
    Effective_Date: number;
    Standing: number;
    User: string;
    accountuid: string;
    created: number;
    deleted: number;
    extindex: number;
    index: number;
    itemuid: string;
    updated: number;
    useruid: string;
}

export interface AccountInfo extends BaseResponseError {
    accountnumber: string;
    accountstatus: string;
    accounttype: string;
    accountuid: string;
    contactuid: string;
    created: string;
    dateclosing: string;
    dateeffective: string;
    datesold: string;
    dealuid: string;
    downpayment: string;
    extdata: AccountExtData;
    index: number;
    insurance: AccountInsurance;
    inventoryuid: string;
    isactive: number;
    isdeleted: number;
    itemuid: string;
    lockDate: number;
    lockStatus: number;
    lockUserUID: string;
    name: string;
    notes: string;
    startingballance: string;
    updated: string;
    useruid: string;
}

export interface AccountExtData {
    APR: number;
    Accrued_Interest: number;
    Balance: number;
    Break_Even_Amt: number;
    Break_Even_Date: number;
    CR_Balance: number;
    CR_Override: number;
    CalcAPR: number;
    CashDown: number;
    CashDownBalance: number;
    CashDownPayment: number;
    CashOnly: 0 | 1;
    Closed_Balance: number;
    Closed_Charged_Off: number;
    Closed_FMV: number;
    Closed_Int_Refund: number;
    Closed_Written_Off: number;
    ClosingNotes: string;
    Con_Amt_To_Finance: number;
    Con_Pmt_Amt: number;
    Con_Pmt_Freq: number;
    ConsumerFin: number;
    Curr_Due: number;
    DaysOverdue: number;
    Deferred_Days: number;
    DoNotReport: 0 | 1;
    Down_Pmt_Amt_Due: number;
    Down_Pmt_Balance: number;
    Down_Pmt_Date_Due: number;
    Down_Pmt_Paid: number;
    Effective_Volume_Interest: number;
    Effective_Volume_Principal: number;
    Extra_Interest_Paid: number;
    Extra_Principal_Paid: number;
    Extra_Prop_Tax_Paid: number;
    FIN_AcctBal: number;
    FIN_AcqDate: number;
    FIN_NetCheck: number;
    FIN_XFER_ExtraPrinc: number;
    FIN_XFER_Interest: number;
    FIN_XFER_Princ: number;
    Fees: number;
    Final_Pmt: number;
    First_Pmt_DOD: number;
    First_Pmt_Date: number;
    GT10000Date: number;
    GT10000LastAmt: number;
    GT10000Printed: number;
    Grace_Period: number;
    Interest: number;
    Interest_Paid: number;
    Interest_Rule: number;
    LT_BalanceShowing: number;
    LT_CustomBalance: number;
    LT_EarlyTerm: number;
    LT_Mileage: number;
    LT_Notes: string;
    LT_Recovery: number;
    LT_Repairs: number;
    LT_Saved: number;
    LT_StockNum: string;
    LT_TurnInMiles: number;
    LT_UnpaidBalance: number;
    LT_UnpaidFees: number;
    LT_WarrantyRefund: number;
    LT_Wholesale: number;
    LastCalc: number;
    Last_Paid: number;
    Last_Paid_Date: string;
    Last_Pmt: number;
    LateFee_Amt: number;
    LateFee_Max: number;
    LateFee_Override: number;
    LateFee_Percent: number;
    Late_Date: number;
    LayAwayAmt: number;
    LayAwayBalance: number;
    Lease: number;
    Loan_Fees: number;
    MEMO: string;
    Miles_Per_Year: number;
    MiscFin: number;
    Monthly_Prop_Tax: number;
    Name: string;
    Next_Pmt_Due: number;
    Next_Update: number;
    OTBox: number;
    OTCodes: string;
    Overage: number;
    Override_Figures: number;
    PTBox: number;
    PTCN: string;
    PTCurrentCode: string;
    PTEmergencyDays: number;
    PTFirstCode: string;
    PTFirstResetCode: string;
    PTGoodUntil: number;
    PTGraceDays: number;
    PTNumDays: number;
    PTRTC: string;
    PTSecondResetCode: string;
    PTUnitSerialNum: string;
    PTUnitType: number;
    PTVersion2: number;
    PassPmts: number;
    Payment_Amt: number;
    Payment_Freq: number;
    Payoff: number;
    Pickup_Pmt_1_Amt: number;
    Pickup_Pmt_1_Date: number;
    Pickup_Pmt_1_Paid: number;
    Pickup_Pmt_2_Amt: number;
    Pickup_Pmt_2_Date: number;
    Pickup_Pmt_2_Paid: number;
    Pickup_Pmt_3_Amt: number;
    Pickup_Pmt_3_Date: number;
    Pickup_Pmt_3_Paid: number;
    Pickup_Pmt_4_Amt: number;
    Pickup_Pmt_4_Date: number;
    Pickup_Pmt_4_Paid: number;
    Pickup_Pmt_5_Amt: number;
    Pickup_Pmt_5_Date: number;
    Pickup_Pmt_5_Paid: number;
    Pmt_Only_Due: number;
    Pmts_left: number;
    PreComputed: number;
    Principal_Paid: number;
    PrivNoAffil: number;
    PrivNoNonAffil: number;
    Profit_Realized: number;
    Prop_Tax_Accrued: number;
    Prop_Tax_Due: number;
    Prop_Tax_Paid: number;
    REFID: number;
    RFN: number;
    RFN_APR: number;
    RFN_Amt: number;
    RFN_Count: number;
    RFN_Deferred_Days: number;
    RFN_Extra_Principal_Paid: number;
    RFN_Final_Pmt: number;
    RFN_First_Pmt_DOD: number;
    RFN_First_Pmt_Date: number;
    RFN_Interest: number;
    RFN_Interest_Paid: number;
    RFN_Intr_Paid_Through: number;
    RFN_Paid_Through: number;
    RFN_PassPmts: number;
    RFN_Payment_Amt: number;
    RFN_Principal_Paid: number;
    RFN_StartingBalance: number;
    RFN_Term: number;
    Repo_CID: string;
    Repo_Company: string;
    Repo_Date: number;
    Reserve: string;
    ReserveTotal: number;
    Residual: number;
    Riding_Amt: number;
    ServiceFee: number;
    StatementPrinted: number;
    StatusAskedCO: number;
    StatusCode: number;
    TX_DPTaxes: number;
    TX_TaxRate: number;
    TX_Taxes: number;
    TX_TaxesPaid: number;
    Term: number;
    Termination_Fees: number;
    Title_Num: string;
    Title_Received: 0 | 1;
    Total_Adjustments: number;
    Total_Paid: number;
    Update_Periods: number;
    UseQF: number;
    Vehicle: string;
    accountuid: string;
    buyerMobile: string;
    buyerName: string;
    buyerWorkPhone: string;
    cobuyerMobile: string;
    cobuyerName: string;
    cobuyerWorkPhone: string;
    created: string;
    dateeffective: string;
    differentSeller: string;
    differentSellerInfo: string;
    index: number;
    itemuid: string;
    updated: string;
    useruid: string;
}

export interface AccountInsurance {
    Insurance_Agent_Address: string;
    Insurance_Agent_Name: string;
    Insurance_Agent_Phone_No: string;
    Insurance_Co_Num: string;
    Insurance_Company: string;
    Insurance_Eff_Date: string;
    Insurance_Exp_Date: string;
    Insurance_Notes: string;
    Insurance_Policy_Number: string;
    Insurance_Updated: string;
    Insurance_userUID: string;
}

export interface AccountHistory {
    ACCT_NUM: string;
    Balance: number;
    CID: string;
    CR_AmtPaid: number;
    CR_Change: number;
    CashDrawer: number;
    Check_Num: string;
    Comment: string;
    CreatedBy: string;
    Curr_Due: number;
    DID: string;
    DateCreated: number;
    Deleted: number;
    Demo: number;
    Down_Pmt_Memo: number;
    Down_Pmt_Paid: number;
    Down_pmt_due: number;
    Extra_Interest_Paid: number;
    Fee_Pmt: number;
    Fees_Memo: number;
    Initials: string;
    Interest_Memo: number;
    Interest_Paid: number;
    IsAdjustment: number;
    Late_Date: number;
    LayawayBalance: number;
    Layaway_Paid: number;
    New_Balance: number;
    New_Down_Pmt_Due: number;
    New_Interest_Paid: number;
    New_Late_Fees: number;
    New_Layaway: number;
    New_Next_Pmt_Date: number;
    New_Payoff: number;
    New_Pmts_Left: number;
    New_Principal_Paid: number;
    New_TX_TaxesPaid: number;
    Next_Pmt_Due: number;
    Next_Update: number;
    Other_Due: number;
    PTCurrentCode: string;
    PTGoodUntil: number;
    PTNumDays: number;
    PTOldCurrentCode: string;
    PTOldGoodUntil: number;
    PTOldNumDays: number;
    Payoff: number;
    PmtType: number;
    Pmt_Amt: number;
    Pmt_Date: number;
    Pmt_Type: string;
    Pmts_Left: number;
    Principal_Memo: number;
    Principal_Paid: number;
    Principal_Pmt: number;
    Prop_Tax_Paid: number;
    RECEIPT_NUM: string;
    Repo_Fee: number;
    SaveDeleted: number;
    Storage_Fee: number;
    TX_TaxPmt: number;
    Taxes_Memo: number;
    Total_Amt_Due: number;
    Total_Due: number;
    Total_Fees: number;
    Tow_Fee: number;
    Type: string;
    Unpaid_Late_Fees: number;
    VID: string;
    accountuid: string;
    clientuid: string;
    created: number;
    dealuid: string;
    deleted: number;
    index: number;
    inventoryuid: string;
    itemuid: string;
    updated: number;
    useruid: string;
}

export interface AccountNote {
    ACCT_NUM: string;
    ContactMethod: string;
    Date: number;
    Note: string;
    NoteBy: string;
    accountuid: string;
    created: number;
    deleted: number;
    extindex: number;
    index: number;
    itemuid: string;
    updated: number;
    useruid: string;
}

export interface AccountInsurance {
    status: Status;
    error: string;
    info: string;
    message: string;
    itemuid: string;
    Insurance_Eff_Date: string;
    Insurance_Exp_Date: string;
    Insurance_Updated: string;
    Insurance_userUID: string;
    Insurance_Company: string;
    Insurance_Co_Num: string;
    Insurance_Policy_Number: string;
    Insurance_Policy_Received: 0 | 1;
    Insurance_Notes: string;
    Insurance_Agent_Name: string;
    Insurance_Agent_Address: string;
    Insurance_Agent_Phone_No: string;
}

export interface AccountDetails extends BaseResponseError {
    message: string;
    accountuid: string;
    CurrentStatus: AccountCurrentStatus;
    CollectionDetails: AccountCollectionDetails;
    OriginalAmounts: AccountOriginalAmounts;
    NewAmounts: AccountNewAmounts;
    QuickPay: AccountQuickPay;
    PaymentDistribution: AccountPaymentDistribution;
    CashDealPayoff: AccountCashDealPayoff;
    WriteOff: AccountWriteOff;
}

export interface AccountOriginalAmount {
    AmountFinanced: string;
    ExpectedInterest: string;
    PrincipalPaid: string;
    InterestPaid: string;
    ExtraPrincipalPmts: string;
    DownPaymentPaid: string;
    TotalPaid: string;
    CurrentBalance: string;
    NextPmtDue: string;
}

export interface AccountCurrentStatus {
    PastDueAmount: string;
    CurrentDue: string;
    DownPickupDue: string;
    Fees: string;
    TotalDue: string;
    CurrentBalance: string;
}

export interface AccountCollectionDetails {
    RegularPayment: string;
    NextPmtDue: string;
    DaysOverdue: string;
    LastPaid: string;
    LastPaidDays: string;
    LastLate: string;
}

export interface AccountOriginalAmounts {
    AmountFinanced: string;
    ExpectedInterest: string;
    PrincipalPaid: string;
    InterestPaid: string;
    ExtraPrincipalPmts: string;
    DownPaymentPaid: string;
    TotalPaid: string;
    CurrentBalance: string;
    NextPmtDue: string;
}

export interface AccountNewAmounts {
    PrincipalPaid: string;
    InterestPaid: string;
    ExtraPrincipalPmts: string;
    DownPaymentPaid: string;
    TotalPaid: string;
    NewBalance: string;
    NextPmtDue: string;
}

export interface AccountQuickPay {
    DownPaymentBalance: string;
    FeesBalance: string;
    NewLateFeesDate: string;
    NewLateFeesDue: string;
    InterestDate: string;
    InterestDue: string;
    PrincipalBalance: string;
}

export interface AccountPaymentDistribution {
    DownPickupPayment: string;
    Fees: string;
    Principal: string;
    AdditionalPrincipal: string;
    Interest: string;
    TaxesPaid: string;
    TotalPaid: string;
    NextPmtDue: string;
    RemainingPastDue: string;
    NewAccountBalance: string;
    NewDownPaymentBalance: string;
    NewFeesAdded: string;
    NewFeesBalance: string;
    NewTotalBalance: string;
}

export interface AccountCashDealPayoff {
    DownPaymentBalance: string;
    AmountFinancedBalance: string;
    UnearnedInterest: string;
}

export interface AccountWriteOff {
    PrincipalWriteOff: string;
    InterestWriteOff: string;
    LateChargeWriteOff: string;
}

export interface AccountUpdateTotalInfo {
    status: string;
    error: string;
    info: string;
    message: string;
    accountuid: string;
    PrincipalPaid: number;
    InterestPaid: number;
    ExtraPrincipalPayments: number;
    TotalPaid: number;
}

export interface AccountPromise {
    status: string;
    error: string;
    info: string;
    message: string;
    index: number;
    created: number;
    updated: number;
    deleted: number;
    itemuid: string;
    useruid: string;
    username: string;
    amount: number;
    paydate: number;
    pstatus: number;
    pstatusname: string;
    notes: string;
}

export interface AccountUpdateTakePayment {
    PaymentType: number;
    PaymentDate: number;
    PaymentMethod: number;
    CheckNumber: string;
    TotalAmount: number;
    BreakdownDownPayment: number;
    BreakdownFees: number;
    BreakdownPrincipal: number;
    BreakdownContractPayment: number;
    CashDrawer: string;
    PaymentTakenBy: string;
    Notes: string;
    AmountTendered: number;
    Charge: number;
    AdjType: number;
    AdjDate: number;
    AdjPrincipal: number;
    AdjInterest: number;
    AdjExtraPrincipal: number;
    AdjDownPayment: number;
    PayOffBalancePaydown: number;
    PayOffDownPayment: number;
    PayOffFees: number;
    PayoffReserve: number;
    PayoffDiscount: number;
    PayoffLoanFees: number;
    PayoffServiceContractWithholding: number;
    PayoffGAPWithholding: number;
    PayoffVSIWithholding: number;
    PayoffMiscWithholding: number;
    PayoffMiscProfitComission: number;
}

export interface AccountMemoNote extends BaseResponseError {
    accountuid: string;
    alert: string;
    note: string;
}

export interface AccountDrawer {
    created: string;
    drawer: string;
    itemuid: string;
    useruid: string;
}

export interface AccountFeeData {
    feetype: number;
    feename: string;
    amount: number;
    description: string;
    reason: string;
}
