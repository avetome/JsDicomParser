/// <reference path="./ByteArrayParsers/IByteArrayParser.ts" />
/// <reference path="./DicomElement.ts" />

class DicomDataSet {
    byteArray: Uint8Array;
    byteArrayParser: IByteArrayParser;
    elements: DicomElement[];

    constructor(byteArray: Uint8Array, byteArrayParser: IByteArrayParser, elements: DicomElement[]) {
        this.byteArray = byteArray;
        this.byteArrayParser = byteArrayParser;
        this.elements = elements;
    }

    getElementAsString(tag: string) {
        var element: DicomElement = this.elements[tag];

        if (!element || element.length <= 0) {
            return undefined;
        }

        var fixedString = this.byteArrayParser.ReadFixedString(this.byteArray, element.offset, element.length);

        return fixedString.trim();
    }

    getElementAsUint32(tag: string) {
        var element: DicomElement = this.elements[tag];        

        if(!element || element.length === 0)
        {
            return undefined;
        }

        return this.byteArrayParser.readUint32(this.byteArray, element.offset);        
    }
}