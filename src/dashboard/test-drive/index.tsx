import { CompanySearch } from "dashboard/contacts/common/company-search";
import { Button } from "primereact/button";
import { ReactElement, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import "./index.css";
import { DateInput, PhoneInput, StateDropdown, TextInput } from "dashboard/common/form/inputs";
import { InventorySearch } from "dashboard/inventory/common/inventory-search";
import { InputTextarea } from "primereact/inputtextarea";
import { TestDriver } from "./form-data";
import { useStore } from "store/hooks";
import { printTestDrive } from "http/services/print";
import { useToast } from "dashboard/common/toast";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { ContactTypeNameList, ContactUser } from "common/models/contact";
import { setContact } from "http/services/contacts-service";
import { Form, Formik } from "formik";
import { Inventory } from "common/models/inventory";

const validationSchema = Yup.object().shape({
    customerName: Yup.string().trim().required("First Name is required"),
    customerLastName: Yup.string().trim().required("Last Name is required"),
    homePhone: Yup.string().required("Phone Number is required"),
    dlNumber: Yup.string().required("Driver License Number is required"),
    dlState: Yup.string().required("DL’s State is required"),
    vclVIN: Yup.string().required("VIN is required"),
    vclMake: Yup.string().required("Make is required"),
    vclModel: Yup.string().required("Model is required"),
    vclYear: Yup.string().required("Year is required"),
    dealersName: Yup.string().required("Manager is required"),
    outOdometer: Yup.string().required("Odometer is required"),
});

enum TEST_DRIVE_ACTIONS {
    PRINT = "print",
    DOWNLOAD = "download",
    PREVIEW = "preview",
}

const getCurrentDate = () => {
    const date = new Date();
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

export const PrintForTestDrive = (): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const toast = useToast();
    const navigate = useNavigate();

    const handlePrintForm = async (values: TestDriver, action?: TEST_DRIVE_ACTIONS) => {
        if (authUser && authUser.useruid) {
            const response = await printTestDrive(authUser.useruid, values);
            if (response.status === Status.ERROR) {
                const { error } = response;
                return toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: error || "Error while print for test drive",
                    life: TOAST_LIFETIME,
                });
            }
            setTimeout(() => {
                const url = new Blob([response], { type: "application/pdf" });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(url);

                switch (action) {
                    case TEST_DRIVE_ACTIONS.DOWNLOAD:
                        link.download = `${values.customerLastName}_test_drive_form.pdf`;
                        link.click();
                        break;
                    case TEST_DRIVE_ACTIONS.PREVIEW:
                        window.open(
                            link.href,
                            "_blank",
                            "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=1280,height=720"
                        );
                        break;
                    case TEST_DRIVE_ACTIONS.PRINT:
                        const printWindow = window.open(
                            link.href,
                            "toolbar=no,scrollbars=no,resizable=yes,top=100,left=100,width=1280,height=720"
                        );
                        printWindow?.addEventListener("load", () => {
                            printWindow.print();
                        });
                        break;
                }
            }, 3000);
        }
    };

    const handleAddToContact = (values: TestDriver) => {
        const newContact: Partial<ContactUser> = {
            firstName: values.customerName.trim(),
            lastName: values.customerLastName.trim(),
            phone1: values.homePhone.trim(),
            dl_number: values.dlNumber.trim(),
            dl_issuedate: values.dlIssuingDate.trim(),
            dl_expiration: values.dlExpirationDate.trim(),
        };
        if (!newContact.firstName || !newContact.lastName) {
            return toast.current?.show({
                severity: "error",
                summary: Status.ERROR,
                detail: "Please fill all required fields",
                life: TOAST_LIFETIME,
            });
        }
        setContact(null, newContact).then((response) => {
            if (response?.status === Status.ERROR) {
                return toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: response.error,
                    life: TOAST_LIFETIME,
                });
            }
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Contact added successfully",
                life: TOAST_LIFETIME,
            });
        });
    };

    return (
        <Suspense>
            <div className='grid relative'>
                <Button
                    icon='pi pi-times'
                    className='p-button close-button'
                    onClick={() => navigate("/dashboard")}
                />
                <div className='col-12'>
                    <div className='card test-drive'>
                        <div className='card-header flex'>
                            <h2 className='card-header__title uppercase w-full m-0'>
                                Print (for test drive)
                            </h2>
                        </div>
                        <div className='card-content test-drive__card'>
                            <Formik
                                initialValues={{
                                    customerName: "",
                                    customerLastName: "",
                                    homePhone: "",
                                    dlNumber: "",
                                    dlState: "",
                                    dlIssuingDate: getCurrentDate(),
                                    dlExpirationDate: getCurrentDate(),
                                    vclVIN: "",
                                    vclMake: "",
                                    vclModel: "",
                                    vclYear: "",
                                    dealersName: "",
                                    outOdometer: "",
                                    comments: "",
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values) => handlePrintForm(values)}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    isValid,
                                    dirty,
                                }) => {
                                    const handleInventoryFill = ({
                                        VIN,
                                        Make,
                                        Model,
                                        Year,
                                    }: Inventory) => {
                                        handleChange({
                                            target: {
                                                name: "vclVIN",
                                                value: VIN,
                                            },
                                        });
                                        handleChange({
                                            target: {
                                                name: "vclMake",
                                                value: Make,
                                            },
                                        });
                                        handleChange({
                                            target: {
                                                name: "vclModel",
                                                value: Model,
                                            },
                                        });
                                        handleChange({
                                            target: {
                                                name: "vclYear",
                                                value: Year,
                                            },
                                        });
                                    };
                                    return (
                                        <Form className='grid test-drive__card-content'>
                                            <div className='col-12 test-drive__subtitle'>
                                                Driver
                                            </div>
                                            <div className='col-9 grid row-gap-2'>
                                                <div className='col-6 relative'>
                                                    <CompanySearch
                                                        name='First Name (required)'
                                                        value={values.customerName}
                                                        returnedField='firstName'
                                                        onChange={({ value }) =>
                                                            handleChange({
                                                                target: {
                                                                    name: "customerName",
                                                                    value,
                                                                },
                                                            })
                                                        }
                                                        getFullInfo={(contact) => {
                                                            handleChange({
                                                                target: {
                                                                    name: "customerName",
                                                                    value: contact.firstName,
                                                                },
                                                            });
                                                            handleChange({
                                                                target: {
                                                                    name: "customerLastName",
                                                                    value: contact.lastName,
                                                                },
                                                            });
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.customerName &&
                                                        touched.customerName && (
                                                            <div className='p-error'>
                                                                {errors.customerName}
                                                            </div>
                                                        )}
                                                </div>
                                                <div className='col-6 relative'>
                                                    <CompanySearch
                                                        name='Last Name (required)'
                                                        value={values.customerLastName}
                                                        returnedField='lastName'
                                                        onChange={({ value }) =>
                                                            handleChange({
                                                                target: {
                                                                    name: "customerLastName",
                                                                    value,
                                                                },
                                                            })
                                                        }
                                                        getFullInfo={(contact) => {
                                                            handleChange({
                                                                target: {
                                                                    name: "customerName",
                                                                    value: contact.firstName,
                                                                },
                                                            });
                                                            handleChange({
                                                                target: {
                                                                    name: "customerLastName",
                                                                    value: contact.lastName,
                                                                },
                                                            });
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.customerLastName &&
                                                        touched.customerLastName && (
                                                            <div className='p-error'>
                                                                {errors.customerLastName}
                                                            </div>
                                                        )}
                                                </div>

                                                <div className='col-4 relative'>
                                                    <PhoneInput
                                                        name='Phone Number (required)'
                                                        value={values.homePhone}
                                                        onChange={handleChange}
                                                        onBlur={(e) => e && handleBlur}
                                                        id='homePhone'
                                                    />
                                                    {errors.homePhone && touched.homePhone && (
                                                        <div className='p-error'>
                                                            {errors.homePhone}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className='col-4 relative'>
                                                    <TextInput
                                                        name='Driver License’s Number (required)'
                                                        value={values.dlNumber}
                                                        onChange={({ target: { value } }) =>
                                                            handleChange({
                                                                target: { name: "dlNumber", value },
                                                            })
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.dlNumber && touched.dlNumber && (
                                                        <div className='p-error'>
                                                            {errors.dlNumber}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='col-4 relative'>
                                                    <StateDropdown
                                                        name='DL’s State (required)'
                                                        value={values.dlState}
                                                        onChange={({ value }) =>
                                                            handleChange({
                                                                target: { name: "dlState", value },
                                                            })
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.dlState && touched.dlState && (
                                                        <div className='p-error'>
                                                            {errors.dlState}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='col-6 relative'>
                                                    <DateInput
                                                        name='DL’s Start Date (required)'
                                                        value={values.dlIssuingDate}
                                                        onChange={({ value }) =>
                                                            handleChange({
                                                                target: { name: "lIssuing", value },
                                                            })
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                </div>
                                                <div className='col-6 relative'>
                                                    <DateInput
                                                        name='DL’s Exp. Date (required)'
                                                        value={values.dlExpirationDate}
                                                        onChange={({ value }) =>
                                                            handleChange({
                                                                target: {
                                                                    name: "lExpiration",
                                                                    value,
                                                                },
                                                            })
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                </div>
                                                <div className='col-12 test-drive__subtitle'>
                                                    Vehicle
                                                </div>

                                                <div className='col-6 relative'>
                                                    <InventorySearch
                                                        name='VIN (required)'
                                                        value={values.vclVIN}
                                                        returnedField='VIN'
                                                        onChange={({ value }) =>
                                                            handleChange({
                                                                target: { name: "vclVIN", value },
                                                            })
                                                        }
                                                        getFullInfo={handleInventoryFill}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.vclVIN && touched.vclVIN && (
                                                        <div className='p-error'>
                                                            {errors.vclVIN}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='col-6 relative'>
                                                    <InventorySearch
                                                        name='Make (required)'
                                                        value={values.vclMake}
                                                        returnedField='Make'
                                                        onChange={({ value }) =>
                                                            handleChange({
                                                                target: { name: "vclMake", value },
                                                            })
                                                        }
                                                        getFullInfo={handleInventoryFill}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.vclMake && touched.vclMake && (
                                                        <div className='p-error'>
                                                            {errors.vclMake}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='col-6 relative'>
                                                    <InventorySearch
                                                        name='Model (required)'
                                                        value={values.vclModel}
                                                        returnedField='Model'
                                                        onChange={({ value }) =>
                                                            handleChange({
                                                                target: { name: "vclModel", value },
                                                            })
                                                        }
                                                        getFullInfo={handleInventoryFill}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.vclModel && touched.vclModel && (
                                                        <div className='p-error'>
                                                            {errors.vclModel}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='col-6 relative'>
                                                    <TextInput
                                                        name='Year (required)'
                                                        value={values.vclYear}
                                                        onChange={({ target: { value } }) =>
                                                            handleChange({
                                                                target: { name: "vclYear", value },
                                                            })
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.vclYear && touched.vclYear && (
                                                        <div className='p-error'>
                                                            {errors.vclYear}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className='col-12 test-drive__subtitle'>
                                                    Dealer
                                                </div>

                                                <div className='col-4 relative'>
                                                    <CompanySearch
                                                        name='Manager (required)'
                                                        value={values.dealersName}
                                                        onChange={({ value }) =>
                                                            handleChange({
                                                                target: {
                                                                    name: "dealersName",
                                                                    value,
                                                                },
                                                            })
                                                        }
                                                        contactCategory={
                                                            ContactTypeNameList.DEALERS
                                                        }
                                                        getFullInfo={(contact) => {
                                                            handleChange({
                                                                target: {
                                                                    name: "dealersName",
                                                                    value:
                                                                        contact.userName ||
                                                                        contact.businessName,
                                                                },
                                                            });
                                                        }}
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.dealersName && touched.dealersName && (
                                                        <div className='p-error'>
                                                            {errors.dealersName}
                                                        </div>
                                                    )}
                                                </div>
                                                <DateInput
                                                    name='Issue Date/Time (required)'
                                                    onBlur={handleBlur}
                                                    colWidth={4}
                                                />
                                                <div className='col-4 relative'>
                                                    <TextInput
                                                        name='Odometer (required)'
                                                        value={values.outOdometer}
                                                        onChange={({ target: { value } }) =>
                                                            handleChange({
                                                                target: {
                                                                    name: "outOdometer",
                                                                    value,
                                                                },
                                                            })
                                                        }
                                                        onBlur={handleBlur}
                                                    />
                                                    {errors.outOdometer && touched.outOdometer && (
                                                        <div className='p-error'>
                                                            {errors.outOdometer}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='col-12 relative'>
                                                    <span className='p-float-label'>
                                                        <InputTextarea
                                                            name='Comment'
                                                            value={values.comments}
                                                            onChange={({ target: { value } }) =>
                                                                handleChange({
                                                                    target: {
                                                                        name: "comments",
                                                                        value,
                                                                    },
                                                                })
                                                            }
                                                            onBlur={handleBlur}
                                                            className='test-drive__text-area'
                                                        />
                                                        <label className='float-label'>
                                                            Comment
                                                        </label>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='col-3 ml-6 mt-0 test-drive__card-control'>
                                                <Button
                                                    type='button'
                                                    className='test-drive__button'
                                                    label='Add to contacts'
                                                    onClick={() => handleAddToContact(values)}
                                                    disabled={
                                                        !values.customerName.trim() ||
                                                        !values.customerLastName.trim()
                                                    }
                                                    severity={
                                                        !values.customerName.trim() ||
                                                        !values.customerLastName.trim()
                                                            ? "secondary"
                                                            : "success"
                                                    }
                                                    outlined
                                                />
                                                <Button
                                                    type='button'
                                                    className='test-drive__button'
                                                    severity={
                                                        !isValid || !dirty ? "secondary" : "success"
                                                    }
                                                    onClick={() =>
                                                        handlePrintForm(
                                                            values,
                                                            TEST_DRIVE_ACTIONS.PREVIEW
                                                        )
                                                    }
                                                    disabled={!isValid || !dirty}
                                                    label='Preview'
                                                />
                                                <Button
                                                    type='button'
                                                    className='test-drive__button'
                                                    severity={
                                                        !isValid || !dirty ? "secondary" : "success"
                                                    }
                                                    onClick={() =>
                                                        handlePrintForm(
                                                            values,
                                                            TEST_DRIVE_ACTIONS.PRINT
                                                        )
                                                    }
                                                    disabled={!isValid || !dirty}
                                                    label='Print'
                                                />
                                                <Button
                                                    type='button'
                                                    className='test-drive__button'
                                                    severity={
                                                        !isValid || !dirty ? "secondary" : "success"
                                                    }
                                                    onClick={() =>
                                                        handlePrintForm(
                                                            values,
                                                            TEST_DRIVE_ACTIONS.DOWNLOAD
                                                        )
                                                    }
                                                    disabled={!isValid || !dirty}
                                                    label='Download'
                                                />
                                            </div>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};
