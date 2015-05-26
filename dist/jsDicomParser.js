/// <reference path="./typing/browserify.d.ts" />
/// <reference path="./ByteArrayParsers/IByteArrayParser.ts" />
var ByteStream = (function () {
    function ByteStream(byteArray, byteArrayParser, position) {
        if (byteArray === undefined) {
            throw "ByteStream: missing required parameter 'byteArray'";
        }
        if ((byteArray instanceof Uint8Array) === false) {
            throw 'ByteStream: byteArray should be instance of Uint8Array';
        }
        if (position < 0) {
            throw "ByteStream: position cannot be less than 0";
        }
        if (position >= byteArray.length) {
            throw "ByteStream: position cannot be more than or equal to byteArray.length";
        }
        if (byteArrayParser === undefined) {
            throw "ByteStream: missing required parameter 'byteArrayParser'";
        }
        this.byteArray = byteArray;
        this.position = position ? position : 0;
        this.byteArrayParser = byteArrayParser;
    }
    ByteStream.prototype.seek = function (offset) {
        if (this.position + offset < 0) {
            throw "ByteStream: cannot seek to position < 0";
        }
        this.position += offset;
    };
    ByteStream.prototype.readFixedString = function (length) {
        var result = this.byteArrayParser.ReadFixedString(this.byteArray, this.position, length);
        this.position += length;
        return result;
    };
    ByteStream.prototype.readUint16 = function () {
        var result = this.byteArrayParser.readUint16(this.byteArray, this.position);
        this.position += 2;
        return result;
    };
    ByteStream.prototype.readUint32 = function () {
        var result = this.byteArrayParser.readUint32(this.byteArray, this.position);
        this.position += 4;
        return result;
    };
    return ByteStream;
})();
// Just for tags recogniction, not for prodaction
var DicomTagsReference = (function () {
    function DicomTagsReference() {
    }
    DicomTagsReference.GetTagName = function (tagCode) {
        var tagName = this.dicomTags[tagCode];
        if (tagName == undefined) {
            return "unknown";
        }
        return tagName;
    };
    DicomTagsReference.dicomTags = {
        "x00020000": "FileMetaInfoGroupLength",
        "x00020001": "FileMetaInfoVersion",
        "x00020002": "MediaStorageSOPClassUID",
        "x00020003": "MediaStorageSOPInstanceUID",
        "x00020010": "TransferSyntaxUID",
        "x00020012": "ImplementationClassUID",
        "x00020013": "ImplementationVersionName",
        "x00020016": "SourceApplicationEntityTitle"
    };
    return DicomTagsReference;
})();
/// <reference path="./utils/DicomTagsReference.ts" />
var DicomTag = (function () {
    function DicomTag() {
    }
    DicomTag.prototype.getCode = function () {
        if (this.group < 0 || this.element < 0) {
            throw "DicomTag.getCode: tag number and group must be positive number";
        }
        return "x" + ('00000000' + (this.group * 256 * 256 + this.element).toString(16)).substr(-8);
    };
    // format for search on DicomLookup
    DicomTag.prototype.getDicomLookupSearchCode = function () {
        if (this.group < 0 || this.element < 0) {
            throw "DicomTag.getCode: tag number and group must be positive number";
        }
        return ('0000' + this.group.toString(16)).substr(-4) + "," + ('0000' + this.element.toString(16)).substr(-4);
    };
    DicomTag.prototype.findName = function () {
        if (this.group < 0 || this.element < 0) {
            throw "DicomTag.getCode: tag number and group must be positive number";
        }
        return DicomTagsReference.GetTagName(this.getCode());
    };
    return DicomTag;
})();
/// <reference path="./DicomTag.ts" />
var DicomElement = (function () {
    function DicomElement() {
    }
    return DicomElement;
})();
/// <reference path="./ByteArrayParsers/IByteArrayParser.ts" />
/// <reference path="./DicomElement.ts" />
var DicomDataSet = (function () {
    function DicomDataSet(byteArray, byteArrayParser, elements) {
        this.byteArray = byteArray;
        this.byteArrayParser = byteArrayParser;
        this.elements = elements;
    }
    DicomDataSet.prototype.getElementAsString = function (tag) {
        var element = this.elements[tag];
        if (!element || element.length <= 0) {
            return undefined;
        }
        var fixedString = this.byteArrayParser.ReadFixedString(this.byteArray, element.offset, element.length);
        return fixedString.trim();
    };
    DicomDataSet.prototype.getElementAsUint32 = function (tag) {
        var element = this.elements[tag];
        if (!element || element.length === 0) {
            return undefined;
        }
        return this.byteArrayParser.readUint32(this.byteArray, element.offset);
    };
    return DicomDataSet;
})();
/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./IByteArrayParser.ts" />
var LittleEndianByteArrayParser = (function () {
    function LittleEndianByteArrayParser() {
    }
    LittleEndianByteArrayParser.prototype.ReadFixedString = function (byteArray, position, length) {
        if (length < 0) {
            throw 'LittleEndianByteArrayParser.ReadFixedString: length cannot be less than 0';
        }
        if (position + length > byteArray.length) {
            throw 'LittleEndianByteArrayParser.ReadFixedString: length cannot be more than buffer.length';
        }
        var result = "";
        for (var i = 0; i < length; i++) {
            var byte = byteArray[position + i];
            if (byte === 0) {
                position += length;
                return result;
            }
            result += String.fromCharCode(byte);
        }
        return result;
    };
    LittleEndianByteArrayParser.prototype.readUint16 = function (byteArray, position) {
        if (position < 0) {
            throw 'LittleEndianByteArrayParser.readUint16: position cannot be less than 0';
        }
        if (position + 2 > byteArray.length) {
            throw 'LittleEndianByteArrayParser.readUint16: length cannot be more than buffer.length';
        }
        return byteArray[position] + (byteArray[position + 1] * 256);
    };
    LittleEndianByteArrayParser.prototype.readUint32 = function (byteArray, position) {
        if (position < 0) {
            throw 'LittleEndianByteArrayParser.readUint16: position cannot be less than 0';
        }
        if (position + 4 > byteArray.length) {
            throw 'LittleEndianByteArrayParser.readUint16: length cannot be more than buffer.length';
        }
        var uint32 = (byteArray[position] + (byteArray[position + 1] * 256) + (byteArray[position + 2] * 256 * 256) + (byteArray[position + 3] * 256 * 256 * 256));
        return uint32;
    };
    return LittleEndianByteArrayParser;
})();
/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./../ByteStream.ts" />
/// <reference path="./../DicomElement.ts" />
var DicomConstants = (function () {
    function DicomConstants() {
    }
    DicomConstants.Tags = {
        PixelData: "x7fe00010",
    };
    return DicomConstants;
})();
/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./IDicomReader.ts" />
/// <reference path="./../DicomElement.ts" />
/// <reference path="./../DicomTag.ts" />
/// <reference path="./../utils/DicomConstants.ts" />
var ExplicitDicomReader = (function () {
    function ExplicitDicomReader() {
    }
    ExplicitDicomReader.prototype.readTag = function (stream) {
        if (stream === undefined) {
            throw "ExplicitDicomReader.readTag: stream can't be undefined";
        }
        var tag = new DicomTag();
        tag.group = stream.readUint16();
        tag.element = stream.readUint16();
        return tag;
    };
    ExplicitDicomReader.prototype.readElement = function (stream) {
        if (stream === undefined) {
            throw "ExplicitDicomReader.readTag: stream can't be undefined";
        }
        var element = new DicomElement();
        var tag = this.readTag(stream);
        element.tag = tag.getCode();
        element.tagName = tag.findName();
        element.tagSearchCode = tag.getDicomLookupSearchCode();
        element.vr = stream.readFixedString(2);
        var dataLengthSizeBytes = this._getDataLengthSizeInBytesForVR(element.vr);
        if (dataLengthSizeBytes === 2) {
            element.length = stream.readUint16();
            element.offset = stream.position;
        }
        else {
            stream.seek(2);
            element.length = stream.readUint32();
            element.offset = stream.position;
        }
        if (element.length === 4294967295) {
            element.isUndefinedLength = true;
            if (element.tag === DicomConstants.Tags.PixelData) {
                // find image pixels size
                return element;
            }
            else {
                // find item delimitation 
                return element;
            }
        }
        if (element.vr === 'SQ') {
        }
        stream.seek(element.length);
        return element;
    };
    ExplicitDicomReader.prototype._getDataLengthSizeInBytesForVR = function (vr) {
        if (vr === 'OB' || vr === 'OW' || vr === 'SQ' || vr === 'OF' || vr === 'UT' || vr === 'UN') {
            return 4;
        }
        else {
            return 2;
        }
    };
    return ExplicitDicomReader;
})();
/// <reference path="./typing/browserify.d.ts" />
/// <reference path="./ByteStream.ts" />
/// <reference path="./ByteArrayParsers/IByteArrayParser.ts" />
/// <reference path="./ByteArrayParsers/LittleEndianByteArrayParser.ts" />
/// <reference path="./DicomReaders/ExplicitDicomReader.ts" />
/// <reference path="./DicomElement.ts" />
/// <reference path="./DicomDataSet.ts" />
var JsDicomParser = (function () {
    function JsDicomParser() {
    }
    JsDicomParser.prototype.parse = function (byteArray, option) {
        var littleEndianStream = new ByteStream(byteArray, new LittleEndianByteArrayParser());
        this._readPart10Header(littleEndianStream);
    };
    // read dicom header according to PS3.10 (http://medical.nema.org/dicom/2013/output/chtml/part10/PS3.10.html)
    // Spoiler: always in Explicit VR Little Endian
    JsDicomParser.prototype._readPart10Header = function (stream) {
        this._checkDicomPrefix(stream);
        var dicomReader = new ExplicitDicomReader();
        var elements = [];
        while (stream.position < stream.byteArray.length) {
            var position = stream.position;
            var element = dicomReader.readElement(stream);
            if (element.tag > 'x0002ffff') {
                stream.position = position;
                break;
            }
            elements[element.tag] = element;
            elements.push(element);
        }
        var dataSet = new DicomDataSet(stream.byteArray, stream.byteArrayParser, elements);
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].vr == "UL") {
                console.debug("", elements[i], dataSet.getElementAsUint32(elements[i].tag));
            }
            else {
                console.debug("", elements[i], dataSet.getElementAsString(elements[i].tag));
            }
        }
    };
    JsDicomParser.prototype._checkDicomPrefix = function (stream) {
        stream.seek(128);
        var prefix = stream.readFixedString(4);
        console.debug(prefix);
        if (prefix !== "DICM") {
            throw "JsDicomParser._checkDicomPrefix: DICM prefix not found";
        }
    };
    return JsDicomParser;
})();

//# sourceMappingURL=jsDicomParser.js.map