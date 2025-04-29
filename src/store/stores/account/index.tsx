import { BaseResponseError, Status } from "common/models/base-response";
import {
    AccountInfo,
    AccountExtData,
    AccountDetails,
    AccountDrawer,
    AccountMemoNote,
    AccountUpdateTakePayment,
} from "common/models/accounts";
import { action, makeAutoObservable } from "mobx";
import { RootStore } from "store";
import {
    createOrUpdateAccount,
    getAccountInfo,
    getAccountNote,
    getPaymentInfo,
    listPaymentDrawers,
    updateAccountTakePayment,
} from "http/services/accounts.service";

export type AccountNoteData = Pick<AccountMemoNote, "alert" | "note">;

const initialNote: AccountNoteData = {
    alert: "",
    note: "",
};

export class AccountStore {
    public rootStore: RootStore;
    private _account: Partial<AccountInfo> = {} as AccountInfo;
    private _accountPaymentsInfo: Partial<AccountDetails> = {} as AccountDetails;
    private _accountExtData: AccountExtData = {} as AccountExtData;
    private _accountDrawers: AccountDrawer[] = [];
    private _accountID: string = "";
    private _accountNote: AccountNoteData = initialNote;
    private _accountTakePayment: Partial<AccountUpdateTakePayment> = {} as AccountUpdateTakePayment;
    private _isAccountChanged: boolean = false;
    private _isAccountPaymentChanged: boolean = false;
    private _prevPath: string | null = null;
    protected _isLoading = false;

    public constructor(rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;
    }

    public get account() {
        return this._account;
    }

    public get accountID() {
        return this._accountID;
    }

    public get accountExtData() {
        return this._accountExtData;
    }

    public get accountPaymentsInfo() {
        return this._accountPaymentsInfo;
    }

    public get accountDrawers() {
        return this._accountDrawers;
    }

    public get accountNote() {
        return this._accountNote;
    }

    public get accountTakePayment() {
        return this._accountTakePayment;
    }

    public get isAccountChanged() {
        return this._isAccountChanged;
    }

    public get isAccountPaymentChanged() {
        return this._isAccountPaymentChanged;
    }

    public get prevPath() {
        return this._prevPath;
    }

    public get isLoading() {
        return this._isLoading;
    }

    public getAccount = async (itemuid: string) => {
        this._isLoading = true;
        try {
            const response = await getAccountInfo(itemuid);
            if (response && response.status === Status.ERROR) {
                throw response.error;
            } else {
                const { extdata, ...account } = response as AccountInfo;

                this._accountID = account.accountuid;

                this._account = account || ({} as AccountInfo);
                this._accountExtData = extdata || ({} as AccountExtData);
            }
        } catch (error) {
            return {
                status: Status.ERROR,
                error,
            };
        } finally {
            this._isLoading = false;
        }
    };

    public getNotes = (id: string) => {
        getAccountNote(id).then((res) => {
            if (res?.status !== Status.ERROR) this._accountNote = res as AccountMemoNote;
        });
    };

    public getAccountPaymentsInfo = async (accountuid: string) => {
        this._isLoading = true;
        try {
            const response = await getPaymentInfo(accountuid);
            if (response) {
                this._accountPaymentsInfo = response || ({} as AccountDetails);
            }
        } catch (error) {
        } finally {
            this._isLoading = false;
        }
    };

    public getDrawers = async (useruid: string) => {
        this._isLoading = true;
        try {
            const response = await listPaymentDrawers(useruid);
            if (Array.isArray(response)) {
                this._accountDrawers = response as AccountDrawer[];
            }
        } catch (error) {
        } finally {
            this._isLoading = false;
        }
    };

    public changeAccount = action(
        (key: keyof Omit<AccountInfo, "extdata">, value: string | number | string[]) => {
            this._isAccountChanged = true;
            this._account[key] = value as never;
        }
    );

    public changeAccountExtData = action((key: keyof AccountExtData, value: string | number) => {
        this._isAccountChanged = true;
        this._accountExtData[key] = value as never;
    });

    public changeAccountPaymentsInfo = action(
        (key: keyof AccountDetails, value: string | number) => {
            this._isAccountPaymentChanged = true;
            this._accountPaymentsInfo[key] = value as never;
        }
    );

    public changeAccountTakePayment = action(
        (key: keyof AccountUpdateTakePayment, value: string | number) => {
            this._isAccountPaymentChanged = true;
            this._accountTakePayment[key] = value as never;
        }
    );

    public saveTakePayment = action(async (): Promise<BaseResponseError | undefined> => {
        try {
            this._isLoading = true;
            const response = await updateAccountTakePayment(
                this._accountID,
                this._accountTakePayment
            );
            if (response?.status === Status.ERROR) {
                const { error } = response as BaseResponseError;

                throw new Error(error);
            }
        } catch (error: Error | any) {
            const err = error as Error;
            return {
                status: Status.ERROR,
                error: err.message,
            };
        }
    });

    public saveAccount = action(async (): Promise<string | undefined> => {
        try {
            this._isLoading = true;

            const response = await createOrUpdateAccount(this._accountID, {
                ...this._account,
                extdata: this._accountExtData,
            });
            await Promise.all([response]).then((response) =>
                response.forEach((res) => {
                    if (res?.status === Status.ERROR) {
                        const { error } = res as BaseResponseError;
                        throw new Error(error);
                    }
                })
            );
        } catch (error) {
            return error as string;
        } finally {
            this._isLoading = false;
        }
    });

    public set accountNote(note: AccountNoteData) {
        this._isAccountPaymentChanged = true;
        this._accountNote = note;
    }

    public set isLoading(state: boolean) {
        this._isLoading = state;
    }

    public set isAccountChanged(state: boolean) {
        this._isAccountChanged = state;
    }

    public set prevPath(path: string | null) {
        this._prevPath = path;
    }

    public clearAccount = () => {
        this._account = {} as AccountInfo;
        this._accountID = "";
        this._prevPath = null;
        this._accountExtData = {} as AccountExtData;
    };
}
