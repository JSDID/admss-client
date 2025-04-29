import React, { ReactElement, useEffect, useState, useCallback } from "react";
import {
    createReportCollection,
    getUserFavoriteReportList,
    getUserReportCollectionsContent,
    moveReportToCollection,
    setCollectionOrder,
    setReportOrder,
} from "http/services/reports.service";
import { Button } from "primereact/button";
import { Tree, TreeDragDropEvent } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { BaseResponseError, Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { Panel } from "primereact/panel";
import {
    NODE_TYPES,
    REPORT_TYPES,
    ReportCollection,
    ReportDocument,
    TOAST_MESSAGES,
} from "common/models/reports";
import { useStore } from "store/hooks";
import { CollectionPanelContent } from "dashboard/reports/common/panel-content";
import { ReportsPanelHeader } from "dashboard/reports/common/report-headers";
import { ActionButtons } from "dashboard/reports/common/report-buttons";
import { useNavigate } from "react-router-dom";
import { ReportParameters } from "./common/report-parameters";
import { TreeNodeEvent } from "common/models";
import { buildTreeNodes, transformLabel } from "./common/drag-and-drop";
import "./index.css";

const EDIT_COLLECTION_CLASSES: Readonly<string[]> = ["reports-actions__button", "p-button-label"];
const OPEN_PARAMETERS_CLASSES: Readonly<string[]> = [
    "reports__list-item--inner",
    "reports__list-item",
    "reports__list-name",
];

export const Reports = (): ReactElement => {
    const navigate = useNavigate();
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const toast = useToast();

    const [reportSearch, setReportSearch] = useState<string>("");
    const [reportCollections, setReportCollections] = useState<ReportCollection[]>([]);
    const [customCollections, setCustomCollections] = useState<ReportCollection[]>([]);
    const [favoriteCollections, setFavoriteCollections] = useState<ReportCollection[]>([]);
    const [collectionName, setCollectionName] = useState<string>("");

    const [newCollectionsReports, setNewCollectionsReports] = useState<ReportDocument[]>([]);
    const [selectedReports, setSelectedReports] = useState<ReportDocument[]>([]);
    const [isCollectionEditing, setIsCollectionEditing] = useState<string | null>(null);
    const [isParametersEditing, setIsParametersEditing] = useState<ReportDocument | null>(null);

    const getReportCollections = useCallback(async () => {
        const response = await getUserReportCollectionsContent(authUser!.useruid);
        const { error } = response as BaseResponseError;
        if (error && toast.current) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error,
                life: TOAST_LIFETIME,
            });
        }
        if (Array.isArray(response)) {
            const collectionsWithoutFavorite = response.filter(
                (c) => c.description !== "Favorites"
            );
            const customCols = collectionsWithoutFavorite
                ?.flatMap((col) => col.collections)
                ?.filter(Boolean);
            setReportCollections(collectionsWithoutFavorite);
            setCustomCollections(customCols);
        } else {
            setReportCollections([]);
        }
    }, [authUser, toast]);

    const getFavoriteReportCollections = useCallback(async () => {
        const response = await getUserFavoriteReportList(authUser!.useruid);
        if (Array.isArray(response)) {
            setFavoriteCollections(response);
        }
    }, [authUser]);

    const handleGetUserReportCollections = useCallback(async () => {
        await getFavoriteReportCollections();
        await getReportCollections();
    }, [getFavoriteReportCollections, getReportCollections]);

    useEffect(() => {
        if (authUser) {
            handleGetUserReportCollections();
        }
    }, [authUser, handleGetUserReportCollections]);

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

    const allNodes: TreeNode[] = [
        ...buildTreeNodes(favoriteCollections, true),
        ...buildTreeNodes(reportCollections, true),
    ];

    const handleCreateCollection = () => {
        if (!collectionName) return;
        createReportCollection(authUser!.useruid, {
            name: collectionName,
            documents: newCollectionsReports,
        }).then((response) => {
            const { error } = response as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                    life: TOAST_LIFETIME,
                });
            } else {
                handleGetUserReportCollections();
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "New collection is successfully created!",
                    life: TOAST_LIFETIME,
                });
                setCollectionName("");
                setNewCollectionsReports([]);
            }
        });
    };

    const handleUpdateCollection = (collectionUid: string, editCollectionName?: string) => {
        const finalName = collectionName || editCollectionName;
        if (!finalName) return;
        createReportCollection(authUser!.useruid, {
            name: finalName,
            documents: selectedReports,
            itemuid: collectionUid,
        }).then((response) => {
            const { error } = response as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                    life: TOAST_LIFETIME,
                });
            } else {
                handleGetUserReportCollections();
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Collection is successfully updated!",
                    life: TOAST_LIFETIME,
                });
                setCollectionName("");
                setSelectedReports([]);
                setIsCollectionEditing(null);
            }
        });
    };

    const handleCustomEditCollection = (
        event: React.MouseEvent<HTMLElement>,
        collectionUid: string
    ) => {
        const target = event.target as HTMLElement;
        if (EDIT_COLLECTION_CLASSES.some((cls) => target.classList.contains(cls))) {
            event.stopPropagation();
            setIsCollectionEditing(collectionUid);
        }
    };

    const handleOpenParameters = (event: React.MouseEvent<HTMLElement>, report: ReportDocument) => {
        const target = event.target as HTMLElement;
        if (!OPEN_PARAMETERS_CLASSES.some((cls) => target.classList.contains(cls))) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        if (isParametersEditing?.itemUID === report.itemUID) {
            setIsParametersEditing(null);
        } else {
            setIsParametersEditing(report);
        }
    };

    const handleDragDrop = async (event: TreeDragDropEvent) => {
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
                reportCollections.find((col) => col.itemUID === collectionId)?.collections
                    ?.length || 0;

            if (dropIndex !== undefined && collectionId && dragData.document.documentUID != null) {
                const response = await setReportOrder(
                    collectionId,
                    dragData.document.documentUID,
                    dropIndex - currentCollectionsLength
                );
                if (response?.error) {
                    showError(response.error);
                } else {
                    showSuccess(TOAST_MESSAGES.REPORT_MOVED_SUCCESS);
                    await updateDocumentOrderInCollection(collectionId);
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
            if (sourceCollectionId && sourceCollectionId !== targetCollectionId) {
                const response = await moveReportToCollection(
                    sourceCollectionId,
                    reportId,
                    targetCollectionId
                );
                if (response && response.status === Status.ERROR) {
                    showError(response.error);
                } else {
                    showSuccess(TOAST_MESSAGES.REPORT_MOVED_SUCCESS);
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

        await handleGetUserReportCollections();
    };

    const updateDocumentOrderInCollection = async (collectionUid: string) => {
        const foundCollection = reportCollections.find((col) => col.itemUID === collectionUid);
        if (!foundCollection || !foundCollection.documents) return;
        const updatedDocs = foundCollection.documents.map((doc, idx) => ({
            ...doc,
            order: idx,
        }));
        setReportCollections((prev) =>
            prev.map((c) => (c.itemUID === collectionUid ? { ...c, documents: updatedDocs } : c))
        );
    };

    const nodeTemplate = (node: TreeNode) => {
        const data = node.data || {};
        const nodeType = data.type;

        if (nodeType === NODE_TYPES.COLLECTION) {
            const currentCollection: ReportCollection = data.collection;
            const handleEditClick = (ev: React.MouseEvent<HTMLElement>) => {
                handleCustomEditCollection(ev, currentCollection.itemUID);
            };
            const hasNewDocs = currentCollection.documents?.some((doc) => doc.isNew);
            const isMatchedBySearch =
                reportSearch &&
                currentCollection.name?.toLowerCase().includes(reportSearch.toLowerCase());
            const isEditing = currentCollection.itemUID === isCollectionEditing;
            return (
                <>
                    <div className='reports__list-item'>
                        <div className={isMatchedBySearch ? "searched-item" : "reports__list-name"}>
                            {typeof node.label === "string"
                                ? transformLabel(node.label)
                                : node.label}
                        </div>
                        {hasNewDocs && <div className='reports-tree-header__label ml-2'>New</div>}
                        {currentCollection.userUID === authUser?.useruid &&
                            !currentCollection.isfavorite &&
                            currentCollection.name !== REPORT_TYPES.CUSTOM && (
                                <Button
                                    label='Edit'
                                    className='reports-actions__button cursor-pointer'
                                    outlined
                                    onClick={handleEditClick}
                                />
                            )}
                    </div>
                    {isEditing && (
                        <div className='edit-collection p-panel'>
                            <div className='p-panel-content relative'>
                                <CollectionPanelContent
                                    handleClosePanel={() => {
                                        setIsCollectionEditing(null);
                                        handleGetUserReportCollections();
                                    }}
                                    collectionuid={currentCollection.itemUID}
                                    collectionName={currentCollection.name}
                                    collections={[...customCollections, ...reportCollections]}
                                    selectedReports={currentCollection.documents || []}
                                    setCollectionName={setCollectionName}
                                    setSelectedReports={setSelectedReports}
                                    handleCreateCollection={() =>
                                        handleUpdateCollection(
                                            currentCollection.itemUID,
                                            currentCollection.name
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )}
                </>
            );
        }
        if (nodeType === NODE_TYPES.DOCUMENT) {
            const currentReport: ReportDocument = data.document;
            const isMatchedBySearch =
                reportSearch &&
                currentReport.name.toLowerCase().includes(reportSearch.toLowerCase());

            return (
                <>
                    <div
                        className='reports__list-item reports__list-item--inner'
                        onClick={(ev) => handleOpenParameters(ev, currentReport)}
                        onDoubleClick={() => {
                            navigate(`/dashboard/reports/${currentReport.documentUID}`);
                        }}
                    >
                        <p className={isMatchedBySearch ? "searched-item" : "reports__list-name"}>
                            {currentReport.name}
                        </p>
                        {currentReport.isNew ? (
                            <div className='reports-tree-header__label ml-2'>New</div>
                        ) : null}
                        <ActionButtons
                            report={currentReport}
                            collectionList={[reportCollections[0], ...customCollections].filter(
                                (col) => col.itemUID !== data.parentCollectionUID
                            )}
                            refetchCollectionsAction={handleGetUserReportCollections}
                            currentCollectionUID={data.parentCollectionUID}
                        />
                    </div>
                    {isParametersEditing?.documentUID === currentReport.documentUID && (
                        <ReportParameters report={isParametersEditing} />
                    )}
                </>
            );
        }
        return <span>{node.label}</span>;
    };

    return (
        <div className='card reports'>
            <div className='card-header'>
                <h2 className='card-header__title uppercase m-0'>Reports</h2>
            </div>
            <div className='card-content'>
                <div className='grid'>
                    <div className='col-12'>
                        <Panel
                            headerTemplate={(options) =>
                                ReportsPanelHeader({
                                    options,
                                    navigatePath: "create",
                                    state: reportSearch,
                                    isConfirm: !!selectedReports.length || !!collectionName.length,
                                    setStateAction: setReportSearch,
                                })
                            }
                            className='edit-collection w-full'
                            collapsed
                            toggleable
                        >
                            <CollectionPanelContent
                                collectionName={collectionName}
                                collections={[...customCollections, ...reportCollections]}
                                selectedReports={newCollectionsReports}
                                setCollectionName={setCollectionName}
                                setSelectedReports={setNewCollectionsReports}
                                handleCreateCollection={handleCreateCollection}
                            />
                        </Panel>
                    </div>
                    <div className='col-12'>
                        <Tree
                            className='reports__tree'
                            dragdropScope='reports'
                            onDragDrop={handleDragDrop}
                            value={allNodes}
                            nodeTemplate={nodeTemplate}
                            filter={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
