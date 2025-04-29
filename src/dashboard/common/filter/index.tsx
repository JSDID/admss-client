import { ExportWebList } from "common/models/export-web";
import { Inventory } from "common/models/inventory";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { ReactElement, useState } from "react";

export interface FilterOptions {
    label: string;
    value: string;
    column?: keyof Inventory | keyof ExportWebList | "Misc";
    bold?: boolean;
    disabled?: boolean;
}

export const filterOptions: FilterOptions[] = [
    { label: "Status", value: "status", bold: true, disabled: true },
    { label: "All", value: "all", column: "Status" },
    { label: "Current (not sold)", column: "Status", value: "current" },
    { label: "Sold", column: "Status", value: "sold" },
    { label: "Age", value: "age", bold: true, disabled: true },
    { label: "0 to 30 days", column: "Age", value: "0-30" },
    { label: "31 to 60 days", column: "Age", value: "31-60" },
    { label: "61 to 90 days", column: "Age", value: "61-90" },
    { label: "90+ days", column: "Age", value: "over90" },
    { label: "Body", value: "body", bold: true, disabled: true },
    { label: "Trucks", column: "BodyStyle", value: "trucks" },
    { label: "SUVs", column: "BodyStyle", value: "suv" },
    { label: "Sedans", column: "BodyStyle", value: "sedans" },
    { label: "Coupes", column: "BodyStyle", value: "coupes" },
    { label: "Convertibles", column: "BodyStyle", value: "convertibles" },
    { label: "Miles", value: "miles", bold: true, disabled: true },
    { label: "0 to 30000", column: "mileage", value: "0-30000" },
    { label: "30000 to 100000", column: "mileage", value: "30000-100000" },
    { label: "over 100000", column: "mileage", value: "over100000" },
    { label: "Audit", value: "audit", bold: true, disabled: true },
    { label: "Data needs update", column: "Audit", value: "needsUpdatedata" },
    { label: "Just arrived (today)", column: "Audit", value: "arrivedToday" },
    { label: "Needs cleaning", column: "Audit", value: "needsCleaning" },
    { label: "Ready for sale", column: "Audit", value: "readySale" },
    { label: "Needs inspection", column: "Audit", value: "needsInspection" },
    { label: "Needs oil changes", column: "Audit", value: "needsOil" },
    { label: "Floorplanned", column: "Audit", value: "floorplanned" },
    { label: "Keys missing", column: "Audit", value: "keysMissing" },
    { label: "Title missing", column: "Audit", value: "titleMissing" },
    { label: "Not paid", column: "Audit", value: "notPaid" },
    // TODO: missed misc column
    { label: "Misc", column: "Misc", value: "misc", bold: true, disabled: true },
    { label: "AWD", column: "Misc", value: "awd" },
    { label: "Manual Transmission", column: "Misc", value: "manual" },
    { label: "Diesel", column: "Misc", value: "diesel" },
    { label: "Fuel economy", column: "Misc", value: "fuelEconomy" },
    { label: "Electric", column: "Misc", value: "electric" },
];

interface TableFilterProps {
    filterOptions: FilterOptions[];
    onFilterChange: (selectedFilter: FilterOptions[]) => void;
    onClearFilters: () => void;
}

export const TableFilter = ({
    filterOptions,
    onFilterChange,
    onClearFilters,
}: TableFilterProps): ReactElement => {
    const [selectedFilter, setSelectedFilter] = useState<FilterOptions[]>([]);

    const dropdownHeaderPanel = (
        <div className='dropdown-header flex pb-1'>
            <label className='cursor-pointer dropdown-header__label'>
                <Checkbox
                    checked={
                        filterOptions.filter((option) => !option.disabled).length ===
                        selectedFilter.length
                    }
                    onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedFilter(
                            isChecked
                                ? filterOptions.map((option) => ({
                                      value: option.value,
                                      label: option.label,
                                  }))
                                : []
                        );
                        onFilterChange(isChecked ? filterOptions : []);
                    }}
                    className='dropdown-header__checkbox mr-2'
                />
                Select All
            </label>
            <button
                className='p-multiselect-close p-link'
                onClick={() => {
                    setSelectedFilter([]);
                    onClearFilters();
                }}
            >
                <i className='pi pi-times' />
            </button>
        </div>
    );

    return (
        <MultiSelect
            optionValue='value'
            optionLabel='label'
            options={filterOptions}
            value={selectedFilter}
            onChange={({ value }: MultiSelectChangeEvent) => {
                setSelectedFilter(value);
                onFilterChange(value);
            }}
            placeholder='Filter'
            className='w-full pb-0 h-full flex align-items-center inventory-filter'
            display='chip'
            selectedItemsLabel='Clear Filter'
            panelHeaderTemplate={dropdownHeaderPanel}
            pt={{
                header: {
                    className: "inventory-filter__header",
                },
                wrapper: {
                    className: "inventory-filter__wrapper",
                    style: {
                        maxHeight: "500px",
                    },
                },
            }}
        />
    );
};
