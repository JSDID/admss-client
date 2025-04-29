import { ListData } from "common/models";
import { TOAST_LIFETIME } from "common/settings";
import { ComboBox } from "dashboard/common/form/dropdown";
import { useToast } from "dashboard/common/toast";
import { deleteContact, getContactDeleteReasonsList } from "http/services/contacts-service";
import { observer } from "mobx-react-lite";
import { DropdownProps } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "store/hooks";

interface DeleteFormProps extends DropdownProps {
    isDeleteConfirm: boolean;
    attemptedSubmit?: boolean;
}

export const DeleteForm = observer(
    ({ isDeleteConfirm, attemptedSubmit }: DeleteFormProps): ReactElement => {
        const toast = useToast();
        const navigate = useNavigate();
        const { id } = useParams();
        const store = useStore().contactStore;
        const userStore = useStore().userStore;
        const { authUser } = userStore;

        const { deleteReason } = store;

        const [deleteReasonsList, setDeleteReasonsList] = useState<ListData[]>([]);
        const [comment, setComment] = useState<string>("");

        useEffect(() => {
            getContactDeleteReasonsList(authUser!.useruid).then((res) => {
                Array.isArray(res) && setDeleteReasonsList(res);
            });
        }, []);

        const handleDeleteContact = async () => {
            if (id && deleteReason) {
                const res = await deleteContact(id, { reason: deleteReason, comment });

                if (!res) {
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Error while deleting contact",
                        life: TOAST_LIFETIME,
                    });
                    return;
                }

                if (res?.error) {
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: res?.error,
                        life: TOAST_LIFETIME,
                    });
                } else {
                    navigate("/dashboard/contacts");
                }
            }
        };

        useEffect(() => {
            if (isDeleteConfirm) {
                handleDeleteContact();
            }
        }, [isDeleteConfirm]);

        return (
            <div className='contact-form col-12'>
                <div className='contact-form__title contact-form__title--danger uppercase'>
                    Delete contact
                </div>
                <div className='grid'>
                    <div className='col-6 relative'>
                        <ComboBox
                            optionLabel='name'
                            optionValue='name'
                            value={deleteReason}
                            required
                            onChange={({ value }) => {
                                store.deleteReason = value;
                            }}
                            options={deleteReasonsList}
                            className={`w-full vehicle-general__dropdown ${
                                attemptedSubmit && !deleteReason ? "p-invalid" : ""
                            }`}
                            label='Reason (required)'
                        />
                        {attemptedSubmit && !deleteReason && (
                            <small className='p-error'>Data is required</small>
                        )}
                    </div>
                    <div className='col-12'>
                        <span className='p-float-label'>
                            <InputTextarea
                                className='w-full'
                                value={comment}
                                pt={{
                                    root: {
                                        style: {
                                            height: "110px",
                                        },
                                    },
                                }}
                                onChange={({ target: { value } }) => {
                                    setComment(value);
                                }}
                            />
                            <label className='float-label'>Comment</label>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
);
