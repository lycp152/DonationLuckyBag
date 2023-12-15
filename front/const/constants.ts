import { Mumbai, Chain } from "@thirdweb-dev/chains";

// your token bound factory address
export const factoryAddress: string =
  "0x02101dfB77FDE026414827Fdc604ddAF224F0921";
export const implementation: string =
  "0x7fB1B923A41177Ef3Dea748e2200092D2E933Ac9";

// Your thirdweb api key - you can get one at https://thirdweb.com/dashboard/api-keys
export const TWApiKey: string =
  process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || "";
export const activeChain: Chain = Mumbai;

export const nftDropAddress: string =
  "0xC7982449f322c207d9E187FD42567B89eE08C009";
export const tokenAddress: string =
  "0x883511539539Cb491130157417768e4f82a46F96";
