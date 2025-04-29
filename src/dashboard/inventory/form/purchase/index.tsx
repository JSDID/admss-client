import { AccordionItems, Inventory } from "dashboard/inventory/common";
import { lazy } from "react";

const PurchaseFloorplan = lazy(() =>
    import("./floorplan").then((module) => ({ default: module.PurchaseFloorplan }))
);
const PurchaseConsign = lazy(() =>
    import("./consign").then((module) => ({ default: module.PurchaseConsign }))
);
const PurchaseTitle = lazy(() =>
    import("./title").then((module) => ({ default: module.PurchaseTitle }))
);
const PurchasePurchases = lazy(() =>
    import("./purchases").then((module) => ({ default: module.PurchasePurchases }))
);
const PurchaseExpenses = lazy(() =>
    import("./expenses").then((module) => ({ default: module.PurchaseExpenses }))
);
const PurchasePayments = lazy(() =>
    import("./payments").then((module) => ({ default: module.PurchasePayments }))
);

export const InventoryPurchaseData: Pick<Inventory, "label" | "items"> = {
    label: "Purchase",
    items: [
        { itemLabel: AccordionItems.PURCHASES, component: <PurchasePurchases /> },
        { itemLabel: AccordionItems.PAYMENTS, component: <PurchasePayments /> },
        { itemLabel: AccordionItems.EXPENSES, component: <PurchaseExpenses /> },
        { itemLabel: AccordionItems.TITLE, component: <PurchaseTitle /> },
        { itemLabel: AccordionItems.FLOORPLAN, component: <PurchaseFloorplan /> },
        { itemLabel: AccordionItems.CONSIGN, component: <PurchaseConsign /> },
    ],
};
