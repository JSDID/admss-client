import { BaseResponse, BaseResponseError } from "../base-response";

export interface ContactExtData {
    created: number;
    updated: number;
    useruid: string;
    contactuid: string;
    itemuid: string;
    Buyer_Salutation: string;
    Buyer_First_Name: string;
    Buyer_Middle_Name: string;
    Buyer_Last_Name: string;
    Buyer_Generation: string;
    Buyer_Res_Address: string;
    Buyer_Res_Address_2: string;
    Buyer_City: string;
    Buyer_State: string;
    Buyer_Zip_Code: string;
    Buyer_County: string;
    Buyer_Res_Status: string;
    Buyer_Res_Landlord: string;
    Buyer_Res_Landlord_Phone: string;
    Buyer_Res_Years: string;
    Buyer_Res_Months: string;
    Buyer_Res_Payments: string;
    Buyer_Res_Homeowner_Years: string;
    Buyer_Mailing_Address: string;
    Buyer_Mailing_Address_2: string;
    Buyer_Mailing_City: string;
    Buyer_Mailing_State: string;
    Buyer_Mailing_Zip: string;
    Buyer_Mailing_County: string;
    Buyer_Driver_License_Num: string;
    Buyer_DL_State: string;
    Buyer_DL_Exp_Date: string;
    Buyer_SS_Number: string;
    Buyer_Sex: string;
    Buyer_Date_Of_Birth: string;
    Buyer_Home_Phone_Number: string;
    Buyer_Business_Phone_Number: string;
    Buyer_Mobile_Phone_Number: string;
    Buyer_Mobile_Phone_Provider: string;
    Buyer_Pager_Number: string;
    Buyer_Fax_Number: string;
    Buyer_EMail: string;
    Buyer_Prev1_Address: string;
    Buyer_Prev1_Address_2: string;
    Buyer_Prev1_City: string;
    Buyer_Prev1_State: string;
    Buyer_Prev1_Zip_Code: string;
    Buyer_Prev1_County: string;
    Buyer_Prev1_Status: string;
    Buyer_Prev1_Landlord: string;
    Buyer_Prev1_Landlord_Phone: string;
    Buyer_Prev1_Years: string;
    Buyer_Prev1_Months: string;
    Buyer_Prev2_Address: string;
    Buyer_Prev2_Address_2: string;
    Buyer_Prev2_City: string;
    Buyer_Prev2_State: string;
    Buyer_Prev2_Zip_Code: string;
    Buyer_Prev2_County: string;
    Buyer_Prev2_Status: string;
    Buyer_Prev2_Landlord: string;
    Buyer_Prev2_Landlord_Phone: string;
    Buyer_Prev2_Years: string;
    Buyer_Prev2_Months: string;
    Buyer_Emp_Occupation: string;
    Buyer_Emp_Contact: string;
    Buyer_Emp_Company: string;
    Buyer_Emp_Address: string;
    Buyer_Emp_Address_2: string;
    Buyer_Emp_City: string;
    Buyer_Emp_State: string;
    Buyer_Emp_Zip: string;
    Buyer_Emp_Phone: string;
    Buyer_Emp_Ext: string;
    Buyer_Emp_Monthly_Salary: string;
    Buyer_Emp_Addl_Income: string;
    Buyer_Emp_Addl_Income_Src: string;
    Buyer_Emp_Pay_Freq: string;
    Buyer_Emp_Pay_Date: string;
    Buyer_Emp_TOJ_YR: string;
    Buyer_Emp_TOJ_MO: string;
    Buyer_Emp2_Occupation: string;
    Buyer_Emp2_Contact: string;
    Buyer_Emp2_Company: string;
    Buyer_Emp2_Address: string;
    Buyer_Emp2_Address_2: string;
    Buyer_Emp2_City: string;
    Buyer_Emp2_State: string;
    Buyer_Emp2_Zip: string;
    Buyer_Emp2_Phone: string;
    Buyer_Emp2_Ext: string;
    Buyer_Emp2_Monthly_Salary: string;
    Buyer_Emp2_TOJ_YR: string;
    Buyer_Emp2_TOJ_MO: string;
    CoBuyer_AndOr: string;
    CoBuyer_Salutation: string;
    CoBuyer_First_Name: string;
    CoBuyer_Middle_Name: string;
    CoBuyer_Last_Name: string;
    CoBuyer_Generation: string;
    CoBuyer_Same_Address: string;
    CoBuyer_Res_Address: string;
    CoBuyer_Res_Address_2: string;
    CoBuyer_City: string;
    CoBuyer_State: string;
    CoBuyer_Zip_Code: string;
    CoBuyer_County: string;
    CoBuyer_Res_Status: string;
    CoBuyer_Res_Landlord: string;
    CoBuyer_Res_Landlord_Phone: string;
    CoBuyer_Res_Years: string;
    CoBuyer_Res_Month: string;
    CoBuyer_Res_Payments: string;
    CoBuyer_Res_Homeowner_Years: string;
    CoBuyer_Mailing_Address: string;
    CoBuyer_Mailing_Address_2: string;
    CoBuyer_Mailing_City: string;
    CoBuyer_Mailing_State: string;
    CoBuyer_Mailing_Zip: string;
    CoBuyer_Mailing_County: string;
    CoBuyer_Driver_License_Num: string;
    CoBuyer_DL_State: string;
    CoBuyer_DL_Exp_Date: string;
    CoBuyer_SS_Number: string;
    CoBuyer_Sex: string;
    CoBuyer_Date_Of_Birth: string;
    CoBuyer_Home_Phone_Number: string;
    CoBuyer_Business_Phone_Number: string;
    CoBuyer_Mobile_Phone_Number: string;
    CoBuyer_Pager_Number: string;
    CoBuyer_Fax_Number: string;
    CoBuyer_EMail: string;
    CoBuyer_Prev1_Address: string;
    CoBuyer_Prev1_Address_2: string;
    CoBuyer_Prev1_City: string;
    CoBuyer_Prev1_State: string;
    CoBuyer_Prev1_Zip_Code: string;
    CoBuyer_Prev1_County: string;
    CoBuyer_Prev1_Status: string;
    CoBuyer_Prev1_Landlord: string;
    CoBuyer_Prev1_Landlord_Phone: string;
    CoBuyer_Prev1_Years: string;
    CoBuyer_Prev1_Months: string;
    CoBuyer_Emp_Occupation: string;
    CoBuyer_Emp_Contact: string;
    CoBuyer_Emp_Company: string;
    CoBuyer_Emp_Address: string;
    CoBuyer_Emp_Address_2: string;
    CoBuyer_Emp_City: string;
    CoBuyer_Emp_State: string;
    CoBuyer_Emp_Zip: string;
    CoBuyer_Emp_Phone: string;
    CoBuyer_Emp_Ext: string;
    CoBuyer_Emp_Monthly_Salary: string;
    CoBuyer_Emp_Addl_Income: string;
    CoBuyer_Emp_Addl_Income_Src: string;
    CoBuyer_Emp_Pay_Freq: string;
    CoBuyer_Emp_Pay_Date: string;
    CoBuyer_Emp_TOJ_YR: string;
    CoBuyer_Emp_TOJ_MO: string;
    CoBuyer_Emp2_Occupation: string;
    CoBuyer_Emp2_Contact: string;
    CoBuyer_Emp2_Company: string;
    CoBuyer_Emp2_Address: string;
    CoBuyer_Emp2_Address_2: string;
    CoBuyer_Emp2_City: string;
    CoBuyer_Emp2_State: string;
    CoBuyer_Emp2_Zip: string;
    CoBuyer_Emp2_Phone: string;
    CoBuyer_Emp2_Ext: string;
    CoBuyer_Emp2_Monthly_Salary: string;
    CoBuyer_Emp2_TOJ_YR: string;
    CoBuyer_Emp2_TOJ_MO: string;
    Buyer_Liquid_Assets: string;
    CoBuyer_Liquid_Assets: string;
    Notes: string;
    Credit_School_Level: string;
    Credit_Mos_History: string;
    Credit_Num_Records: string;
    Credit_Bankruptcy_Discharge: string;
    Credit_High_Credit: string;
    Credit_Yrs_as_Homeowner: string;
    Credit_Beacon: string;
    Credit_Mothers_Maiden: string;
    Credit_Buyer_Self_Employed: string;
    Credit_CoBuyer_Self_Employed: string;
    Credit_First_Time_Buyer: string;
    Credit_Foreclosure: string;
    Credit_Repossession: string;
    Credit_Buyer_Bankruptcy: string;
    Credit_CoBuyer_Bankruptcy: string;
    Credit_Bank1_Name: string;
    Credit_Bank1_Type: string;
    Credit_Bank1_Balance: string;
    Credit_Bank2_Name: string;
    Credit_Bank2_Type: string;
    Credit_Bank2_Balance: string;
    Credit_Bank3_Name: string;
    Credit_Bank3_Type: string;
    Credit_Bank3_Balance: string;
    Credit_Report: string;
    Lender_Discount: string;
    Lender_Reserve: string;
    Lender_Buy_Fee: string;
    Lender_APR: string;
    Lender_Notes: string;
    Lender_No_Odd: string;
    Lender_Require_Rounded_Final: string;
    Demo: string;
    SALESMAN_ID: string;
    PROSPECT1_ID: string;
    PROSPECT2_ID: string;
    Bankrupt: string;
    Priv_Allow_Affil: string;
    Priv_Allow_NonAffil: string;
    Buyer_In_Bankruptcy: string;
    Contact_Name: string;
    OFAC_Buyer_DW: string;
    OFAC_CoBuyer_DW: string;
    OFAC_Buyer_OUT: string;
    OFAC_CoBuyer_OUT: string;
    OFAC_Msg: string;
    ID_Verified: string;
    ID_Verify_Level: string;
    ID_Verify_Memo: string;
    QBID: string;
}

