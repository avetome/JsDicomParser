/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./IByteArrayParser.ts" />

class LittleEndianByteArrayParser implements IByteArrayParser {

    ReadFixedString(byteArray: Uint8Array, position: number, length: number):string {
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

    readUint16(byteArray: Uint8Array, position: number):number {
        if (position < 0) {
            throw 'LittleEndianByteArrayParser.readUint16: position cannot be less than 0';
        }
        if (position + 2 > byteArray.length) {
            throw 'LittleEndianByteArrayParser.readUint16: length cannot be more than buffer.length';
        }

        return byteArray[position] + (byteArray[position + 1] * 256);        
    }

    readUint32(byteArray: Uint8Array, position: number):number {
        if (position < 0) {
            throw 'LittleEndianByteArrayParser.readUint16: position cannot be less than 0';
        }

        if (position + 4 > byteArray.length) {
            throw 'LittleEndianByteArrayParser.readUint16: length cannot be more than buffer.length';
        }

        var uint32 = (byteArray[position] +
        (byteArray[position + 1] * 256) +
        (byteArray[position + 2] * 256 * 256) +
        (byteArray[position + 3] * 256 * 256 * 256 ));

        return uint32;
    }    
}