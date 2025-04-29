import { Dialog } from "primereact/dialog";
import { SearchInput } from "dashboard/common/form/inputs";
import { QueryParams } from "common/models/query-params";
import { useState } from "react";
import { DropdownProps } from "primereact/dropdown";
import { Deal } from "common/models/deals";
import { useStore } from "store/hooks";
import { DealsDataTable } from "dashboard/deals";
import { getDealsList } from "http/services/deals.service";

const FIELD: keyof Deal = "contactinfo";

interface DealSearchProps extends DropdownProps {
    onRowClick?: (dealName: string) => void;
    originalPath?: string;
    returnedField?: keyof Deal;
    getFullInfo?: (deal: Deal) => void;
}

export const DealSearch = ({
    name,
    value,
    onRowClick,
    onChange,
    originalPath,
    returnedField,
    getFullInfo,
    ...props
}: DealSearchProps) => {
    const [options, setOptions] = useState<Deal[]>([]);
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);

    const handleDealInputChange = async (searchValue: string) => {
        if (!searchValue.trim()) {
            return;
        }
        const qry = returnedField ? `${searchValue}.${returnedField}` : `${searchValue}.${FIELD}`;
        const params: QueryParams = {
            qry,
        };
        const response = await getDealsList(authUser!.useruid, params);

        if (Array.isArray(response)) {
            setOptions(response);
        } else {
            setOptions([]);
        }
    };

    const handleOnRowClick = (dealName: string) => {
        onRowClick && onRowClick(dealName);
        setDialogVisible(false);
    };

    const handleGetFullInfo = (deal: Deal) => {
        getFullInfo && getFullInfo(deal);
        setDialogVisible(false);
    };

    return (
        <>
            <SearchInput
                name={name}
                title={name}
                optionValue={returnedField || FIELD}
                optionLabel={FIELD}
                options={options}
                onInputChange={handleDealInputChange}
                value={value}
                onChange={onChange}
                onIconClick={() => {
                    setDialogVisible(true);
                }}
                {...props}
            />
            <Dialog
                header={<div className='uppercase'>Choose a Deal</div>}
                visible={dialogVisible}
                style={{ width: "75vw", height: "75vh" }}
                maximizable
                modal
                onHide={() => setDialogVisible(false)}
            >
                <DealsDataTable
                    onRowClick={handleOnRowClick}
                    originalPath={originalPath}
                    returnedField={returnedField}
                    getFullInfo={handleGetFullInfo}
                />
            </Dialog>
        </>
    );
};
