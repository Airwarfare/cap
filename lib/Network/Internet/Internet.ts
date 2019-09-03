export interface Internet {
  offset: number;
  protocol: number;

  parse(buffer: Buffer, offset: number): Internet;
}
