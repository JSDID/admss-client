import { CATEGORIES } from "common/constants/media-categories";
import { UploadMediaLink } from "common/models/inventory";
import { ReactElement } from "react";

export const MediaLinkRowExpansionTemplate = ({
    contenttype,
    notes,
}: Partial<UploadMediaLink>): ReactElement => {
    return (
        <>
            <div className='expanded-row'>
                <div className='expanded-row__label'>Category:</div>
                <div className='expanded-row__text'>
                    {CATEGORIES.find((category) => category.id === contenttype)?.name}
                </div>
            </div>
            <div className='expanded-row'>
                <div className='expanded-row__label'>Comment:</div>
                <div className='expanded-row__text'>{notes}</div>
            </div>
        </>
    );
};
