/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./../ByteStream.ts" />
/// <reference path="./../DicomElement.ts" />

interface IDicomReader {
    readTag(byteStream: ByteStream): DicomTag;
    readElement(byteStream: ByteStream): DicomElement;
}