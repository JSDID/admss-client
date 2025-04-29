import { Router as RemixRouter } from "@remix-run/router/dist/router";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import { ReactElement } from "react";
import App from "App";
import { Dashboard } from "dashboard";
import { Accounts } from "dashboard/accounts";
import { AccountsForm } from "dashboard/accounts/form";
import Contacts from "dashboard/contacts";
import { ContactForm } from "dashboard/contacts/form";
import { Deals } from "dashboard/deals";
import { DealsForm } from "dashboard/deals/form";
import { Home } from "dashboard/home";
import Inventory from "dashboard/inventory";
import { InventoryForm } from "dashboard/inventory/form";
import { SignIn } from "sign/sign-in";
import ProtectedRoute from "http/routes/ProtectedRoute";
import { GeneralSettings } from "dashboard/profile/generalSettings";
import { Reports } from "dashboard/reports";
import { ExportToWeb } from "dashboard/export-web";
import { ReportForm } from "dashboard/reports/form";
import { PrintForTestDrive } from "dashboard/test-drive";
import { AccountTakePayment } from "dashboard/accounts/take-payment-form";
import { Tasks } from "dashboard/tasks";
import { ErrorBoundary } from "http/routes/ErrorBoundary";
import { ToastProvider } from "dashboard/common/toast";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const AppRouter = (): ReactElement => {
    const routes = [
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorBoundary />,
            children: [
                { path: "", element: <SignIn /> },
                {
                    path: "dashboard",
                    element: <Dashboard />,
                    children: [
                        {
                            path: "",
                            element: (
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            ),
                        },
                        {
                            path: "test-drive",
                            element: (
                                <ProtectedRoute>
                                    <PrintForTestDrive />
                                </ProtectedRoute>
                            ),
                        },
                        {
                            path: "inventory",
                            element: (
                                <ProtectedRoute>
                                    <Outlet />
                                </ProtectedRoute>
                            ),
                            children: [
                                { path: "", element: <Inventory /> },
                                { path: "create", element: <InventoryForm /> },
                                { path: ":id", element: <InventoryForm /> },
                            ],
                        },
                        {
                            path: "contacts",
                            element: (
                                <ProtectedRoute notAllowed={["salesPerson"]}>
                                    <Outlet />
                                </ProtectedRoute>
                            ),
                            children: [
                                { path: "", element: <Contacts /> },
                                { path: "create", element: <ContactForm /> },
                                { path: ":id", element: <ContactForm /> },
                            ],
                        },
                        {
                            path: "deals",
                            element: (
                                <ProtectedRoute notAllowed={["salesPerson"]}>
                                    <Outlet />
                                </ProtectedRoute>
                            ),
                            children: [
                                { path: "", element: <Deals /> },
                                { path: "create", element: <DealsForm /> },
                                { path: ":id", element: <DealsForm /> },
                            ],
                        },
                        {
                            path: "accounts",
                            element: (
                                <ProtectedRoute notAllowed={["salesPerson"]}>
                                    <Outlet />
                                </ProtectedRoute>
                            ),
                            children: [
                                { path: "", element: <Accounts /> },
                                { path: "create", element: <AccountsForm /> },
                                { path: ":id", element: <AccountsForm /> },
                                { path: ":id/take-payment", element: <AccountTakePayment /> },
                            ],
                        },
                        {
                            path: "settings",
                            element: (
                                <ProtectedRoute notAllowed={["salesPerson"]}>
                                    <GeneralSettings />
                                </ProtectedRoute>
                            ),
                        },
                        {
                            path: "reports",
                            element: (
                                <ProtectedRoute notAllowed={["salesPerson"]}>
                                    <Outlet />
                                </ProtectedRoute>
                            ),
                            children: [
                                { path: "", element: <Reports /> },
                                { path: ":id", element: <ReportForm /> },
                                { path: "create", element: <ReportForm /> },
                            ],
                        },
                        {
                            path: "export-web",
                            element: (
                                <ProtectedRoute notAllowed={["salesPerson"]}>
                                    <ExportToWeb />
                                </ProtectedRoute>
                            ),
                        },
                        {
                            path: "tasks",
                            element: (
                                <ProtectedRoute notAllowed={["salesPerson"]}>
                                    <Outlet />
                                </ProtectedRoute>
                            ),
                            children: [{ path: "", element: <Tasks /> }],
                        },
                    ],
                },
            ],
        },
    ];

    const router: RemixRouter = createBrowserRouter(routes);

    return (
        <ToastProvider>
            <RouterProvider router={router} />
        </ToastProvider>
    );
};

root.render(<AppRouter />);
