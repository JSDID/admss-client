import { Inventory } from "common/models/inventory";
import { ColumnProps } from "primereact/column";

export interface FilterOptions {
    label: string;
    value: string;
    column?: keyof Inventory | "Misc";
    bold?: boolean;
    disabled?: boolean;
}

export type TableColumnsList = Pick<TableColumnProps, "header" | "field"> & { checked: boolean };

export const filterOptions: FilterOptions[] = [
    { label: "Status", value: "status", bold: true, disabled: true },
    { label: "All", value: "all", column: "Status" },
    { label: "Current (not sold)", column: "Status", value: "current" },
    { label: "Sold", column: "Status", value: "sold" },
    { label: "Age", value: "age", bold: true, disabled: true },
    { label: "0 to 30 days", column: "Age", value: "0-30" },
    { label: "31 to 60 days", column: "Age", value: "31-60" },
    { label: "61 to 90 days", column: "Age", value: "61-90" },
    { label: "90+ days", column: "Age", value: "over90" },
    { label: "Body", value: "body", bold: true, disabled: true },
    { label: "Trucks", column: "BodyStyle", value: "trucks" },
    { label: "SUVs", column: "BodyStyle", value: "suv" },
    { label: "Sedans", column: "BodyStyle", value: "sedans" },
    { label: "Coupes", column: "BodyStyle", value: "coupes" },
    { label: "Convertibles", column: "BodyStyle", value: "convertibles" },
    { label: "Miles", value: "miles", bold: true, disabled: true },
    { label: "0 to 30000", column: "mileage", value: "0-30000" },
    { label: "30000 to 100000", column: "mileage", value: "30000-100000" },
    { label: "over 100000", column: "mileage", value: "over100000" },
    { label: "Audit", value: "audit", bold: true, disabled: true },
    { label: "Data needs update", column: "Audit", value: "needsUpdatedata" },
    { label: "Just arrived (today)", column: "Audit", value: "arrivedToday" },
    { label: "Needs cleaning", column: "Audit", value: "needsCleaning" },
    { label: "Ready for sale", column: "Audit", value: "readySale" },
    { label: "Needs inspection", column: "Audit", value: "needsInspection" },
    { label: "Needs oil changes", column: "Audit", value: "needsOil" },
    { label: "Floorplanned", column: "Audit", value: "floorplanned" },
    { label: "Keys missing", column: "Audit", value: "keysMissing" },
    { label: "Title missing", column: "Audit", value: "titleMissing" },
    { label: "Not paid", column: "Audit", value: "notPaid" },
    // TODO: missed misc column
    { label: "Misc", column: "Misc", value: "misc", bold: true, disabled: true },
    { label: "AWD", column: "Misc", value: "awd" },
    { label: "Manual Transmission", column: "Misc", value: "manual" },
    { label: "Diesel", column: "Misc", value: "diesel" },
    { label: "Fuel economy", column: "Misc", value: "fuelEconomy" },
    { label: "Electric", column: "Misc", value: "electric" },
];

export interface TableColumnProps extends ColumnProps {
    field: keyof Inventory | MissedInventoryColumn;
}

export type MissedInventoryColumn =
    | "Location"
    | "IsFloorplanned"
    | "FloorplanCompany"
    | "PurchasedFrom"
    | "PurchaseAuctCo"
    | "PurchaseBuyerName"
    | "PurchaseDate"
    | "PurchaseAmount"
    | "LotNo"
    | "SoldByLot"
    | "KeysMissing"
    | "KeysDuplicate"
    | "KeysHasRemote"
    | "KeyNumber"
    | "Consignor"
    | "Consign"
    | "IsTradeIn"
    | "TitleStatus"
    | "TitleState"
    | "TitleNumber"
    | "TitleReceived"
    | "TitleReceivedDate"
    | "Paid"
    | "SalesTaxPaid"
    | "ODOMInExcess"
    | "ODOMNotActual"
    | "DAM_Salvage"
    | "DAM_Salvage_State"
    | "DAM_Flood"
    | "DAM_25"
    | "DAM_25_Parts"
    | "DAM_Theft"
    | "DAM_Theft_Parts"
    | "DAM_Reconstructed"
    | "Autocheck_Checked"
    | "CHK_Oil"
    | "CHK_Inspected"
    | "INSP_Number"
    | "INSP_Date"
    | "INSP_Emissions"
    | "INSP_Sticker_Exp"
    | "In Stock Date"
    | "City MPG"
    | "Hwy MPG";

