const _ = require('lodash')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'app', alias: 'a', type: String },
  { name: 'domains', type: String},
]

const options = commandLineArgs(optionDefinitions)

const s = require("./"+options.app)
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

function permute(input) {
	var permArr = [],
	usedChars = [];

	return digg(input)

	function digg(input) {
	  var i, ch;
	  for (i = 0; i < input.length; i++) {
		ch = input.splice(i, 1)[0];
		usedChars.push(ch);
		if (input.length == 0) {
		  permArr.push(usedChars.slice());
		}
		digg(input);
		input.splice(i, 0, ch);
		usedChars.pop();
	  }
	  return permArr
	};
}


function calcSolution(s) {
	let cost = 0
	s.edges.forEach(e => {
		srcNode = s.nodes[e.input]
		dstNode = s.nodes[e.func]
		outNode = s.nodes[e.output]
		srcDomain = srcNode.domain
		dstDomain = dstNode.domain
		outputDomain = outNode.domain
		inputBorderCost = s.domainBorderWeights[srcDomain][dstDomain]
		outputBorderCost = s.domainBorderWeights[dstDomain][outputDomain]
		const inputCost = srcNode.sensitivity * inputBorderCost
		const outputSens = (srcNode.sensitivity * dstNode.sensitivityMult)
		const outputCost = outputSens * outputBorderCost

		cost += (((srcNode.sensitivity) + (dstNode.sensitivity)) * inputBorderCost) + 
			((dstNode.sensitivity + (srcNode.sensitivity * dstNode.sensitivityMult)) * outputBorderCost)
	})
	return cost.toFixed(2)
}

function genSolutions(s, d) {
	const solutions = []
	const numNodes = Object.keys(s.nodes).length;
	const perms = getPermutations(d, numNodes)
	console.log("No of solutions: " + perms.length)
	perms.forEach(p => {
		const c = _.cloneDeep(s)
		Object.values(c.nodes).forEach((n, i) => {
			n.domain = p[i]
		})
		solutions.push(c)
	})
	return solutions
}

function extractDomain(s) {
	let str = ""
	Object.keys(s.nodes).forEach(k => {
		const v = s.nodes[k]
		str += k+":"+v.domain +" "
	})
	return str
}
const sols = genSolutions(s, d)
let leastSols = null
let lowestCost = calcSolution(sols[1])
sols.forEach(t => {
	t.cost = calcSolution(t)
	if (t.cost <= lowestCost) {
		leastSols = t
		lowsetCost = t.cost
	}
})
sols.forEach(t => {
	console.log("cost metric: " + t.cost)
	console.log("solution: " +	extractDomain(t))
	console.log("")
})

console.log("")
console.log("least cost: " + lowsetCost)


