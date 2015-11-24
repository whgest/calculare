Array.prototype.contains = function(val) {
    return this.indexOf(val) !== -1;
};

var symbolOrder = ['I', 'V', 'X', 'L' , 'C', 'D', 'M'];

var decimals = ['I', 'X', 'C', 'M'];
var quinarys = ['V', 'L', 'D'];

romanSort = function(x, y) {
    if (symbolOrder.indexOf(x) > symbolOrder.indexOf(y)) {
        return -1;
    }
    if (symbolOrder.indexOf(y) > symbolOrder.indexOf(x)) {
        return 1;
    }
    return 0;
};

isValidSubtractive = function(subtractor, subtractee) {
    return (decimals.contains(subtractor) &&
                (
                    decimals.indexOf(subtractor) === quinarys.indexOf(subtractee) ||
                    decimals.indexOf(subtractee) === decimals.indexOf(subtractor) + 1
                )
    )

};

convertSubtractives = function(subtractor, subtractee) {
    res = [];

    if (decimals.contains(subtractee)) {
        //decimal subtractives
        for (var i = 0; i < 9; ++i) {
            res.push(subtractor);
        }
    } else {
        //quinary subtractives
        for (var i = 0; i < 4; ++i) {
            res.push(subtractor);
        }
    }

    return res;
};

convertFromQuinary = function(numeral) {
    var res = [];

    numeral.forEach(function(char) {
        var qIndex = quinarys.indexOf(char);
        if (qIndex > -1) {
            for (var i=0; i<=4; ++i) {
                res.push(decimals[qIndex]);
            }
        } else {
            res.push(char)
        }
    });

    return res;
};

validateNumeral = function(numeral) {
    for (var i = 0; i < numeral.length; i++) {
        //non decimals can not be used in subtractive notation
        var prevChar = numeral[i-1] || null,
            thisChar = numeral[i],
            nextChar = numeral[i+1] || null,
            thirdChar = numeral[i+2] || null;

        //double quinaries (VV)
        if (quinarys.contains(thisChar) && thisChar === nextChar) {
            return false;
        }

        //invalid subtractive or values out of order (VX, XM)
        if (romanSort(thisChar, nextChar) === 1 && !isValidSubtractive(thisChar, nextChar)) {
            return false;
        }

        //invalid value before or after subtractive (IXX, IIX)
        if ((thirdChar || prevChar) &&
            isValidSubtractive(thisChar, nextChar) &&
            (romanSort(thirdChar, thisChar) !== 1 || romanSort(prevChar, thisChar) !== -1)) {
            return false;
        }
    }

    return true;

};

convertToDecimal = function(numeral) {
    res = [];
    for (var i = 0; i < numeral.length; i++) {
        //non decimals can not be used in subtractive notation
        var thisChar = numeral[i],
            nextChar = numeral[i+1] || null;

        if (isValidSubtractive(thisChar, nextChar)) {
            res = res.concat(convertSubtractives(thisChar, nextChar));
            i += 1;
        } else {
            res.push(thisChar);
        }

    }

    return convertFromQuinary(res).sort(romanSort);
};

convertToRoman = function(numeral) {
    decimals.forEach(function(decimal) {
        var howMany = numeral.lastIndexOf(decimal) - numeral.indexOf(decimal) + 1;


        while (howMany >= 4) {
            var nextDecimal = decimals[decimals.indexOf(decimal) + 1],
                nextQuinary = quinarys[decimals.indexOf(decimal)];

            if (howMany >= 10) {
                numeral.splice(numeral.indexOf(decimal), 10, nextDecimal);
            } else if (howMany === 9) {
                numeral.splice(numeral.indexOf(decimal), 10, decimal + nextDecimal);

            } else if (howMany >= 5) {
                numeral.splice(numeral.indexOf(decimal), 5, nextQuinary);
            } else if (howMany === 4) {
                numeral.splice(numeral.indexOf(decimal), 5, decimal + nextQuinary);
            }

            howMany = numeral.lastIndexOf(decimal) - numeral.indexOf(decimal) + 1;

        }
    });

    return numeral
};

var addNumeral = function(x, y) {
    var x = x.split(''),
        y = y.split(''),
        xy;

    if (!validateNumeral(x)) {
        console.log(x.join('') + ' is not a valid numeral.');
        return false;
    }

    if (!validateNumeral(y)) {
        console.log(y.join('') + ' is not a valid numeral.');
        return false;
    }

    xy = convertToDecimal(x).concat(convertToDecimal(y));

    return convertToRoman(xy.sort(romanSort)).join('');
};

console.log(addNumeral('DL', 'IV'));

