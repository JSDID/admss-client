import { AccordionItems, Inventory } from "dashboard/inventory/common";
import { lazy } from "react";

const ExportWebPrice = lazy(() =>
    import("./price").then((module) => ({ default: module.ExportWebPrice }))
);
const ExportWebDates = lazy(() =>
    import("./dates").then((module) => ({ default: module.ExportWebDates }))
);
const ExportWebLinks = lazy(() =>
    import("./links").then((module) => ({ default: module.ExportWebLinks }))
);
const ExportWebFuel = lazy(() =>
    import("./fuel").then((module) => ({ default: module.ExportWebFuel }))
);
const ExportWebExtra = lazy(() =>
    import("./extra").then((module) => ({ default: module.ExportWebExtra }))
);
const ExportWebHistory = lazy(() =>
    import("./history").then((module) => ({ default: module.ExportWebHistory }))
);

export const InventoryExportWebData: Pick<Inventory, "label" | "items"> = {
    label: "Export to WEB",
    items: [
        { itemLabel: AccordionItems.PRICE, component: <ExportWebPrice /> },
        { itemLabel: AccordionItems.DATES, component: <ExportWebDates /> },
        { itemLabel: AccordionItems.LINKS, component: <ExportWebLinks /> },
        { itemLabel: AccordionItems.FUEL, component: <ExportWebFuel /> },
        { itemLabel: AccordionItems.EXTRA, component: <ExportWebExtra /> },
        { itemLabel: AccordionItems.HISTORY, component: <ExportWebHistory /> },
    ],
};
