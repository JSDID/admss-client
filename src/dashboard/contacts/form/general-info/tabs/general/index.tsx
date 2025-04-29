import { observer } from "mobx-react-lite";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import { useStore } from "store/hooks";
import { useParams } from "react-router-dom";
import {
    Contact,
    ContactExtData,
    ContactOFAC,
    ContactType,
    ScanBarcodeDL,
} from "common/models/contact";
import {
    checkContactOFAC,
    getContactsTypeList,
    scanContactDL,
} from "http/services/contacts-service";
import { useFormikContext } from "formik";
import { REQUIRED_COMPANY_TYPE_INDEXES } from "dashboard/contacts/form";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { useToast } from "dashboard/common/toast";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { TextInput } from "dashboard/common/form/inputs";
import { parseCustomDate } from "common/helpers";
import { SexList } from "common/constants/contract-options";
import { ComboBox } from "dashboard/common/form/dropdown";

const enum TOOLTIP_MESSAGE {
    PERSON = "You can input either a person or a business name. If you entered a business name but intended to enter personal details, clear the business name field, and the fields for entering personal data will become active.",
    BUSINESS = "You can input either a person or a business name. If you entered a personal data but intended to enter business name, clear the personal data fields, and the field for entering business name will become active.",
    ONLY_BUSINESS = "The type of contact you have selected requires entering only the business name",
}

type ContactUpdate = Pick<
    Contact,
    "firstName" | "lastName" | "middleName" | "ZIP" | "city" | "streetAddress" | "state"
>;

