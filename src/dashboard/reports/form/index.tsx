import {
    NODE_TYPES,
    ReportCollection,
    ReportDocument,
    TOAST_MESSAGES,
} from "common/models/reports";
import {
    getUserFavoriteReportList,
    setReportOrder,
    moveReportToCollection,
    setCollectionOrder,
} from "http/services/reports.service";
import { Button } from "primereact/button";
import { ReactElement, useEffect, useState, useCallback, useRef } from "react";
import { useStore } from "store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";
import { ReportEditForm } from "./edit";
import { observer } from "mobx-react-lite";
import { ReportFooter } from "./common";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { Tree, TreeDragDropEvent } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { Status } from "common/models/base-response";
import { buildTreeNodes } from "../common/drag-and-drop";
import { TreeNodeEvent } from "common/models";
import { ConfirmModal } from "dashboard/common/dialog/confirm";

const COLLECTION_DRAG_DELAY = 1000;

export const NodeContent = ({
    node,
    isSelected,
    onClick,
    isTogglerVisible,
}: {
    node: TreeNodeEvent;
    isSelected: boolean;
    onClick: () => void;
    isTogglerVisible?: boolean;
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const isNew = !!node.data?.document?.isNew;
    const isSimpleNode = node.type === NODE_TYPES.DOCUMENT;

    useEffect(() => {
        const parent = ref.current?.closest(".p-treenode-content");
        if (parent) {
            if (isTogglerVisible) {
                parent.classList.add("report__list-item--toggler-visible");
            }
            if (isSelected) {
                parent.classList.add("report__list-item--selected-container");
            } else {
                parent.classList.remove("report__list-item--selected-container");
            }
            if (isSimpleNode) {
                parent.classList.add("simple-node");
            }
        }
    }, [isSelected, isTogglerVisible, isSimpleNode]);

    return (
        <div className='w-full' ref={ref}>
            <Button
                onClick={onClick}
                className={`report__list-item w-full ${isNew ? "report__list-item--new" : ""}`}
                text
            >
                {node.label}
            </Button>
        </div>
    );
};

export const ReportForm = observer((): ReactElement => {
    const userStore = useStore().userStore;
    const reportStore = useStore().reportStore;
    const { isReportChanged, allCollections, getUserReportCollections, clearReport } = reportStore;
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { authUser } = userStore;
    const toast = useToast();
    const [favoriteCollections, setFavoriteCollections] = useState<ReportCollection[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({});
    const expandedForId = useRef<string | null>(null);
    const [confirmActive, setConfirmActive] = useState<boolean>(false);
    const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

    const getCollections = async () => {
        if (authUser) {
            getUserReportCollections();
            const response = await getUserFavoriteReportList(authUser.useruid);
            if (response && Array.isArray(response)) {
                setFavoriteCollections(response);
            }
        }
    };

    useEffect(() => {
        getCollections();
        return () => {
            clearReport();
        };
    }, [authUser]);

    const allNodes = [
        ...favoriteCollections.map((collection) => ({
            key: collection.itemUID,
            label: collection.name,
            type: NODE_TYPES.COLLECTION,
            data: { collection: collection, order: collection.order },
            children:
                collection.documents
                    ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((doc) => ({
                        key: doc.itemUID,
                        label: doc.name,
                        type: NODE_TYPES.DOCUMENT,
                        data: {
                            document: doc,
                            collectionId: collection.itemUID,
                            order: doc.order,
                        },
                    })) || [],
        })),
        ...buildTreeNodes(allCollections),
    ];

    const findPathToDocument = useCallback(
        (nodes: TreeNode[], docId: string, path: string[] = []): string[] | null => {
            for (let node of nodes) {
                const nodeData = node as TreeNodeEvent;
                if (
                    nodeData.type === NODE_TYPES.DOCUMENT &&
                    nodeData.data.document?.documentUID === docId
                ) {
                    return path;
                }

                if (
                    nodeData.type === NODE_TYPES.COLLECTION &&
                    node.children &&
                    node.children.length > 0
                ) {
                    const newPath = [...path, node.key as string];
                    const result = findPathToDocument(node.children, docId, newPath);
                    if (result) return result;
                }
            }
            return null;
        },
        []
    );

    useEffect(() => {
        if (id && allNodes.length > 0 && expandedForId.current !== id) {
            const path = findPathToDocument(allNodes, id);
            if (path) {
                const newExpandedKeys: { [key: string]: boolean } = {};
                path.forEach((key) => (newExpandedKeys[key] = true));
                setExpandedKeys((prev) => ({ ...prev, ...newExpandedKeys }));
                expandedForId.current = id;
            }
        }
    }, [id, allNodes, findPathToDocument]);

    const handleSelection = (node: TreeNode) => {
        const { type, key, data } = node as TreeNodeEvent;
        if (type === NODE_TYPES.COLLECTION) {
            setExpandedKeys((prev) => {
                const newKeys = { ...prev };
                if (newKeys[key!]) {
                    delete newKeys[key!];
                } else {
                    newKeys[key!] = true;
                }
                return newKeys;
            });
        }
        if (type === NODE_TYPES.DOCUMENT && data.document) {
            const doc: ReportDocument = data.document;
            reportStore.report = doc;
            reportStore.reportName = doc.name;
            navigate(`/dashboard/reports/${doc.documentUID}`);
        }
    };

    const showError = (detail: string) => {
        toast.current?.show({
            severity: "error",
            summary: TOAST_MESSAGES.ERROR,
            detail,
            life: TOAST_LIFETIME,
        });
    };

    const showSuccess = (detail: string) => {
        toast.current?.show({
            severity: "success",
            summary: TOAST_MESSAGES.SUCCESS,
            detail,
            life: TOAST_LIFETIME,
        });
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>, node: TreeNode) => {
        const nodeData = node as TreeNodeEvent;
        if (nodeData.type === NODE_TYPES.COLLECTION && nodeData.children?.length) {
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }

            hoverTimerRef.current = setTimeout(() => {
                setExpandedKeys((prev) => ({
                    ...prev,
                    [node.key as string]: true,
                }));
            }, COLLECTION_DRAG_DELAY);
        }
    };

    const handleDragLeave = () => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
    };

    const handleDragDrop = async (event: TreeDragDropEvent) => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }

        const dragNode = event.dragNode as TreeNodeEvent | undefined;
        const dropNode = event.dropNode as TreeNodeEvent | undefined;
        const dropIndex = event.dropIndex - 1 < 0 ? 0 : event.dropIndex - 1;

        if (!dropNode) return;

        if (
            dragNode?.type === NODE_TYPES.DOCUMENT &&
            dragNode?.data?.collectionId !== dropNode?.data?.collection?.itemUID &&
            (!!dropNode?.data?.collection?.isdefault || !!dropNode?.data?.collection?.isfavorite)
        ) {
            showError(TOAST_MESSAGES.MOVE_INTO_DEFAULT_ERROR);
            return;
        }

        if (
            dragNode?.type === NODE_TYPES.DOCUMENT &&
            dropNode?.type === NODE_TYPES.COLLECTION &&
            dragNode?.data?.document?.isdefault &&
            dragNode?.data?.collectionId !== dropNode?.data?.collection?.itemUID
        ) {
            showError(TOAST_MESSAGES.ERROR_CANNOT_MOVE_FROM_DEFAULT_COLLECTION);
            return;
        }

        if (
            dropNode?.type === NODE_TYPES.COLLECTION &&
            dragNode?.type !== NODE_TYPES.DOCUMENT &&
            (!!dropNode.data?.collection?.isdefault || !!dropNode.data?.collection?.isfavorite)
        ) {
            showError(TOAST_MESSAGES.CANNOT_MOVE_INTO_DEFAULT_COLLECTION);
            return;
        }

        const dragData = dragNode?.data;
        const dropData = dropNode?.data;

        if (
            dragNode?.type === NODE_TYPES.DOCUMENT &&
            dragData?.document &&
            dragNode?.data?.collectionId === dropNode?.data?.collection?.itemUID
        ) {
            const collectionId = dragData.collectionId;
            const currentCollectionsLength =
                allCollections.find((col: ReportCollection) => col.itemUID === collectionId)
                    ?.collections?.length || 0;

            if (dropIndex !== undefined) {
                const order =
                    dropIndex - currentCollectionsLength < 0
                        ? 0
                        : dropIndex - currentCollectionsLength;
                const response = await setReportOrder(
                    collectionId,
                    dragData.document.documentUID,
                    order
                );
                if (response?.error) {
                    showError(response.error);
                } else {
                    showSuccess(TOAST_MESSAGES.REPORT_MOVED_SUCCESS);
                }
            }
        }

        if (
            dragNode?.type === NODE_TYPES.DOCUMENT &&
            dropNode?.type === NODE_TYPES.COLLECTION &&
            dragData?.document
        ) {
            const sourceCollectionId = dragData.collectionId;
            const targetCollectionId = dropData.collection.itemUID;
            const reportId = dragData.document.documentUID;
            if (sourceCollectionId !== targetCollectionId) {
                const response = await moveReportToCollection(
                    sourceCollectionId,
                    reportId,
                    targetCollectionId
                );
                if (response && response.status === Status.ERROR) {
                    showError(response.error);
                } else {
                    if (dropIndex !== undefined) {
                        const currentCollectionsLength =
                            allCollections.find(
                                (col: ReportCollection) => col.itemUID === targetCollectionId
                            )?.collections?.length || 0;

                        const order =
                            dropIndex - currentCollectionsLength < 0
                                ? 0
                                : dropIndex - currentCollectionsLength;

                        const orderResponse = await setReportOrder(
                            targetCollectionId,
                            reportId,
                            order
                        );
                        if (orderResponse?.error) {
                            showError(orderResponse.error);
                        } else {
                            showSuccess(TOAST_MESSAGES.REPORT_MOVED_SUCCESS);
                        }
                    } else {
                        showSuccess(TOAST_MESSAGES.REPORT_MOVED_SUCCESS);
                    }
                }
            }
        }

        if (dragNode?.type === NODE_TYPES.COLLECTION && dragData?.collection && dropIndex != null) {
            const sourceCollectionId = dragData.collection.itemUID;
            if (sourceCollectionId) {
                const response = await setCollectionOrder(sourceCollectionId, dropIndex);
                if (response && response.status === Status.ERROR) {
                    showError(response.error);
                } else {
                    showSuccess(TOAST_MESSAGES.COLLECTION_REORDERED_SUCCESS);
                }
            }
        }

        getCollections();
    };

    const navigateToReports = () => {
        navigate("/dashboard/reports");
    };

    const handleCloseClick = () => {
        if (isReportChanged) {
            setConfirmActive(true);
        } else {
            navigateToReports();
        }
    };

    return (
        <div className='grid relative'>
            <Button
                icon='pi pi-times'
                className='p-button close-button'
                onClick={handleCloseClick}
            />
            <div className='col-12'>
                <div className='card report'>
                    <div className='card-header flex'>
                        <h2 className='report__title uppercase m-0'>
                            {id ? "Edit" : "Create custom"} report
                        </h2>
                        {id && (
                            <Button
                                outlined
                                className='button-rounded ml-3'
                                onClick={() => navigate("/dashboard/reports/create")}
                            >
                                Create new report
                            </Button>
                        )}
                    </div>
                    <div className='card-content report__card grid'>
                        <div className='col-4'>
                            <Tree
                                value={allNodes}
                                dragdropScope='reports'
                                onDragDrop={handleDragDrop}
                                expandedKeys={expandedKeys}
                                onToggle={(e) => setExpandedKeys(e.value)}
                                nodeTemplate={(node) => {
                                    const nodeData = node as TreeNodeEvent;
                                    const isSelected =
                                        nodeData.type === NODE_TYPES.DOCUMENT &&
                                        nodeData.data.document?.documentUID === id;
                                    return (
                                        <div
                                            onDragEnter={(e) => handleDragEnter(e, node)}
                                            onDragLeave={handleDragLeave}
                                        >
                                            <NodeContent
                                                node={nodeData}
                                                isSelected={isSelected}
                                                onClick={() => handleSelection(node)}
                                                isTogglerVisible={
                                                    nodeData.type === NODE_TYPES.COLLECTION
                                                }
                                            />
                                        </div>
                                    );
                                }}
                            />
                        </div>
                        <ReportEditForm />
                    </div>
                    <ReportFooter onRefetch={getUserReportCollections} />
                </div>
            </div>
            <ConfirmModal
                visible={confirmActive}
                draggable={false}
                position='top'
                className='contact-delete-dialog'
                title='Quit Editing?'
                icon='pi-exclamation-triangle'
                bodyMessage='Are you sure you want to leave this page? All unsaved data will be lost.'
                rejectLabel='Cancel'
                acceptLabel='Confirm'
                confirmAction={navigateToReports}
                onHide={() => setConfirmActive(false)}
            />
        </div>
    );
});
