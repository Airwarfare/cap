export interface Transport {
  parse(buffer: Buffer, offset: number): Transport;
}
