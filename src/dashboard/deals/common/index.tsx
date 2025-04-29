import { Button } from "primereact/button";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { ReactElement } from "react";

export interface DealsItem extends MenuItem {
    itemLabel: string;
    itemIndex?: number;
    component?: ReactElement;
}

export interface Deals {
    label: string;
    items: DealsItem[];
    sectionId: number;
    startIndex: number;
    getLength: () => number;
}

export enum AccordionDealItems {
    SALE = "Sale",
    ODOMETER = "Odometer Disclosure",
    SELLER = "Seller",
    LIENS = "Liens",
    FIRST_TRADE = "Trade 1",
    SECOND_TRADE = "Trade 2",
    TAG = "Tag",
    INSURANCE = "Insurance",
    CHARGES = "Insurance Charges",
    PRODUCTS = "F&I products",
    FINANCES = "Finances",
    PICKUP = "Pickup payments",
    CONTRACT = "Contract Printing",
    LHPH = "LHPH",
    BHPH = "BHPH",
    DISMANTLE = "Dismantle",
}

export class DealsSection implements Deals {
    private static instancesCount: number = 0;
    private static itemIndex: number = 0;
    private _sectionId: number;
    private _label: string;
    private _startIndex: number = 0;
    private _items: DealsItem[];

    public get sectionId(): number {
        return this._sectionId;
    }
    public get label(): string {
        return this._label;
    }
    public get items(): DealsItem[] {
        return this._items;
    }
    public get startIndex(): number {
        return this._startIndex;
    }

    public constructor({ label, items }: { label: string; items: DealsItem[] }) {
        this._sectionId = ++DealsSection.instancesCount;
        this._label = label;
        this._items = items.map(({ itemLabel, component }, index: number) => ({
            itemLabel,
            component,
            itemIndex: DealsSection.itemIndex++,
            template: (item: MenuItem, options: MenuItemOptions) => {
                return this.newTemplate(item, options, index);
            },
        }));
        this._startIndex = DealsSection.itemIndex - this.items.length;
    }

    private newTemplate(
        item: MenuItem,
        { props, onClick, className, labelClassName }: MenuItemOptions,
        index: number
    ): ReactElement {
        const isActive =
            (DealsSection.instancesCount > this.items.length || index <= props.activeIndex) &&
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
        DealsSection.itemIndex = 0;
        DealsSection.instancesCount = 0;
    }

    public getLength(): number {
        return this.items.length;
    }
}
