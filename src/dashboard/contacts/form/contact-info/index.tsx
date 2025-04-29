import { Contact, ContactAccordionItems } from "dashboard/contacts/common/step-navigation";
import { lazy } from "react";

const ContactsSocialInfo = lazy(() =>
    import("./contacts").then((module) => ({ default: module.ContactsSocialInfo }))
);
const ContactsWorkplace = lazy(() =>
    import("./workplace").then((module) => ({ default: module.ContactsWorkplace }))
);
const ContactsProspecting = lazy(() =>
    import("./prospecting").then((module) => ({ default: module.ContactsProspecting }))
);

const items = [
    { itemLabel: ContactAccordionItems.CONTACTS, component: <ContactsSocialInfo /> },
    { itemLabel: ContactAccordionItems.COMPANY, component: <ContactsWorkplace /> },
    { itemLabel: ContactAccordionItems.PROSPECTING, component: <ContactsProspecting /> },
];

export const ContactInfoData: Pick<Contact, "label" | "items"> = {
    label: `Contact Information`,
    items,
};
