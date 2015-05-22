/// <reference path="./typing/browserify.d.ts" />
/// <reference path="./ByteArrayParsers/IByteArrayParser.ts" />

class ByteStream {

    position: number;
    byteArray: number[];
    byteArrayParser: IByteArrayParser;

    constructor(byteArray: number[], byteArrayParser: IByteArrayParser, position: number) {
        if(byteArray === undefined)
        {
            throw "ByteStream: missing required parameter 'byteArray'";
        }
        if((byteArray instanceof Uint8Array) === false) {
            throw 'ByteStream: byteArray should be instance of Uint8Array';
        }
        if(position < 0)
        {
            throw "ByteStream: position cannot be less than 0";
        }
        if(position >= byteArray.length)
        {
            throw "ByteStream: position cannot be more than or equal to byteArray.length";

        }
        if(byteArrayParser === undefined)
        {
            throw "ByteStream: missing required parameter 'byteArrayParser'";
        }        

        this.byteArray = byteArray;
        this.position = position ? position : 0;
        this.byteArrayParser = byteArrayParser;
    }

    seek(offset: number) {
        if(this.position + offset < 0)
        {
            throw "ByteStream: cannot seek to position < 0";
        }

        this.position += offset;
    }

    readFixedString(length: number) {
        var result = this.byteArrayParser.ReadFixedString(this.byteArray, this.position, length);
        this.position += length;

        return result;
    }
}

export = ByteStream;