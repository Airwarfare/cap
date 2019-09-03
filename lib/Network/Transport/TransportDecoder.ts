import { Transport } from "./Transport";
import { TCP } from "./TCP";
import { TransportLayer } from "../ProtocolEnums";
import { UDP } from "./UDP";

export class TransportDecoder {
  static decode(buffer: Buffer, protocol: number): Transport {
    return this.transportType(buffer, protocol);
  }

  static transportType(buffer: Buffer, protocol: number) {
    switch (protocol) {
      case TransportLayer.TCP:
        return new TCP().parse(buffer);
      case TransportLayer.UDP:
        return new UDP();
      default:
        return new TCP();
    }
  }
}
