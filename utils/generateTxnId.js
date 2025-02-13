const crypto = require('node:crypto');

/**
 * Generates a unique transaction ID with the following format:
 * TXN_<timestamp>_<random_string>
 *
 * @returns {string} A unique transaction ID
 */
const generateTransactionId = (orderId) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(4).toString('hex');
  const encodedOrderId = Buffer.from(orderId.toString()).toString('base64');
  return `TXN_${timestamp}_${encodedOrderId}_${randomString}`;
};

const decodeTransactionId = (transactionId) => {
  const decodedOrderId = Buffer.from(
    transactionId.split('_')[2],
    'base64'
  ).toString('utf8');
  return decodedOrderId;
};

module.exports = { generateTransactionId, decodeTransactionId };
