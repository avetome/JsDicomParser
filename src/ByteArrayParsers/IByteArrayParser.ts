interface IByteArrayParser {    
    ReadFixedString(byteArray: Uint8Array, position: number, length: number): string;
}