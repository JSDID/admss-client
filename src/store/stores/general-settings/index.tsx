import { BaseResponseError, Status } from "common/models/base-response";
import { MediaType } from "common/models/enums";
import { GeneralSettings, WatermarkPostProcessing } from "common/models/general-settings";
import { CreateMediaItemRecordResponse } from "common/models/inventory";
import { UserGroup } from "common/models/user";
import { getUserGroupList } from "http/services/auth-user.service";
import { createMediaItemRecord, uploadInventoryMedia } from "http/services/media.service";
import {
    getPostProcessing,
    getUserGeneralSettings,
    getWatermark,
    updatePostProcessing,
    updateUserGeneralSettings,
} from "http/services/settings.service";
import { action, makeAutoObservable } from "mobx";
import { RootStore } from "store";

type TextBlock = Partial<WatermarkPostProcessing>;

const initialPostProcessing: TextBlock[] = [
    {
        id: 0,
        ppPattern: "",
        fontColor: 0,
        bkColor: 0,
        fontSize: 0,
        posX: 0,
        posY: 0,
        ppText: "",
        fontName: "",
        useruid: "",
    },
];

export class GeneralSettingsStore {
    public rootStore: RootStore;
    private _settings: GeneralSettings = {} as GeneralSettings;
    private _inventoryGroups: UserGroup[] = [];
    private _inventoryGroupID: string = "";
    private _watermarkImage: File | null = null;
    private _watermarkImageUrl: string | null = null;
    private _postProcessing: WatermarkPostProcessing[] =
        initialPostProcessing as WatermarkPostProcessing[];
    protected _isLoading = false;
    private _isSettingsChanged: boolean = false;
    private _isPostProcessingChanged: boolean = false;
    private _memoRoute: string = "";
    private _activeTab: number | null = null;
    private _tabLength: number = 0;

    public constructor(rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;
    }

    public get settings() {
        return this._settings;
    }

    public get inventoryGroups() {
        return this._inventoryGroups;
    }

    public get inventoryGroupID() {
        return this._inventoryGroupID;
    }

    public get isSettingsChanged() {
        return this._isSettingsChanged;
    }

    public get watermarkImage() {
        return this._watermarkImage;
    }

    public get watermarkImageUrl() {
        return this._watermarkImageUrl;
    }

    public get postProcessing() {
        return this._postProcessing;
    }

    public get isLoading() {
        return this._isLoading;
    }

    public get memoRoute() {
        return this._memoRoute;
    }

    public get tabLength() {
        return this._tabLength;
    }

    public get activeTab() {
        return this._activeTab;
    }

    private get logomediauid() {
        return this._settings.logomediauid;
    }

    public getSettings = async () => {
        this._isLoading = true;
        try {
            const userSettings = await getUserGeneralSettings();
            if (userSettings && !userSettings.error) {
                this._settings = userSettings as GeneralSettings;
                this._isSettingsChanged = false;
            }
            return { status: Status.OK };
        } catch (error) {
            return {
                status: Status.ERROR,
                error,
            };
        } finally {
            this._isLoading = false;
        }
    };

    public getUserGroupList = async () => {
        const useruid = this.rootStore.userStore.authUser!.useruid;
        const response = await getUserGroupList(useruid);
        if (response && Array.isArray(response)) {
            const defaultGroup = response.find((group) => !!group.isdefault);
            this._inventoryGroupID = defaultGroup?.itemuid ?? response[0]?.itemuid ?? "";
            this._inventoryGroups = response as UserGroup[];
        }
    };

    public getPostProcessing = async () => {
        this._isLoading = true;
        try {
            const useruid = this.rootStore.userStore.authUser?.useruid;
            if (!useruid) return { status: Status.ERROR, error: "User UID is not available" };
            const postProcessing = await getPostProcessing(useruid);
            if (postProcessing && postProcessing.error) {
                return {
                    status: Status.ERROR,
                    error: postProcessing.error,
                };
            }
            const response = Array.isArray(postProcessing) ? postProcessing : initialPostProcessing;
            this._postProcessing = response as WatermarkPostProcessing[];
            this._isPostProcessingChanged = false;
            return { status: Status.OK };
        } catch (error) {
            return {
                status: Status.ERROR,
                error,
            };
        } finally {
            this._isLoading = false;
        }
    };

    public changeInventoryGroups = action((inventoryGroups: UserGroup[]) => {
        this._inventoryGroups = inventoryGroups;
    });

    public savePostProcessing = async () => {
        this._isLoading = true;
        try {
            const useruid = this.rootStore.userStore.authUser?.useruid;
            if (!useruid) return { status: Status.ERROR, error: "User UID is not available" };
            const response = await updatePostProcessing(useruid, this._postProcessing);
            if (response?.status === Status.ERROR) {
                return response;
            }
            this._isPostProcessingChanged = false;
            return { status: Status.OK };
        } catch (error) {
            return {
                status: Status.ERROR,
                error,
            };
        } finally {
            this._isLoading = false;
        }
    };

