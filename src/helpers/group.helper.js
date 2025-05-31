const seatLine = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O'];
const numberSeatInLine = 6;
const seatNumberContributor = (seatNumber) => {
    const pos = parseInt(seatNumber / numberSeatInLine);
    return seatLine[pos];
}

module.exports.groupHelper = {
    seatNumberContributor
}