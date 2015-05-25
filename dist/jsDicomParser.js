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
    return ByteStream;
})();

/// <reference path="./typing/browserify.d.ts" />
/// <reference path="./ByteArrayParsers/IByteArrayParser.ts" />
var JsDicomParser = (function () {
    function JsDicomParser() {
    }
    JsDicomParser.prototype.parse = function (byteArray, option) {
    };
    // read dicom header according to PS3.10 (http://medical.nema.org/dicom/2013/output/chtml/part10/PS3.10.html)
    JsDicomParser.prototype._readPart10Header = function () {
    };
    JsDicomParser.prototype._readDicomPrefix = function () {
    };
    return JsDicomParser;
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
    return LittleEndianByteArrayParser;
})();

//# sourceMappingURL=jsDicomParser.js.map