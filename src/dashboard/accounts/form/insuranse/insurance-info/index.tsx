import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccountInsurance, updateAccountInsurance } from "http/services/accounts.service";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { AccountInsurance } from "common/models/accounts";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { InsuranceInfoField } from "./insurance-info-item";
import { Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { Loader } from "dashboard/common/loader";

export const AccountInsuranceInfo = observer((): ReactElement => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [insuranceInfo, setInsuranceInfo] = useState<AccountInsurance>();
    const store = useStore().accountStore;
    const [insuranceEdit, setInsuranceEdit] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const {
        accountExtData: { Title_Received, Title_Num },
        changeAccountExtData,
    } = store;

    const handleGetInsuranceHistory = async () => {
        if (id) {
            setIsLoading(true);
            getAccountInsurance(id).then((res) => {
                if (res?.status === Status.ERROR) {
                    toast.current?.show({
                        severity: "error",
                        summary: Status.ERROR,
                        detail: res.error,
                        life: TOAST_LIFETIME,
                    });
                }
                if (res) {
                    setInsuranceInfo(res as AccountInsurance);
                    setIsLoading(false);
                }
            });
        }
    };

    useEffect(() => {
        handleGetInsuranceHistory();
    }, [id]);

    const handleChangeInsuranceInfo = () => {
        if (insuranceInfo) {
            id &&
                updateAccountInsurance(id, insuranceInfo).then((res) => {
                    if (res?.status === Status.ERROR) {
                        toast.current?.show({
                            severity: "error",
                            summary: Status.ERROR,
                            detail: res.error,
                            life: TOAST_LIFETIME,
                        });
                    } else {
                        setInsuranceInfo(res as AccountInsurance);
                        handleGetInsuranceHistory().then(() => {
                            setInsuranceEdit(true);
                            setIsButtonDisabled(true);
                        });
                        toast.current?.show({
                            severity: "success",
                            summary: "Success",
                            detail: "Insurance info updated successfully!",
                            life: TOAST_LIFETIME,
                        });
                    }
                });
        }
    };

    const handleChangeInsuranceEdit = () => {
        if (!insuranceInfo?.Insurance_userUID) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Insurance userUID is required",
                life: TOAST_LIFETIME,
            });
        } else {
            navigate(`/dashboard/contacts/${insuranceInfo?.Insurance_userUID}`);
        }
    };

    const handleChangeInsurance = (field: keyof AccountInsurance, value: string) => {
        setIsButtonDisabled(false);
        setInsuranceInfo((prev) => ({ ...prev!, [field]: value }));
    };

    return (
        <div className='insurance-info'>
            <div className='insurance-info__container'>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <div className='insurance-info__item insurance-info--splitter'>
                            <InsuranceInfoField
                                label='Insurance Company'
                                value={insuranceInfo?.Insurance_Company}
                                onChange={(e) => handleChangeInsurance("Insurance_Company", e)}
                                editMode={insuranceEdit}
                            />
                            <InsuranceInfoField
                                label='Insurance Agent'
                                value={insuranceInfo?.Insurance_Agent_Name}
                                onChange={(e) => handleChangeInsurance("Insurance_Agent_Name", e)}
                                editMode={insuranceEdit}
                            />
                            <InsuranceInfoField
                                label='Policy#'
                                value={insuranceInfo?.Insurance_Policy_Number}
                                onChange={(e) =>
                                    handleChangeInsurance("Insurance_Policy_Number", e)
                                }
                                editMode={insuranceEdit}
                            />

                            <div className='insurance-field'>
                                <Checkbox
                                    inputId='account-insurance-policy'
                                    name='account-insurance-policy'
                                    checked={!!insuranceInfo?.Insurance_Policy_Received}
                                    onClick={() => {
                                        setIsButtonDisabled(false);
                                        setInsuranceInfo((prev) => ({
                                            ...prev!,
                                            Insurance_Policy_Received:
                                                !prev?.Insurance_Policy_Received ? 1 : 0,
                                        }));
                                    }}
                                />
                                <label
                                    htmlFor='account-insurance-policy'
                                    className='ml-2 insurance-field__label insurance-field__label--thin'
                                >
                                    Insurance Policy Received
                                </label>
                            </div>
                            <InsuranceInfoField
                                label='Expiration Date'
                                value={insuranceInfo?.Insurance_Exp_Date}
                                editMode={insuranceEdit}
                                inputType='date'
                            />
                        </div>
                        <div className='insurance-info__item'>
                            <div className='insurance-field'>
                                <Checkbox
                                    inputId='account-insurance-title-received'
                                    name='account-insurance-title-received'
                                    checked={!!Title_Received}
                                    onClick={() => {
                                        setIsButtonDisabled(false);
                                        changeAccountExtData(
                                            "Title_Received",
                                            !Title_Received ? 1 : 0
                                        );
                                    }}
                                />
                                <label
                                    htmlFor='account-insurance-title-received'
                                    className='insurance-field__label ml-2 insurance-field__label--thin'
                                >
                                    Title Received
                                </label>
                            </div>
                            <span className='p-float-label'>
                                <InputText
                                    id='account-insurance-title-num'
                                    className='insurance-info__input w-full'
                                    value={Title_Num}
                                    onChange={(e) => {
                                        setIsButtonDisabled(false);
                                        changeAccountExtData("Title_Num", e.target.value);
                                    }}
                                />
                                <label className='float-label'>Title#</label>
                            </span>
                        </div>
                    </>
                )}
                <div className='insurance-info__footer'>
                    <Button
                        type='button'
                        className='insurance-info__button'
                        disabled={isButtonDisabled}
                        severity={isButtonDisabled ? "secondary" : "success"}
                        onClick={handleChangeInsuranceInfo}
                    >
                        Save
                    </Button>
                </div>
            </div>
            <div className='insurance-info__footer'>
                <Button
                    className='insurance-info__button insurance-info__button--edit'
                    onClick={handleChangeInsuranceEdit}
                    outlined
                >
                    View/ Edit Contact Information
                </Button>
            </div>
        </div>
    );
});
