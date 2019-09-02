import { Link } from "./Link";
import { LinkDecoder } from "./LinkDecoder";

export class Ethernet implements Link {
  public offset: number = 0;
  public src: string = "";
  public dest: string = "";
  public type: number = 0;

  constructor() {}

  parse(buffer: Buffer): Ethernet {
    this.src = LinkDecoder.macAddressDecode(buffer);
    this.dest = LinkDecoder.macAddressDecode(buffer);
    this.type = LinkDecoder.typeDecode(buffer);
    this.offset = LinkDecoder.offset;
    return this;
  }
}
