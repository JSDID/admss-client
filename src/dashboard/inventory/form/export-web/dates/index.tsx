import { DateInput } from "dashboard/common/form/inputs";
import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import { useStore } from "store/hooks";

export const ExportWebDates = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const {
        inventoryExportWeb: { InStockDate, LastModifiedDate, LastExportDate },
        changeExportWeb,
    } = store;

    return (
        <div className='grid export-web-dates row-gap-2'>
            <div className='col-3'>
                <DateInput
                    date={InStockDate}
                    onChange={({ value }) =>
                        value && changeExportWeb({ key: "InStockDate", value: Number(value) })
                    }
                    name='In Stock Date'
                />
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <DateInput
                    date={LastModifiedDate}
                    onChange={({ value }) =>
                        value && changeExportWeb({ key: "LastModifiedDate", value: Number(value) })
                    }
                    name='Last Modified Date'
                />
            </div>
            <div className='col-3'>
                <DateInput
                    date={LastExportDate}
                    onChange={({ value }) =>
                        value && changeExportWeb({ key: "LastExportDate", value: Number(value) })
                    }
                    name='Last Export Date'
                />
            </div>
        </div>
    );
});