    public changeSettings = action(
        (
            key: keyof GeneralSettings,
            value: string | number | string[],
            isSettingsChanged: boolean = true
        ) => {
            if (isSettingsChanged) {
                this._isSettingsChanged = true;
            }
            this._settings[key] = value as never;
        }
    );

    public changePostProcessing = action((state: Partial<WatermarkPostProcessing>[]) => {
        this._isSettingsChanged = true;
        this._isPostProcessingChanged = true;
        this._postProcessing = state as WatermarkPostProcessing[];
    });

    public getWatermarkImage = (): void => {
        getWatermark(this._settings.logomediauid).then((watermarkImage) => {
            if (watermarkImage) {
                const url =
                    watermarkImage instanceof Blob || watermarkImage instanceof File
                        ? URL.createObjectURL(watermarkImage)
                        : watermarkImage;
                this._watermarkImageUrl = url as string;
            }
        });
    };

    private setWatermarkImage = async (): Promise<any> => {
        if (!this._watermarkImage) {
            return { status: Status.OK };
        }
        this._isLoading = true;
        try {
            const formData = new FormData();
            formData.append("file", this._watermarkImage);
            const createMediaResponse = await createMediaItemRecord(MediaType.mtPhoto);
            if (createMediaResponse?.status === Status.ERROR) {
                return createMediaResponse;
            }
            const { itemUID } = createMediaResponse as CreateMediaItemRecordResponse;
            const uploadMediaResponse = await uploadInventoryMedia(itemUID, formData);
            if (uploadMediaResponse?.status === Status.ERROR) {
                return uploadMediaResponse;
            }
            const { itemuid } = uploadMediaResponse as any;
            this.changeSettings("logomediauid", itemuid);
            return { status: Status.OK };
        } catch (error) {
            return {
                status: Status.ERROR,
                error,
            };
        } finally {
            this._isLoading = false;
        }
    };

    public saveSettings = action(async (): Promise<BaseResponseError> => {
        this._isLoading = true;
        try {
            if (this._isPostProcessingChanged) {
                const postProcessingResult = await this.savePostProcessing();
                if (postProcessingResult.status === Status.ERROR) {
                    return postProcessingResult;
                }
            }
            if (this._watermarkImage !== null) {
                const watermarkResult = await this.setWatermarkImage();
                if (watermarkResult.status === Status.ERROR) {
                    return watermarkResult;
                }
            }
            const response = await updateUserGeneralSettings(this._settings);
            if (response?.status === Status.ERROR) {
                return response;
            }
            this._isSettingsChanged = false;
            return { status: Status.OK };
        } catch (error) {
            return {
                status: Status.ERROR,
                error,
            } as BaseResponseError;
        } finally {
            this._isLoading = false;
        }
    });

    public restoreDefaultSettings = action(async (): Promise<BaseResponseError> => {
        this._isLoading = true;
        this._isPostProcessingChanged = true;
        try {
            this._settings.logoenabled = 0;
            this._settings.logoposX = 0;
            this._settings.logoposY = 0;
            this._settings.logomediauid = "";
            this._watermarkImage = null;
            this._postProcessing = initialPostProcessing as WatermarkPostProcessing[];

            const saveResult = await this.saveSettings();
            if (saveResult.status === Status.ERROR) {
                return saveResult;
            }

            this._isSettingsChanged = false;
            this._isPostProcessingChanged = false;
            return { status: Status.OK };
        } catch (error) {
            return {
                status: Status.ERROR,
                error,
            } as BaseResponseError;
        } finally {
            this._isLoading = false;
        }
    });

    public set watermarkImage(state: File | null) {
        this._isSettingsChanged = true;
        this._watermarkImage = state;
    }

    public set watermarkImageUrl(state: string | null) {
        if (!state) {
            this.watermarkImage = null;
            this.logomediauid = "";
        }
        this._isSettingsChanged = true;
        this._watermarkImageUrl = state;
    }

    public set inventoryGroupID(state: string) {
        this._inventoryGroupID = state;
    }

    public set isLoading(state: boolean) {
        this._isLoading = state;
    }

    public set memoRoute(state: string) {
        this._memoRoute = state;
    }

    public set tabLength(state: number) {
        this._tabLength = state;
    }

    public set activeTab(state: number | null) {
        this._activeTab = state;
    }

    public set isSettingsChanged(state: boolean) {
        this._isSettingsChanged = state;
    }

    private set logomediauid(state: string) {
        this._settings.logomediauid = state;
    }

    public clearSettings = () => {
        this._settings = {} as GeneralSettings;
        this._isSettingsChanged = false;
        this._isPostProcessingChanged = false;
        this._watermarkImage = null;
        this._postProcessing = initialPostProcessing as WatermarkPostProcessing[];
    };
}
