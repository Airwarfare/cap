import { Link } from "./Link";

export class Wifi implements Link {
  public offset: number = 0;
  public type: number = -1;

  constructor() {}

  parse(buffer: Buffer): Wifi {
    return new Wifi();
  }
}
