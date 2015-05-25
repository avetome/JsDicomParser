interface IByteArrayParser {    
    ReadFixedString(byteArray: Uint8Array, position: number, length: number): string;

    readUint16(byteArray: Uint8Array, position: number):number;
}