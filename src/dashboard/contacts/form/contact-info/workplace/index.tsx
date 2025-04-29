import { useFormikContext } from "formik";
import { observer } from "mobx-react-lite";
import { InputText } from "primereact/inputtext";
import { ReactElement } from "react";
import { useStore } from "store/hooks";
import { ContactExtData } from "common/models/contact";
import { PhoneInput } from "dashboard/common/form/inputs";

export const ContactsWorkplace = observer((): ReactElement => {
    const store = useStore().contactStore;
    const { contactExtData, changeContactExtData } = store;
    const { values, errors, setFieldValue, setFieldTouched, handleBlur } =
        useFormikContext<ContactExtData>();
    return (
        <div className='grid contacts-workplace row-gap-2'>
            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='contacts-workplace__text-input w-full'
                        value={contactExtData.Buyer_Emp_Company || ""}
                        onChange={({ target: { value } }) => {
                            changeContactExtData("Buyer_Emp_Company", value);
                        }}
                    />
                    <label className='float-label'>Employer</label>
                </span>
            </div>
            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='contacts-workplace__text-input w-full'
                        value={contactExtData.Buyer_Emp_Contact || ""}
                        onChange={({ target: { value } }) => {
                            changeContactExtData("Buyer_Emp_Contact", value);
                        }}
                    />

                    <label className='float-label'>Contact Name</label>
                </span>
            </div>

            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <InputText
                        className={`contacts-workplace__text-input w-full ${
                            errors.Buyer_Emp_Ext ? "p-invalid" : ""
                        }`}
                        onBlur={handleBlur}
                        value={values.Buyer_Emp_Ext || ""}
                        onChange={async ({ target: { value } }) => {
                            await setFieldValue("Buyer_Emp_Ext", value);
                            changeContactExtData("Buyer_Emp_Ext", value);
                            setFieldTouched("Buyer_Emp_Ext", true, true);
                        }}
                    />
                    <label className='float-label'>E-mail</label>
                </span>
                <small className='p-error'>{errors.Buyer_Emp_Ext}</small>
            </div>

            <div className='col-6 relative'>
                <PhoneInput
                    name='Phone Number'
                    className={`contacts-workplace__text-input w-full ${
                        errors.Buyer_Emp_Phone ? "p-invalid" : ""
                    }`}
                    onBlur={handleBlur}
                    value={values.Buyer_Emp_Phone || ""}
                    onChange={async ({ target: { value } }) => {
                        await setFieldValue("Buyer_Emp_Phone", value);
                        changeContactExtData("Buyer_Emp_Phone", Number(value));
                        setFieldTouched("Buyer_Emp_Phone", true, true);
                    }}
                />
                <small className='p-error'>{errors.Buyer_Emp_Phone}</small>
            </div>
        </div>
    );
});
