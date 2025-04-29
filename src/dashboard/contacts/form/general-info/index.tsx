import { Contact, ContactAccordionItems } from "dashboard/contacts/common/step-navigation";
import { lazy } from "react";

const ContactsBuyerInfo = lazy(() =>
    import("./buyer-info").then((module) => ({ default: module.ContactsBuyerInfo }))
);
const ContactsCoBuyerInfo = lazy(() =>
    import("./co-buyer-info").then((module) => ({ default: module.ContactsCoBuyerInfo }))
);

export enum GENERAL_CONTACT_TYPE {
    BUYER = "buyer",
    CO_BUYER = "co-buyer",
}

export const BUYER_ID = 1;

export const generalBuyerInfo: Pick<Contact, "label" | "items"> = {
    label: "General information",
    items: [
        {
            itemLabel: ContactAccordionItems.BUYER,
            component: <ContactsBuyerInfo />,
        },
    ],
};

export const generalCoBuyerInfo: Pick<Contact, "label" | "items"> = {
    label: "General information",
    items: [
        {
            itemLabel: ContactAccordionItems.BUYER,
            component: <ContactsBuyerInfo />,
        },
        {
            itemLabel: ContactAccordionItems.CO_BUYER,
            component: <ContactsCoBuyerInfo />,
        },
    ],
};
