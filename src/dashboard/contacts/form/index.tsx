import { Steps } from "primereact/steps";
import { ReactElement, Suspense, useEffect, useRef, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { ContactAccordionItems, ContactItem, ContactSection } from "../common/step-navigation";
import { useNavigate, useParams } from "react-router-dom";
import { BUYER_ID, generalBuyerInfo, generalCoBuyerInfo } from "./general-info";
import { ContactInfoData } from "./contact-info";
import { useStore } from "store/hooks";
import { useLocation } from "react-router-dom";
import { Loader } from "dashboard/common/loader";
import { observer } from "mobx-react-lite";
import { Form, Formik, FormikProps } from "formik";
import { Contact, ContactExtData } from "common/models/contact";
import * as Yup from "yup";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { BaseResponseError, Status } from "common/models/base-response";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { DashboardDialog } from "dashboard/common/dialog";
import { ContactMediaData } from "./media-data";
import { DeleteForm } from "./delete-form";
import { truncateText } from "common/helpers";
import { Tooltip } from "primereact/tooltip";
import { LETTERS_ONLY_REGEX } from "common/constants/regex";
const STEP = "step";

export type PartialContact = Pick<
    Contact,
    | "firstName"
    | "middleName"
    | "lastName"
    | "type"
    | "businessName"
    | "email1"
    | "email2"
    | "phone1"
    | "phone2"
> &
    Pick<
        ContactExtData,
        | "CoBuyer_First_Name"
        | "CoBuyer_Middle_Name"
        | "CoBuyer_Last_Name"
        | "Buyer_Emp_Ext"
        | "Buyer_Emp_Phone"
    >;

const tabFields: Partial<Record<ContactAccordionItems, (keyof PartialContact)[]>> = {
    [ContactAccordionItems.BUYER]: ["firstName", "lastName", "type", "businessName"],
    [ContactAccordionItems.CONTACTS]: ["email1", "email2", "phone1", "phone2"],
    [ContactAccordionItems.COMPANY]: ["Buyer_Emp_Ext", "Buyer_Emp_Phone"],
};

export const REQUIRED_COMPANY_TYPE_INDEXES = [2, 3, 4, 5, 6, 7, 8];

const handleOnlyLettersMessage = (text: string) => {
    return `${text || "This field"} must contain only letters.`;
};

export const ContactFormSchema: Yup.ObjectSchema<Partial<PartialContact>> = Yup.object().shape({
    firstName: Yup.string()
        .trim()
        .test("firstNameRequired", "Data is required.", function (value) {
            const { type, businessName } = this.parent;
            if (!REQUIRED_COMPANY_TYPE_INDEXES.includes(type) && !businessName?.trim()) {
                return !!value?.trim();
            }
            return true;
        })
        .matches(LETTERS_ONLY_REGEX, {
            message: handleOnlyLettersMessage("First name"),
            excludeEmptyString: true,
        }),
    middleName: Yup.string()
        .trim()
        .matches(LETTERS_ONLY_REGEX, {
            message: handleOnlyLettersMessage("Middle name"),
        }),
    lastName: Yup.string()
        .trim()
        .test("lastNameRequired", "Data is required.", function (value) {
            const { type, businessName } = this.parent;
            if (!REQUIRED_COMPANY_TYPE_INDEXES.includes(type) && !businessName?.trim()) {
                return !!value?.trim();
            }
            return true;
        })
        .matches(LETTERS_ONLY_REGEX, {
            message: handleOnlyLettersMessage("Last name"),
            excludeEmptyString: true,
        }),
    businessName: Yup.string()
        .trim()
        .test("businessNameRequired", "Data is required.", function (value) {
            const { type, firstName, lastName } = this.parent;
            if (
                REQUIRED_COMPANY_TYPE_INDEXES.includes(type) &&
                !firstName?.trim() &&
                !lastName?.trim()
            ) {
                return !!value?.trim();
            }
            return true;
        }),
    type: Yup.number().default(0).required("Data is required."),
    email1: Yup.string().email("Invalid email address."),
    email2: Yup.string().email("Invalid email address."),
    phone1: Yup.string()
        .transform((value) => value.replace(/-/g, ""))
        .matches(/^[\d]{10,13}$/, {
            message: "Invalid phone number.",
            excludeEmptyString: false,
        }),
    phone2: Yup.string()
        .transform((value) => value.replace(/-/g, ""))
        .matches(/^[\d]{10,13}$/, {
            message: "Invalid phone number.",
            excludeEmptyString: false,
        }),
    Buyer_Emp_Ext: Yup.string().email("Invalid email address."),
    Buyer_Emp_Phone: Yup.string()
        .transform((value) => value.replace(/-/g, ""))
        .matches(/^[\d]{10,13}$/, {
            message: "Invalid phone number.",
            excludeEmptyString: false,
        }),
    CoBuyer_First_Name: Yup.string().matches(LETTERS_ONLY_REGEX, {
        message: handleOnlyLettersMessage("First name"),
    }),
    CoBuyer_Middle_Name: Yup.string().matches(LETTERS_ONLY_REGEX, {
        message: handleOnlyLettersMessage("Middle name"),
    }),
    CoBuyer_Last_Name: Yup.string().matches(LETTERS_ONLY_REGEX, {
        message: handleOnlyLettersMessage("Last name"),
    }),
});

const DialogBody = (): ReactElement => {
    return (
        <>
            <div className='confirm-header'>
                <i className='pi pi-exclamation-triangle confirm-header__icon' />
                <div className='confirm-header__title'>Required data is missing</div>
            </div>
            <div className='text-center w-full confirm-body'>
                The form cannot be saved as it missing required data.
            </div>
            <div className='text-center w-full confirm-body--bold'>
                Please fill in the required fields and try again.
            </div>
        </>
    );
};

export const ContactForm = observer((): ReactElement => {
    const { id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const toast = useToast();

    const [contactSections, setContactSections] = useState<ContactSection[]>([]);
    const [accordionSteps, setAccordionSteps] = useState<number[]>([0]);
    const [itemsMenuCount, setItemsMenuCount] = useState(0);
    const tabParam = searchParams.get(STEP) ? Number(searchParams.get(STEP)) - 1 : 0;
    const [stepActiveIndex, setStepActiveIndex] = useState<number>(tabParam);
    const [accordionActiveIndex, setAccordionActiveIndex] = useState<number | number[]>([0]);
    const store = useStore().contactStore;
    const {
        contact,
        contactType,
        contactExtData,
        getContact,
        clearContact,
        saveContact,
        isContactChanged,
        memoRoute,
        deleteReason,
        isLoading,
        activeTab,
        tabLength,
    } = store;
    const navigate = useNavigate();
    const formikRef = useRef<FormikProps<PartialContact>>(null);
    const [validateOnMount, setValidateOnMount] = useState<boolean>(false);
    const [errorSections, setErrorSections] = useState<string[]>([]);
    const [confirmMessage, setConfirmMessage] = useState<string>("");
    const [confirmTitle, setConfirmTitle] = useState<string>("");
    const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {});
    const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
    const [isDataMissingConfirm, setIsDataMissingConfirm] = useState<boolean>(false);
    const [confirmActive, setConfirmActive] = useState<boolean>(false);
    const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false);
    const [deleteActiveIndex, setDeleteActiveIndex] = useState<number>(0);
    const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
    const stepsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let contactsSections = [ContactInfoData];

        switch (contactType) {
            case BUYER_ID:
                contactsSections = [generalCoBuyerInfo, ...contactsSections];
                break;
            default:
                contactsSections = [generalBuyerInfo, ...contactsSections];
                break;
        }

        if (id) {
            contactsSections = [...contactsSections, ContactMediaData];
        }

        const sections = contactsSections.map((sectionData) => new ContactSection(sectionData));
        setContactSections(sections);
        setAccordionSteps(sections.map((item) => item.startIndex));
        const itemsMenuCount = sections.reduce((acc, current) => acc + current.getLength(), -1);
        setItemsMenuCount(itemsMenuCount);
        setDeleteActiveIndex(itemsMenuCount + 1);

        return () => {
            sections.forEach((section) => section.clearCount());
        };
    }, [contactType]);

    useEffect(() => {
        if (id) {
            getContact(id).then((response) => {
                if (response?.status === Status.ERROR) {
                    toast.current?.show({
                        severity: "error",
                        summary: Status.ERROR,
                        detail: (response?.error as string) || "",
                        life: TOAST_LIFETIME,
                    });
                    navigate(`/dashboard/contacts`);
                }
            });
        } else {
            clearContact();
        }
        return () => {
            clearContact();
        };
    }, [id, store]);

    const getUrl = (activeIndex: number) => {
        const currentPath = id ? id : "create";
        return `/dashboard/contacts/${currentPath}?step=${activeIndex + 1}`;
    };

    const handleCloseClick = () => {
        const performNavigation = () => {
            if (memoRoute) {
                navigate(memoRoute);
                store.memoRoute = "";
            } else {
                navigate(`/dashboard/contacts`);
            }
        };

        if (isContactChanged) {
            setConfirmTitle("Quit Editing?");
            setConfirmMessage(
                "Are you sure you want to leave this page? All unsaved data will be lost."
            );
            setConfirmAction(() => performNavigation);
            setIsConfirmVisible(true);
        } else {
            performNavigation();
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isContactChanged) {
                event.preventDefault();
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isContactChanged]);

    useEffect(() => {
        accordionSteps.forEach((step, index) => {
            stepActiveIndex >= step && setAccordionActiveIndex([index]);
        });
        if (stepsRef.current) {
            const activeStep = stepsRef.current.querySelector("[aria-selected='true']");
            if (activeStep) {
                activeStep.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }
    }, [stepActiveIndex, stepsRef.current]);

    const handleSaveContactForm = () => {
        formikRef.current?.validateForm().then(async (errors) => {
            if (!Object.keys(errors).length) {
                const response = await saveContact();
                if (response && response.status === Status.OK) {
                    if (memoRoute) {
                        navigate(memoRoute);
                        store.memoRoute = "";
                    } else {
                        navigate(`/dashboard/contacts`);
                    }
                    toast.current?.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Contact saved successfully",
                    });
                } else {
                    const { errorField } = response as BaseResponseError;
                    if (
                        errorField &&
                        Object.keys(tabFields).some((key) =>
                            tabFields[key as ContactAccordionItems]?.includes(
                                errorField as keyof PartialContact
                            )
                        )
                    ) {
                        formikRef.current?.setErrors({ [errorField]: response.error });
                    }
                    toast.current?.show({
                        severity: "error",
                        summary: Status.ERROR,
                        detail: response.error || "Error while saving contact",
                        life: TOAST_LIFETIME,
                    });
                }
            } else {
                setValidateOnMount(true);

                const sectionsWithErrors = Object.keys(errors);
                const currentSectionsWithErrors: string[] = [];
                Object.entries(tabFields).forEach(([key, value]) => {
                    value.forEach((field) => {
                        if (
                            sectionsWithErrors.includes(field) &&
                            !currentSectionsWithErrors.includes(key)
                        ) {
                            currentSectionsWithErrors.push(key);
                        }
                    });
                });
                setErrorSections(currentSectionsWithErrors);

                setIsDataMissingConfirm(true);
            }
        });
    };

    const handleOnBackClick = () => {
        if (activeTab !== null && activeTab && activeTab > 0) {
            store.activeTab = activeTab - 1;
        } else {
            setStepActiveIndex((prev) => {
                const newStep = prev - 1;
                navigate(getUrl(newStep));
                return newStep;
            });
        }
    };

    const handleOnNextClick = () => {
        if (activeTab !== null && activeTab < tabLength - 1) {
            store.activeTab = activeTab + 1;
        } else {
            setStepActiveIndex((prev) => {
                const newStep = prev + 1;
                navigate(getUrl(newStep));
                return newStep;
            });
        }
    };

    const stepAccordionHeader = (section: ContactSection) => {
        const validTabsCount = section.items.reduce((count, item) => {
            const tabFieldsForItem = tabFields[item.itemLabel];

            const hasErrors = tabFieldsForItem?.some(
                (fieldName) => formikRef.current?.errors[fieldName]
            );

            return hasErrors ? count : count + 1;
        }, 0);

        const totalTabsCount = section.items.length;

        return (
            <div className='p-0'>
                {section.label}
                <span className='ml-2 text--green'>
                    ({validTabsCount}/{totalTabsCount})
                </span>
            </div>
        );
    };

    return isLoading ? (
        <Loader overlay />
    ) : (
        <Suspense>
            <div className='grid relative'>
                <Button
                    icon='pi pi-times'
                    className='p-button close-button'
                    onClick={handleCloseClick}
                />
                <div className='col-12'>
                    <div className='card contact'>
                        <div className='card-header'>
                            <h2 className='card-header__title uppercase m-0 pr-2'>
                                {id ? "Edit" : "Create new"} contact
                            </h2>
                            {id && (
                                <div className='card-header-info'>
                                    <Tooltip target='.tooltip-target' />

                                    {(contact.firstName || contact.lastName) && (
                                        <>
                                            Full Name
                                            <span
                                                className='card-header-info__data tooltip-target'
                                                data-pr-tooltip={`${contact.firstName || ""} ${contact.lastName || ""}`}
                                                data-pr-position='top'
                                            >
                                                {truncateText(
                                                    `${contact.firstName || ""} ${contact.lastName || ""}`
                                                )}
                                            </span>
                                        </>
                                    )}

                                    {contact?.businessName && (
                                        <>
                                            Company name
                                            <span
                                                className='card-header-info__data tooltip-target'
                                                data-pr-tooltip={contact.businessName}
                                                data-pr-position='top'
                                            >
                                                {truncateText(contact.businessName)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='card-content contact__card'>
                            <div className='grid flex-nowrap card-content__wrapper'>
                                <div className='p-0' ref={stepsRef}>
                                    <Accordion
                                        activeIndex={accordionActiveIndex}
                                        onTabChange={(e) => setAccordionActiveIndex(e.index)}
                                        multiple
                                        className='contact__accordion'
                                    >
                                        {contactSections.map((section) => (
                                            <AccordionTab
                                                key={section.sectionId}
                                                header={stepAccordionHeader(section)}
                                            >
                                                <Steps
                                                    model={section.items.map(
                                                        ({ itemLabel, template }, idx) => ({
                                                            label: itemLabel,
                                                            template,
                                                            command: () => {
                                                                navigate(
                                                                    getUrl(section.startIndex + idx)
                                                                );
                                                            },
                                                            className: errorSections.length
                                                                ? errorSections.includes(itemLabel)
                                                                    ? "section-invalid"
                                                                    : "section-valid"
                                                                : "",
                                                        })
                                                    )}
                                                    readOnly={false}
                                                    activeIndex={
                                                        stepActiveIndex - section.startIndex
                                                    }
                                                    onSelect={(e) =>
                                                        setStepActiveIndex(
                                                            e.index + section.startIndex
                                                        )
                                                    }
                                                    className='vertical-step-menu'
                                                    pt={{
                                                        menu: { className: "flex-column w-full" },
                                                        step: {
                                                            className: "border-circle contact-step",
                                                        },
                                                    }}
                                                />
                                            </AccordionTab>
                                        ))}
                                    </Accordion>
                                    {id && (
                                        <Button
                                            icon='pi pi-times'
                                            className='p-button gap-2 inventory__delete-nav w-full'
                                            severity='danger'
                                            onClick={() => setStepActiveIndex(deleteActiveIndex)}
                                        >
                                            Delete contact
                                        </Button>
                                    )}
                                </div>
                                <div className='w-full flex flex-column p-0'>
                                    <div className='flex flex-grow-1'>
                                        <Formik
                                            innerRef={formikRef}
                                            validationSchema={ContactFormSchema}
                                            initialValues={
                                                {
                                                    firstName: contact?.firstName || "",
                                                    middleName: contact?.middleName || "",
                                                    lastName: contact?.lastName || "",
                                                    type: contact?.type || 0,
                                                    businessName: contact?.businessName || "",
                                                    email1: contact?.email1 || "",
                                                    email2: contact?.email2 || "",
                                                    phone1: contact?.phone1 || "",
                                                    phone2: contact?.phone2 || "",
                                                    Buyer_Emp_Ext:
                                                        contactExtData.Buyer_Emp_Ext || "",
                                                    Buyer_Emp_Phone:
                                                        contactExtData.Buyer_Emp_Phone || "",
                                                    CoBuyer_First_Name:
                                                        contactExtData.CoBuyer_First_Name || "",
                                                    CoBuyer_Last_Name:
                                                        contactExtData.CoBuyer_Last_Name || "",
                                                } as PartialContact
                                            }
                                            enableReinitialize
                                            validateOnChange={false}
                                            validateOnBlur={false}
                                            validateOnMount={validateOnMount}
                                            onSubmit={() => {
                                                setValidateOnMount(false);
                                            }}
                                        >
                                            <Form name='contactForm' className='w-full'>
                                                {contactSections.map((section) =>
                                                    section.items.map((item: ContactItem) => {
                                                        return (
                                                            <div
                                                                key={item.itemIndex}
                                                                className={`${
                                                                    stepActiveIndex ===
                                                                    item.itemIndex
                                                                        ? "block contact-form"
                                                                        : "hidden"
                                                                }`}
                                                            >
                                                                <div className='contact-form__title uppercase'>
                                                                    {item.itemLabel}
                                                                </div>
                                                                {stepActiveIndex ===
                                                                    item.itemIndex && (
                                                                    <Suspense fallback={<Loader />}>
                                                                        {item.component}
                                                                    </Suspense>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </Form>
                                        </Formik>
                                        {stepActiveIndex === deleteActiveIndex && (
                                            <DeleteForm
                                                attemptedSubmit={attemptedSubmit}
                                                isDeleteConfirm={isDeleteConfirm}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-content-end gap-3 mt-5 mr-3 form-nav'>
                                <Button
                                    onClick={handleOnBackClick}
                                    className='form-nav__button'
                                    outlined
                                    disabled={stepActiveIndex <= 0 && !activeTab}
                                    severity={
                                        stepActiveIndex <= 0 && !activeTab ? "secondary" : "success"
                                    }
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleOnNextClick}
                                    disabled={stepActiveIndex >= itemsMenuCount}
                                    severity={
                                        stepActiveIndex >= itemsMenuCount ? "secondary" : "success"
                                    }
                                    className='form-nav__button'
                                    outlined
                                >
                                    Next
                                </Button>
                                {stepActiveIndex === deleteActiveIndex ? (
                                    <Button
                                        onClick={() =>
                                            deleteReason.length
                                                ? setConfirmActive(true)
                                                : setAttemptedSubmit(true)
                                        }
                                        disabled={!deleteReason.length}
                                        {...(!deleteReason.length && { severity: "secondary" })}
                                        className='form-nav__button form-nav__button--danger'
                                    >
                                        Delete
                                    </Button>
                                ) : (
                                    <Button
                                        className='form-nav__button'
                                        type='button'
                                        onClick={handleSaveContactForm}
                                        disabled={!isContactChanged}
                                        severity={isContactChanged ? "success" : "secondary"}
                                    >
                                        Save
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isConfirmVisible ? (
                <ConfirmModal
                    visible={!!isConfirmVisible}
                    title={confirmTitle}
                    icon='pi-exclamation-triangle'
                    bodyMessage={confirmMessage}
                    confirmAction={confirmAction}
                    draggable={false}
                    rejectLabel='Cancel'
                    acceptLabel='Confirm'
                    resizable={false}
                    className='contact-confirm-dialog'
                    onHide={() => setIsConfirmVisible(false)}
                />
            ) : (
                <ConfirmModal
                    visible={confirmActive}
                    draggable={false}
                    position='top'
                    className='contact-delete-dialog'
                    bodyMessage='Do you really want to delete this contact? 
                This process cannot be undone.'
                    rejectLabel='Cancel'
                    acceptLabel='Delete'
                    confirmAction={() => setIsDeleteConfirm(true)}
                    onHide={() => setConfirmActive(false)}
                />
            )}

            <DashboardDialog
                visible={!!isDataMissingConfirm}
                className='contact-missed-data-dialog'
                onHide={() => setIsDataMissingConfirm(false)}
                footer='Got it'
                action={() => setIsDataMissingConfirm(false)}
            >
                <DialogBody />
            </DashboardDialog>
        </Suspense>
    );
});
