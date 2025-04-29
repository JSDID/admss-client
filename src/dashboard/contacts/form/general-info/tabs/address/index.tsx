import { observer } from "mobx-react-lite";
import { InputText } from "primereact/inputtext";
import { ReactElement, useEffect, useMemo, useState } from "react";
import "./index.css";
import { useStore } from "store/hooks";
import { STATES_LIST } from "common/constants/states";
import { Checkbox } from "primereact/checkbox";
import { BUYER_ID, GENERAL_CONTACT_TYPE } from "dashboard/contacts/form/general-info";
import { ComboBox } from "dashboard/common/form/dropdown";

const { BUYER, CO_BUYER } = GENERAL_CONTACT_TYPE;

interface ContactsAddressInfoProps {
    type?: typeof BUYER | typeof CO_BUYER;
}

export const ContactsAddressInfo = observer(({ type }: ContactsAddressInfoProps): ReactElement => {
    const store = useStore().contactStore;
    const { contact, changeContact, contactExtData, changeContactExtData } = store;
    const [isSameAsMailing, setIsSameAsMailing] = useState<boolean>(false);

    useEffect(() => {
        if (isSameAsMailing) {
            if (type === BUYER) {
                changeContact("mailStreetAddress", contact.streetAddress);
                changeContact("mailState", contact.state);
                changeContact("mailCity", contact.city);
                changeContact("mailZIP", contact.ZIP);
            } else {
                changeContactExtData("CoBuyer_Mailing_Address", contactExtData.CoBuyer_Emp_Address);
                changeContactExtData("CoBuyer_Mailing_State", contactExtData.CoBuyer_Emp_State);
                changeContactExtData("CoBuyer_Mailing_City", contactExtData.CoBuyer_Emp_City);
                changeContactExtData("CoBuyer_Mailing_Zip", contactExtData.CoBuyer_Emp_Zip);
            }
        }
    }, [
        isSameAsMailing,
        contact.streetAddress,
        contact.state,
        contact.city,
        contact.ZIP,
        contactExtData.CoBuyer_Emp_Address,
        contactExtData.CoBuyer_Emp_State,
        contactExtData.CoBuyer_Emp_City,
        contactExtData.CoBuyer_Emp_Zip,
        type,
        changeContact,
        changeContactExtData,
    ]);

    const isControlDisabled = useMemo(
        () => type === CO_BUYER && contact.type !== BUYER_ID,
        [type, contact.type]
    );

    return (
        <div className='grid address-info row-gap-2'>
            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='address-info__text-input w-full'
                        value={
                            (type === BUYER
                                ? contact.streetAddress
                                : contactExtData.CoBuyer_Emp_Address) || ""
                        }
                        onChange={({ target: { value } }) =>
                            type === BUYER
                                ? changeContact("streetAddress", value)
                                : changeContactExtData("CoBuyer_Emp_Address", value)
                        }
                        disabled={isControlDisabled}
                    />
                    <label className='float-label'>Street Address</label>
                </span>
            </div>
            <div className='col-3'>
                <ComboBox
                    optionLabel='label'
                    optionValue='id'
                    filter
                    placeholder='State'
                    value={
                        (type === BUYER ? contact.state : contactExtData.CoBuyer_Emp_State) || ""
                    }
                    options={STATES_LIST}
                    onChange={({ target: { value } }) =>
                        type === BUYER
                            ? changeContact("state", value)
                            : changeContactExtData("CoBuyer_Emp_State", value)
                    }
                    className='w-full address-info__dropdown'
                    disabled={isControlDisabled}
                    showClear={
                        !!(type === BUYER ? contact.state : contactExtData.CoBuyer_Emp_State)
                    }
                />
            </div>

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='address-info__text-input w-full'
                        value={
                            (type === BUYER ? contact.city : contactExtData.CoBuyer_Emp_City) || ""
                        }
                        onChange={({ target: { value } }) =>
                            type === BUYER
                                ? changeContact("city", value)
                                : changeContactExtData("CoBuyer_Emp_City", value)
                        }
                        disabled={isControlDisabled}
                    />
                    <label className='float-label'>City</label>
                </span>
            </div>

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='address-info__text-input w-full'
                        value={
                            (type === BUYER ? contact.ZIP : contactExtData.CoBuyer_Emp_Zip) || ""
                        }
                        onChange={({ target: { value } }) =>
                            type === BUYER
                                ? changeContact("ZIP", value)
                                : changeContactExtData("CoBuyer_Emp_Zip", value)
                        }
                        disabled={isControlDisabled}
                    />
                    <label className='float-label'>Zip Code</label>
                </span>
            </div>
            <div className='col-12 grid'>
                <div className='col-9 text-line'>
                    <h3 className='text-line__title m-0 pr-3'>Mailing address</h3>
                    <hr className='text-line__line flex-1' />
                </div>
                <div className='col-3'>
                    <div className='flex px-2'>
                        <Checkbox
                            inputId='contact-same-address'
                            className='mt-1'
                            name='contact-same-address'
                            checked={isSameAsMailing}
                            onChange={() => setIsSameAsMailing(!isSameAsMailing)}
                            disabled={isControlDisabled}
                        />
                        <label htmlFor='contact-same-address' className='ml-2'>
                            Same as primary address
                        </label>
                    </div>
                </div>
            </div>

            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='mailing-address-info__text-input w-full'
                        value={
                            (type === BUYER
                                ? contact.mailStreetAddress
                                : contactExtData.CoBuyer_Mailing_Address) || ""
                        }
                        onChange={({ target: { value } }) =>
                            type === BUYER
                                ? changeContact("mailStreetAddress", value)
                                : changeContactExtData("CoBuyer_Mailing_Address", value)
                        }
                        disabled={isSameAsMailing || isControlDisabled}
                    />
                    <label className='float-label'>Street address</label>
                </span>
            </div>
            <div className='col-3'>
                <ComboBox
                    optionLabel='label'
                    optionValue='id'
                    placeholder='State'
                    value={
                        (type === BUYER
                            ? contact.mailState
                            : contactExtData.CoBuyer_Mailing_State) || ""
                    }
                    onChange={({ target: { value } }) =>
                        type === BUYER
                            ? changeContact("mailState", value)
                            : changeContactExtData("CoBuyer_Mailing_State", value)
                    }
                    options={STATES_LIST}
                    className='w-full mailing-address-info__dropdown'
                    disabled={isSameAsMailing || isControlDisabled}
                    showClear={
                        !!(type === BUYER
                            ? contact.mailState
                            : contactExtData.CoBuyer_Mailing_State)
                    }
                />
            </div>

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='mailing-address-info__text-input w-full'
                        value={
                            (type === BUYER
                                ? contact.mailCity
                                : contactExtData.CoBuyer_Mailing_City) || ""
                        }
                        onChange={({ target: { value } }) =>
                            type === BUYER
                                ? changeContact("mailCity", value)
                                : changeContactExtData("CoBuyer_Mailing_City", value)
                        }
                        disabled={isSameAsMailing || isControlDisabled}
                    />
                    <label className='float-label'>City</label>
                </span>
            </div>

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='mailing-address-info__text-input w-full'
                        value={
                            (type === BUYER
                                ? contact.mailZIP
                                : contactExtData.CoBuyer_Mailing_Zip) || ""
                        }
                        onChange={({ target: { value } }) =>
                            type === BUYER
                                ? changeContact("mailZIP", value)
                                : changeContactExtData("CoBuyer_Mailing_Zip", value)
                        }
                        disabled={isSameAsMailing || isControlDisabled}
                    />
                    <label className='float-label'>Zip Code</label>
                </span>
            </div>
        </div>
    );
});
