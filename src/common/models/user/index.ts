import { FilterOptions } from "dashboard/inventory/common/data-table";
import { DataTableState } from "primereact/datatable";
import { ContactType } from "../contact";
import { BaseResponseError } from "../base-response";

interface ColumnWidth {
    [key: string]: number;
}

export interface TableState extends DataTableState {
    page: number;
    column: string;
}

interface UserSettings {
    activeColumns?: any[];
    columnWidth?: ColumnWidth;
    table?: TableState;
}

export interface InventoryUserSettings extends UserSettings {
    activeColumns?: string[];
    currentLocation?: string;
    selectedFilterOptions?: FilterOptions[];
    selectedInventoryType: string[];
}

export interface ContactsUserSettings extends UserSettings {
    selectedCategoriesOptions?: ContactType[];
}

export interface ExportWebUserSettings extends UserSettings {
    selectedFilterOptions?: FilterOptions[] | any;
}

export interface SidebarUserSettings {
    isSidebarCollapsed: boolean;
}

export interface ServerUserSettings {
    inventory: InventoryUserSettings;
    contacts: ContactsUserSettings;
    exportWeb: ExportWebUserSettings;
    exportSchedule: ExportWebUserSettings;
    exportHistory: ExportWebUserSettings;
    sidebar?: SidebarUserSettings;
}

export interface UserGroup {
    created: string;
    description: string;
    itemuid: string;
    updated: string;
    useruid: string;
    enabled: 0 | 1;
    order: number;
    isdefault: 0 | 1;
}

export interface UserPermissionsResponse extends BaseResponseError {
    uaSystemAdmin: 0 | 1;
    uaManager: 0 | 1;
    uaClientAdmin: 0 | 1;
    uaLocationAdmin: 0 | 1;
    uaSalesPerson: 0 | 1;
    uaViewInventory: 0 | 1;
    uaAddInventory: 0 | 1;
    uaEditInventory: 0 | 1;
    uaViewCostsAndExpenses: 0 | 1;
    uaAddExpenses: 0 | 1;
    uaEditExpenses: 0 | 1;
    uaDeleteInventory: 0 | 1;
    uaViewContacts: 0 | 1;
    uaAddContacts: 0 | 1;
    uaEditContacts: 0 | 1;
    uaDeleteContacts: 0 | 1;
    uaViewDeals: 0 | 1;
    uaAddDeals: 0 | 1;
    uaEditDeals: 0 | 1;
    uaEditInsuranceOnly: 0 | 1;
    uaPrintDealsForms: 0 | 1;
    uaEditDealWashout: 0 | 1;
    uaEditPaidComissions: 0 | 1;
    uaDeleteDeal: 0 | 1;
    uaViewAccounts: 0 | 1;
    uaEditPayments: 0 | 1;
    uaDeletePayments: 0 | 1;
    uaAddCreditsAndFees: 0 | 1;
    uaDeleteAccounts: 0 | 1;
    uaChangePayments: 0 | 1;
    uaAllowBackdatingPayments: 0 | 1;
    uaAllowPartialPayments: 0 | 1;
    uaCreateUsers: 0 | 1;
    uaEditSettings: 0 | 1;
    uaAllowPaymentCalculator: 0 | 1;
    uaAllowPaymentQuote: 0 | 1;
    uaAllowReports: 0 | 1;
    uaAllowPrinting: 0 | 1;
}
