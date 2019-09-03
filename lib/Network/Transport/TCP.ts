import { Transport } from "./Transport";
import { TCPOptionsDecoder, TCPOption } from "./TCPOptions";

export class TCP implements Transport {
  public offset: number = 0;
  public srcPort: number = 0;
  public dstPort: number = 0;

  public sequenceNumber: Buffer = Buffer.alloc(4);
  public acknowledgementNumber: Buffer = Buffer.alloc(4);

  // Flags
  public headerLength: number = 0;
  public nonce: boolean = false;
  public cwr: boolean = false;
  public ecnEcho: boolean = false;
  public urgent: boolean = false;
  public acknowledgement: boolean = false;
  public push: boolean = false;
  public reset: boolean = false;
  public syn: boolean = false;
  public fin: boolean = false;

  public window: number = 0;
  public checksum: string = "";
  public urgentPointer: number = 0;
  public options: TCPOption[] = [];
  public data: Buffer = Buffer.alloc(0);

  parse(buffer: Buffer): TCP {
    this.getSourcePort(buffer);
    this.getDestinationPort(buffer);
    this.getSequenceNumber(buffer);
    this.getAcknowledgementNumber(buffer);
    this.getHeaderLength(buffer);

    // Flags
    this.getNonce(buffer);
    this.offset++;
    this.getCWR(buffer);
    this.getEcnEcho(buffer);
    this.getUrgent(buffer);
    this.getAcknowledgement(buffer);
    this.getPush(buffer);
    this.getReset(buffer);
    this.getSyn(buffer);
    this.getFin(buffer);
    this.offset++;

    this.getWindow(buffer);
    this.getChecksum(buffer);
    this.getUrgentPointer(buffer);
    if (this.offset !== this.headerLength * 4) this.getOptions(buffer);
    this.getData(buffer);
    return this;
  }

  getSourcePort(buffer: Buffer) {
    this.srcPort = this.sliceParseInt(buffer, 2);
  }

  getDestinationPort(buffer: Buffer) {
    this.dstPort = this.sliceParseInt(buffer, 2);
  }

  getSequenceNumber(buffer: Buffer) {
    // TODO: Proper parse
    buffer.copy(this.sequenceNumber, 0, this.offset, this.offset + 4);
    this.offset += 4;
  }

  getAcknowledgementNumber(buffer: Buffer) {
    buffer.copy(this.acknowledgementNumber, 0, this.offset, this.offset + 4);
    this.offset += 4;
  }

  getHeaderLength(buffer: Buffer) {
    this.headerLength = buffer.slice(this.offset, this.offset + 1)[0] >>> 4;
  }

  getNonce(buffer: Buffer) {
    this.nonce = !!(buffer.slice(this.offset, this.offset + 1)[0] & 0x1);
  }

  getCWR(buffer: Buffer) {
    this.cwr = this.checkFlag(buffer, 7);
  }

  getEcnEcho(buffer: Buffer) {
    this.ecnEcho = this.checkFlag(buffer, 6);
  }

  getUrgent(buffer: Buffer) {
    this.urgent = this.checkFlag(buffer, 5);
  }

  getAcknowledgement(buffer: Buffer) {
    this.acknowledgement = this.checkFlag(buffer, 4);
  }

  getPush(buffer: Buffer) {
    this.push = this.checkFlag(buffer, 3);
  }

  getReset(buffer: Buffer) {
    this.reset = this.checkFlag(buffer, 2);
  }

  getSyn(buffer: Buffer) {
    this.syn = this.checkFlag(buffer, 1);
  }

  getFin(buffer: Buffer) {
    this.fin = this.checkFlag(buffer, 0);
  }

  getWindow(buffer: Buffer) {
    this.window = this.sliceParseInt(buffer, 2);
  }

  getChecksum(buffer: Buffer) {
    this.checksum = this.sliceParseString(buffer, 2);
  }

  getUrgentPointer(buffer: Buffer) {
    this.urgentPointer = this.sliceParseInt(buffer, 2);
  }

  getOptions(buffer: Buffer) {
    this.options = TCPOptionsDecoder.parse(
      buffer.slice(this.offset, this.headerLength * 4)
    );
    this.offset = this.headerLength * 4;
  }

  getData(buffer: Buffer) {
    this.data = Buffer.from(buffer.slice(this.offset, buffer.length));
  }

  checkFlag(buffer: Buffer, offset: number) {
    return !!((buffer.slice(this.offset, this.offset + 1)[0] >>> offset) & 0x1);
  }

  sliceParseInt(buffer: Buffer, length: number) {
    const trimed = this.sliceParse(buffer, length);
    return parseInt(trimed.toString("hex"), 16);
  }

  sliceParseString(buffer: Buffer, length: number) {
    const trimed = this.sliceParse(buffer, length);
    return trimed.toString("hex");
  }

  sliceParse(buffer: Buffer, length: number) {
    const trimed = buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return trimed;
  }
}
