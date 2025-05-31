const { createHash } = require('node:crypto');

const hashEmailToInt = (email) => {
    // tạo hash cho email 
    const hash = createHash('sha256').update(email).digest('hex');
    // Chuyển hex thành số BigInt
    const bigIntValue = BigInt('0x' + hash);
    // tính số dư 
    const intValue = Number(bigIntValue % BigInt(2 ** 26)); // tính đến 2^26 - 1 thôi, cho nhanh 
    return intValue; // Số nguyên từ 0 đến 2^26 - 1
}

module.exports = {
    hashEmailToInt
}