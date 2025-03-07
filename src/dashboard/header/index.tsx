import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import logo from "assets/images/logo_with_title.svg";
import userCabinet from "assets/images/icons/header/user-cabinet.svg";
import { AuthUser, logout } from "http/services/auth.service";
import { useLocation, useNavigate } from "react-router-dom";
import { localStorageClear } from "services/local-storage.service";
import { LS_APP_USER } from "common/constants/localStorage";
import { SupportContactDialog } from "dashboard/profile/supportContact";
import { SupportHistoryDialog } from "dashboard/profile/supportHistory";
import { UserProfileDialog } from "dashboard/profile/userProfile";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { getExtendedData } from "http/services/auth-user.service";
import { CONTACT_SUPPORT, HELP_PAGE } from "common/constants/links";

export const Header = observer((): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const menuRight = useRef<Menu>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [supportContact, setSupportContact] = useState<boolean>(
        new URLSearchParams(location.search).has(CONTACT_SUPPORT)
    );
    const [supportHistory, setSupportHistory] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<boolean>(false);
    const [showChangeLocation, setShowChangeLocation] = useState<boolean>(false);

    const [isSalesPerson, setIsSalesPerson] = useState(true);
    useEffect(() => {
        if (authUser && Object.keys(authUser.permissions).length) {
            getExtendedData(authUser.useruid).then((response) => {
                if (response && response.locations && response.locations.length > 1) {
                    setShowChangeLocation(true);
                }
            });
            const { permissions } = authUser;
            const { uaSalesPerson, ...otherPermissions } = permissions;
            if (Object.values(otherPermissions).some((permission) => permission === 1)) {
                return setIsSalesPerson(false);
            }
            if (!!uaSalesPerson) setIsSalesPerson(true);
        }
    }, [authUser]);

    const signOut = ({ useruid }: AuthUser) => {
        logout(useruid).finally(() => {
            localStorageClear(LS_APP_USER);
            navigate("/");
        });
    };

    const removeSupportHistoryParam = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete(CONTACT_SUPPORT);
        navigate({ search: searchParams.toString() }, { replace: true });
    };

    const menuItems = useMemo(
        () =>
            [
                {
                    label: "My Profile",
                    command() {
                        setUserProfile(true);
                    },
                },
                !isSalesPerson
                    ? { label: "General Settings", command: () => navigate("settings") }
                    : null,
                { separator: true },
                showChangeLocation ? { label: "Change Location" } : null,
                { label: "Users" },
                { separator: true },
                {
                    label: "Contact support",
                    command() {
                        setSupportContact(true);
                    },
                },
                {
                    label: "Support history",
                    command() {
                        setSupportHistory(true);
                    },
                },
                {
                    label: "Help",
                    command() {
                        window.open(HELP_PAGE, "_blank");
                    },
                },
                { separator: true },
                {
                    label: "Logout",
                    command() {
                        authUser && signOut(authUser);
                    },
                },
            ].filter(Boolean) as MenuItem[],
        [authUser, isSalesPerson, showChangeLocation]
    );

    if (menuRight) {
        return (
            <header className='header'>
                <img src={logo} alt='ADMSS' className='header__logo' />

                <div className='header__content'>
                    <div className='header__info'>
                        <span className='header__name'>{authUser?.loginname}</span>

                        <span className='header__location'>{authUser?.locationname}</span>
                    </div>

                    <div className='header__menu'>
                        <Menu model={menuItems} popup ref={menuRight} popupAlignment='right' />
                        <img
                            className='header__icon'
                            onClick={(event) => menuRight?.current?.toggle(event)}
                            src={userCabinet}
                            alt='User cabinet'
                        />
                    </div>
                </div>
                {authUser && (
                    <>
                        <UserProfileDialog
                            onHide={() => setUserProfile(false)}
                            visible={userProfile}
                            authUser={authUser}
                        />
                        <SupportContactDialog
                            onHide={() => {
                                setSupportContact(false);
                                removeSupportHistoryParam();
                            }}
                            visible={supportContact}
                        />
                        <SupportHistoryDialog
                            onHide={() => setSupportHistory(false)}
                            visible={supportHistory}
                        />
                    </>
                )}
            </header>
        );
    }
    return <></>;
});
