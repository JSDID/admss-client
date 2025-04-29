import { Button } from "primereact/button";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { ReactElement } from "react";

/* eslint-disable jsx-a11y/anchor-is-valid */

export enum ContactAccordionItems {
    BUYER = "Buyer information",
    CO_BUYER = "Co-buyer information",
    CONTACTS = "Contacts",
    COMPANY = "Company/Workplace",
    PROSPECTING = "Prospecting and notes",
    DOCUMENTS = "Documents",
}

export interface ContactItem extends MenuItem {
    itemLabel: ContactAccordionItems;
    itemIndex?: number;
    component?: ReactElement;
}

export interface Contact {
    label: string;
    items: ContactItem[];
    sectionId: number;
    startIndex: number;
    getLength: () => number;
}

export class ContactSection implements Contact {
    private static instancesCount: number = 0;
    private static itemIndex: number = 0;
    public sectionId: number;
    public label: string;
    public startIndex: number = 0;
    public items: ContactItem[];

    public constructor({ label, items }: { label: string; items: ContactItem[] }) {
        this.sectionId = ++ContactSection.instancesCount;
        this.label = label;
        this.items = items.map(({ itemLabel, component }, index: number) => ({
            itemLabel,
            component,
            itemIndex: ContactSection.itemIndex++,
            template: (item: MenuItem, options: MenuItemOptions) => {
                return this.newTemplate(item, options, index);
            },
        }));
        this.startIndex = ContactSection.itemIndex - this.items.length;
    }

    private newTemplate(
        item: MenuItem,
        { props, onClick, className, labelClassName }: MenuItemOptions,
        index: number
    ): ReactElement {
        const isActive =
            (ContactSection.instancesCount > this.items.length || index <= props.activeIndex) &&
            props.activeIndex !== 0;

        return (
            <Button onClick={onClick} className={`${className} vertical-nav`}>
                <label
                    className={`vertical-nav__icon p-steps-number ${
                        isActive && "p-steps-number--green"
                    } border-circle`}
                />
                <span className={`${labelClassName} vertical-nav__label`}>{item.label}</span>
            </Button>
        );
    }

    public getLength(): number {
        return this.items.length;
    }

    public clearCount() {
        ContactSection.itemIndex = 0;
        ContactSection.instancesCount = 0;
    }
}
