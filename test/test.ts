import { Packet } from "../lib/Network/Packet";
import { LinkLayer } from "../lib/Network/ProtocolEnums";
import { Cap } from "../lib/Cap";

const c = new Cap();
const device = "\\Device\\NPF_{FBE9EE53-8D53-408C-8EFE-0C31EE7BE9F6}";
const filter = "tcp and src host 69.163.219.213";
const bufSize = 10 * 1024 * 1024;
let buffer = Buffer.alloc(65535);

const linkType = c.open(device, filter, bufSize, buffer);

c.setMinBytes && c.setMinBytes(0);

c.on("packet", (nbytes: any, trunc: any) => {
  buffer = buffer.slice(0, nbytes);
  if (linkType === "ETHERNET") {
    const t = new Packet(buffer, LinkLayer.Ethernet);
    console.log("");
  }
});
