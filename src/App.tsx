import { Loader } from "dashboard/common/loader";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { store } from "store";
import { StoreContext } from "store/context";

export default function App() {
    return (
        <StoreContext.Provider value={store}>
            <Suspense fallback={<Loader overlay />}>
                <Outlet />
            </Suspense>
        </StoreContext.Provider>
    );
}
