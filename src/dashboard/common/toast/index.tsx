import { Toast } from "primereact/toast";
import { ReactElement, ReactNode, createContext, useContext, useRef } from "react";
import "./index.css";
const ToastContext = createContext<React.RefObject<Toast> | null>(null);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps): ReactElement => {
    const toast = useRef<Toast>(null);
    return (
        <ToastContext.Provider value={toast}>
            {children}
            <Toast ref={toast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === null) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
