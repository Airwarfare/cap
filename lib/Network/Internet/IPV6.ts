import { Internet } from "./Internet";

export class IPV6 implements Internet {
  public offset: number = 0;
  public protocol: number = -1;

  constructor() {}

  parse(buffer: Buffer, offset: number): IPV6 {
    return new IPV6();
  }
}
