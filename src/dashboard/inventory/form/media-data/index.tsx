import { AccordionItems, Inventory } from "dashboard/inventory/common";
import { lazy } from "react";
import "./index.css";
const MediaDataImages = lazy(() =>
    import("./images").then((module) => ({ default: module.ImagesMedia }))
);
const MediaDataVideo = lazy(() =>
    import("./video").then((module) => ({ default: module.VideoMedia }))
);
const MediaDataAudio = lazy(() =>
    import("./audio").then((module) => ({ default: module.AudioMedia }))
);
const MediaDataDocuments = lazy(() =>
    import("./documents").then((module) => ({ default: module.DocumentsMedia }))
);
const MediaDataLinks = lazy(() =>
    import("./links").then((module) => ({ default: module.LinksMedia }))
);

export const InventoryMediaData: Pick<Inventory, "label" | "items"> = {
    label: "Media data",
    items: [
        { itemLabel: AccordionItems.IMAGES, component: <MediaDataImages /> },
        { itemLabel: AccordionItems.VIDEO, component: <MediaDataVideo /> },
        { itemLabel: AccordionItems.AUDIO, component: <MediaDataAudio /> },
        { itemLabel: AccordionItems.DOCUMENTS, component: <MediaDataDocuments /> },
        { itemLabel: AccordionItems.LINKS, component: <MediaDataLinks /> },
    ],
};
