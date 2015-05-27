/// <reference path="./DicomTag.ts" />

class DicomElement {
    tag: string;

    tagSearchCode: string;
    tagName: string;

    vr: string;
    length: number;
    isUndefinedLength: boolean;
    offset: number;

    items: DicomElement[];
    DataSet: any;

    constructor() {}
}