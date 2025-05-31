function randomNumber() {
    return Math.floor(Math.random() * (100 - 50 + 1)) + 50;
}

module.exports.randomHelper = {
    randomNumber
}