/// <reference path="./typing/browserify.d.ts" />
/// <reference path="./ByteStream.ts" />
/// <reference path="./ByteArrayParsers/IByteArrayParser.ts" />
/// <reference path="./ByteArrayParsers/LittleEndianByteArrayParser.ts" />
/// <reference path="./DicomReaders/ExplicitDicomReader.ts" />
/// <reference path="./DicomElement.ts" />
/// <reference path="./DicomDataSet.ts" />

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

        var elements: DicomElement[] = [];

        while(stream.position < stream.byteArray.length) {
            var position: number = stream.position;

            var element: DicomElement = dicomReader.readElement(stream);

            if(element.tag > 'x0002ffff') {
                stream.position = position;
                break;
            }

            elements[element.tag] = element;
            elements.push(element);
        }

        var dataSet = new DicomDataSet(stream.byteArray, stream.byteArrayParser, elements);

        for (var i = 0; i < elements.length; i++) {
            console.debug("", elements[i], dataSet.getElementAsString(elements[i].tag));
        }
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