import { BaseResponseError } from "common/models/base-response";
import { ListData } from "common/models";

export interface GeneralSettings extends BaseResponseError {
    accountFixedDigits: number;
    accountLateFeeGracePeriod: number;
    accountLateFeeMax: number;
    accountLateFeeMin: number;
    accountLateFeePercentage: number;
    accountPrefix: string;
    accountStartNumber: number;
    accountSuffix: string;
    contractDefInterestRate: number;
    contractPaymentFrequency: number;
    defInvDoNotBill: 0 | 1;
    defInvDoNotPost: 0 | 1;
    defInvExportToWeb: 0 | 1;
    defInvMarkPaid: 0 | 1;
    defInvTitleReceived: 0 | 1;
    feeDefDocumentation: number;
    feeDefSpareTag: number;
    feeDefSpareTransferTag: number;
    feeDefTag: number;
    feeDefTitle: number;
    feeDefTransfer: number;
    feeDefvehiclePack: number;
    index: number;
    itemuid: string;
    leaseDefaultMileage: number;
    leaseMoneyFactor: number;
    leaseOverageAmount: number;
    leasePaymentFrequency: number;
    leaseTerm: number;
    logoenabled: 0 | 1;
    logomediauid: string;
    logoopacity: number;
    logoposX: number;
    logoposY: number;
    stocknumFixedDigits: number;
    stocknumLast6ofVIN: number;
    stocknumLast8ofVIN: number;
    stocknumPrefix: string;
    stocknumSequental: number;
    stocknumSuffix: string;
    stocknumtiFixedDigits: number;
    stocknumtiFromSoldVehicle: number;
    stocknumtiLast6ofVIN: number;
    stocknumtiLast8ofVIN: number;
    stocknumtiPrefix: string;
    stocknumtiSequental: number;
    stocknumtiSuffix: string;
    taxDefStateVehicleTaxRate: number;
    uilogoenabled: 0 | 1;
    uilogomediauid: string;
    updated: string;
    useruid: string;
    watermarkenabled: 0 | 1;
}

export interface WatermarkPostProcessing extends BaseResponseError {
    id: number;
    created: string;
    updated: string;
    deleted: string;
    useruid: string;
    itemuid: string;
    posX: number;
    posY: number;
    fontSize: number;
    fontColor: number;
    bkColor: number;
    fontName: string;
    ppText: string;
    ppPattern: string;
}

export interface GeneralInventoryOptions extends ListData {
    itemuid: string;
    order: number;
}
