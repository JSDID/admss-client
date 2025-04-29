import { ReactElement } from "react";
import "./index.css";

interface LoaderProps {
    overlay?: boolean;
    size?: "default" | "large";
}

export const Loader = ({ overlay, size }: LoaderProps): ReactElement => {
    return (
        <div className={`loader-wrapper ${overlay && "loader-wrapper--overlay"}`}>
            <div className={`loader ${size ? `loader--${size}` : ""}`}></div>
            <div className='loader-text'>Loading, please wait...</div>
        </div>
    );
};
