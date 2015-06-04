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

        var dataSet:DicomDataSet = new DicomDataSet(littleEndianStream.byteArray, littleEndianStream.byteArrayParser, []);

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
        console.debug("Rows: ", dataSet.getElementAsUint16(DicomConstants.Tags.Rows));
        console.debug("Columns: ", dataSet.getElementAsUint16(DicomConstants.Tags.Columns));
        console.debug("BitsAllocated: ", dataSet.getElementAsUint16(DicomConstants.Tags.BitsAllocated));
        console.debug("BitsStored: ", dataSet.getElementAsUint16(DicomConstants.Tags.BitsStored));
        console.debug("NumberOfFrames: ", dataSet.getElementAsUint16(DicomConstants.Tags.NumberOfFrames));
        console.debug("DerivationDescription: ", dataSet.getElementAsString(DicomConstants.Tags.DerivationDescription));
        console.debug("PixelDataLength: ", dataSet.elements[DicomConstants.Tags.PixelData]);        
        console.debug("", this._extractUncompressedPixels(dataSet, dataSet.getElementAsUint16(DicomConstants.Tags.Rows), dataSet.getElementAsUint16(DicomConstants.Tags.Columns)));
    }

    private _extractUncompressedPixels(dataSet: DicomDataSet, width: any, height:any)
    {
        var pixelDataElement: DicomElement = dataSet.elements[DicomConstants.Tags.PixelData];
        var pixelDataOffset = pixelDataElement.offset;

        var numPixels = width * height;

        return new Int16Array(dataSet.byteArray.buffer, pixelDataOffset, numPixels);
    }    

    // read dicom header according to PS3.10 (http://medical.nema.org/dicom/2013/output/chtml/part10/PS3.10.html)
    // Spoiler: always in Explicit VR Little Endian
    private _readPart10Header(stream: ByteStream, dataSet:DicomDataSet) {       

        var dicomReader = new ExplicitDicomReader();        

        while(stream.position < stream.byteArray.length) {
            var position: number = stream.position;

            var element: DicomElement = dicomReader.readElement(stream);

            if(element.tag > 'x0002ffff') {
                stream.position = position;
                break;
            }

            dataSet.addElement(element);
        }
    }

    // only ExplicitVrLittleEndian support now
    private _readDataSet(stream: ByteStream, dataSet:DicomDataSet) {
        var dicomReader = new ExplicitDicomReader();        

        try {
            while (stream.position < stream.byteArray.length) {
                var position: number = stream.position;

                var element: DicomElement = dicomReader.readElement(stream);

                dataSet.addElement(element);
            }
        }
        catch(e) {
            console.debug("",stream.position);
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
        if(headerDataSet.elements[DicomConstants.Tags.TransferSyntaxUID] === undefined) {
            throw 'JsDicomParser._readTransferSyntax: missing required meta header attribute 0002,0010';
        }

        var transferSyntaxElement: DicomElement = headerDataSet.elements[DicomConstants.Tags.TransferSyntaxUID];

        return headerDataSet.getElementAsString(transferSyntaxElement.tag);
    }

    private isExplicit(transferSyntax) {
        if(transferSyntax === DicomConstants.TransferSyntaxes.ImplicitVrLittleEndian)
        {
            return false;
        }

        // all other transfer syntaxes should be explicit
        return true;
    }

    private isLittleEndian(transferSyntax) {
        if(transferSyntax === DicomConstants.TransferSyntaxes.ExplicitVrBigEndian)
        {
            return false;
        }

        // all other transfer syntaxes are little endian; only the pixel encoding differs
        return true;
    }
}