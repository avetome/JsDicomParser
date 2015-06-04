/// <reference path="./../ByteStream.ts" />
/// <reference path="./../DicomElement.ts" />

module JsDicomParser {
    export interface IDicomReader {
        readElement(byteStream: ByteStream): DicomElement;
    }
}