/// <reference path="./IByteArrayParser.ts" />

module JsDicomParser {
    export class LittleEndianByteArrayParser implements IByteArrayParser {
        ReadFixedString(byteArray: Uint8Array, position: number, length: number): string {
            if (length < 0) {
                throw 'LittleEndianByteArrayParser.ReadFixedString: length cannot be less than 0';
            }

            if (position + length > byteArray.length) {
                throw 'LittleEndianByteArrayParser.ReadFixedString: length cannot be more than buffer.length';
            }

            var result: string = "";

            for (var i: number = 0; i < length; i++) {
                var byte = byteArray[position + i];

                if (byte === 0) {
                    position += length;
                    return result;
                }

                result += String.fromCharCode(byte);
            }

            return result;
        }

        readUint16(byteArray: Uint8Array, position: number): number {
            if (position < 0) {
                throw 'LittleEndianByteArrayParser.readUint16: position cannot be less than 0';
            }
            if (position + 2 > byteArray.length) {
                throw 'LittleEndianByteArrayParser.readUint16: length cannot be more than buffer.length';
            }

            return byteArray[position] + (byteArray[position + 1] * 256);
        }

        readUint32(byteArray: Uint8Array, position: number): number {
            if (position < 0) {
                throw 'LittleEndianByteArrayParser.readUint16: position cannot be less than 0';
            }

            if (position + 4 > byteArray.length) {
                throw 'LittleEndianByteArrayParser.readUint16: length cannot be more than buffer.length';
            }

            var uint32 = (byteArray[position] +
                (byteArray[position + 1] * 256) +
                (byteArray[position + 2] * 256 * 256) +
                (byteArray[position + 3] * 256 * 256 * 256));

            return uint32;
        }

        readFloat(byteArray: Uint8Array, position: number) {
            if (position < 0) {
                throw 'LittleEndianByteArrayParser.readFloat: position cannot be less than 0';
            }

            if (position + 4 > byteArray.length) {
                throw 'LittleEndianByteArrayParser.readFloat: length cannot be more than buffer.length';
            }

            var fa = new Uint8Array(4);
            fa[0] = byteArray[position];
            fa[1] = byteArray[position + 1];
            fa[2] = byteArray[position + 2];
            fa[3] = byteArray[position + 3];

            var floatArray = new Float32Array(fa.buffer);

            return floatArray[0];
        }
    }
}