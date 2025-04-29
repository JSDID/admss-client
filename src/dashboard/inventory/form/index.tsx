import { Steps } from "primereact/steps";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InventoryVehicleData } from "./vehicle";
import { Button } from "primereact/button";
import { AccordionItems, Inventory, InventoryItem, InventorySection } from "../common";
import { InventoryPurchaseData } from "./purchase";
import { InventoryMediaData } from "./media-data";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "store/hooks";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { checkStockNoAvailability, getVINCheck } from "http/services/inventory-service";
import { InventoryExportWebData } from "./export-web";

import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { PrintForms } from "./print-forms";
import { Loader } from "dashboard/common/loader";
import { Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";

import { Inventory as InventoryModel, InventoryStockNumber } from "common/models/inventory";
import { useToast } from "dashboard/common/toast";
import { MAX_VIN_LENGTH, MIN_VIN_LENGTH } from "dashboard/common/form/vin-decoder";
import { DeleteForm } from "./delete-form";
import { BaseResponseError, Status } from "common/models/base-response";
import { debounce } from "common/helpers";
import { TOAST_LIFETIME } from "common/settings";

const STEP = "step";

type PartialInventory = Pick<
    InventoryModel,
    | "VIN"
    | "Make"
    | "Model"
    | "Year"
    | "locationuid"
    | "GroupClassName"
    | "StockNo"
    | "TypeOfFuel_id"
>;

const tabFields: Partial<Record<AccordionItems, (keyof PartialInventory)[]>> = {
    [AccordionItems.GENERAL]: [
        "VIN",
        "Make",
        "Model",
        "Year",
        "locationuid",
        "GroupClassName",
        "StockNo",
    ],
    [AccordionItems.DESCRIPTION]: ["TypeOfFuel_id"],
};

const MIN_YEAR = 1970;
const MAX_YEAR = new Date().getFullYear();

const enum DIALOG_MESSAGES {
    QUIT = "Are you sure you want to leave this page? All unsaved data will be lost.",
    DELETE = "Do you really want to delete this inventory? This process cannot be undone.",
}

export const InventoryForm = observer(() => {
    const { id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get(STEP) ? Number(searchParams.get(STEP)) - 1 : 0;
    const toast = useToast();

    const [isInventoryWebExported, setIsInventoryWebExported] = useState(false);
    const [stepActiveIndex, setStepActiveIndex] = useState<number>(tabParam);
    const [accordionActiveIndex, setAccordionActiveIndex] = useState<number | number[]>([]);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState<boolean>(false);
    const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false);

    const stepsRef = useRef<HTMLDivElement>(null);
    const store = useStore().inventoryStore;
    const {
        getInventory,
        clearInventory,
        saveInventory,
        getInventoryExportWeb,
        getWebCheckStatus,
        getInventoryExportWebHistory,
        activeTab,
        tabLength,
        inventory,
        isFormChanged,
        currentLocation,
        deleteReason,
        memoRoute,
        isLoading,
    } = store;
    const navigate = useNavigate();
    const [inventorySections, setInventorySections] = useState<InventorySection[]>([]);
    const [accordionSteps, setAccordionSteps] = useState<number[]>([0]);
    const [itemsMenuCount, setItemsMenuCount] = useState(0);
    const [printActiveIndex, setPrintActiveIndex] = useState<number>(0);
    const [deleteActiveIndex, setDeleteActiveIndex] = useState<number>(0);
    const formikRef = useRef<FormikProps<PartialInventory>>(null);
    const [validateOnMount, setValidateOnMount] = useState<boolean>(false);
    const [errorSections, setErrorSections] = useState<string[]>([]);
    const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {});
    const [confirmQuitEditVisible, setConfirmQuitEditVisible] = useState<boolean>(false);

    const initialVIN = useMemo(() => {
        if (inventory) {
            return inventory?.VIN;
        }
        return "";
    }, [inventory]);

    const initialStockNo = useMemo(() => {
        if (inventory) {
            return inventory?.StockNo;
        }
        return "";
    }, [inventory]);

    const InventoryFormSchema = ({
        initialVIN,
        initialStockNo,
    }: {
        initialVIN?: string;
        initialStockNo?: string;
    }): Yup.ObjectSchema<Partial<PartialInventory>> => {
        const debouncedCheckStockNoAvailability = debounce(
            async (value: string, resolve: (exists: boolean) => void) => {
                if (!value || initialStockNo === value) {
                    resolve(true);
                    return;
                }

                try {
                    const res = (await checkStockNoAvailability(
                        value
                    )) as unknown as InventoryStockNumber;
                    resolve(!(res && res.status === Status.OK && res.exists));
                } catch (error) {
                    resolve(true);
                }
            },
            500
        );

        const debouncedCheckVINAvailability = debounce(
            async (value: string, resolve: (exists: boolean) => void) => {
                if (!value || initialVIN === value) {
                    resolve(true);
                    return;
                }

                try {
                    const res = (await getVINCheck(value)) as unknown as InventoryStockNumber;
                    resolve(!(res && res.status === Status.OK && res.exists));
                } catch (error) {
                    resolve(true);
                }
            },
            500
        );

        return Yup.object().shape({
            VIN: Yup.string()
                .trim()
                .min(MIN_VIN_LENGTH, `VIN must be at least ${MIN_VIN_LENGTH} characters`)
                .max(MAX_VIN_LENGTH, `VIN must be less than ${MAX_VIN_LENGTH} characters`)
                .test("is-vin-available", "VIN is already in use", function (value) {
                    return new Promise((resolve) => {
                        debouncedCheckVINAvailability(value || "", resolve);
                    });
                })
                .required("Data is required."),
            Make: Yup.string().trim().required("Data is required."),
            Model: Yup.string().trim().required("Data is required."),
            Year: Yup.string()
                .test(
                    "is-valid-year",
                    `Must be between ${MIN_YEAR} and ${MAX_YEAR}`,
                    function (value) {
                        const year = Number(value);
                        if (year < MIN_YEAR) {
                            return this.createError({
                                message: `Must be greater than ${MIN_YEAR}`,
                            });
                        }
                        if (year > MAX_YEAR) {
                            return this.createError({ message: `Must be less than ${MAX_YEAR}` });
                        }
                        return true;
                    }
                )
                .required("Data is required."),
            locationuid: Yup.string().trim().required("Data is required."),
            GroupClassName: Yup.string().trim().required("Data is required."),
            StockNo: Yup.string()
                .trim()
                .min(1, "Stock number must be at least 1 character")
                .max(20, "Stock number must be at most 20 characters")
                .test("is-stockno-available", "Stock number is already in use", function (value) {
                    return new Promise((resolve) => {
                        debouncedCheckStockNoAvailability(value || "", resolve);
                    });
                }),
            TypeOfFuel_id: Yup.string().trim().required("Data is required."),
        });
    };

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

    const getUrl = (activeIndex: number) => {
        const currentPath = id ? id : "create";
        return `/dashboard/inventory/${currentPath}?step=${activeIndex + 1}`;
    };

    const handleGetInventory = async (id: string) => {
        const response = await getInventory();
        const res = response as unknown as BaseResponseError;
        if (res?.status === Status.ERROR) {
            toast.current?.show({
                severity: "error",
                summary: Status.ERROR,
                detail: res?.error || "",
                life: TOAST_LIFETIME,
            });
            navigate(`/dashboard/inventory`);
        }
    };

    useEffect(() => {
        const inventorySections: Pick<Inventory, "label" | "items">[] = [
            InventoryVehicleData,
            InventoryPurchaseData,
            InventoryExportWebData,
        ];
        id && inventorySections.splice(2, 0, InventoryMediaData);
        const sections = inventorySections.map((sectionData) => new InventorySection(sectionData));
        setInventorySections(sections);
        setAccordionSteps(sections.map((item) => item.startIndex));
        const itemsMenuCount = sections.reduce((acc, current) => acc + current.getLength(), -1);
        setItemsMenuCount(itemsMenuCount);
        setPrintActiveIndex(itemsMenuCount + 1);
        setDeleteActiveIndex(itemsMenuCount + 2);

        if (id) {
            store.inventoryID = id;
            handleGetInventory(id);
        }

        return () => {
            sections.forEach((section) => section.clearCount());
            clearInventory();
        };
    }, [id, store]);

    useEffect(() => {
        if (
            stepActiveIndex >= accordionSteps[accordionSteps.length - 1] &&
            !isInventoryWebExported
        ) {
            if (id) {
                getInventoryExportWeb(id);
                getWebCheckStatus(id);
                getInventoryExportWebHistory(id);
                setIsInventoryWebExported(true);
            }
        }
    }, [accordionSteps, stepActiveIndex]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isFormChanged) {
                event.preventDefault();
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isFormChanged]);

    const handleCloseClick = () => {
        const performNavigation = () => {
            if (memoRoute) {
                navigate(memoRoute);
                store.memoRoute = "";
            } else {
                navigate(`/dashboard/inventory`);
            }
        };

        if (isFormChanged) {
            setConfirmAction(() => performNavigation);
            setConfirmQuitEditVisible(true);
        } else {
            performNavigation();
        }
    };

    const handleOnBackClick = () => {
        setStepActiveIndex((prev) => {
            const newStep = prev - 1;
            navigate(getUrl(newStep));
            return newStep;
        });
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

    const handleActivePrintForms = () => {
        navigate(getUrl(printActiveIndex));
        setStepActiveIndex(printActiveIndex);
    };

    const handleSaveInventoryForm = () => {
        formikRef.current?.validateForm().then((errors) => {
            if (!Object.keys(errors).length) {
                formikRef.current?.submitForm();
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

                toast.current?.show({
                    severity: "error",
                    summary: "Validation Error",
                    detail: "Please fill in all required fields.",
                });
            }
        });
    };

    const navigateAndClear = () => {
        navigate(`/dashboard/inventory`);
        clearInventory();
    };

    const showToastMessage = () => {
        toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Inventory saved successfully",
        });
    };

    const handleSubmit = async (id: string | undefined) => {
        setValidateOnMount(false);
        const response = await saveInventory(id);

        if (response === Status.OK) {
            navigateAndClear();
            showToastMessage();
        } else {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: response,
            });
        }
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
                    <div className='card inventory'>
                        <div className='card-header flex'>
                            <h2 className='card-header__title uppercase m-0'>
                                {id ? "Edit" : "Create new"} inventory
                            </h2>
                            {id && (
                                <div className='card-header-info'>
                                    Stock#
                                    <span className='card-header-info__data'>
                                        {inventory?.StockNo}
                                    </span>
                                    Make
                                    <span className='card-header-info__data'>
                                        {inventory?.Make}
                                    </span>
                                    Model
                                    <span className='card-header-info__data'>
                                        {inventory?.Model}
                                    </span>
                                    Year
                                    <span className='card-header-info__data'>
                                        {inventory?.Year}
                                    </span>
                                    VIN
                                    <span className='card-header-info__data'>{inventory?.VIN}</span>
                                </div>
                            )}
                        </div>
                        <div className='card-content inventory__card'>
                            <div className='grid flex-nowrap inventory__card-content card-content__wrapper'>
                                <div className='inventory__navigation' ref={stepsRef}>
                                    <Accordion
                                        activeIndex={accordionActiveIndex}
                                        onTabChange={(e) => setAccordionActiveIndex(e.index)}
                                        className='inventory__accordion'
                                        multiple
                                    >
                                        {inventorySections.map((section) => (
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
                                                    className='vertical-step-menu'
                                                    pt={{
                                                        menu: {
                                                            className: "flex-column w-full",
                                                        },
                                                        step: {
                                                            className:
                                                                "border-circle inventory-step",
                                                        },
                                                    }}
                                                />
                                            </AccordionTab>
                                        ))}
                                    </Accordion>
                                    {id && (
                                        <Button
                                            icon='icon adms-print'
                                            className={`p-button gap-2 inventory__print-nav ${
                                                stepActiveIndex === printActiveIndex &&
                                                "inventory__print-nav--active"
                                            } w-full`}
                                            onClick={handleActivePrintForms}
                                        >
                                            Print forms
                                        </Button>
                                    )}
                                    {id && (
                                        <Button
                                            icon='pi pi-times'
                                            className='p-button gap-2 inventory__delete-nav w-full'
                                            severity='danger'
                                            onClick={() => setStepActiveIndex(deleteActiveIndex)}
                                        >
                                            Delete inventory
                                        </Button>
                                    )}
                                </div>
                                <div className='w-full flex flex-column p-0 inventory-content__wrapper'>
                                    <div className='flex flex-grow-1'>
                                        <Formik
                                            innerRef={formikRef}
                                            validationSchema={InventoryFormSchema({
                                                initialVIN,
                                                initialStockNo,
                                            })}
                                            initialValues={
                                                {
                                                    VIN: inventory?.VIN || "",
                                                    Make: inventory.Make,
                                                    Model: inventory.Model,
                                                    Year: inventory.Year,
                                                    TypeOfFuel_id: inventory?.TypeOfFuel_id || "0",
                                                    StockNo: inventory?.StockNo || "",
                                                    locationuid:
                                                        inventory?.locationuid || currentLocation,
                                                    GroupClassName: inventory?.GroupClassName || "",
                                                } as PartialInventory
                                            }
                                            enableReinitialize
                                            validateOnChange={false}
                                            validateOnBlur={false}
                                            validateOnMount={validateOnMount}
                                            onSubmit={() => handleSubmit(id)}
                                        >
                                            <Form name='inventoryForm' className='w-full'>
                                                {inventorySections.map((section) =>
                                                    section.items.map((item: InventoryItem) => (
                                                        <div
                                                            key={item.itemIndex}
                                                            className={`${
                                                                stepActiveIndex === item.itemIndex
                                                                    ? "block inventory-form"
                                                                    : "hidden"
                                                            }`}
                                                        >
                                                            <div className='inventory-form__title uppercase'>
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
                                                    <div className='inventory-form'>
                                                        <div className='inventory-form__title uppercase'>
                                                            Print history
                                                        </div>
                                                        <PrintForms />
                                                    </div>
                                                )}
                                                {stepActiveIndex === deleteActiveIndex && (
                                                    <DeleteForm
                                                        attemptedSubmit={attemptedSubmit}
                                                        isDeleteConfirm={isDeleteConfirm}
                                                    />
                                                )}
                                            </Form>
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-content-end gap-3 mt-8 mr-3'>
                                <Button
                                    onClick={handleOnBackClick}
                                    className='uppercase px-6 inventory__button'
                                    disabled={stepActiveIndex <= 0}
                                    severity={stepActiveIndex <= 0 ? "secondary" : "success"}
                                    outlined
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleOnNextClick}
                                    disabled={stepActiveIndex >= itemsMenuCount}
                                    severity={
                                        stepActiveIndex === deleteActiveIndex ||
                                        stepActiveIndex >= itemsMenuCount
                                            ? "secondary"
                                            : "success"
                                    }
                                    className='uppercase px-6 inventory__button'
                                    outlined
                                >
                                    Next
                                </Button>
                                {stepActiveIndex === deleteActiveIndex ? (
                                    <Button
                                        onClick={() =>
                                            deleteReason.length
                                                ? setConfirmDeleteVisible(true)
                                                : setAttemptedSubmit(true)
                                        }
                                        className='p-button uppercase px-6 inventory__button inventory__button--danger'
                                    >
                                        Delete
                                    </Button>
                                ) : (
                                    <Button
                                        className='uppercase px-6 inventory__button'
                                        onClick={handleSaveInventoryForm}
                                        severity={isFormChanged ? "success" : "secondary"}
                                        disabled={!isFormChanged}
                                    >
                                        Save
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {confirmQuitEditVisible ? (
                <ConfirmModal
                    visible={!!confirmQuitEditVisible}
                    position='top'
                    title='Quit Editing?'
                    icon='pi-exclamation-triangle'
                    bodyMessage={DIALOG_MESSAGES.QUIT}
                    confirmAction={confirmAction}
                    draggable={false}
                    rejectLabel='Cancel'
                    acceptLabel='Confirm'
                    resizable={false}
                    className='contact-confirm-dialog'
                    onHide={() => setConfirmQuitEditVisible(false)}
                />
            ) : (
                <ConfirmModal
                    visible={confirmDeleteVisible}
                    bodyMessage={DIALOG_MESSAGES.DELETE}
                    confirmAction={() => setIsDeleteConfirm(true)}
                    onHide={() => setConfirmDeleteVisible(false)}
                />
            )}
        </Suspense>
    );
});
