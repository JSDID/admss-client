import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { BorderedCheckbox } from "dashboard/common/form/inputs";
import { useStore } from "store/hooks";
import { ContactTypeNameList } from "common/models/contact";

export const DealGeneralSeller = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        deal: { salesperson1uid, salesperson2uid, differentSeller, differentSellerUID },
        changeDeal,
    } = store;
    return (
        <div className='grid deal-general-seller row-gap-2'>
            <div className='col-6'>
                <CompanySearch
                    value={salesperson1uid}
                    onChange={({ target: { value } }) =>
                        changeDeal({ key: "salesperson1uid", value })
                    }
                    onRowClick={(value) =>
                        changeDeal({
                            key: "salesperson1uid",
                            value,
                        })
                    }
                    name='Salesman 1'
                />
            </div>
            <div className='col-6'>
                <CompanySearch
                    value={salesperson2uid}
                    onChange={({ target: { value } }) =>
                        changeDeal({ key: "salesperson2uid", value })
                    }
                    onRowClick={(value) =>
                        changeDeal({
                            key: "salesperson2uid",
                            value,
                        })
                    }
                    name='Salesman 2'
                />
            </div>

            <hr className='col-12 form-line' />

            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!differentSeller}
                    onChange={() =>
                        changeDeal({ key: "differentSeller", value: !differentSeller ? 1 : 0 })
                    }
                    name='Different seller'
                />
            </div>
            {!!differentSeller && (
                <div className='col-6'>
                    <CompanySearch
                        name='Seller'
                        value={differentSellerUID}
                        onChange={({ target: { value } }) =>
                            changeDeal({ key: "differentSellerUID", value })
                        }
                        onRowClick={(value) =>
                            changeDeal({
                                key: "differentSellerUID",
                                value,
                            })
                        }
                        contactCategory={ContactTypeNameList.DEALERS}
                    />
                </div>
            )}
        </div>
    );
});
