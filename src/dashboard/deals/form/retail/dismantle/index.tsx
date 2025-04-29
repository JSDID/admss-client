import { BorderedCheckbox, DateInput } from "dashboard/common/form/inputs";
import { observer } from "mobx-react-lite";
import { InputText } from "primereact/inputtext";
import { ReactElement } from "react";
import { useStore } from "store/hooks";

export const DealDismantle = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        dealExtData: {
            DismantledDate,
            Dismntl_Sold_Engine,
            Dismntl_Sold_Engine_To,
            Dismntl_Sold_Transmission,
            Dismntl_Sold_Transmission_To,
            Dismntl_Sold_Body,
            Dismntl_Sold_Body_To,
            Dismntl_Sold_Frame,
            Dismntl_Sold_Frame_To,
            Dismntl_Sold_Other,
            Dismntl_Sold_Other_To,
        },
        changeDealExtData,
    } = store;
    return (
        <div className='grid deal-dismantle row-gap-2'>
            <div className='col-3'>
                <DateInput
                    name='Dismantled Date'
                    date={DismantledDate}
                    onChange={(date) =>
                        changeDealExtData({ key: "DismantledDate", value: String(date) })
                    }
                />
            </div>

            <div className='splitter col-12'>
                <h3 className='splitter__title m-0 pr-3'>Components sold</h3>
                <hr className='splitter__line flex-1' />
            </div>

            <div className='col-3'>
                <BorderedCheckbox
                    name='Engine'
                    checked={!!Dismntl_Sold_Engine}
                    onChange={() =>
                        changeDealExtData({
                            key: "Dismntl_Sold_Engine",
                            value: !Dismntl_Sold_Engine ? 1 : 0,
                        })
                    }
                />
            </div>
            <div className='col-9'>
                <span className='p-float-label'>
                    <InputText
                        value={Dismntl_Sold_Engine_To}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "Dismntl_Sold_Engine_To", value });
                        }}
                    />
                    <label className='float-label'>Comment</label>
                </span>
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!Dismntl_Sold_Transmission}
                    onChange={() => {
                        changeDealExtData({
                            key: "Dismntl_Sold_Transmission",
                            value: !Dismntl_Sold_Transmission ? 1 : 0,
                        });
                    }}
                    name='Transmission'
                />
            </div>
            <div className='col-9'>
                <span className='p-float-label'>
                    <InputText
                        value={Dismntl_Sold_Transmission_To}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "Dismntl_Sold_Transmission_To", value });
                        }}
                    />
                    <label className='float-label'>Comment</label>
                </span>
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!Dismntl_Sold_Body}
                    onChange={() => {
                        changeDealExtData({
                            key: "Dismntl_Sold_Body",
                            value: !Dismntl_Sold_Body ? 1 : 0,
                        });
                    }}
                    name='Body'
                />
            </div>
            <div className='col-9'>
                <span className='p-float-label'>
                    <InputText
                        value={Dismntl_Sold_Body_To}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "Dismntl_Sold_Body_To", value });
                        }}
                    />
                    <label className='float-label'>Comment</label>
                </span>
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!Dismntl_Sold_Frame}
                    onChange={() => {
                        changeDealExtData({
                            key: "Dismntl_Sold_Frame",
                            value: !Dismntl_Sold_Frame ? 1 : 0,
                        });
                    }}
                    name='Frame'
                />
            </div>
            <div className='col-9'>
                <span className='p-float-label'>
                    <InputText
                        value={Dismntl_Sold_Frame_To}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "Dismntl_Sold_Frame_To", value });
                        }}
                    />
                    <label className='float-label'>Comment</label>
                </span>
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!Dismntl_Sold_Other}
                    onChange={() => {
                        changeDealExtData({
                            key: "Dismntl_Sold_Other",
                            value: !Dismntl_Sold_Other ? 1 : 0,
                        });
                    }}
                    name='Other'
                />
            </div>
            <div className='col-9'>
                <span className='p-float-label'>
                    <InputText
                        value={Dismntl_Sold_Other_To}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "Dismntl_Sold_Other_To", value });
                        }}
                    />
                    <label className='float-label'>Comment</label>
                </span>
            </div>
        </div>
    );
});
