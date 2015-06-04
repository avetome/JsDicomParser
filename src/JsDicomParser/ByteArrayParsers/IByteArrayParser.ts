module JsDicomParser {
    export interface IByteArrayParser {
        ReadFixedString(byteArray: Uint8Array, position: number, length: number): string;

        readUint16(byteArray: Uint8Array, position: number): number;

        readUint32(byteArray: Uint8Array, position: number): number;

        readFloat(byteArray: Uint8Array, position: number): number;
    }
}