import { ReportServiceColumns, ReportServices } from "common/models/reports";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { getReportColumns, getReportDatasets } from "http/services/reports.service";
import { useStore } from "store/hooks";
import { useToast } from "dashboard/common/toast";
import { useEffect, useState } from "react";

interface Dataset {
    id: number;
    key: string;
    match: { id: number; name: string }[];
    name: ReportServices;
}

export const dataSetValues: ReportServices[] = [
    ReportServices.INVENTORY,
    ReportServices.CONTACTS,
    ReportServices.DEALS,
    ReportServices.ACCOUNTS,
];

const initialDataSetsData: Record<ReportServices, ReportServiceColumns[]> = {
    [ReportServices.INVENTORY]: [],
    [ReportServices.CONTACTS]: [],
    [ReportServices.DEALS]: [],
    [ReportServices.ACCOUNTS]: [],
};

export enum MOVE_DIRECTION {
    LEFT = "left",
    RIGHT = "right",
    TOP = "top",
    BOTTOM = "bottom",
    UP = "up",
    DOWN = "down",
}

const getCompatibleDatasets = (
    selectedDatasets: ReportServices[],
    allDatasets: Dataset[]
): ReportServices[] => {
    if (!allDatasets.length || !selectedDatasets.length) {
        return dataSetValues;
    }

    const selectedDatasetObjects = selectedDatasets
        .map((name) => allDatasets.find((dataset) => dataset.name === name))
        .filter(Boolean) as Dataset[];

    return dataSetValues.filter((datasetName) => {
        const dataset = allDatasets.find((dataset) => dataset.name === datasetName);
        if (!dataset) return false;

        if (selectedDatasets.includes(datasetName)) return true;

        const datasetMatches = new Set(dataset.match.map((match) => match.id));
        return selectedDatasetObjects.every((selected) => {
            const selectedMatches = new Set(selected.match.map((match) => match.id));
            return datasetMatches.has(selected.id) && selectedMatches.has(dataset.id);
        });
    });
};

export const useReportColumnController = () => {
    const store = useStore().reportStore;
    const { report } = store;
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const toast = useToast();
    const [dataSet, setDataSet] = useState<ReportServices | null>(null);
    const [selectedValues, setSelectedValues] = useState<ReportServiceColumns[]>([]);
    const [availableValues, setAvailableValues] = useState<ReportServiceColumns[]>([]);
    const [currentItem, setCurrentItem] = useState<ReportServiceColumns | null>(null);
    const [initialDataSets, setInitialDataSets] =
        useState<Record<ReportServices, ReportServiceColumns[]>>(initialDataSetsData);
    const [availableDatasets, setAvailableDatasets] = useState<ReportServices[]>(dataSetValues);
    const [datasets, setDatasets] = useState<Dataset[]>([]);

    useEffect(() => {
        const fetchDatasets = async () => {
            if (authUser?.useruid) {
                const response = await getReportDatasets(authUser.useruid);
                if (Array.isArray(response)) {
                    setDatasets(response);
                }
            }
        };
        fetchDatasets();
    }, [authUser?.useruid]);

    useEffect(() => {
        if (!datasets.length || !report) return;

        if (report?.columns) {
            const initialSelectedValues = report.columns.filter(Boolean);
            setSelectedValues(initialSelectedValues);

            const selectedDatasets = Array.from(
                new Set(
                    initialSelectedValues.map(
                        (item: ReportServiceColumns) => item.dataset as ReportServices
                    )
                )
            ).filter(Boolean) as ReportServices[];
            const compatibleDatasets = getCompatibleDatasets(selectedDatasets, datasets);
            setAvailableDatasets(compatibleDatasets);
        }
    }, [report, datasets, authUser?.useruid]);

    useEffect(() => {
        const selectedDatasets = Array.from(
            new Set(
                selectedValues.map((item: ReportServiceColumns) => item.dataset as ReportServices)
            )
        ).filter(Boolean) as ReportServices[];

        const compatibleDatasets = getCompatibleDatasets(selectedDatasets, datasets);
        setAvailableDatasets(compatibleDatasets);

        if (dataSet && !compatibleDatasets.includes(dataSet)) {
            setDataSet(null);
            setAvailableValues([]);
        }
    }, [selectedValues, datasets]);

    useEffect(() => {
        if (dataSet) {
            const allColumns = initialDataSets[dataSet] || [];
            const filtered = allColumns.filter(
                (column) => !selectedValues.some((selected) => selected.data === column.data)
            );
            setAvailableValues(filtered);
        }
    }, [dataSet, selectedValues, initialDataSets]);

    useEffect(() => {
        const fetchColumns = async () => {
            const useruid = authUser?.useruid;
            if (!dataSet || !useruid) return;
            if (initialDataSets[dataSet].length > 0) return;

            const response = await getReportColumns({ service: dataSet, useruid });
            if (response?.status === Status.ERROR) {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: response?.error,
                    life: TOAST_LIFETIME,
                });
            } else if (response) {
                const columnsWithOrigin = response.map((item: ReportServiceColumns) => ({
                    ...item,
                    originalDataSet: dataSet,
                }));
                setInitialDataSets((prev) => ({
                    ...prev,
                    [dataSet]: columnsWithOrigin,
                }));
            }
        };
        fetchColumns();
    }, [dataSet, authUser?.useruid, toast]);

    useEffect(() => {
        store.reportColumns = selectedValues;
    }, [selectedValues, store]);

    return {
        dataSet,
        report,
        setDataSet,
        selectedValues,
        setSelectedValues,
        availableValues,
        setAvailableValues,
        currentItem,
        setCurrentItem,
        availableDatasets,
    };
};
