import { LS_APP_USER } from "common/constants/localStorage";
import { BaseResponseError, Status } from "common/models/base-response";
import { ComboBox } from "dashboard/common/form/dropdown";
import { useToast } from "dashboard/common/toast";
import { AuthUser } from "http/services/auth.service";
import { deleteInventory, getInventoryDeleteReasonsList } from "http/services/inventory-service";
import { observer } from "mobx-react-lite";
import { DropdownProps } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getKeyValue } from "services/local-storage.service";
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
        const store = useStore().inventoryStore;

        const { deleteReason } = store;

        const [deleteReasonsList, setDeleteReasonsList] = useState<string[]>([]);
        const [comment, setComment] = useState<string>("");

        useEffect(() => {
            const authUser: AuthUser = getKeyValue(LS_APP_USER);
            if (authUser) {
                getInventoryDeleteReasonsList(authUser.useruid).then((res) => {
                    Array.isArray(res) && setDeleteReasonsList(res);
                });
            }
        }, []);

        const handleDeleteInventory = () => {
            if (id && deleteReason) {
                deleteInventory(id, { reason: deleteReason, comment }).then((response) => {
                    if (response?.status === Status.ERROR) {
                        const { error } = response as BaseResponseError;
                        toast.current?.show({
                            severity: "error",
                            summary: "Error",
                            detail: error || "Error while deleting inventory",
                        });
                    } else {
                        navigate("/dashboard/inventory");
                    }
                });
            }
        };

        useEffect(() => {
            if (isDeleteConfirm) {
                handleDeleteInventory();
            }
        }, [isDeleteConfirm]);

        return (
            <div className='inventory-form'>
                <div className='inventory-form__title inventory-form__title--danger uppercase'>
                    Delete inventory
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
