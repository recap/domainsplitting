const _ = require('lodash')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'length', alias: 'l', type: Number },
  { name: 'domains', type: String},
]

const options = commandLineArgs(optionDefinitions)

const d = options.domains.split(",")

var getPermutations = function(list, maxLen) {
    // Copy initial values as arrays
    var perm = list.map(function(val) {
        return [val];
    });
    // Our permutation generator
    var generate = function(perm, maxLen, currLen) {
        // Reached desired length
        if (currLen === maxLen) {
            return perm;
        }
        // For each existing permutation
        for (var i = 0, len = perm.length; i < len; i++) {
            var currPerm = perm.shift();
            // Create new permutation
            for (var k = 0; k < list.length; k++) {
                perm.push(currPerm.concat(list[k]));
            }
        }
        // Recurse
        return generate(perm, maxLen, currLen + 1);
    };
    // Start with size 1 because of initial values
    return generate(perm, maxLen, 1);
};

console.log(getPermutations(d, options.length))
