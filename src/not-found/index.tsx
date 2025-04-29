import { ReactElement } from "react";
import { Card } from "primereact/card";
import image404 from "assets/images/404.svg";
import "./index.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { CONTACT_SUPPORT } from "common/constants/links";

export const NotFound = (): ReactElement => {
    const navigate = useNavigate();

    const handleGoBack = (): void => {
        navigate(-1);
    };
    const handleContactUs = (): void => {
        navigate(`/dashboard?${CONTACT_SUPPORT}`);
    };

    return (
        <Card className='not-found card'>
            <h2 className='not-found__warning'>OOPS!</h2>
            <img className='not-found__image' src={image404} alt='404' />
            <h3 className='not-found__info'>Page not found</h3>
            <p className='not-found__message'>The requested URL was not fount on this server</p>
            <div className='not-found__buttons'>
                <Button className='not-found__button' onClick={handleGoBack}>
                    Go back
                </Button>
                <Button className='not-found__button' onClick={handleContactUs}>
                    Contact us
                </Button>
            </div>
        </Card>
    );
};
