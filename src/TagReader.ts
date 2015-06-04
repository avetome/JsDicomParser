/// <reference path="./DicomTag.ts" />
/// <reference path="./ByteStream.ts" />

module JsDicomParser {
    export class TagReader {

        public static ReadTag(stream: ByteStream): DicomTag {
            if (stream === undefined) {
                throw "TagReader.ReadTag: stream can't be undefined";
            }

            var tag = new DicomTag();
            tag.group = stream.readUint16();
            tag.element = stream.readUint16();

            return tag;
        }
    }
}