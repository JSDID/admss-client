import { TreeNode } from "primereact/treenode";

export interface TypeList {
    id: number;
    name: string;
}

export interface ListData extends TypeList {
    index?: number;
}

export interface PrintForm {
    description: string;
    index: number;
    itemuid: string;
    name: string;
    state: string;
    type: string;
    version: string;
}

export interface TreeNodeEvent extends TreeNode {
    type: string;
}

export interface MediaLimits {
    formats: string[];
    codecs?: string;
    minResolution?: string;
    prefResolution?: string;
    maxResolution?: string;
    maxDuration?: number;
    maxSize: number;
    maxUpload?: number;
}
