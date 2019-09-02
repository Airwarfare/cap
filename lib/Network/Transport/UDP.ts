import { Transport } from "./Transport";

export class UDP implements Transport {
  constructor() {}

  parse(buffer: Buffer, offset: number): UDP {
    return new UDP();
  }
}
