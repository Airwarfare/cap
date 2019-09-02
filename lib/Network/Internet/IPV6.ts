import { Internet } from "./Internet";

export class IPV6 implements Internet {
  private offset: number = 0;

  constructor() {}

  parse(buffer: Buffer, offset: number): IPV6 {
    return new IPV6();
  }
}
