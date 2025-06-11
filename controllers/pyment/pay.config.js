import PayU from "payu-websdk"

const payu_key = process.env.MERCHANT_KEY || '2iZoPY'
const payu_salt = process.env.MERCHANT_SALT || 'xiSekJnGE84B47GOeh09zetYsqSMcl7F'

// create a client

const payuClient = new PayU({
    key:payu_key,
    salt:payu_salt
},process.env.PAYU_ENVIRONMENT || 'TEST')

const PayData={
    payuClient,
    payu_key,
    payu_salt
}

export {PayData}