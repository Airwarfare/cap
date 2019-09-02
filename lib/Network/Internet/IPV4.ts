import { Internet } from "./Internet";
import { InternetDecoder } from "./InternetDecoder";

export class IPV4 implements Internet {
  private offset: number = 0;
  public version: number = 0;
  public headerLength: number = 0;
  public servicesField: ServicesField = new ServicesField();
  public totalLength: number = 0;
  public identification: number = 0;
  public flags: IPV4Flags = new IPV4Flags();
  public ttl: number = 0;
  public protocol: number = -1;
  public checksum: string = "";
  public src: string = "";
  public dest: string = "";

  constructor() {}

  parse(buffer: Buffer): IPV4 {
    this.getVersion(buffer);
    this.getHeader(buffer);
    this.offset++;
    this.getServiceField(buffer);
    this.getTotalLength(buffer);
    this.getIdentification(buffer);
    this.getFlags(buffer);
    this.getTTL(buffer);
    this.getProtocol(buffer);
    this.getChecksum(buffer);
    this.getSrc(buffer);
    this.getDest(buffer);
    return this;
  }

  getVersion(buffer: Buffer) {
    this.version = buffer.slice(this.offset, this.offset + 1)[0] >>> 4;
  }

  getHeader(buffer: Buffer) {
    this.headerLength = buffer.slice(this.offset, this.offset + 1)[0] & 15;
  }

  getServiceField(buffer: Buffer) {
    this.servicesField.servicesCodepoint = ServicesField.getServicesCodepoint(
      buffer,
      this.offset
    );

    this.servicesField.ecn = ServicesField.getECN(buffer, this.offset);

    this.offset++;
  }

  getTotalLength(buffer: Buffer) {
    this.totalLength = this.sliceParseInt(buffer, 2);
  }

  getIdentification(buffer: Buffer) {
    this.identification = this.sliceParseInt(buffer, 2);
  }

  getFlags(buffer: Buffer) {
    this.flags.reserved = IPV4Flags.getReserved(buffer, this.offset);
    this.flags.noFragment = IPV4Flags.getNoFragment(buffer, this.offset);
    this.flags.moreFragments = IPV4Flags.getMoreFragments(buffer, this.offset);
    this.offset += 2;
  }

  getTTL(buffer: Buffer) {
    this.ttl = this.sliceParseInt(buffer, 1);
  }

  getProtocol(buffer: Buffer) {
    this.protocol = this.sliceParseInt(buffer, 1);
  }

  getChecksum(buffer: Buffer) {
    this.checksum = this.sliceParseString(buffer, 2);
  }

  getSrc(buffer: Buffer) {
    this.src = InternetDecoder.decodeIP(buffer, this.offset);
    this.offset += 4;
  }

  getDest(buffer: Buffer) {
    this.dest = InternetDecoder.decodeIP(buffer, this.offset);
    this.offset += 4;
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

class ServicesField {
  public servicesCodepoint: number = 0x0;
  public ecn: number = 0x0;

  static getServicesCodepoint(buffer: Buffer, offset: number): number {
    return buffer.slice(offset, offset + 1)[0] >>> 0x2;
  }

  static getECN(buffer: Buffer, offset: number) {
    return buffer.slice(offset, offset + 1)[0] & 0x3;
  }
}

class IPV4Flags {
  public reserved: boolean = false;
  public noFragment: boolean = false;
  public moreFragments: boolean = false;

  static getReserved(buffer: Buffer, offset: number): boolean {
    return !!(buffer.slice(offset, offset + 1)[0] >>> 7);
  }

  static getNoFragment(buffer: Buffer, offset: number): boolean {
    return !!((buffer.slice(offset, offset + 1)[0] & 0x40) >>> 6);
  }

  static getMoreFragments(buffer: Buffer, offset: number): boolean {
    return !!((buffer.slice(offset, offset + 1)[0] & 0x20) >>> 5);
  }
}
