import { Internet } from "./Internet";
import { IPV4 } from "./IPV4";
import { InternetLayer } from "../ProtocolEnums";
import { IPV6 } from "./IPV6";

export class InternetDecoder {
  static decode(buffer: Buffer, internet: number): Internet {
    return this.internetType(buffer, internet);
  }

  static internetType(buffer: Buffer, internet: number) {
    switch (internet) {
      case InternetLayer.IPV4:
        return new IPV4().parse(buffer);
      case InternetLayer.IPV6:
        return new IPV6();
      default:
        return new IPV4();
    }
  }

  static decodeIP(buffer: Buffer, offset: number) {
    const trimed = buffer.slice(offset, offset + 4);
    return trimed.reduce(
      (accumulator, cur, i) => `${accumulator}${i > 0 ? "." : ""}${cur}`,
      ""
    );
  }
}
