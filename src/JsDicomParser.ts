/// <reference path="./typing/browserify.d.ts" />
/// <reference path="./ByteStream.ts" />
/// <reference path="./ByteArrayParsers/IByteArrayParser.ts" />
/// <reference path="./ByteArrayParsers/LittleEndianByteArrayParser.ts" />
/// <reference path="./DicomReaders/ExplicitDicomReader.ts" />

class JsDicomParser {

    parse(byteArray: Uint8Array, option?: any[]) {
        var littleEndianStream = new ByteStream(byteArray, new LittleEndianByteArrayParser());

        this._readPart10Header(littleEndianStream);
    }    

    // read dicom header according to PS3.10 (http://medical.nema.org/dicom/2013/output/chtml/part10/PS3.10.html)
    // Spoiler: always in Explicit VR Little Endian
    private _readPart10Header(stream: ByteStream) {
        this._checkDicomPrefix(stream);

        var dicomReader = new ExplicitDicomReader();

        console.debug("", dicomReader.readElement(stream));
    }

    private _checkDicomPrefix(stream: ByteStream) {
        stream.seek(128);
        var prefix = stream.readFixedString(4);

        console.debug(prefix);

        if (prefix !== "DICM") {
            throw "JsDicomParser._checkDicomPrefix: DICM prefix not found";
        }
    }
}