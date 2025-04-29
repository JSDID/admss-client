import { Button } from "primereact/button";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { ReactElement } from "react";

export enum AccordionItems {
    GENERAL = "General",
    DESCRIPTION = "Description",
    OPTIONS = "Options",
    CHECKS = "Checklist",
    KEYS = "Keys",
    DISCLOSURES = "Disclosures",
    OTHER = "Other",
    FLOORPLAN = "Floorplan",
    CONSIGN = "Consign",
    TITLE = "Title",
    PURCHASES = "Purchases",
    EXPENSES = "Expenses",
    PAYMENTS = "Payments",
    PRICE = "Price and comments",
    DATES = "Dates",
    FUEL = "Fuel Economy",
    EXTRA = "Extra data",
    HISTORY = "History",
    IMAGES = "Images",
    VIDEO = "Video",
    AUDIO = "Audio",
    DOCUMENTS = "Documents",
    LINKS = "Links",
}

export interface InventoryItem extends MenuItem {
    itemLabel: AccordionItems | string;
    itemIndex?: number;
    component?: ReactElement;
}

export interface Inventory {
    label: string;
    items: InventoryItem[];
    sectionId: number;
    startIndex: number;
    getLength: () => number;
}

export class InventorySection implements Inventory {
    private static instancesCount: number = 0;
    private static itemIndex: number = 0;
    private _sectionId: number;
    private _label: string;
    private _startIndex: number = 0;
    private _items: InventoryItem[];

    public get sectionId(): number {
        return this._sectionId;
    }
    public get label(): string {
        return this._label;
    }
    public get items(): InventoryItem[] {
        return this._items;
    }
    public get startIndex(): number {
        return this._startIndex;
    }

    public constructor({ label, items }: { label: string; items: InventoryItem[] }) {
        this._sectionId = ++InventorySection.instancesCount;
        this._label = label;
        this._items = items.map(({ itemLabel, component }, index: number) => ({
            itemLabel,
            component,
            itemIndex: InventorySection.itemIndex++,
            template: (item: MenuItem, options: MenuItemOptions) => {
                return this.newTemplate(item, options, index);
            },
        }));
        this._startIndex = InventorySection.itemIndex - this.items.length;
    }

    private newTemplate(
        item: MenuItem,
        { props, onClick, className, labelClassName }: MenuItemOptions,
        index: number
    ): ReactElement {
        const isActive =
            (InventorySection.instancesCount > this.items.length || index <= props.activeIndex) &&
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

    public clearCount() {
        InventorySection.itemIndex = 0;
        InventorySection.instancesCount = 0;
    }

    public getLength(): number {
        return this.items.length;
    }
}
