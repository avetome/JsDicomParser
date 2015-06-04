/// <reference path="./ByteStream.ts" />
/// <reference path="./ByteArrayParsers/IByteArrayParser.ts" />
/// <reference path="./ByteArrayParsers/LittleEndianByteArrayParser.ts" />
/// <reference path="./DicomReaders/ExplicitDicomReader.ts" />
/// <reference path="./DicomElement.ts" />
/// <reference path="./DicomDataSet.ts" />

module JsDicomParser {
    export class Parser {

        parse(byteArray: Uint8Array, option?: any[]) {
            var littleEndianStream = new ByteStream(byteArray, new LittleEndianByteArrayParser());

            var dataSet: DicomDataSet = new DicomDataSet(littleEndianStream.byteArray, littleEndianStream.byteArrayParser, []);

            this._checkDicomPrefix(littleEndianStream);

            this._readPart10Header(littleEndianStream, dataSet);
    
            var transferSyntax = this._readTransferSyntax(dataSet);
    
            if (!this.isExplicit(transferSyntax) || !this.isLittleEndian(transferSyntax)) {
                throw "JsDicomParser.parse: only ExplicitVrLittleEndian transfer syntax support yet";
            }
    
            this._readDataSet(littleEndianStream, dataSet);
    
            console.debug("", dataSet.elements);
            console.debug("TransferSyntaxes: ", dataSet.getElementAsString(DicomConstants.Tags.TransferSyntaxUID));
            console.debug("PhotometricInterpretation: ", dataSet.getElementAsString(DicomConstants.Tags.PhotometricInterpretation));
            console.debug("PixelSpacing: ", dataSet.getElementAsString(DicomConstants.Tags.PixelSpacing));
            console.debug("Rows: ", dataSet.getElementAsUint16(DicomConstants.Tags.Rows));
            console.debug("Columns: ", dataSet.getElementAsUint16(DicomConstants.Tags.Columns));            
            console.debug("PixelRepresentation: ", dataSet.getElementAsUint16(DicomConstants.Tags.PixelRepresentation));
            console.debug("BitsAllocated: ", dataSet.getElementAsUint16(DicomConstants.Tags.BitsAllocated));
            console.debug("BitsStored: ", dataSet.getElementAsUint16(DicomConstants.Tags.BitsStored));
            console.debug("NumberOfFrames: ", dataSet.getElementAsUint16(DicomConstants.Tags.NumberOfFrames));
            console.debug("DerivationDescription: ", dataSet.getElementAsString(DicomConstants.Tags.DerivationDescription));
            console.debug("PixelDataLength: ", dataSet.elements[DicomConstants.Tags.PixelData]);

            return dataSet;
        }

        // read dicom header according to PS3.10 (http://medical.nema.org/dicom/2013/output/chtml/part10/PS3.10.html)
        // Spoiler: always in Explicit VR Little Endian
        private _readPart10Header(stream: ByteStream, dataSet: DicomDataSet) {

            var dicomReader = new ExplicitDicomReader();

            while (stream.position < stream.byteArray.length) {
                var position: number = stream.position;

                var element: DicomElement = dicomReader.readElement(stream);

                if (element.tag > 'x0002ffff') {
                    stream.position = position;
                    break;
                }

                dataSet.addElement(element);
            }
        }

        // only ExplicitVrLittleEndian support now
        private _readDataSet(stream: ByteStream, dataSet: DicomDataSet) {
            var dicomReader = new ExplicitDicomReader();

            try {
                while (stream.position < stream.byteArray.length) {
                    var position: number = stream.position;

                    var element: DicomElement = dicomReader.readElement(stream);

                    dataSet.addElement(element);
                }
            }
            catch (e) {
                console.debug("", stream.position);
                throw e;
            }
        }

        private _checkDicomPrefix(stream: ByteStream) {
            stream.seek(128);
            var prefix = stream.readFixedString(4);

            if (prefix !== "DICM") {
                throw "JsDicomParser._checkDicomPrefix: DICM prefix not found";
            }
        }

        private _readTransferSyntax(headerDataSet: DicomDataSet) {
            if (headerDataSet.elements[DicomConstants.Tags.TransferSyntaxUID] === undefined) {
                throw 'JsDicomParser._readTransferSyntax: missing required meta header attribute 0002,0010';
            }

            var transferSyntaxElement: DicomElement = headerDataSet.elements[DicomConstants.Tags.TransferSyntaxUID];

            return headerDataSet.getElementAsString(transferSyntaxElement.tag);
        }

        private isExplicit(transferSyntax) {
            if (transferSyntax === DicomConstants.TransferSyntaxes.ImplicitVrLittleEndian) {
                return false;
            }

            // all other transfer syntaxes should be explicit
            return true;
        }

        private isLittleEndian(transferSyntax) {
            if (transferSyntax === DicomConstants.TransferSyntaxes.ExplicitVrBigEndian) {
                return false;
            }

            // all other transfer syntaxes are little endian; only the pixel encoding differs
            return true;
        }
    }
}

declare var module: any;
declare var define: any;

// see http://garrettn.github.io/blog/2014/02/19/write-modular-javascript-that-works-anywhere-with-umd/
if (typeof module === "object" && module.exports) {
    // CommonJS (Node)
    module.exports = JsDicomParser;
} else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () { return JsDicomParser; });
}