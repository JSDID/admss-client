import { configure } from "mobx";
import { InventoryStore } from "store/stores/inventory";
import { ContactStore } from "store/stores/contact";
import { DealStore } from "store/stores/deal";
import { UserStore } from "store/stores/user";
import { AccountStore } from "store/stores/account";
import { ReportStore } from "store/stores/report";
import { GeneralSettingsStore } from "store/stores/general-settings";

configure({
    enforceActions: "never",
});

export class RootStore {
    public inventoryStore: InventoryStore;
    public contactStore: ContactStore;
    public dealStore: DealStore;
    public userStore: UserStore;
    public accountStore: AccountStore;
    public reportStore: ReportStore;
    public generalSettingsStore: GeneralSettingsStore;
    public constructor() {
        this.userStore = new UserStore(this);
        this.inventoryStore = new InventoryStore(this);
        this.contactStore = new ContactStore(this);
        this.dealStore = new DealStore(this);
        this.accountStore = new AccountStore(this);
        this.reportStore = new ReportStore(this);
        this.generalSettingsStore = new GeneralSettingsStore(this);
    }
}

export const store = new RootStore();
