import { Button } from "primereact/button";
import { ReactElement, useRef } from "react";
import { ReportSelect } from "dashboard/reports/form/common";
import { observer } from "mobx-react-lite";
import { ReportServiceColumns } from "common/models/reports";
import {
    MOVE_DIRECTION,
    useReportColumnController,
} from "dashboard/reports/form/edit/column-select/select-controller";
import { ComboBox } from "dashboard/common/form/dropdown";
export const ReportColumnSelect = observer((): ReactElement => {
    const {
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
    } = useReportColumnController();

    const availableRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLDivElement>(null);

    const scrollToTop = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollTo({
            top: ref.current.scrollHeight,
            behavior: "smooth",
        });
    };

    const moveItem = (
        item: ReportServiceColumns,
        from: ReportServiceColumns[],
        to: ReportServiceColumns[],
        setFrom: React.Dispatch<React.SetStateAction<ReportServiceColumns[]>>,
        setTo: React.Dispatch<React.SetStateAction<ReportServiceColumns[]>>
    ) => {
        setFrom(from.filter((i) => i !== item));
        setTo([...to, item]);
        setCurrentItem(null);
    };

    const moveAllItems = (
        from: ReportServiceColumns[],
        to: ReportServiceColumns[],
        setFrom: React.Dispatch<React.SetStateAction<ReportServiceColumns[]>>,
        setTo: React.Dispatch<React.SetStateAction<ReportServiceColumns[]>>
    ) => {
        setTo([...to, ...from]);
        setFrom([]);
    };

    const changeOrder = (
        item: ReportServiceColumns,
        direction: MOVE_DIRECTION,
        list: ReportServiceColumns[],
        setList: React.Dispatch<React.SetStateAction<ReportServiceColumns[]>>
    ) => {
        const index = list.indexOf(item);
        if (index === -1) return;
        const newList = [...list];

        switch (direction) {
            case MOVE_DIRECTION.UP:
                if (index) {
                    newList.splice(index - 1, 0, newList.splice(index, 1)[0]);
                }
                break;

            case MOVE_DIRECTION.DOWN:
                if (index < newList.length - 1) {
                    newList.splice(index + 1, 0, newList.splice(index, 1)[0]);
                }
                break;

            case MOVE_DIRECTION.TOP:
                newList.unshift(newList.splice(index, 1)[0]);
                scrollToTop(list === availableValues ? availableRef : selectedRef);
                break;

            case MOVE_DIRECTION.BOTTOM:
                newList.push(newList.splice(index, 1)[0]);
                scrollToBottom(list === availableValues ? availableRef : selectedRef);
                break;

            default:
                return;
        }

        setList(newList);

        setTimeout(() => {
            document.querySelector(".report-select__item.selected")?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 50);
    };

    const ControlButton = (
        icon: string,
        action: () => void,
        tooltip: string,
        disabled?: boolean
    ) => {
        return (
            <Button
                className='report-control__button'
                icon={`pi pi-angle-${icon}`}
                disabled={disabled || !!report.isdefault}
                tooltip={tooltip}
                tooltipOptions={{ position: "mouse" }}
                outlined
                onClick={action}
            />
        );
    };

    return (
        <div className='col-12 report-controls'>
            <div className='report-controls__main'>
                <div className='report-control__available'>
                    <div className='report-control'>
                        {ControlButton(
                            MOVE_DIRECTION.UP,
                            () =>
                                currentItem &&
                                changeOrder(
                                    currentItem,
                                    MOVE_DIRECTION.UP,
                                    availableValues,
                                    setAvailableValues
                                ),
                            MOVE_DIRECTION.UP,
                            availableValues.findIndex((i) => i === currentItem) === 0 ||
                                !currentItem
                        )}
                        {ControlButton(
                            "double-up",
                            () =>
                                currentItem &&
                                changeOrder(
                                    currentItem,
                                    MOVE_DIRECTION.TOP,
                                    availableValues,
                                    setAvailableValues
                                ),
                            MOVE_DIRECTION.TOP,
                            availableValues.findIndex((i) => i === currentItem) === 0 ||
                                !currentItem
                        )}
                        {ControlButton(
                            MOVE_DIRECTION.DOWN,
                            () =>
                                currentItem &&
                                changeOrder(
                                    currentItem,
                                    MOVE_DIRECTION.DOWN,
                                    availableValues,
                                    setAvailableValues
                                ),
                            MOVE_DIRECTION.DOWN,
                            availableValues.findIndex((i) => i === currentItem) ===
                                availableValues.length - 1 || !currentItem
                        )}
                        {ControlButton(
                            "double-down",
                            () =>
                                currentItem &&
                                changeOrder(
                                    currentItem,
                                    MOVE_DIRECTION.BOTTOM,
                                    availableValues,
                                    setAvailableValues
                                ),
                            MOVE_DIRECTION.BOTTOM,
                            availableValues.findIndex((i) => i === currentItem) ===
                                availableValues.length - 1 || !currentItem
                        )}
                    </div>
                    <div className='report-control__content'>
                        <ComboBox
                            className='report-controls__dropdown'
                            options={availableDatasets}
                            value={dataSet}
                            emptyMessage='-'
                            disabled={!!report.isdefault}
                            onChange={(e) => setDataSet(e.value)}
                            pt={{
                                wrapper: {
                                    className: "capitalize",
                                },
                            }}
                            label='Data Set'
                        />
                        <ReportSelect
                            header='Available'
                            values={availableValues}
                            currentItem={currentItem}
                            onItemClick={(item) => setCurrentItem(item)}
                            onItemDoubleClick={(item) =>
                                moveItem(
                                    item,
                                    availableValues,
                                    selectedValues,
                                    setAvailableValues,
                                    setSelectedValues
                                )
                            }
                            containerRef={availableRef}
                        />
                    </div>
                </div>
                <div className='report-control'>
                    {ControlButton(
                        MOVE_DIRECTION.RIGHT,
                        () =>
                            currentItem &&
                            moveItem(
                                currentItem,
                                availableValues,
                                selectedValues,
                                setAvailableValues,
                                setSelectedValues
                            ),
                        "Move Right",
                        !!selectedValues.includes(currentItem!) || !currentItem
                    )}
                    {ControlButton(
                        "double-right",
                        () =>
                            moveAllItems(
                                availableValues,
                                selectedValues,
                                setAvailableValues,
                                setSelectedValues
                            ),
                        "Move All",
                        !availableValues.length
                    )}
                    {ControlButton(
                        MOVE_DIRECTION.LEFT,
                        () =>
                            currentItem &&
                            moveItem(
                                currentItem,
                                selectedValues,
                                availableValues,
                                setSelectedValues,
                                setAvailableValues
                            ),
                        "Move Left",
                        !!availableValues.includes(currentItem!) || !currentItem
                    )}
                    {ControlButton(
                        "double-left",
                        () =>
                            moveAllItems(
                                selectedValues,
                                availableValues,
                                setSelectedValues,
                                setAvailableValues
                            ),
                        "Move All",
                        !selectedValues.length
                    )}
                </div>
                <div className='report-control__selected'>
                    <ReportSelect
                        header='Selected'
                        values={selectedValues}
                        currentItem={currentItem}
                        onItemClick={(item) => setCurrentItem(item)}
                        onItemDoubleClick={(item) =>
                            moveItem(
                                item,
                                selectedValues,
                                availableValues,
                                setSelectedValues,
                                setAvailableValues
                            )
                        }
                        containerRef={selectedRef}
                    />
                    <div className='report-control'>
                        {ControlButton(
                            MOVE_DIRECTION.UP,
                            () =>
                                currentItem &&
                                changeOrder(
                                    currentItem,
                                    MOVE_DIRECTION.UP,
                                    selectedValues,
                                    setSelectedValues
                                ),
                            MOVE_DIRECTION.UP,
                            selectedValues.findIndex((i) => i === currentItem) === 0 || !currentItem
                        )}
                        {ControlButton(
                            "double-up",
                            () =>
                                currentItem &&
                                changeOrder(
                                    currentItem,
                                    MOVE_DIRECTION.TOP,
                                    selectedValues,
                                    setSelectedValues
                                ),
                            MOVE_DIRECTION.TOP,
                            selectedValues.findIndex((i) => i === currentItem) === 0 || !currentItem
                        )}
                        {ControlButton(
                            MOVE_DIRECTION.DOWN,
                            () =>
                                currentItem &&
                                changeOrder(
                                    currentItem,
                                    MOVE_DIRECTION.DOWN,
                                    selectedValues,
                                    setSelectedValues
                                ),
                            MOVE_DIRECTION.DOWN,
                            selectedValues.findIndex((i) => i === currentItem) ===
                                selectedValues.length - 1 || !currentItem
                        )}
                        {ControlButton(
                            "double-down",
                            () =>
                                currentItem &&
                                changeOrder(
                                    currentItem,
                                    MOVE_DIRECTION.BOTTOM,
                                    selectedValues,
                                    setSelectedValues
                                ),
                            MOVE_DIRECTION.BOTTOM,
                            selectedValues.findIndex((i) => i === currentItem) ===
                                selectedValues.length - 1 || !currentItem
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});
