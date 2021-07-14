import * as jsPDf from 'jspdf';
import autoTable from 'jspdf-autotable';

export class ExportFile {
    doc: any;
    constructor() {
        this.doc = new jsPDf('portrait');
        // this.exportPdf(columns, rows)
    }

    exportPdf = (filename: string, columns, rows,title,dateFormate, PrintDate, totalsum) => {
        // const rows = [1, 2, 3, 4, 5]
        // const columns = ['a', 'b', 'c', 'd', 'e'
        var y = 10;  
        var img = new Image()
        img.src = 'assets/images/slider1.png'
        // this.doc.text(80, 10, title);
        this.doc.addImage(img, 'png', 70, 3, 0, 12)  
        this.doc.text(80, 10, '');  
        this.doc.text(15, 17, dateFormate, this.doc.setFontSize(7));
        this.doc.text(82, 17, title, this.doc.setFontSize(11));
        this.doc.text(172, 17, PrintDate,  this.doc.setFontSize(7));
        debugger;
    
        // this.doc.text(145, 290, totalsum,  this.doc.setFontSize(12));
         autoTable(this.doc, {
            startY: 20,
            // columnStyles: {
            //     2: {
            //         halign: 'right'
            //     },
            //     3: {
            //         halign: 'right'
            //     },
            //     4: {
            //         halign: 'right'
            //     },
            //     5: {
            //         halign: 'right'
            //     }},
             head: [columns],
             body: rows,
             foot:totalsum
         })
        this.doc.save(`${filename} ${new Date(Date.now()).toLocaleString()}.pdf`)
    }

    exportExcel = (columns, rows) => { }
    exportCSV = (columns, rows) => { }

}
