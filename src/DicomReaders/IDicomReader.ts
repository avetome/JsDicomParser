/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./../ByteStream.ts" />

interface IDicomReader {
    readTag(byteStream: ByteStream): string;
}