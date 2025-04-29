import { observer } from "mobx-react-lite";
import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement } from "react";
import "./index.css";
import { useStore } from "store/hooks";

export const ExportWebLinks = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const { inventoryExportWeb, changeExportWeb } = store;
    return (
        <div className='grid export-web-links row-gap-2'>
            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        value={inventoryExportWeb.VDPLink}
                        onChange={({ target: { value } }) =>
                            changeExportWeb({ key: "VDPLink", value })
                        }
                        className='w-full export-web-links__text-area'
                    />

                    <label className='float-label'>VDP Link</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        value={inventoryExportWeb.VideoURL}
                        onChange={({ target: { value } }) =>
                            changeExportWeb({ key: "VideoURL", value })
                        }
                        className='w-full export-web-links__text-area'
                    />

                    <label className='float-label'>Video URL</label>
                </span>
            </div>
            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        value={inventoryExportWeb.PhotoURL}
                        onChange={({ target: { value } }) =>
                            changeExportWeb({ key: "PhotoURL", value })
                        }
                        className='w-full export-web-links__text-area'
                    />

                    <label className='float-label'>Photo URL</label>
                </span>
            </div>
        </div>
    );
});
