import { Transport } from "./Transport";

export class UDP implements Transport {
  public data: Buffer = Buffer.alloc(0);
  public offset: number = 0;

  constructor() {}

  parse(buffer: Buffer, offset: number): UDP {
    return new UDP();
  }
}
