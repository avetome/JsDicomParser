/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./IByteArrayParser.ts" />

class LittleEndianByteArrayParser implements IByteArrayParser {

    ReadFixedString(byteArray: number[], position: number, length: number):string {
        if(length < 0)
        {
            throw 'LittleEndianByteArrayParser.ReadFixedString: length cannot be less than 0';
        }

        if(position + length > byteArray.length) {
            throw 'LittleEndianByteArrayParser.ReadFixedString: length cannot be more than buffer.length';
        }

        var result:string = "";

        for(var i:number = 0; i < length; i++)
        {
            var byte = byteArray[position + i];

            if(byte === 0) {
                position +=  length;
                return result;
            }

            result += String.fromCharCode(byte);
        }

        return result;
    }
}

export = LittleEndianByteArrayParser;