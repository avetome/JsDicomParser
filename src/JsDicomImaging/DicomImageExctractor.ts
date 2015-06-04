module JsDicomImaging {
    export class DicomImageExtractor {
        getDicomImage(dicomDataSet: any) {
            console.debug(dicomDataSet);
        }
    }
}

declare var module: any;
declare var define: any;

// see http://garrettn.github.io/blog/2014/02/19/write-modular-javascript-that-works-anywhere-with-umd/
if (typeof module === "object" && module.exports) {
    // CommonJS (Node)
    module.exports = JsDicomImaging;
} else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () { return JsDicomImaging; });
}