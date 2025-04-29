import { TypeList } from "common/models";
import { ContentType } from "common/models/enums";

export const CATEGORIES: readonly TypeList[] = [
    { name: "Interior", id: ContentType.ctInterior },
    { name: "Exterior", id: ContentType.ctExterior },
    { name: "Document", id: ContentType.ctDocument },
    { name: "General", id: ContentType.ctGeneral },
];
