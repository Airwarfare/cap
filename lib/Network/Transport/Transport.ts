export interface Transport {
  data: Buffer;
  offset: number;

  parse(buffer: Buffer, offset: number): Transport;
}
