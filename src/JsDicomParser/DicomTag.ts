/// <reference path="./utils/DicomTagsReference.ts" />

module JsDicomParser {

    export class DicomTag {
        group: number;
        element: number;

        getCode(): string {
            if (this.group < 0 || this.element < 0) {
                throw "DicomTag.getCode: tag number and group must be positive number";
            }

            return "x" + ('00000000' + (this.group * 256 * 256 + this.element).toString(16)).substr(-8);
        }

        // format for search on DicomLookup
        getDicomLookupSearchCode(): string {
            if (this.group < 0 || this.element < 0) {
                throw "DicomTag.getCode: tag number and group must be positive number";
            }

            return ('0000' + this.group.toString(16)).substr(-4) + "," + ('0000' + this.element.toString(16)).substr(-4);
        }

        findName(): string {
            if (this.group < 0 || this.element < 0) {
                throw "DicomTag.getCode: tag number and group must be positive number";
            }

            return DicomTagsReference.GetTagName(this.getCode());
        }
    }
}