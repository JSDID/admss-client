import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { BorderedCheckbox, DashboardRadio, DateInput } from "dashboard/common/form/inputs";
import { InputText } from "primereact/inputtext";
import { useStore } from "store/hooks";

const tagTopRadio = [
    { name: "titleonly", title: "Title Only", value: "0" },
    { name: "newplates", title: "New Plates", value: "1" },
];

const tagBottomRadio = [
    { name: "transfer", title: "Plate transfered", value: "0" },
    { name: "exchanged", title: "Exchanged Plate", value: "1" },
    { name: "replaced", title: "Replaced Plate", value: "2" },
];

export const DealRetailTag = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        dealExtData: {
            Transferred_Plate_Number,
            Transferred_Expiration_Date,
            Exchanged_Plate_Number,
            Replaced_Plate_Number,
            TempTagDate,
            TempTagNumber,
            Class_of_License,
            Plate_Issued,
            Title_Only,
            Title_and_License,
            Plate_Transferred,
            Exchanged_Plates,
            Replace_Plate,
            Plate_Number,
            Plate_Issue_Date,
        },
        changeDealExtData,
    } = store;
    return (
        <div className='grid deal-retail-tag row-gap-2'>
            <div className='col-6'>
                <DashboardRadio
                    radioArray={tagTopRadio}
                    onChange={(value) => {
                        if (value === "0") {
                            changeDealExtData({ key: "Title_Only", value: 1 });
                            changeDealExtData({ key: "Title_and_License", value: 0 });
                        } else {
                            changeDealExtData({ key: "Title_Only", value: 0 });
                            changeDealExtData({ key: "Title_and_License", value: 1 });
                        }
                    }}
                    initialValue={
                        !Title_Only && !Title_and_License ? "1" : Title_Only === 1 ? "0" : "1"
                    }
                    style={{ width: `${95 / tagTopRadio.length}%` }}
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='deal-odometer__text-input w-full'
                        value={Class_of_License}
                        disabled={!Title_and_License}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "Class_of_License", value })
                        }
                    />
                    <label className='float-label'>Class of License</label>
                </span>
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!Plate_Issued}
                    disabled={!Title_and_License}
                    onChange={() =>
                        changeDealExtData({ key: "Plate_Issued", value: !Plate_Issued ? 1 : 0 })
                    }
                    name='Were Plates Issued?'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='deal-odometer__text-input w-full'
                        value={Plate_Number}
                        disabled={!Title_and_License}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "Plate_Number", value })
                        }
                    />
                    <label className='float-label'>Plate#</label>
                </span>
            </div>

            <div className='col-3'>
                <DateInput
                    name='Issue Date'
                    date={Number(Transferred_Expiration_Date)}
                    emptyDate
                    disabled={!Title_and_License}
                    onChange={({ value }) =>
                        changeDealExtData({
                            key: "Transferred_Expiration_Date",
                            value: Number(value),
                        })
                    }
                />
            </div>

            <hr className='col-12 form-line' />

            <div className='col-3'>
                <DashboardRadio
                    radioArray={tagBottomRadio}
                    style={{ width: `100%` }}
                    disabled={!Title_and_License}
                    initialValue={
                        Plate_Transferred === 1 ? "0" : Exchanged_Plates === 1 ? "1" : null
                    }
                    onChange={(value) => {
                        changeDealExtData({ key: "Plate_Transferred", value: 0 });
                        changeDealExtData({ key: "Exchanged_Plates", value: 0 });
                        changeDealExtData({ key: "Replace_Plate", value: 0 });
                        switch (value) {
                            case "0":
                                changeDealExtData({ key: "Plate_Transferred", value: 1 });
                                break;
                            case "1":
                                changeDealExtData({ key: "Exchanged_Plates", value: 1 });
                                break;
                            case "2":
                                changeDealExtData({ key: "Replace_Plate", value: 1 });
                                break;
                            default:
                                break;
                        }
                    }}
                />
            </div>
            <div className='col-3'>
                <div className='grid'>
                    <div className='col-12'>
                        <span className='p-float-label'>
                            <InputText
                                className='deal-odometer__text-input w-full'
                                disabled={!Plate_Transferred || !Title_and_License}
                                value={!Plate_Transferred ? "" : Transferred_Plate_Number}
                                onChange={({ target: { value } }) =>
                                    changeDealExtData({ key: "Transferred_Plate_Number", value })
                                }
                            />
                            <label className='float-label'>Plate#</label>
                        </span>
                    </div>
                    <div className='col-12'>
                        <span className='p-float-label'>
                            <InputText
                                className='deal-odometer__text-input w-full'
                                disabled={!Exchanged_Plates || !Title_and_License}
                                value={!Exchanged_Plates ? "" : Exchanged_Plate_Number}
                                onChange={({ target: { value } }) =>
                                    changeDealExtData({ key: "Exchanged_Plate_Number", value })
                                }
                            />
                            <label className='float-label'>Plate#</label>
                        </span>
                    </div>
                    <div className='col-12'>
                        <span className='p-float-label'>
                            <InputText
                                className='deal-odometer__text-input w-full'
                                disabled={!Replace_Plate || !Title_and_License}
                                value={!Replace_Plate ? "" : Replaced_Plate_Number}
                                onChange={({ target: { value } }) =>
                                    changeDealExtData({ key: "Replaced_Plate_Number", value })
                                }
                            />
                            <label className='float-label'>Plate#</label>
                        </span>
                    </div>
                </div>
            </div>
            <div className='col-3'>
                <DateInput
                    name='Expiration Date'
                    date={Number(Plate_Issue_Date)}
                    disabled={!Title_and_License}
                    emptyDate
                    onChange={({ value }) =>
                        changeDealExtData({
                            key: "Plate_Issue_Date",
                            value: Number(value),
                        })
                    }
                />
            </div>

            <hr className='col-12 form-line' />

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='deal-odometer__text-input w-full'
                        value={TempTagNumber}
                        disabled={!Title_and_License}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "TempTagNumber", value })
                        }
                    />
                    <label className='float-label'>Temp Marker Number</label>
                </span>
            </div>
            <div className='col-3'>
                <DateInput
                    name='Date'
                    date={TempTagDate}
                    disabled={!Title_and_License}
                    emptyDate
                    onChange={({ value }) =>
                        changeDealExtData({ key: "TempTagDate", value: Number(value) })
                    }
                />
            </div>
        </div>
    );
});