export interface ContactProspect {
    index: number;
    created: string;
    updated: string;
    itemuid: string;
    useruid: string;
    contactuid: string;
    inventoryuid: string;
    notes: string;
}

export interface Contact extends BaseResponseError {
    ZIP: string;
    businessName: string;
    businessSite: string;
    city: string;
    cobuyeruid: string;
    companyName: string;
    contactuid: string;
    created: string;
    dl_expiration: string;
    dl_issuedate: string;
    dl_number: string;
    dluidback: string;
    dluidfront: string;
    dob: string;
    email1: string;
    email2: string;
    emails: string[];
    exp: string;
    extdata?: ContactExtData;
    firstName: string;
    lastName: string;
    mailCity: string;
    mailEmail: string;
    mailPhone: string;
    mailState: string;
    mailStreetAddress: string;
    mailZIP: string;
    messager1: string;
    messager2: string;
    messager3: string;
    messager4: string;
    messagers: string[];
    middleName: string;
    phone1: string;
    phone2: string;
    phones: string[];
    prospect: ContactProspect[];
    sex: string;
    state: string;
    streetAddress: string;
    type: number;
    updated: string;
    userName: string;
    useruid: string;
}

export enum OFAC_CHECK_STATUS {
    PASSED = "PASSED",
    FAILED = "FAILED",
}

