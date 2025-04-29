import { ReactElement } from "react";
import "./index.css";
import { AppColors } from "common/models/css-variables";

type Info = {
    title: string;
    titleColor?: AppColors;
    value: string | number;
    valueColor?: AppColors;
    valueClass?: string;
};

interface InfoSectionProps {
    sectionTitle: string;
    info: Info[];
}

export const InfoSection = ({ sectionTitle, info }: InfoSectionProps): ReactElement => {
    return (
        <div className='info-section'>
            <h3 className='info-section__title'>{sectionTitle}</h3>
            <div className='info-section__details'>
                {info.map(({ title, titleColor, value, valueColor, valueClass }) => (
                    <div className='info-section__detail' key={title}>
                        <span
                            style={{
                                color: `var(--admss-app-${titleColor || AppColors.MAIN_BLUE})`,
                            }}
                            className='info-section__detail-title font-semibold'
                        >
                            {title}:
                        </span>
                        <span
                            style={{
                                color: `var(--admss-app-${valueColor || AppColors.BLUE_TEXT})`,
                            }}
                            className={`info-section__detail-value ${valueClass || ""}`}
                        >
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