export const ContactsGeneralInfo = observer((): ReactElement => {
    const { id } = useParams();
    const [typeList, setTypeList] = useState<ContactType[]>([]);
    const store = useStore().contactStore;
    const {
        contact,
        contactExtData,
        contactFullInfo,
        contactType,
        changeContact,
        changeContactExtData,
    } = store;
    const toast = useToast();
    const [allowOverwrite, setAllowOverwrite] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { errors, values, validateField, setFieldValue } = useFormikContext<Contact>();

    const [savedFirstName, setSavedFirstName] = useState<string>(contact.firstName || "");
    const [savedLastName, setSavedLastName] = useState<string>(contact.lastName || "");
    const [savedMiddleName, setSavedMiddleName] = useState<string>(contact.middleName || "");
    const [savedBusinessName, setSavedBusinessName] = useState<string>(contact.businessName || "");
    const prevTypeRef = useRef<number | null>(null);

    const handleGetTypeList = async () => {
        const response = await getContactsTypeList(id || "0");
        if (response && Array.isArray(response)) {
            setTypeList(response);
        } else {
            setTypeList([]);
        }
    };

    useEffect(() => {
        handleGetTypeList();
    }, [id]);

    const handleScanDL = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        store.isLoading = true;

        try {
            const response = await scanContactDL(file);

            if (!response) {
                await Promise.reject("No response from server");
                return;
            }

            if (response.status === Status.ERROR) {
                await Promise.reject(response.error || "Failed to scan DL");
                return;
            }

            const { contact: scannedContact } = response as ScanBarcodeDL;

            if (!scannedContact) {
                await Promise.reject("Failed to parse driver license data");
                return;
            }

            const {
                firstName,
                lastName,
                middleName,
                ZIP,
                city,
                streetAddress,
                state,
                sex,
                dl_number,
                dob,
                exp,
            } = scannedContact;

            if (allowOverwrite) {
                changeContact([
                    ["firstName", firstName],
                    ["lastName", lastName],
                    ["middleName", middleName],
                    ["ZIP", ZIP],
                    ["city", city],
                    ["streetAddress", streetAddress],
                    ["state", state],
                ]);

                const [dobTimestamp, expTimestamp] = [parseCustomDate(dob), parseCustomDate(exp)];

                changeContactExtData([
                    ["Buyer_DL_State", state],
                    ["Buyer_Sex", SexList.find((item) => item?.id === Number(sex))?.name || ""],
                    ["Buyer_Driver_License_Num", dl_number],
                    ["Buyer_Date_Of_Birth", dobTimestamp],
                    ["Buyer_DL_Exp_Date", expTimestamp],
                ]);
            } else {
                const fieldsToUpdate = {
                    firstName,
                    lastName,
                    middleName,
                    ZIP,
                    city,
                    streetAddress,
                    state,
                    sex: SexList.find((item) => item?.id === Number(sex))?.name || "",
                    dl_number,
                };

                const updates = (
                    Object.entries(fieldsToUpdate) as [keyof ContactUpdate, string | number][]
                ).filter(([key]) => !contact[key]);

                const extDataFieldsToUpdate = {
                    Buyer_DL_State: state,
                    Buyer_Sex: SexList.find((item) => item?.id === Number(sex))?.name || "",
                    Buyer_Driver_License_Num: dl_number,
                    Buyer_Date_Of_Birth: parseCustomDate(dob),
                    Buyer_DL_Exp_Date: parseCustomDate(exp),
                };

                const extDataUpdates = (
                    Object.entries(extDataFieldsToUpdate) as [
                        keyof ContactExtData,
                        string | number,
                    ][]
                ).filter(([key]) => !contactExtData?.[key]);

                !!updates.length && changeContact(updates);
                !!extDataUpdates.length && changeContactExtData(extDataUpdates);
            }
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail:
                    error instanceof Error
                        ? error.message
                        : "Failed to parse date from driver license",
                life: TOAST_LIFETIME,
            });
        } finally {
            store.isLoading = false;
            event.target.value = "";
        }
    };

    const isBusinessNameRequired = useMemo(() => {
        return REQUIRED_COMPANY_TYPE_INDEXES.includes(contact.type);
    }, [contact.type]);

    const shouldDisableNameFields = useMemo(() => {
        return (
            isBusinessNameRequired || (!!values.businessName && values.businessName.trim() !== "")
        );
    }, [isBusinessNameRequired, values.businessName]);

    const shouldDisableBusinessName = useMemo(() => {
        return (
            !isBusinessNameRequired && (!!contact.firstName?.trim() || !!contact.lastName?.trim())
        );
    }, [isBusinessNameRequired, contact.firstName, contact.lastName]);

    useEffect(() => {
        if (prevTypeRef.current === contact.type) return;

        if (shouldDisableNameFields) {
            if (contact.firstName) {
                setSavedFirstName(contact.firstName);
                setFieldValue("firstName", "");
                changeContact("firstName", "", false);
            }
            if (contact.lastName) {
                setSavedLastName(contact.lastName);
                setFieldValue("lastName", "");
                changeContact("lastName", "", false);
            }
            if (contact.middleName) {
                setSavedMiddleName(contact.middleName);
                setFieldValue("middleName", "");
                changeContact("middleName", "", false);
            }
        } else {
            if (!contact.firstName && savedFirstName) {
                setFieldValue("firstName", savedFirstName);
                changeContact("firstName", savedFirstName, false);
            }
            if (!contact.lastName && savedLastName) {
                setFieldValue("lastName", savedLastName);
                changeContact("lastName", savedLastName, false);
            }
            if (!contact.middleName && savedMiddleName) {
                setFieldValue("middleName", savedMiddleName);
                changeContact("middleName", savedMiddleName, false);
            }
        }

        prevTypeRef.current = contact.type;
    }, [shouldDisableNameFields, contact.type]);

    useEffect(() => {
        if (prevTypeRef.current === contact.type) return;

        if (shouldDisableBusinessName) {
            if (contact.businessName) {
                setSavedBusinessName(contact.businessName);
                setFieldValue("businessName", "");
                changeContact("businessName", "", false);
            }
        } else {
            if (!contact.businessName && savedBusinessName) {
                setFieldValue("businessName", savedBusinessName);
                changeContact("businessName", savedBusinessName, false);
            }
        }

        prevTypeRef.current = contact.type;
    }, [shouldDisableBusinessName, contact.type]);

    const handleOfacCheck = () => {
        if (!contactFullInfo.firstName || !contactFullInfo.lastName) {
            return;
        }
        checkContactOFAC(id, { ...contactFullInfo }).then((response) => {
            if (response?.status === Status.ERROR) {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: response.error,
                    life: TOAST_LIFETIME,
                });
            } else {
                store.contactOFAC = response as ContactOFAC;
            }
        });
    };

    return (
        <div className='grid general-info row-gap-2'>
            <div className='col-12 grid'>
                <div className='col-4 relative pr-0 pb-0'>
                    <ComboBox
                        optionLabel='name'
                        optionValue='id'
                        value={contact.type || 0}
                        options={typeList}
                        onChange={(e) => {
                            store.contactType = e.value;
                            setFieldValue("type", e.value);
                            changeContact("type", e.value);
                        }}
                        className={`w-full general-info__dropdown ${
                            errors.type ? "p-invalid" : ""
                        }`}
                        label='Type (required)'
                        pt={{
                            wrapper: {
                                style: { height: "auto", maxHeight: "none" },
                            },
                        }}
                    />

                    <small className='p-error'>{errors.type}</small>
                </div>
            </div>
            {!!contactType && !REQUIRED_COMPANY_TYPE_INDEXES.includes(contactType) ? (
                <div className='col-12 flex gap-4'>
                    <Button
                        type='button'
                        label='Scan driver license'
                        className='general-info__button'
                        tooltip='Data received from the DL’s backside will fill in related fields'
                        outlined
                        onClick={handleScanDL}
                    />
                    <input
                        type='file'
                        accept='image/*'
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <div className='general-info-overwrite pb-3'>
                        <Checkbox
                            checked={allowOverwrite}
                            inputId='general-info-overwrite'
                            className='general-info-overwrite__checkbox'
                            onChange={() => setAllowOverwrite(!allowOverwrite)}
                        />
                        <label
                            htmlFor='general-info-overwrite'
                            className='general-info-overwrite__label'
                        >
                            Overwrite data
                        </label>
                        <Button
                            text
                            tooltip='Data received from the DL’s backside will overwrite user-entered data'
                            icon='icon adms-help'
                            outlined
                            type='button'
                            className='general-info-overwrite__icon'
                            tooltipOptions={{
                                className: "overwrite-tooltip",
                            }}
                        />
                    </div>
                </div>
            ) : null}
            {contactType && !REQUIRED_COMPANY_TYPE_INDEXES.includes(contactType) ? (
                <>
                    <div className='col-4 relative'>
                        <TextInput
                            className={`general-info__text-input ${errors.firstName ? "p-invalid" : ""}`}
                            value={contact.firstName || ""}
                            onChange={({ target: { value } }) => {
                                setFieldValue("firstName", value, true).then(() => {
                                    changeContact("firstName", value);
                                    validateField("firstName");
                                });
                            }}
                            onBlur={handleOfacCheck}
                            name={`First Name${!shouldDisableNameFields ? " (required)" : ""}`}
                            tooltip={
                                isBusinessNameRequired
                                    ? TOOLTIP_MESSAGE.ONLY_BUSINESS
                                    : shouldDisableNameFields
                                      ? TOOLTIP_MESSAGE.PERSON
                                      : ""
                            }
                            disabled={shouldDisableNameFields}
                            clearButton
                        />
                        <small className='p-error'>{errors.firstName}</small>
                    </div>

                    <div className='col-4 relative'>
                        <TextInput
                            name='Middle Name'
                            className={`general-info__text-input ${errors.middleName ? "p-invalid" : ""}`}
                            value={contact.middleName || ""}
                            onChange={({ target: { value } }) => {
                                setFieldValue("middleName", value, true).then(() => {
                                    changeContact("middleName", value);
                                    validateField("middleName");
                                });
                            }}
                            tooltip={
                                isBusinessNameRequired
                                    ? TOOLTIP_MESSAGE.ONLY_BUSINESS
                                    : shouldDisableNameFields
                                      ? TOOLTIP_MESSAGE.PERSON
                                      : ""
                            }
                            disabled={shouldDisableNameFields}
                            clearButton
                        />
                        <small className='p-error'>{errors.middleName}</small>
                    </div>

                    <div className='col-4 relative'>
                        <TextInput
                            name={`Last Name${!shouldDisableNameFields ? " (required)" : ""}`}
                            className={`general-info__text-input ${errors.lastName ? "p-invalid" : ""}`}
                            value={contact.lastName || ""}
                            onChange={({ target: { value } }) => {
                                setFieldValue("lastName", value, true).then(() => {
                                    changeContact("lastName", value);
                                    validateField("lastName");
                                });
                            }}
                            onBlur={handleOfacCheck}
                            disabled={shouldDisableNameFields}
                            tooltip={
                                isBusinessNameRequired
                                    ? TOOLTIP_MESSAGE.ONLY_BUSINESS
                                    : shouldDisableNameFields
                                      ? TOOLTIP_MESSAGE.PERSON
                                      : ""
                            }
                            clearButton
                        />
                        <small className='p-error'>{errors.lastName}</small>
                    </div>
                </>
            ) : null}
            {!!contactType && (
                <div className='col-4 relative'>
                    <TextInput
                        name={`Business Name${!shouldDisableBusinessName ? " (required)" : ""}`}
                        className={`general-info__text-input w-full ${
                            errors.businessName ? "p-invalid" : ""
                        }`}
                        value={contact.businessName || ""}
                        onChange={({ target: { value } }) => {
                            changeContact("businessName", value);
                            setFieldValue("businessName", value);
                        }}
                        disabled={!!shouldDisableBusinessName}
                        tooltip={shouldDisableBusinessName ? TOOLTIP_MESSAGE.BUSINESS : ""}
                        clearButton
                    />

                    <small className='p-error'>{errors.businessName}</small>
                </div>
            )}
        </div>
    );
});