export const columns: TableColumnsList[] = [
    { field: "StockNo", header: "Stock#", checked: true },
    { field: "Make", header: "Make", checked: true },
    { field: "Model", header: "Model", checked: true },
    { field: "Year", header: "Year", checked: true },
    { field: "ExteriorColor", header: "Color", checked: true },
    { field: "mileage", header: "Mileage", checked: true },
    { field: "Price", header: "Price", checked: true },
    { field: "VIN", header: "VIN", checked: true },
    { field: "Category", header: "Category", checked: false },
    { field: "InteriorColor", header: "Interior Color", checked: false },
    { field: "BodyStyle", header: "Body", checked: false },
    { field: "Transmission", header: "Transmission", checked: false },
    { field: "TypeOfFuel", header: "Fuel Type", checked: false },
    { field: "DriveLine", header: "Drive Line", checked: false },
    { field: "Cylinders", header: "Number of Cylinders", checked: false },
    { field: "Engine", header: "Engine Descriptions", checked: false },
    { field: "Status", header: "Status", checked: false },
    { field: "GroupClass", header: "Group Class", checked: false },
    { field: "Location", header: "Location", checked: false },
    { field: "IsFloorplanned", header: "Floorplan Status", checked: false },
    { field: "FloorplanCompany", header: "Floorplan Company", checked: false },
    { field: "PurchasedFrom", header: "Purchased From", checked: false },
    { field: "PurchaseAuctCo", header: "Purchase Auction Company", checked: false },
    { field: "PurchaseBuyerName", header: "Purchase Buyer Name", checked: false },
    { field: "PurchaseDate", header: "Purchase Date", checked: false },
    { field: "PurchaseAmount", header: "Purchase Amount", checked: false },
    { field: "LotNo", header: "Lot Number", checked: false },
    { field: "SoldByLot", header: "Sold By Lot", checked: false },
    { field: "KeysMissing", header: "Keys Missing", checked: false },
    { field: "KeysDuplicate", header: "Duplicate Keys", checked: false },
    { field: "KeysHasRemote", header: "Keys with Remote", checked: false },
    { field: "KeyNumber", header: "Key Number", checked: false },
    { field: "Consignor", header: "Consignor", checked: false },
    { field: "Consign", header: "Consign Date", checked: false },
    { field: "IsTradeIn", header: "Trade-In Status", checked: false },
    { field: "TitleStatus", header: "Title Status", checked: false },
    { field: "TitleState", header: "Title State", checked: false },
    { field: "TitleNumber", header: "Title Number", checked: false },
    { field: "TitleReceived", header: "Title Received", checked: false },
    { field: "TitleReceivedDate", header: "Title Received Date", checked: false },
    { field: "Paid", header: "Paid", checked: false },
    { field: "SalesTaxPaid", header: "Sales Tax Paid", checked: false },
    { field: "ODOMInExcess", header: "Odometer in Excess", checked: false },
    { field: "ODOMNotActual", header: "Odometer Not Actual", checked: false },
    { field: "DAM_Salvage", header: "Salvage Status", checked: false },
    { field: "DAM_Salvage_State", header: "Salvage State", checked: false },
    { field: "DAM_Flood", header: "Flood Status", checked: false },
    { field: "DAM_25", header: "Damage Percentage", checked: false },
    { field: "DAM_25_Parts", header: "Damaged Parts", checked: false },
    { field: "DAM_Theft", header: "Theft Status", checked: false },
    { field: "DAM_Theft_Parts", header: "Theft Parts", checked: false },
    { field: "DAM_Reconstructed", header: "Reconstruction Status", checked: false },
    { field: "Autocheck_Checked", header: "Autocheck Status", checked: false },
    { field: "CHK_Oil", header: "Oil Check", checked: false },
    { field: "CHK_Inspected", header: "State Inspection", checked: false },
    { field: "FactoryCertified", header: "Factory Certified", checked: false },
    { field: "DealerCertified", header: "Dealer Certified", checked: false },
    { field: "INSP_Number", header: "Inspection Number", checked: false },
    { field: "INSP_Date", header: "Inspection Date", checked: false },
    { field: "INSP_Emissions", header: "Emissions Check", checked: false },
    { field: "INSP_Sticker_Exp", header: "Sticker Expiration Date", checked: false },
    { field: "In Stock Date", header: "In Stock Date", checked: false },
    { field: "City MPG", header: "City MPG", checked: false },
    { field: "Hwy MPG", header: "Highway MPG", checked: false },
];
