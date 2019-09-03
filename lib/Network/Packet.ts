import { Link } from "./Link/Link";
import { Internet } from "./Internet/Internet";
import { Transport } from "./Transport/Transport";
import { LinkDecoder } from "./Link/LinkDecoder";
import { InternetDecoder } from "./Internet/InternetDecoder";
import { TransportDecoder } from "./Transport/TransportDecoder";

export class Packet {
  public link: Link;
  public internet: Internet;
  public transport: Transport;

  constructor(buffer: Buffer, link: number, nbytes: number) {
    this.link = LinkDecoder.decode(buffer, link);

    this.internet = InternetDecoder.decode(
      buffer.slice(this.link.offset, buffer.length),
      this.link.type
    );

    this.transport = TransportDecoder.decode(
      buffer.slice(this.internet.offset + this.link.offset, buffer.length),
      this.internet.protocol
    );

    this.transport.data = this.transport.data.slice(
      this.link.offset + this.internet.offset + this.transport.offset,
      nbytes
    );
  }
}
