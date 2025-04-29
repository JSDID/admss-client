/* eslint-disable jsx-a11y/anchor-is-valid */
import { Steps } from "primereact/steps";
import { Suspense, useEffect, useRef, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { AccordionDealItems, Deals, DealsItem, DealsSection } from "../common";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { DealGeneralInfo } from "dashboard/deals/form/general-info";
import {
    DealBHPH,
    DealDismantleForm,
    DealLHPH,
    DealRetail,
    DealWholeSale,
} from "dashboard/deals/form/retail";
import { useStore } from "store/hooks";
import { Loader } from "dashboard/common/loader";
import { PrintDealForms } from "dashboard/deals/form/print-forms";
import { Form, Formik, FormikProps } from "formik";
import { Deal, DealExtData } from "common/models/deals";
import * as Yup from "yup";
import { useToast } from "dashboard/common/toast";
import { MAX_VIN_LENGTH, MIN_VIN_LENGTH } from "dashboard/common/form/vin-decoder";
import { BaseResponseError, Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";

const STEP = "step";
const EMPTY_INFO_MESSAGE = "N/A";

export type PartialDeal = Pick<
    Deal,
    | "contactinfo"
    | "inventoryinfo"
    | "dealtype"
    | "dealstatus"
    | "saletype"
    | "datepurchase"
    | "dateeffective"
    | "inventorystatus"
> &
    Pick<
        DealExtData,
        | "HowFoundOut"
        | "SaleID"
        | "OdometerReading"
        | "OdomDigits"
        | "First_Lien_Phone_Num"
        | "Trade1_Make"
        | "Trade1_Model"
        | "Trade1_VIN"
        | "Trade1_Year"
        | "Trade1_Mileage"
        | "Trade1_Lien_Address"
        | "Trade1_Lien_Phone"
        | "Trade2_Make"
        | "Trade2_Model"
        | "Trade2_VIN"
        | "Trade2_Year"
        | "Trade2_Mileage"
        | "Trade2_Lien_Address"
        | "Trade2_Lien_Phone"
    >;

const tabFields: Partial<Record<AccordionDealItems, (keyof PartialDeal)[]>> = {
    [AccordionDealItems.SALE]: [
        "contactinfo",
        "inventoryinfo",
        "dealtype",
        "dealstatus",
        "saletype",
        "datepurchase",
        "dateeffective",
        "inventorystatus",
        "HowFoundOut",
        "SaleID",
    ],
    [AccordionDealItems.ODOMETER]: ["OdometerReading", "OdomDigits"],
    [AccordionDealItems.FIRST_TRADE]: [
        "Trade1_Make",
        "Trade1_Model",
        "Trade1_VIN",
        "Trade1_Year",
        "Trade1_Mileage",
        "Trade1_Lien_Address",
        "Trade1_Lien_Phone",
    ],
    [AccordionDealItems.SECOND_TRADE]: [
        "Trade2_Make",
        "Trade2_Model",
        "Trade2_VIN",
        "Trade2_Year",
        "Trade2_Mileage",
        "Trade2_Lien_Address",
        "Trade2_Lien_Phone",
    ],
};

const MIN_YEAR = 1970;
const MAX_YEAR = new Date().getFullYear();

export const DealFormSchema: Yup.ObjectSchema<Partial<PartialDeal>> = Yup.object().shape({
    contactinfo: Yup.string().required("Data is required."),
    inventoryinfo: Yup.string().required("Data is required."),
    dealtype: Yup.number().required("Data is required."),
    dealstatus: Yup.number().required("Data is required."),
    saletype: Yup.number().required("Data is required."),
    datepurchase: Yup.string().trim().required("Data is required."),
    dateeffective: Yup.string().trim().required("Data is required."),
    inventorystatus: Yup.number().nullable().required("Data is required."),
    HowFoundOut: Yup.string().required("Data is required."),
    SaleID: Yup.string().required("Data is required."),
    OdometerReading: Yup.string().required("Data is required."),
    OdomDigits: Yup.number().required("Data is required."),
    First_Lien_Phone_Num: Yup.string().matches(/^[\d]{10,13}$/, {
        message: "Please enter a valid number.",
        excludeEmptyString: false,
    }),
    Trade1_Make: Yup.string().required("Data is required."),
    Trade1_Model: Yup.string().required("Data is required."),
    Trade1_VIN: Yup.string()
        .min(MIN_VIN_LENGTH, `VIN must be at least ${MIN_VIN_LENGTH} characters`)
        .max(MAX_VIN_LENGTH, `VIN must be less than ${MAX_VIN_LENGTH} characters`)
        .required("Data is required."),
    Trade1_Year: Yup.string()
        .required("Data is required.")
        .test("is-valid-year", `Must be between ${MIN_YEAR} and ${MAX_YEAR}`, function (value) {
            const year = Number(value);
            if (year < MIN_YEAR) {
                return this.createError({ message: `Must be greater than ${MIN_YEAR}` });
            }
            if (year > MAX_YEAR) {
                return this.createError({ message: `Must be less than ${MAX_YEAR}` });
            }
            return true;
        }),
    Trade1_Mileage: Yup.string()
        .required("Data is required.")
        .test("is-positive", "Mileage must be greater than 0", (value) => {
            const numValue = Number(value);
            return !isNaN(numValue) && numValue > 0;
        }),
    Trade1_Lien_Address: Yup.string().email("Please enter a valid email address."),
    Trade1_Lien_Phone: Yup.string().matches(/^[\d]{10,13}$/, {
        message: "Please enter a valid number.",
        excludeEmptyString: false,
    }),
    Trade2_Make: Yup.string().required("Data is required."),
    Trade2_Model: Yup.string().required("Data is required."),
    Trade2_VIN: Yup.string()
        .min(MIN_VIN_LENGTH, `VIN must be at least ${MIN_VIN_LENGTH} characters`)
        .max(MAX_VIN_LENGTH, `VIN must be less than ${MAX_VIN_LENGTH} characters`)
        .required("Data is required."),
    Trade2_Year: Yup.string()
        .required("Data is required.")
        .test("is-valid-year", `Must be between ${MIN_YEAR} and ${MAX_YEAR}`, function (value) {
            const year = Number(value);
            if (year < MIN_YEAR) {
                return this.createError({ message: `Must be greater than ${MIN_YEAR}` });
            }
            if (year > MAX_YEAR) {
                return this.createError({ message: `Must be less than ${MAX_YEAR}` });
            }
            return true;
        }),
    Trade2_Mileage: Yup.string()
        .required("Data is required.")
        .test("is-positive", "Mileage must be greater than 0", (value) => {
            const numValue = Number(value);
            return !isNaN(numValue) && numValue > 0;
        }),
    Trade2_Lien_Address: Yup.string().email("Please enter a valid email address."),
    Trade2_Lien_Phone: Yup.string().matches(/^[\d]{10,13}$/, {
        message: "Please enter a valid number.",
        excludeEmptyString: false,
    }),
});

enum DealType {
    LHPH = 7,
    DISMANTLE = 6,
    WHOLESALE = 5,
    BHPH = 0,
}

const DATE_NOW = new Date().toISOString();

export const DealsForm = observer(() => {
    const { id } = useParams();
    const location = useLocation();
    const toast = useToast();
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get(STEP) ? Number(searchParams.get(STEP)) - 1 : 0;

    const store = useStore().dealStore;
    const {
        deal,
        inventory,
        dealType,
        dealExtData,
        accordionActiveIndex,
        getDeal,
        getPrintList,
        saveDeal,
        clearDeal,
        isFormChanged,
        isLoading,
    } = store;

    const [stepActiveIndex, setStepActiveIndex] = useState<number>(tabParam);
    const [printActiveIndex, setPrintActiveIndex] = useState<number>(0);
    const stepsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [dealsSections, setDealsSections] = useState<DealsSection[]>([]);
    const [accordionSteps, setAccordionSteps] = useState<number[]>([0]);
    const [itemsMenuCount, setItemsMenuCount] = useState(0);
    const formikRef = useRef<FormikProps<Partial<Deal> & Partial<DealExtData>>>(null);
    const [errorSections, setErrorSections] = useState<string[]>([]);

    useEffect(() => {
        accordionSteps.forEach((step, index) => {
            if (stepActiveIndex >= step) store.accordionActiveIndex = [index];
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

    useEffect(() => {
        if (stepActiveIndex === printActiveIndex && id) {
            getPrintList(id);
        }
    }, [stepActiveIndex, printActiveIndex]);

    const getUrl = (activeIndex: number) => {
        const currentPath = id ? id : "create";
        return `/dashboard/deals/${currentPath}?step=${activeIndex + 1}`;
    };

    const handleGetDeal = async () => {
        if (id) {
            const response = await getDeal(id);

            if (response?.status === Status.ERROR) {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: (response?.error as string) || "",
                    life: TOAST_LIFETIME,
                });
                navigate(`/dashboard/deals`);
            }
        }
    };

    useEffect(() => {
        handleGetDeal();
        return () => clearDeal();
    }, [id]);

    useEffect(() => {
        let dealsSections: Pick<Deals, "label" | "items">[] = [DealGeneralInfo];

        switch (dealType) {
            case DealType.LHPH:
                dealsSections = [...dealsSections, DealLHPH];
                break;
            case DealType.DISMANTLE:
                dealsSections = [...dealsSections, DealDismantleForm];
                break;
            case DealType.WHOLESALE:
                dealsSections = [...dealsSections, DealWholeSale];
                break;
            case DealType.BHPH:
                dealsSections = [...dealsSections, DealBHPH];
                break;
            default:
                dealsSections = [...dealsSections, DealRetail];
                break;
        }

        const sections = dealsSections.map((sectionData) => new DealsSection(sectionData));
        setDealsSections(sections);
        setAccordionSteps(sections.map((item) => item.startIndex));
        const itemsMenuCount = sections.reduce((acc, current) => acc + current.getLength(), -1);
        setItemsMenuCount(itemsMenuCount);
        setPrintActiveIndex(itemsMenuCount + 1);

        return () => {
            sections.forEach((section) => section.clearCount());
        };
    }, [dealType]);

    useEffect(() => {
        if (stepActiveIndex === printActiveIndex) {
            store.accordionActiveIndex = [];
        } else {
            accordionSteps.forEach((step, index) => {
                if (stepActiveIndex >= step) {
                    store.accordionActiveIndex = [index];
                }
            });
        }
    }, [stepActiveIndex, printActiveIndex, accordionSteps]);

    const handleActivePrintForms = () => {
        navigate(getUrl(printActiveIndex));
        setStepActiveIndex(printActiveIndex);
    };

    const handleSaveDealForm = () => {
        formikRef.current?.validateForm().then((errors) => {
            if (!Object.keys(errors).length) {
                formikRef.current?.submitForm();
            } else {
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
                toast.current?.show({
                    severity: "error",
                    summary: "Validation Error",
                    detail: "Please fill in all required fields.",
                    life: TOAST_LIFETIME,
                });
            }
        });
    };

    return isLoading ? (
        <Loader overlay />
    ) : (
        <Suspense>
            <div className='grid relative'>
                <Button
                    icon='pi pi-times'
                    className='p-button close-button'
                    onClick={() => navigate("/dashboard/deals")}
                />
                <div className='col-12'>
                    <div className='card deal'>
                        <div className='card-header flex'>
                            <h2 className='card-header__title uppercase m-0'>
                                {id ? "Edit" : "Create new"} Deal
                            </h2>
                            {id && (
                                <div className='card-header-info'>
                                    Stock#
                                    <span className='card-header-info__data'>
                                        {inventory?.StockNo || EMPTY_INFO_MESSAGE}
                                    </span>
                                    Make
                                    <span className='card-header-info__data'>
                                        {inventory?.Make || EMPTY_INFO_MESSAGE}
                                    </span>
                                    Model
                                    <span className='card-header-info__data'>
                                        {inventory?.Model || EMPTY_INFO_MESSAGE}
                                    </span>
                                    Year
                                    <span className='card-header-info__data'>
                                        {inventory?.Year || EMPTY_INFO_MESSAGE}
                                    </span>
                                    VIN
                                    <span className='card-header-info__data'>{inventory?.VIN}</span>
                                </div>
                            )}
                        </div>
                        <div className='card-content deal__card'>
                            <div className='grid flex-nowrap deal__card-content'>
                                <div className='p-0 card-content__wrapper' ref={stepsRef}>
                                    <Accordion
                                        activeIndex={accordionActiveIndex}
                                        onTabChange={(e) => {
                                            store.accordionActiveIndex = e.index;
                                        }}
                                        className='deal__accordion'
                                        multiple
                                    >
                                        {dealsSections.map((section) => (
                                            <AccordionTab
                                                key={section.sectionId}
                                                header={section.label}
                                            >
                                                <Steps
                                                    readOnly={false}
                                                    activeIndex={
                                                        stepActiveIndex - section.startIndex
                                                    }
                                                    onSelect={(e) => {
                                                        setStepActiveIndex(
                                                            e.index + section.startIndex
                                                        );
                                                    }}
                                                    model={section.items.map(
                                                        (
                                                            { itemLabel, template }: any,
                                                            idx: number
                                                        ) => ({
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
                                                    className='vertical-step-menu'
                                                    pt={{
                                                        menu: { className: "flex-column w-full" },
                                                        step: {
                                                            className: "border-circle deal-step",
                                                        },
                                                    }}
                                                />
                                            </AccordionTab>
                                        ))}
                                    </Accordion>
                                    {id && (
                                        <Button
                                            icon='icon adms-print'
                                            className={`p-button gap-2 deal__print-nav ${
                                                stepActiveIndex === printActiveIndex &&
                                                "deal__print-nav--active"
                                            } w-full`}
                                            onClick={handleActivePrintForms}
                                        >
                                            Print forms
                                        </Button>
                                    )}
                                </div>
                                <div className='w-full flex flex-column p-0 card-content__wrapper'>
                                    <div className='flex flex-grow-1'>
                                        <Formik
                                            innerRef={formikRef}
                                            initialValues={
                                                {
                                                    contactinfo: deal.contactinfo || "",
                                                    inventoryinfo: deal.inventoryinfo || "",
                                                    dealtype: deal.dealtype || dealType,
                                                    dealstatus: deal.dealstatus,
                                                    saletype: deal.saletype,
                                                    datepurchase: deal.datepurchase || DATE_NOW,
                                                    dateeffective: deal.dateeffective || DATE_NOW,
                                                    inventorystatus: deal.inventorystatus || 0,
                                                    accountInfo: deal.accountInfo || "",
                                                    HowFoundOut: dealExtData?.HowFoundOut || "",
                                                    SaleID: dealExtData?.SaleID || "",
                                                    OdometerReading:
                                                        dealExtData?.OdometerReading || "",
                                                    OdomDigits: dealExtData?.OdomDigits || "",
                                                    First_Lien_Phone_Num:
                                                        dealExtData?.First_Lien_Phone_Num || "",
                                                    Trade1_Make: dealExtData?.Trade1_Make || "",
                                                    Trade1_Model: dealExtData?.Trade1_Model || "",
                                                    Trade1_VIN: dealExtData?.Trade1_VIN || "",
                                                    Trade1_Year: dealExtData?.Trade1_Year || "",
                                                    Trade1_Mileage:
                                                        dealExtData?.Trade1_Mileage || "",
                                                    Trade1_Lien_Address:
                                                        dealExtData?.Trade1_Lien_Address || "",
                                                    Trade1_Lien_Phone:
                                                        dealExtData?.Trade1_Lien_Phone || "",
                                                    Trade2_Make: dealExtData?.Trade2_Make || "",
                                                    Trade2_Model: dealExtData?.Trade2_Model || "",
                                                    Trade2_VIN: dealExtData?.Trade2_VIN || "",
                                                    Trade2_Year: dealExtData?.Trade2_Year || "",
                                                    Trade2_Mileage:
                                                        dealExtData?.Trade2_Mileage || "",
                                                    Trade2_Lien_Address:
                                                        dealExtData?.Trade2_Lien_Address || "",
                                                    Trade2_Lien_Phone:
                                                        dealExtData?.Trade2_Lien_Phone || "",
                                                } as Partial<Deal> & Partial<DealExtData>
                                            }
                                            enableReinitialize
                                            validationSchema={DealFormSchema}
                                            validateOnChange={false}
                                            validateOnBlur={false}
                                            onSubmit={() => {
                                                saveDeal().then((response) => {
                                                    const res = response as BaseResponseError;
                                                    if (res?.status === Status.ERROR) {
                                                        toast.current?.show({
                                                            severity: "error",
                                                            summary: "Error",
                                                            detail: res?.error,
                                                        });
                                                    } else {
                                                        navigate(`/dashboard/deals`);
                                                        toast.current?.show({
                                                            severity: "success",
                                                            summary: "Success",
                                                            detail: "Deal saved successfully",
                                                        });
                                                    }
                                                });
                                            }}
                                        >
                                            <Form name='dealForm' className='w-full'>
                                                {dealsSections.map((section) =>
                                                    section.items.map((item: DealsItem) => (
                                                        <div
                                                            key={item.itemIndex}
                                                            className={`${
                                                                stepActiveIndex === item.itemIndex
                                                                    ? "block deal-form"
                                                                    : "hidden"
                                                            }`}
                                                        >
                                                            <div className='deal-form__title uppercase'>
                                                                {item.itemLabel}
                                                            </div>
                                                            {stepActiveIndex === item.itemIndex && (
                                                                <Suspense fallback={<Loader />}>
                                                                    {item.component}
                                                                </Suspense>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                                {stepActiveIndex === printActiveIndex && (
                                                    <div className='deal-form'>
                                                        <div className='deal-form__title uppercase'>
                                                            Print forms
                                                        </div>
                                                        <PrintDealForms />
                                                    </div>
                                                )}
                                            </Form>
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-content-end gap-3 mt-5 mr-3 form-nav'>
                                <Button
                                    onClick={() => {
                                        if (!stepActiveIndex) {
                                            return navigate(`/dashboard/deals`);
                                        }
                                        setStepActiveIndex((prev) => {
                                            const newStep = prev - 1;
                                            navigate(getUrl(newStep));
                                            return newStep;
                                        });
                                    }}
                                    className='form-nav__button deal__button'
                                    outlined
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={() =>
                                        setStepActiveIndex((prev) => {
                                            const newStep = prev + 1;
                                            navigate(getUrl(newStep));
                                            return newStep;
                                        })
                                    }
                                    disabled={stepActiveIndex >= itemsMenuCount}
                                    severity={
                                        stepActiveIndex >= itemsMenuCount ? "secondary" : "success"
                                    }
                                    className='form-nav__button deal__button'
                                    outlined
                                >
                                    Next
                                </Button>
                                <Button
                                    onClick={handleSaveDealForm}
                                    className='form-nav__button deal__button'
                                    severity={isFormChanged ? "success" : "secondary"}
                                    disabled={!isFormChanged}
                                >
                                    {id ? "Update" : "Save"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
});
