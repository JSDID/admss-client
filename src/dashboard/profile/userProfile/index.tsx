import { DashboardDialog } from "dashboard/common/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { DialogProps } from "primereact/dialog";
import "./index.css";
import { AuthUser } from "http/services/auth.service";
import { Password } from "primereact/password";

interface UserProfileDialogProps extends DialogProps {
    authUser: AuthUser;
}

export const UserProfileDialog = ({
    visible,
    onHide,
    authUser,
}: UserProfileDialogProps): JSX.Element => {
    const [user, setUser] = useState<AuthUser>(authUser);
    const [newPassword, setNewPassword] = useState<boolean>(false);

    const handleSendSupportContact = (): void => {
        return;
    };

    const handleCloseDialog = () => {
        setNewPassword(false);
        onHide();
    };

    return (
        <DashboardDialog
            className='dialog__user-profile user-profile'
            footer='Save changes'
            header='My profile'
            visible={visible}
            onHide={handleCloseDialog}
            action={handleSendSupportContact}
        >
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>User name</div>
                <div className='profile-row__value'>{authUser.loginname}</div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Company name</div>
                <div className='profile-row__value'>
                    <InputText
                        placeholder='Company name'
                        value={user.companyname}
                        onChange={(event) =>
                            setUser((prev) => ({ ...prev, companyname: event.target.value }))
                        }
                    />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Location</div>
                <div className='profile-row__value'>
                    <InputText placeholder='Location' value={"Arizona"} onChange={(event) => {}} />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Address</div>
                <div className='profile-row__value'>
                    <InputText
                        placeholder='Address'
                        value={"40377 Cit Crest"}
                        onChange={(event) => {}}
                    />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Phone</div>
                <div className='profile-row__value'>
                    <InputText placeholder='Phone' value='536-587-1865' onChange={(event) => {}} />
                </div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Current password</div>
                <div className='profile-row__value'>
                    <Password
                        className='w-100'
                        value={"password"}
                        onChange={(e) => {}}
                        toggleMask
                    />
                </div>
            </div>
            {newPassword || (
                <div className='user-profile__row profile-row'>
                    <div className='profile__change-password' onClick={() => setNewPassword(true)}>
                        Change password
                    </div>
                </div>
            )}
            {newPassword && (
                <>
                    <div className='user-profile__row profile-row'>
                        <div className='profile-row__label'>New password</div>
                        <div className='profile-row__value'>
                            <Password
                                className='w-100'
                                value={""}
                                onChange={(e) => {}}
                                toggleMask
                            />
                        </div>
                    </div>
                    <div className='user-profile__row profile-row'>
                        <div className='profile-row__label'>Confirm password</div>
                        <div className='profile-row__value'>
                            <Password
                                className='w-100'
                                value={""}
                                onChange={(e) => {}}
                                toggleMask
                            />
                        </div>
                    </div>
                </>
            )}
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Next payment</div>
                <div className='profile-row__value'>16 of May, 2023</div>
            </div>
            <div className='user-profile__row profile-row'>
                <div className='profile-row__label'>Last login</div>
                <div className='profile-row__value'>04/26/2023 10:45:39 PM</div>
            </div>
        </DashboardDialog>
    );
};
