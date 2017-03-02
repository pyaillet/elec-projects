import math from 'mathjs';

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  console.log(format(value));
}

/**
 * Helper function to format an output a value.
 * @param {*} value
 * @return {string} Returns the formatted value
 */
function format (value) {
  var precision = 14;
  return math.format(value, precision);
}

let a = math.unit(1000000, "uF");
let b = math.unit(0.00000001, "uF");
print(a);
print(b);
console.log();
console.log(String(a)+" => " + a.toNumber("mF"));
console.log(String(b)+" => " + b.toNumber("nF"));
