test("_string_to_array", function() {
	same(StringDecimal._string_to_array("0"), [0], "zero");
	same(StringDecimal._string_to_array("1"), [1], "one");
	same(StringDecimal._string_to_array("9"), [9], "nine");
	same(StringDecimal._string_to_array("10"), [1, 0], "ten");
	same(StringDecimal._string_to_array("1928374650"), [1, 9, 2, 8, 3, 7, 4, 6, 5, 0], "pandigital");
});

test("_array_to_string", function() {
	same(StringDecimal._array_to_string([0]), "0", "zero");
	same(StringDecimal._array_to_string([1]), "1", "one");
	same(StringDecimal._array_to_string([9]), "9", "nine");
	same(StringDecimal._array_to_string([1, 0]), "10", "ten");
	same(StringDecimal._array_to_string([1, 9, 2, 8, 3, 7, 4, 6, 5, 0]), "1928374650", "pandigital");
});

test("_parse", function() {
	same(StringDecimal._parse("0"), {
		'sign': '+',
		'mantissa': [0],
		'exponent': 0
	}, "zero");
	same(StringDecimal._parse("-0"), {
		'sign': '-',
		'mantissa': [0],
		'exponent': 0
	}, "negative zero");
	same(StringDecimal._parse("1"), {
		'sign': '+',
		'mantissa': [1],
		'exponent': 0
	}, "one");
	same(StringDecimal._parse("+1"), {
		'sign': '+',
		'mantissa': [1],
		'exponent': 0
	}, "positive one");
	same(StringDecimal._parse("-1"), {
		'sign': '-',
		'mantissa': [1],
		'exponent': 0
	}, "negative one");
	same(StringDecimal._parse("10"), {
		'sign': '+',
		'mantissa': [1, 0],
		'exponent': 0
	}, "ten");
	same(StringDecimal._parse("1.0"), {
		'sign': '+',
		'mantissa': [1, 0],
		'exponent': 1
	}, "one point aught");
	same(StringDecimal._parse("-1.0"), {
		'sign': '-',
		'mantissa': [1, 0],
		'exponent': 1
	}, "negative one point aught");
});

test("_format", function() {
	same(StringDecimal._format({
		'sign': '+',
		'mantissa': [0],
		'exponent': 0
	}), "0", "zero");
	same(StringDecimal._format({
		'sign': '-',
		'mantissa': [0],
		'exponent': 0
	}), "-0", "negative zero");
	same(StringDecimal._format({
		'sign': '+',
		'mantissa': [1],
		'exponent': 0
	}), "1", "one");
	same(StringDecimal._format({
		'sign': '+',
		'mantissa': [1],
		'exponent': 0
	}), "1", "positive one");
	same(StringDecimal._format({
		'sign': '-',
		'mantissa': [1],
		'exponent': 0
	}), "-1", "negative one");
	same(StringDecimal._format({
		'sign': '+',
		'mantissa': [1, 0],
		'exponent': 0
	}), "10", "ten");
	same(StringDecimal._format({
		'sign': '+',
		'mantissa': [1, 0],
		'exponent': 1
	}), "1.0", "one point aught");
	same(StringDecimal._format({
		'sign': '-',
		'mantissa': [1, 0],
		'exponent': 1
	}), "-1.0", "negative one point aught");
});


test("_match_exponents", function() {
	var copy = function(a) {
		return {
			'sign': a.sign,
			'mantissa': a.mantissa.slice(),
			'exponent': a.exponent
		}
	}
	var base = {
		'sign': '+',
		'mantissa': [0],
		'exponent': 0
	};
	var a, b;

	a = copy(base);
	b = copy(base);
	StringDecimal._match_exponents(a, b);
	same(a.mantissa, [0]);
	same(a.exponent, 0);
	same(a.mantissa, b.mantissa);
	same(a.exponent, b.exponent);

	a = copy(base);
	b = copy(base);
	a.mantissa = [0, 0];
	a.exponent = 1;
	StringDecimal._match_exponents(a, b);
	same(a.mantissa, [0, 0]);
	same(a.exponent, 1);
	same(a.mantissa, b.mantissa);
	same(a.exponent, b.exponent);

	a = copy(base);
	b = copy(base);
	b.mantissa = [0, 0];
	b.exponent = 1;
	StringDecimal._match_exponents(a, b);
	same(a.mantissa, [0, 0]);
	same(a.exponent, 1);
	same(a.mantissa, b.mantissa);
	same(a.exponent, b.exponent);
});

/* Copied directly from tests.json */
var operator_tests = [
	["add", "0", "0", "0"],
	["add", "0", "0.0", "0.0"],
	["add", "0.0", "0", "0.0"],
	["add", "0.0", "0.0", "0.0"],
	["add", "0.00", "0", "0.00"],

	["add", "-0", "0", "0"],
	["add", "0", "-0", "0"],
	["add", "-0", "-0", "-0"],

	["add", "1", "0", "1"],
	["add", "0", "1", "1"],
	["add", "1", "1", "2"],
	["add", "1.0", "1", "2.0"],
	["add", "1", "1.0", "2.0"],
	["add", "1.0", "1.0", "2.0"],
	["add", "1.00", "1.0", "2.00"],

	["add", "1", "-1", "0"],
	["add", "0", "-1", "-1"],
	["add", "2", "-1", "1"],
	["add", "1", "-2", "-1"],
	["add", "1.0", "-1", "0.0"],
	["add", "0.0", "-1", "-1.0"],
	["add", "2.0", "-1", "1.0"],
	["add", "1.0", "-2", "-1.0"],
	["add", "1", "-1.0", "0.0"],
	["add", "0", "-1.0", "-1.0"],
	["add", "2", "-1.0", "1.0"],
	["add", "1", "-2.0", "-1.0"],

	["add", "-1", "1", "0"],
	["add", "-0", "1", "1"],
	["add", "-2", "1", "-1"],
	["add", "-1", "2", "1"],
	["add", "-1.0", "1", "0.0"],
	["add", "-0.0", "1", "1.0"],
	["add", "-2.0", "1", "-1.0"],
	["add", "-1.0", "2", "1.0"],
	["add", "-1", "1.0", "0.0"],
	["add", "-0", "1.0", "1.0"],
	["add", "-2", "1.0", "-1.0"],
	["add", "-1", "2.0", "1.0"]
];

for (var i = 0; i < operator_tests.length; i++) {
	test("operator_tests case "+i, 1, (
		function(testcase) {
			return function() {
				var actual = StringDecimal.add(testcase[1], testcase[2]);
				var message = testcase[0]+"('"+testcase[1]+"', '"+testcase[2]+"')";
				same(actual, testcase[3], message)
			}
		}
	)(operator_tests[i]));
}
