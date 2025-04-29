import { ListData, PrintForm } from "common/models";
import { BaseResponse, BaseResponseError, Status } from "common/models/base-response";
import { ContentType } from "common/models/enums";
import { MediaLimits } from "common/models";

export interface LocationsListData {
    locations: InventoryLocations[];
    status: Status;
}

export type MakesListData = ListData & { logo: string };
export type OptionsListData = ListData & { name: InventoryOptionsInfo };

export interface InventoryExtData {
    bgAsIs: number;
    bgDuration: string;
    bgFullWarranty: number;
    bgLimitedWarranty: number;
    bgPercLabor: string;
    bgPercParts: string;
    bgServiceContract: number;
    bgSystemsCovered: string;
    bgWarranty: number;
    chkAutocheckChecked: number;
    chkCustom0: number;
    chkCustom1: number;
    chkCustom2: number;
    chkCustom3: number;
    chkCustom4: number;
    chkCustom5: number;
    chkCustom6: number;
    chkCustom7: number;
    chkCustom8: number;
    chkCustom9: number;
    chkInspected: number;
    chkOil: number;
    created: string;
    csConsigorID: string;
    csDate: number;
    csEarlyRemoval: number;
    csFee: number;
    csIsConsigned: number;
    csListingFee: number;
    csName: string;
    csNetToOwner: string;
    csNotes: string;
    csNumDays: number;
    csOwnerAskingPrice: number;
    csReserveAmt: number;
    csReserveFactor: number;
    csReturnDate: number;
    csReturned: number;
    dam25: number;
    dam25Parts: string;
    damFlood: number;
    damODOMInExcess: number;
    damODOMNotActual: number;
    damReconstructed: number;
    damSalvage: number;
    damSalvageState: string;
    damTheft: number;
    damTheftParts: string;
    fpFloorplanCompany: string;
    fpIsFloorplanned: number;
    fpPayoffBy: number;
    fpReductionDate: number;
    fpReduxAmt: number;
    fpRemainBal: number;
    inspDate: number;
    inspEmissions: number;
    inspNumber: string;
    inspSafety: number;
    inspStickerExp: number;
    inventoryuid: string;
    itemuid: string;
    keyNumber: string;
    keysDuplicate: number;
    keysHasRemote: number;
    keysMissing: number;
    payAPR: number;
    payAmtFin: number;
    payAskingPrice: number;
    payBookBaseValue: number;
    payBookMilesAdd: number;
    payBookValue: string;
    payCashPrice: number;
    payDateSold: number;
    payDefaultExpAdded: number;
    payDownPayment: number;
    payExpenses: string;
    payMiscNote: string;
    payPPY: number;
    payPack: number;
    payPaid: number;
    payPayment: number;
    payPaymentDevice: string;
    payPaymentDeviceID: string;
    payPurchaseState: string;
    payRemarks: string;
    paySalesTaxPaid: number;
    paySold: number;
    payStateOfLastReg: string;
    payTerm: number;
    payWSNotes: string;
    purLotNo: number;
    purPurchaseAddress: string;
    purPurchaseAmount: number;
    purPurchaseAuctCo: string;
    purPurchaseBuyer: number;
    purPurchaseBuyerComm: number;
    purPurchaseBuyerName: string;
    purPurchaseBuyerPercent: number;
    purPurchaseCheck: string;
    purPurchaseCheckDate: number;
    purPurchaseCheckMemo: string;
    purPurchaseCity: string;
    purPurchaseDate: number;
    purPurchasePhone: string;
    purPurchaseEmail: string;
    purPurchaseZipCode: string;
    purPurchasedFrom: string;
    purSoldByLot: number;
    titleHolderAddress: string;
    titleHolderName: string;
    titleHolderPayoff: string;
    titleHolderPhone: string;
    titleHolderZIP: string;
    titleHolderState: string;
    titleIsTradeIn: number;
    titleNumber: string;
    titlePrevAddress: string;
    titlePrevName: string;
    titlePrevPhone: string;
    titlePrevZIP: string;
    titlePrevState: string;
    titleReceived: number;
    titleReceivedDate: number;
    titleState: string;
    titleStatus: number;
    updated: string;
    useruid: string;
}

export interface InventoryWebInfo {
    CityMPG: string;
    CostPrice: number;
    DealerComments: string;
    ExtraField1: string;
    ExtraField2: string;
    ExtraField3: string;
    ExtraPrice1: number;
    ExtraPrice2: number;
    ExtraPrice3: number;
    HwyMPG: string;
    InStockDate: number;
    LastExportDate: number;
    LastModifiedDate: number;
    ListPrice: string;
    ModelCode: string;
    PhotoURL: string;
    SpecialPrice: number;
    VDPLink: string;
    VideoURL: string;
    created: number;
    deleted: number;
    enabled: number;
    itemuid: string;
    status: Status;
    updated: number;
    useruid: string;
}

export interface InventorySetResponse extends BaseResponseError {
    itemuid: string;
}

export interface CreateMediaItemRecordResponse extends BaseResponseError {
    itemUID: string;
}

