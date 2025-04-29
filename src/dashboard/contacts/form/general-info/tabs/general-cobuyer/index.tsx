import { observer } from "mobx-react-lite";
import { ReactElement, useRef, useState } from "react";
import { useStore } from "store/hooks";
import { useParams } from "react-router-dom";
import { ContactExtData, ContactOFAC, ScanBarcodeDL } from "common/models/contact";
import { checkContactOFAC, scanContactDL } from "http/services/contacts-service";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { useToast } from "dashboard/common/toast";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { TextInput } from "dashboard/common/form/inputs";
import { useFormikContext } from "formik";
import { parseCustomDate } from "common/helpers";
import { SexList } from "common/constants/contract-options";

export const ContactsGeneralCoBuyerInfo = observer((): ReactElement => {
    const { id } = useParams();
    const store = useStore().contactStore;
    const { contactExtData, contactFullInfo, changeContactExtData } = store;

    const { errors, setFieldValue, validateField } = useFormikContext<ContactExtData>();
    const toast = useToast();
    const [allowOverwrite, setAllowOverwrite] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

            const { contact } = response as ScanBarcodeDL;
            if (!contact) {
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
            } = contact;

            if (allowOverwrite) {
                changeContactExtData([
                    ["CoBuyer_First_Name", firstName],
                    ["CoBuyer_Last_Name", lastName],
                    ["CoBuyer_Middle_Name", middleName],
                    ["CoBuyer_Emp_Zip", ZIP],
                    ["CoBuyer_Emp_City", city],
                    ["CoBuyer_Emp_Address", streetAddress],
                    ["CoBuyer_Emp_State", state],
                    ["CoBuyer_Sex", SexList.find((item) => item?.id === Number(sex))?.name || ""],
                    ["CoBuyer_DL_State", state],
                    ["CoBuyer_Driver_License_Num", dl_number],
                ]);

                const dobTimestamp = parseCustomDate(dob);
                changeContactExtData("CoBuyer_Date_Of_Birth", dobTimestamp);

                const expTimestamp = parseCustomDate(exp);
                changeContactExtData("CoBuyer_DL_Exp_Date", expTimestamp);
            } else {
                const fieldsToUpdate = {
                    CoBuyer_First_Name: firstName,
                    CoBuyer_Last_Name: lastName,
                    CoBuyer_Middle_Name: middleName,
                    CoBuyer_Emp_Zip: ZIP,
                    CoBuyer_Emp_City: city,
                    CoBuyer_Emp_Address: streetAddress,
                    CoBuyer_Emp_State: state,
                    CoBuyer_Sex: SexList.find((item) => item?.id === Number(sex))?.name || "",
                    CoBuyer_DL_State: state,
                    CoBuyer_Driver_License_Num: dl_number,
                    CoBuyer_Date_Of_Birth: parseCustomDate(dob),
                    CoBuyer_DL_Exp_Date: parseCustomDate(exp),
                };

                const updates = (
                    Object.entries(fieldsToUpdate) as [keyof ContactExtData, string | number][]
                ).filter(([key]) => !contactExtData?.[key]);

                !!updates.length && changeContactExtData(updates);
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
            <div className='col-12 flex gap-4'>
                <Button
                    type='button'
                    label='Scan driver license'
                    className='general-info__button'
                    tooltip="Data received from the DL's backside will fill in related fields"
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
                        tooltip="Data received from the DL's backside will overwrite user-entered data"
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

            <div className='col-4 relative'>
                <TextInput
                    className={`general-info__text-input w-full ${errors.CoBuyer_First_Name ? "p-invalid" : ""}`}
                    value={contactExtData.CoBuyer_First_Name || ""}
                    onChange={({ target: { value } }) => {
                        setFieldValue("CoBuyer_First_Name", value, true).then(() => {
                            changeContactExtData("CoBuyer_First_Name", value);
                            validateField("CoBuyer_First_Name");
                        });
                    }}
                    onBlur={handleOfacCheck}
                    name='First Name'
                    clearButton
                />

                <small className='p-error'>{errors.CoBuyer_First_Name}</small>
            </div>

            <div className='col-4 relative'>
                <TextInput
                    name='Middle Name'
                    className={`general-info__text-input w-full ${errors.CoBuyer_Middle_Name ? "p-invalid" : ""}`}
                    value={contactExtData.CoBuyer_Middle_Name || ""}
                    onChange={({ target: { value } }) => {
                        setFieldValue("CoBuyer_Middle_Name", value, true).then(() => {
                            changeContactExtData("CoBuyer_Middle_Name", value);
                            validateField("CoBuyer_Middle_Name");
                        });
                    }}
                    clearButton
                />

                <small className='p-error'>{errors.CoBuyer_Middle_Name}</small>
            </div>

            <div className='col-4 relative'>
                <TextInput
                    name='Last Name'
                    className={`general-info__text-input w-full ${errors.CoBuyer_Last_Name ? "p-invalid" : ""}`}
                    value={contactExtData.CoBuyer_Last_Name || ""}
                    onChange={({ target: { value } }) => {
                        setFieldValue("CoBuyer_Last_Name", value, true).then(() => {
                            changeContactExtData("CoBuyer_Last_Name", value);
                            validateField("CoBuyer_Last_Name");
                        });
                    }}
                    onBlur={handleOfacCheck}
                    clearButton
                />

                <small className='p-error'>{errors.CoBuyer_Last_Name}</small>
            </div>

            <div className='col-4 relative'>
                <TextInput
                    name='Business Name'
                    className='general-info__text-input w-full'
                    value={contactExtData.CoBuyer_Emp_Company || ""}
                    onChange={({ target: { value } }) => {
                        return changeContactExtData("CoBuyer_Emp_Company", value);
                    }}
                    clearButton
                />
            </div>
        </div>
    );
});