export interface ContactOFAC extends BaseResponseError {
    check_status: OFAC_CHECK_STATUS;
    blacklist?: string;
    created?: string;
    updated?: string;
    listid?: number;
    dob?: string;
    firstname?: string;
    lastname?: string;
    details?: string;
}

export interface ContactCheckOFAC extends Contact {
    OFAC: ContactOFAC;
}

export interface ContactsCategories extends BaseResponseError {
    contact_types: ContactType[];
}

export interface ContactType {
    id: number;
    name: ContactTypeNameList | string;
}

export interface ContactUser extends Contact {
    ZIP: string;
    city: string;
    companyName: string;
    contactuid: string;
    created: string;
    dluidback: string;
    dluidfront: string;
    fullAddress: string;
    email1: string;
    email2: string;
    firstName: string;
    lastName: string;
    messager1: string;
    messager2: string;
    middleName: string;
    phone1: string;
    phone2: string;
    state: string;
    streetAddress: string;
    type: number;
    updated: string;
    userName: string;
    useruid: string;
}

export interface TotalUsers extends BaseResponse {
    total: number;
}

export interface SalespersonsList {
    created: string;
    createdbyuid: string;
    creatorusername: string;
    enabled: number;
    updated: string;
    username: string;
    useruid: string;
}

export enum ContactTypeNameList {
    DEFAULT = "Default",
    BUYERS = "Buyers",
    DEALERS = "Dealers",
    INSURANCE_COMPANIES = "Insurance Companies",
    INSURANCE_AGENTS = "Insurance Agents",
    VENDORS = "Vendors",
    LENDERS = "Lenders",
    AUCTIONS = "Auctions",
    CONSIGNORS = "Consignors",
    GENERAL = "General",
}

export interface SetContactResponse extends BaseResponseError {
    OFAC?: ContactOFAC;
    OFAC_cobuyer?: ContactOFAC;
    contactuid: string;
}

export interface ScanBarcodeDL extends BaseResponseError {
    contact: Pick<
        Contact,
        | "ZIP"
        | "city"
        | "created"
        | "dl_number"
        | "dob"
        | "exp"
        | "firstName"
        | "lastName"
        | "middleName"
        | "sex"
        | "state"
        | "streetAddress"
        | "updated"
    >;
    qr_data: {
        Bytes: string;
        Content: string;
        ECLevel: string;
        Error: string;
        Format: string;
        HasECI: boolean;
        Identifier: string;
        IsInverted: boolean;
        IsMirrored: boolean;
        Rotation: number;
        Text: string;
        Version: string;
    }[];
}
