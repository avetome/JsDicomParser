/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./../ByteStream.ts" />
/// <reference path="./../DicomElement.ts" />

interface IDicomReader {    
    readElement(byteStream: ByteStream): DicomElement;
}