import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { ReactElement, ReactNode, useEffect, useState, Suspense } from "react";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { getUserPermissions } from "http/services/auth-user.service";
import { getKeyValue } from "services/local-storage.service";
import { LS_APP_USER } from "common/constants/localStorage";
import { UserPermissionsResponse } from "common/models/user";
import { Loader } from "dashboard/common/loader";
import { createApiDashboardInstance } from "http/index";
import { AuthUser } from "http/services/auth.service";

interface UserRoles {
    admin: boolean;
    localAdmin: boolean;
    manager: boolean;
    salesPerson: boolean;
}

interface ProtectedRouteProps {
    notAllowed?: (keyof UserRoles)[];
    children?: ReactNode;
}

const ProtectedRoute = observer(({ notAllowed, children }: ProtectedRouteProps): ReactElement => {
    const store = useStore().userStore;
    const navigate = useNavigate();
    const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const authUser = getKeyValue(LS_APP_USER);
    useEffect(() => {
        if (authUser) {
            store.storedUser = authUser as AuthUser;
            createApiDashboardInstance(navigate);
            getUserPermissions(authUser.useruid).then((response) => {
                setIsLoading(false);
                if (!response) return setHasRequiredRole(false);
                store.userPermissions = response as UserPermissionsResponse;
                const { uaSalesPerson, ...otherPermissions } = response;
                if (!!uaSalesPerson) return setHasRequiredRole(false);
                if (Object.values(otherPermissions).some((permission) => permission === 1)) {
                    return setHasRequiredRole(true);
                } else if (!!uaSalesPerson) setHasRequiredRole(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <Loader overlay />;
    }

    if (!authUser) {
        return <Navigate to='/' replace />;
    }
    if (!hasRequiredRole && notAllowed) {
        return <Navigate to='/dashboard' replace />;
    }

    return (
        <Suspense fallback={<Loader overlay />}>{children ? <>{children}</> : <Outlet />}</Suspense>
    );
});

export default ProtectedRoute;
