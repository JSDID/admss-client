import { TreeNodeEvent } from "common/models";
import { ReportCollection, NODE_TYPES, ReportDocument, REPORT_TYPES } from "common/models/reports";
import { TreeNode } from "primereact/treenode";

export const transformLabel = (label: string): JSX.Element | string => {
    const regex = /^([^(]+)\s*\((.+)\)$/;
    const match = label.match(regex);

    if (!match) {
        return label;
    }

    const mainText = match[1].trim();
    const parenthesesText = `(${match[2]})`;

    return (
        <div className='flex gap-1'>
            <div className='reports-accordion-header__title'>{mainText}</div>
            <div className='reports-accordion-header__info '>{parenthesesText}</div>
        </div>
    );
};

const countNested = (collection: ReportCollection): number => {
    let totalDocs = collection.documents?.length ?? 0;

    if (collection.collections?.length) {
        for (const childCol of collection.collections) {
            const nested = countNested(childCol);
            totalDocs += nested;
        }
    }

    return totalDocs;
};

export const buildTreeNodes = (
    collectionsData: ReportCollection[],
    countInfo: boolean = false
): TreeNode[] => {
    const collections = JSON.parse(JSON.stringify(collectionsData)) as ReportCollection[];
    return collections
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((col) => {
            let label = col.name;
            let children: TreeNode[] = [];
            if (col.collections?.length) {
                children = buildTreeNodes(col.collections, countInfo);
            }
            if (col.documents?.length) {
                const docNodes = col.documents
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((doc: ReportDocument) => ({
                        key: doc.itemUID,
                        label: doc.name,
                        type: NODE_TYPES.DOCUMENT,
                        data: {
                            type: NODE_TYPES.DOCUMENT,
                            document: doc,
                            collectionId: col.itemUID,
                            order: doc.order,
                            parentCollectionUID: col.itemUID,
                        },
                    }));
                children.push(...docNodes);
            }
            if (countInfo) {
                if (col.name === REPORT_TYPES.CUSTOM) {
                    label = `${col.name} (${col.collections?.length || 0} collections / ${countNested(col)} docs)`;
                } else {
                    const currentDocsCount = col.documents?.length || 0;
                    label = `${col.name} (${currentDocsCount} reports)`;
                }
            }
            return {
                key: col.itemUID,
                label,
                type: NODE_TYPES.COLLECTION,
                data: {
                    type: NODE_TYPES.COLLECTION,
                    collection: col,
                    order: col.order,
                    parentCollectionUID: col.itemUID,
                },
                children,
            };
        });
};

export const convertTreeNodesToCollections = (
    nodes: TreeNodeEvent[],
    parentCollection?: ReportCollection
): ReportCollection[] => {
    return nodes.map((node, index) => {
        const data = node.data || {};
        const isCollection = node.type === NODE_TYPES.COLLECTION;
        if (isCollection) {
            const collectionData: ReportCollection = {
                ...data.collection,
                order: index,
                documents: [],
                collections: data.collection?.collections || [],
            };
            if (node.children && node.children.length) {
                const docs: ReportDocument[] = [];
                const cols: ReportCollection[] = [];
                node.children.forEach((children, i) => {
                    const child = children as TreeNodeEvent;
                    if (child.type === NODE_TYPES.DOCUMENT) {
                        const docData = child.data || {};
                        docs.push({
                            ...docData.document,
                            order: i,
                        });
                    } else if (child.type === NODE_TYPES.COLLECTION) {
                        const subCols = convertTreeNodesToCollections([child], collectionData);
                        cols.push(...subCols);
                    }
                });
                collectionData.documents = docs;
                collectionData.collections = cols;
            }
            return collectionData;
        } else {
            return parentCollection!;
        }
    });
};
