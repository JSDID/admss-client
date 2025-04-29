import { makeShortReports } from "http/services/reports.service";
import { TableColumnsList } from "dashboard/export-web/export/index";
import { ReportsColumn } from "common/models/reports";
import { ExportWebList } from "common/models/export-web";
import { Link } from "react-router-dom";

interface PrintExportTableDataProps {
    useruid: string;
    activeColumns: TableColumnsList[];
    print?: boolean;
    exportsToWeb: ExportWebList[];
}

export const printExportTableData = async ({
    useruid,
    activeColumns,
    exportsToWeb,
    print = false,
}: PrintExportTableDataProps) => {
    const columns: ReportsColumn[] = activeColumns.map((column) => ({
        name: column.header as string,
        data: column.field,
    }));
    const date = new Date();
    const name = `export-web_${
        date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;

    const data = exportsToWeb.map((item) => {
        const filteredItem: Record<string, any> = {};
        columns.forEach((column) => {
            if (item.hasOwnProperty(column.data)) {
                filteredItem[column.data] = item[column.data as keyof typeof item];
            }
        });
        return filteredItem;
    });
    const JSONreport = {
        name,
        itemUID: "0",
        data,
        columns,
        format: "",
    };
    await makeShortReports(useruid, JSONreport).then((response) => {
        const url = new Blob([response], { type: "application/pdf" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(url);
        if (!print) {
            link.download = `Report-${name}.pdf`;
            link.click();
        }

        if (print) {
            window.open(
                link.href,
                "_blank",
                "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=1280,height=720"
            );
        }
    });
};

export const rowExpansionTemplate = (data: ExportWebList) => {
    const maxLength = 480;
    const comment = data.DealerComments || "";

    const truncatedComment =
        comment.length > maxLength ? comment.substring(0, maxLength) + "... " : comment;

    return (
        <div className='expanded-row'>
            <div className='expanded-row__label'>Dealer comment:</div>
            <div className='expanded-row__text'>
                {truncatedComment}
                {comment.length > maxLength && (
                    <span className='expanded-row__link'>
                        <Link
                            className='expanded-row__link-text'
                            to={`/dashboard/inventory/${data.itemuid}?step=19`}
                        >
                            To read the complete comment, visit the inventory card.
                        </Link>
                    </span>
                )}
            </div>
        </div>
    );
};
