import { Link } from "./Link/Link";
import { Internet } from "./Internet/Internet";
import { Transport } from "./Transport/Transport";
import { LinkDecoder } from "./Link/LinkDecoder";
import { InternetDecoder } from "./Internet/InternetDecoder";

export class Packet {
  public link: Link;
  public internet: Internet;
  // public transport: Transport;

  constructor(buffer: Buffer, link: number) {
    this.link = LinkDecoder.decode(buffer, link);
    this.internet = InternetDecoder.decode(
      buffer.slice(this.link.offset, buffer.length),
      this.link.type
    );
    // this.transport.parse(buffer, this.internet.offset);
  }
}
