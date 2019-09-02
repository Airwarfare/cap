import { Transport } from "./Transport";

export class TCP implements Transport {
  constructor() {}

  parse(buffer: Buffer, offset: number): TCP {
    return this;
  }
}
