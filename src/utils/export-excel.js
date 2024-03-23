import * as XLSX from 'xlsx';

export default function exportExcel(title, worksheetName = 'Sheet1', dataFields = [], data) {
    const dataToExport = data.map((el) => {
        const row = {};

        if (dataFields.length === 0) {
            return el;
        }

        dataFields.forEach((field) => {
            const selector = typeof field === 'string' ? field : field?.id;
            const label = typeof field === 'string' ? field : field?.label;

            row[label] = el[selector] || '-';
        });

        return row;
    });

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);

    // Save the workbook as an Excel file
    XLSX.writeFile(workbook, `${title}.xlsx`);
}