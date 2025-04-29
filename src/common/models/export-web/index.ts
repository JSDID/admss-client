import { ReportsColumn } from "../reports";

interface Audit {
    DataNeedsUpdate: 0 | 1;
    JustArrived: 0 | 1;
    NeedsCleaning: 0 | 1;
    ReadyForSale: 0 | 1;
    Sold: 0 | 1;
}

export interface ExportWebList {
    Audit: Audit;
    BodyStyle: string;
    Category: string;
    CityMPG: string;
    CostPrice: string;
    Cylinders: string;
    DealerCertified: number;
    DealerComments: string;
    DriveLine: string;
    Engine: string;
    ExteriorColor: string;
    ExtraField1: string;
    ExtraField2: string;
    ExtraField3: string;
    ExtraPrice1: string;
    ExtraPrice2: string;
    ExtraPrice3: string;
    FactoryCertified: number;
    GroupClass: string;
    GroupClassName: string;
    HwyMPG: string;
    InStockDate: number;
    InteriorColor: string;
    LastExportDate: string;
    LastModifiedDate: string;
    ListPrice: string;
    Make: string;
    Model: string;
    ModelCode: string;
    Notes: string;
    Options: number;
    PhotoURL: string;
    Price: string;
    SpecialPrice: string;
    Status: string;
    StockNo: string;
    Transmission: string;
    Trim: string;
    TypeOfFuel: string;
    VDPLink: string;
    VIN: string;
    VINimageUID: string;
    VideoURL: string;
    Year: string;
    created: number;
    deleted: number;
    enabled: number;
    itemuid: string;
    locationuid: string;
    mileage: string;
    name: string;
    options_codes: number[] | null;
    options_info: string[] | null;
    updated: number;
    useruid: string;
}

export interface ExportWebHistoryList {
    created: string;
    filepath: string;
    id: number;
    info: string;
    itemuid: string;
    lastrun: string;
    md5: string;
    taskstatus: string;
    tasktype: string;
    taskuid: string;
    updated: string;
    useruid: string;
}

export interface ExportWebScheduleList {
    created: string;
    datapath: string;
    info: string;
    id: number;
    lasttatus: string;
    lasttrun: string;
    nextrun: string;
    paused: number;
    tasktype: string;
    taskuid: string;
    updated: string;
    useruid: string;
}

export interface ExportWebPostData {
    data: Record<string, unknown>[];
    columns: ReportsColumn[];
}
