import { ContactOFAC } from "common/models/contact";
import { useState, useRef, useEffect } from "react";

const AdaptiveDivider = ({ divideSymbol = "=" }: { divideSymbol?: string }) => {
    const [count, setCount] = useState(0);
    const dividerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateDivider = () => {
            if (dividerRef.current) {
                const width = dividerRef.current.offsetWidth;
                const fontSize = parseInt(getComputedStyle(dividerRef.current).fontSize);
                const charWidth = fontSize * 0.5;
                const newCount = Math.floor(width / charWidth);
                setCount(newCount);
            }
        };

        updateDivider();
        window.addEventListener("resize", updateDivider);
        return () => {
            window.removeEventListener("resize", updateDivider);
        };
    }, []);

    return (
        <div ref={dividerRef} className='ofac-check__divider'>
            {divideSymbol.repeat(count)}
        </div>
    );
};

const OFACCheckNotice = () => {
    return (
        <div className='ofac-check__notice-section mt-4'>
            NOTICE: This check performs a straight text comparison and will not work correctly if
            the subject's name is not spelled correctly. This check comes with no warranty either
            express or implied. Consider a third party service such as provided by Integra Systems
            for an advanced search that may yield better results and fewer false positives.
        </div>
    );
};

export const OFACCheckPassedLayout = () => {
    return (
        <div className='ofac-check__container'>
            <h4 className='ofac-check__title'>No matches found!</h4>

            <OFACCheckNotice />
        </div>
    );
};

export const OFACCheckFailedLayout = ({ info }: { info: ContactOFAC }) => {
    return (
        <div className='ofac-check__container'>
            <div className='mb-3 ofac-info'>
                <AdaptiveDivider />
                <p className='ofac-info__title'>ADMSS, INC Standard OFAC Check</p>
                <p className='ofac-info__date'>{info?.created}</p>
                <p className='ofac-info__name'>
                    Checking: {info?.lastname} {info?.firstname}
                </p>

                <AdaptiveDivider />
            </div>

            <h4 className='ofac-check__title ofac-check__title--warning'>Match found!</h4>

            <p>{info?.details}</p>
            <p>{info?.dob}</p>
            <p>{info?.listid}</p>

            <p>Instructions:</p>
            <AdaptiveDivider />

            <div className='ofac-check__notice-section ofac-check__notice-section--warning'>
                Use as much of the information above as possible to verify the hit before denying
                sale. If you are reasonably sure the match is valid or if you have questions, find
                an excuse to leave your desk and call the OFAC SDN Hotline at 1-800-540-6322.
            </div>

            <OFACCheckNotice />
        </div>
    );
};
