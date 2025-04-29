/* eslint-disable @typescript-eslint/no-unused-vars */
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { ReactElement, useMemo, useState } from "react";
import "./index.css";
import { useParams } from "react-router-dom";
import { checkContactOFAC } from "http/services/contacts-service";
import { ContactOFAC, OFAC_CHECK_STATUS } from "common/models/contact";
import { Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { BUYER_ID, GENERAL_CONTACT_TYPE } from "dashboard/contacts/form/general-info";
import {
    OFACCheckFailedLayout,
    OFACCheckPassedLayout,
} from "dashboard/contacts/form/general-info/tabs/ofac-check/ofac-layouts";
import { useStore } from "store/hooks";
import { ConfirmModal } from "dashboard/common/dialog/confirm";

interface ContactsOfacCheckProps {
    type?: GENERAL_CONTACT_TYPE.BUYER | GENERAL_CONTACT_TYPE.CO_BUYER;
}

export const ContactsOfacCheck = observer(({ type }: ContactsOfacCheckProps): ReactElement => {
    const { id } = useParams();
    const toast = useToast();
    const store = useStore().contactStore;
    const { contactOFAC, contact, contactFullInfo } = store;
    const [dialogShow, setDialogShow] = useState<boolean>(false);

    const isControlDisabled = useMemo(
        () => type === GENERAL_CONTACT_TYPE.CO_BUYER && contact.type !== BUYER_ID,
        [type, contact.type]
    );

    const handleOfacCheck = () => {
        checkContactOFAC(id, contactFullInfo).then((response) => {
            if (response?.status === Status.ERROR) {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: response.error,
                    life: TOAST_LIFETIME,
                });
            } else {
                const ofac = response as ContactOFAC;
                if (ofac?.check_status === OFAC_CHECK_STATUS.FAILED) {
                    setDialogShow(true);
                }
                store.contactOFAC = response as ContactOFAC;
            }
        });
    };

    return (
        <div className='grid ofac-check row-gap-2'>
            <div className='col-3 px-0'>
                <Button
                    label='Check'
                    className='ofac-check__button'
                    onClick={handleOfacCheck}
                    outlined
                    type='button'
                    disabled={isControlDisabled}
                />
            </div>

            <div className='col-12 ofac-check__field'>
                {contactOFAC.check_status === OFAC_CHECK_STATUS.PASSED && <OFACCheckPassedLayout />}
                {contactOFAC.check_status === OFAC_CHECK_STATUS.FAILED && (
                    <OFACCheckFailedLayout info={contactOFAC} />
                )}
            </div>
            {dialogShow && (
                <ConfirmModal
                    position='top'
                    icon='pi pi-exclamation-triangle'
                    title='OFAC match found!'
                    className='ofac-modal'
                    visible={dialogShow}
                    onHide={() => setDialogShow(false)}
                    acceptLabel='OK'
                    rejectClassName='hidden'
                    bodyMessage='Please visit the OFAC CHECK page for further details.'
                />
            )}
        </div>
    );
});
