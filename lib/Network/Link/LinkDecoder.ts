import { Link } from "./Link";
import { Ethernet } from "./Ethernet";
import { Wifi } from "./Wifi";
import { LinkLayer } from "../ProtocolEnums";

export class LinkDecoder {
  static offset: number = 0;

  static decode(buffer: Buffer, link: number): Link {
    this.offset = 0;
    return this.linkType(buffer, link);
  }

  static macAddressDecode(buffer: Buffer) {
    const trimed = buffer.slice(this.offset, this.offset + 6);
    const macAddress = trimed.reduce(
      (accumulator, cur, i) =>
        `${accumulator}${i > 0 ? ":" : ""}${cur.toString(16)}`,
      ""
    );
    this.offset += 6;
    return macAddress;
  }

  static typeDecode(buffer: Buffer) {
    const trimed = buffer.slice(this.offset, this.offset + 2);
    const type = parseInt(trimed.toString("hex"), 16);
    this.offset += 2;
    return type;
  }

  static linkType(buffer: Buffer, link: number) {
    switch (link) {
      case LinkLayer.Ethernet:
        return new Ethernet().parse(buffer);
      case LinkLayer.Wifi:
        return new Wifi().parse(buffer);
      default:
        return new Ethernet();
    }
  }
}
