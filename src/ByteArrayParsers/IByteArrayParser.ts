interface IByteArrayParser {    
    ReadFixedString(byteArray: number[], position: number, length: number): string;
}