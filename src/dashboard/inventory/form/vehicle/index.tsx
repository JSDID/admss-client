import { AccordionItems, Inventory } from "dashboard/inventory/common";
import { lazy } from "react";

const VehicleGeneral = lazy(() =>
    import("./general").then((module) => ({ default: module.VehicleGeneral }))
);
const VehicleKeys = lazy(() =>
    import("./keys").then((module) => ({ default: module.VehicleKeys }))
);
const VehicleChecklist = lazy(() =>
    import("./checks").then((module) => ({ default: module.VehicleChecklist }))
);
const VehicleDescription = lazy(() =>
    import("./description").then((module) => ({ default: module.VehicleDescription }))
);
const VehicleDisclosures = lazy(() =>
    import("./disclosures").then((module) => ({ default: module.VehicleDisclosures }))
);
const VehicleOther = lazy(() =>
    import("./other").then((module) => ({ default: module.VehicleOther }))
);
const VehicleOptions = lazy(() =>
    import("./options").then((module) => ({ default: module.VehicleOptions }))
);

export const InventoryVehicleData: Pick<Inventory, "label" | "items"> = {
    label: "Vehicle",
    items: [
        { itemLabel: AccordionItems.GENERAL, component: <VehicleGeneral /> },
        { itemLabel: AccordionItems.DESCRIPTION, component: <VehicleDescription /> },
        { itemLabel: AccordionItems.OPTIONS, component: <VehicleOptions /> },
        { itemLabel: AccordionItems.CHECKS, component: <VehicleChecklist /> },
        { itemLabel: AccordionItems.KEYS, component: <VehicleKeys /> },
        { itemLabel: AccordionItems.DISCLOSURES, component: <VehicleDisclosures /> },
        { itemLabel: AccordionItems.OTHER, component: <VehicleOther /> },
    ],
};