export type InventoryOptionsInfo =
    | "A/C"
    | "Automatic Climate Control"
    | "Anti-Lock Brakes"
    | "Anti-Theft System"
    | "Anti-Skid Control"
    | "All Wheel Drive"
    | "Aluminum Alloy Wheels"
    | "AM/FM Stereo"
    | "tConvertable Top"
    | "Cruise Control"
    | "Cassette Player"
    | "CD Changer"
    | "Fog Lights"
    | "Four Wheel Drive"
    | "Leather Upholstry"
    | "Luggage Rack"
    | "MoonRoof"
    | "Navigation System"
    | "Overhead Console"
    | "Power Door Locks"
    | "Power Seats"
    | "Power Steering"
    | "Power Windows"
    | "Remote Keyless Entry"
    | "Rear Window Wiper"
    | "Rear Window Defogger"
    | "Sun Roof"
    | "Sunscreen Glass"
    | "Tinted Windows"
    | "Android Auto"
    | "Apple Car Play";

export interface Audit {
    NeedsInspection: number;
    NeedsOilChange: number;
    Floorplanned: number;
    KeysMissing: number;
    TitleMissing: number;
    NotPaid: number;
    DataNeedsUpdate: number;
    NeedsCleaning: number;
    ReadyForSale: number;
    Sold: number;
    JustArrived: number;
}

export interface Inventory extends BaseResponseError {
    Age: number;
    BodyStyle: string;
    BodyStyle_id: number;
    Category: string;
    Cylinders: string;
    Cylinders_id: number;
    DealerCertified: number;
    DriveLine: string;
    DriveLine_id: number;
    Engine: string;
    Engine_id: number;
    ExteriorColor: string;
    FactoryCertified: number;
    GroupClass: number;
    GroupClassName: string;
    InteriorColor: string;
    Make: string;
    Model: string;
    Notes: string;
    Options: number;
    Price: number;
    Status: string;
    StockNo: string;
    Transmission: string;
    Transmission_id: number;
    Trim: string;
    TypeOfFuel: string;
    TypeOfFuel_id: number | string;
    VIN: string;
    VINimageUID: string;
    Year: string;
    created: string;
    itemuid: string;
    mileage: string;
    name: string;
    options_codes?: unknown;
    options_info?: InventoryOptionsInfo[];
    updated: string;
    useruid: string;
    locationuid: string;
    extdata?: InventoryExtData;
    Audit?: Audit;
}

export interface TotalInventoryList extends BaseResponse {
    total: number;
}

export type EndpointType =
    | "options"
    | "bodytypes"
    | "exteriorcolors"
    | "interiorcolors"
    | "cylinders"
    | "driveline"
    | "engine"
    | "expensetypes"
    | "fueltypes"
    | "transmissiontypes"
    | "automakes"
    | "category"
    | "status"
    | "group";

export interface InventoryMediaItemID {
    itemuid: string;
    mediauid: string;
    inventoryuid: string;
}

export interface InventoryMediaInfo {
    accessed: string;
    created: string;
    duration: number;
    filepath: string;
    height: number;
    index: number;
    itemUID: string;
    mediaType: number;
    size: number;
    status: string;
    updated: string;
    userUID: string;
    width: number;
}

export interface InventoryMediaPostData {
    useruid: string;
    itemuid: string;
    mediaitemuid: string;
    mediaurl: string;
    notes: string;
    type: number;
    contenttype: number;
    order: number;
}

export interface InventoryMedia extends InventoryMediaItemID {
    contenttype: ContentType;
    created: string;
    index: number;
    notes: string;
    type: number;
    updated: string;
    useruid: string;
}

export interface MediaLimitations extends MediaLimits {
    maxUpload: number;
}

export interface InventoryExportWebHistory {
    created: string;
    id: number;
    info: string;
    inventoryuid: string;
    listprice: string;
    servicetype: string;
    specialprice: string;
    taskstatus: string;
    tasktype: string;
    taskuid: string;
    useruid: string;
}

export interface InventoryPrintForm extends PrintForm {}

export interface InventoryLocations {
    created: string;
    index: number;
    locEmail1: string;
    locEmail2: string;
    locManager1: string;
    locManager2: string;
    locName: string;
    locPhone1: string;
    locPhone2: string;
    locState: string;
    locStreetAddress: string;
    locWeb: string;
    locZIP: string;
    locationuid: string;
    updated: string;
    useruid: string;
}

interface InventoryCheckInfo {
    exists: 0 | 1;
    status: Status;
}

export interface InventoryStockNumber extends InventoryCheckInfo {
    stockno: string;
}

export interface InventoryCheckVIN extends InventoryCheckInfo {
    info: string;
    inventoryuid: string;
}

export interface InventoryWebCheck extends BaseResponseError {
    message: string;
    enabled: 0 | 1;
}

export interface InventoryExpense extends BaseResponseError {
    id: number;
    created: string;
    updated: string;
    operationdate: string;
    itemuid: string;
    useruid: string;
    contactuid: string;
    comment: string;
    type: number;
    type_name: string;
    amount: number;
    amount_text: string;
    notbillable: number;
    description: string;
    checknumber: string;
}

export interface InventoryPaymentBack extends BaseResponseError {
    payPack: number;
    payDefaultExpAdded: 0 | 1;
    payPaid: 0 | 1;
    paySalesTaxPaid: 0 | 1;
    payRemarks: string;
}

export interface InventoryOptions extends BaseResponseError {
    options_list: OptionsListData[];
    value: number;
}

export interface MediaItem {
    src: string;
    itemuid: string;
    mediauid?: string;
    info?: Partial<InventoryMedia> & {
        order?: number;
    };
}

export interface UploadMediaItem {
    file: File[];
    data: Partial<InventoryMediaPostData>;
}

export interface UploadMediaLink {
    contenttype: number;
    notes: string;
    mediaurl: string;
}
