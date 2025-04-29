import { Dialog } from "primereact/dialog";
import { SearchInput } from "dashboard/common/form/inputs";
import { QueryParams } from "common/models/query-params";
import { useState } from "react";
import { DropdownProps } from "primereact/dropdown";
import { useStore } from "store/hooks";
import { AccountInfo } from "common/models/accounts";
import { getAccountsList } from "http/services/accounts.service";
import { AccountsDataTable } from "dashboard/accounts";

const FIELD: keyof AccountInfo = "name";

interface AccountSearchProps extends DropdownProps {
    onRowClick?: (accountName: string) => void;
    returnedField?: keyof AccountInfo;
    getFullInfo?: (account: AccountInfo) => void;
}

export const AccountSearch = ({
    name,
    value,
    onRowClick,
    onChange,
    returnedField,
    getFullInfo,
    ...props
}: AccountSearchProps) => {
    const [options, setOptions] = useState<AccountInfo[]>([]);
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);

    const handleAccountInputChange = async (searchValue: string) => {
        if (!searchValue.trim()) {
            return;
        }
        const qry = returnedField ? `${searchValue}.${returnedField}` : `${searchValue}.${FIELD}`;
        const params: QueryParams = {
            qry,
        };
        const response = await getAccountsList(authUser!.useruid, params);

        if (Array.isArray(response)) {
            setOptions(response);
        } else {
            setOptions([]);
        }
    };

    const handleOnRowClick = (accountName: string) => {
        onRowClick && onRowClick(accountName);
        setDialogVisible(false);
    };

    const handleGetFullInfo = (account: AccountInfo) => {
        getFullInfo && getFullInfo(account);
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
                onInputChange={handleAccountInputChange}
                value={value}
                onChange={onChange}
                onIconClick={() => {
                    setDialogVisible(true);
                }}
                {...props}
            />
            <Dialog
                header={<div className='uppercase'>Choose an Account</div>}
                visible={dialogVisible}
                style={{ width: "75vw", height: "75vh" }}
                maximizable
                modal
                onHide={() => setDialogVisible(false)}
            >
                <AccountsDataTable
                    onRowClick={handleOnRowClick}
                    returnedField={returnedField}
                    getFullInfo={handleGetFullInfo}
                />
            </Dialog>
        </>
    );
};
