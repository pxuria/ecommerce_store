import ZarinPal from "zarinpal-node-sdk";

export const zarinpal = new ZarinPal({
    merchantId: process.env.ZARINPAL_MERCHANT_ID! as string,
    sandbox: true,
    //   accessToken: process.env.ZARINPAL_ACESS_TOKEN,
});