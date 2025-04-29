import { Dialog } from "primereact/dialog";
import { SearchInput } from "dashboard/common/form/inputs";
import { LS_APP_USER } from "common/constants/localStorage";
import { ContactType, ContactTypeNameList, ContactUser } from "common/models/contact";
import { QueryParams } from "common/models/query-params";
import { AuthUser } from "http/services/auth.service";
import { getContacts, getContactsTypeList } from "http/services/contacts-service";
import { useState, useEffect } from "react";
import { getKeyValue } from "services/local-storage.service";
import { DropdownProps } from "primereact/dropdown";
import { ContactsDataTable } from "dashboard/contacts";

const FIELD: keyof ContactUser = "companyName";

interface CompanySearchProps extends DropdownProps {
    onRowClick?: (companyName: string) => void;
    contactCategory?: ContactTypeNameList | string;
    originalPath?: string;
    returnedField?: keyof ContactUser;
    getFullInfo?: (contact: ContactUser) => void;
}

export const CompanySearch = ({
    name,
    value,
    onRowClick,
    contactCategory,
    onChange,
    originalPath,
    returnedField,
    getFullInfo,
    ...props
}: CompanySearchProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [options, setOptions] = useState<ContactUser[]>([]);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [currentCategory, setCurrentCategory] = useState<number>();

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        setUser(authUser);
        if (contactCategory) {
            getContactsTypeList("0").then((response) => {
                if (response) {
                    const types = response as ContactType[];
                    const category = types?.find((item) => item.name === contactCategory)?.id;
                    setCurrentCategory(category);
                }
            });
        }
    }, []);

    const handleCompanyInputChange = (searchValue: string): void => {
        if (!searchValue.trim()) {
            return;
        }
        const qry = returnedField ? `${searchValue}.${returnedField}` : `${searchValue}.${FIELD}`;
        const params: QueryParams = {
            qry,
            ...(currentCategory && { param: currentCategory }),
        };
        user &&
            getContacts(user.useruid, params).then((response) => {
                if (response?.length) {
                    setOptions(response);
                } else {
                    setOptions([]);
                }
            });
    };

    const handleOnRowClick = (companyName: string) => {
        onRowClick && onRowClick(companyName);
        setDialogVisible(false);
    };

    const handleGetFullInfo = (contact: ContactUser) => {
        getFullInfo && getFullInfo(contact);
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
                onInputChange={handleCompanyInputChange}
                value={value}
                onChange={onChange}
                onIconClick={() => {
                    setDialogVisible(true);
                }}
                {...props}
            />
            <Dialog
                header={<div className='uppercase'>Choose a Contact</div>}
                visible={dialogVisible}
                style={{ width: "75vw", height: "75vh" }}
                maximizable
                modal
                onHide={() => setDialogVisible(false)}
            >
                <ContactsDataTable
                    onRowClick={handleOnRowClick}
                    contactCategory={contactCategory}
                    originalPath={originalPath}
                    returnedField={returnedField}
                    getFullInfo={handleGetFullInfo}
                />
            </Dialog>
        </>
    );
};
