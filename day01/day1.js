const input = [1,2,3,4,5]

// First
input.reduce((acc, e) => [e, acc[1] + (e > acc[0] ? 1 : 0),[Infinity,0])

// Second
input.slice(2).reduce((acc,e) => {
	const newSum = acc.three.reduce((a,b) => a+b)
	return ({
		sum: newSum,
		three: acc.three.slice(1).concat(e),
		count: acc.count + (newSum > acc.sum ? 1 : 0),
	})
}, { sum: Infinity, three: [0].concat(input.slice(0,2)), count: 0}).count
