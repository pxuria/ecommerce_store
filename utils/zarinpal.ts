import ZarinPal from "zarinpal-node-sdk";

export const zarinpal = new ZarinPal({
    merchantId: process.env.ZARINPAL_MERCHANT_ID! as string,
    sandbox: process.env.NODE_ENV === 'development' ? true : false,
    //   accessToken: process.env.ZARINPAL_ACESS_TOKEN,
});