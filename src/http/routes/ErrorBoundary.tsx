import { ReactElement } from "react";
import { useRouteError } from "react-router-dom";
import { NotFound } from "not-found";
import { useToast } from "dashboard/common/toast";
import { AxiosError } from "axios";
import { TOAST_LIFETIME } from "common/settings";

export const ErrorBoundary = (): ReactElement | null => {
    const error = useRouteError() as AxiosError;
    const toast = useToast();

    if (error?.status === 404 || error?.response?.status === 404) {
        return <NotFound />;
    }

    toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: String(error),
        life: TOAST_LIFETIME,
    });

    return null;
};
