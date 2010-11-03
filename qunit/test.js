function copy_StringDecimal(a) {
	return {
		'sign': a.sign,
		'mantissa': a.mantissa.slice(),
		'exponent': a.exponent
	}
}

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

test("_array_add", function() {
	same(StringDecimal._array_add([0], [0]), [0], "zero plus zero is zero");
	same(StringDecimal._array_add([1], [1]), [2], "one plus one is two");
	same(StringDecimal._array_add([1, 0], [2, 4]), [3, 4], "one zero plus two four is three four");
	same(StringDecimal._array_add([9], [1]), [10], "nine plus one is ten");
});

test("_array_multiply", function() {
	same(StringDecimal._array_multiply([0], -1), [0], "negated zero is zero");
	same(StringDecimal._array_multiply([1], -1), [-1], "negated one is negative one");
	same(StringDecimal._array_multiply([1, 2], -1), [-1, -2], "negated one two is negative one negative two");
	same(StringDecimal._array_multiply([1, 2], 9), [9, 18], "one two times 9 is nine eightteen");
})

test("_array_fill", function() {
	same(StringDecimal._array_fill(0, 0), [], "empty array");
	same(StringDecimal._array_fill(1, 0), [0], "a zero");
	same(StringDecimal._array_fill(2, 0), [0, 0], "two zeros");
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
	var base = {
		'sign': '+',
		'mantissa': [0],
		'exponent': 0
	};
	var a, b;

	a = copy_StringDecimal(base);
	b = copy_StringDecimal(base);
	StringDecimal._match_exponents(a, b);
	same(a.mantissa, [0]);
	same(a.exponent, 0);
	same(a.mantissa, b.mantissa);
	same(a.exponent, b.exponent);

	a = copy_StringDecimal(base);
	b = copy_StringDecimal(base);
	a.mantissa = [0, 0];
	a.exponent = 1;
	StringDecimal._match_exponents(a, b);
	same(a.mantissa, [0, 0]);
	same(a.exponent, 1);
	same(a.mantissa, b.mantissa);
	same(a.exponent, b.exponent);

	a = copy_StringDecimal(base);
	b = copy_StringDecimal(base);
	b.mantissa = [0, 0];
	b.exponent = 1;
	StringDecimal._match_exponents(a, b);
	same(a.mantissa, [0, 0]);
	same(a.exponent, 1);
	same(a.mantissa, b.mantissa);
	same(a.exponent, b.exponent);
});

test('_match_leading', function() {
	var base = {
		'sign': '+',
		'mantissa': [0],
		'exponent': 0
	};
	var a, b;

	a = copy_StringDecimal(base);
	b = copy_StringDecimal(base);
	StringDecimal._match_leading(a, b);
	same(a.mantissa, [0]);
	same(a.exponent, 0);
	same(a.mantissa, b.mantissa);
	same(a.exponent, b.exponent);

	a = copy_StringDecimal(base);
	b = copy_StringDecimal(base);
	a.mantissa = [0, 0];
	StringDecimal._match_leading(a, b);
	same(a.mantissa, [0, 0]);
	same(a.exponent, 0);
	same(a.mantissa, b.mantissa);
	same(a.exponent, b.exponent);

	a = copy_StringDecimal(base);
	b = copy_StringDecimal(base);
	b.mantissa = [0, 0];
	StringDecimal._match_leading(a, b);
	same(a.mantissa, [0, 0]);
	same(a.exponent, 0);
	same(a.mantissa, b.mantissa);
	same(a.exponent, b.exponent);
});

test("_strip_leading", function() {
	var base = {
		'sign': '+',
		'mantissa': [0],
		'exponent': 0
	};

	var a = copy_StringDecimal(base);
	var b = copy_StringDecimal(base);
	same(StringDecimal._strip_leading(a), b, "zero to zero");

	var a = copy_StringDecimal(base);
	a.mantissa = [0, 0];
	var b = copy_StringDecimal(base);
	same(StringDecimal._strip_leading(a), b, "zerozero to zero");

	var a = copy_StringDecimal(base);
	a.mantissa = [0, 0];
	a.exponent = 1;
	var b = copy_StringDecimal(base);
	b.mantissa = [0, 0];
	b.exponent = 1;
	same(StringDecimal._strip_leading(a), b, "zero.zero to zero.zero");

	var a = copy_StringDecimal(base);
	a.mantissa = [0, 1, 0];
	a.exponent = 1;
	var b = copy_StringDecimal(base);
	b.mantissa = [1, 0];
	b.exponent = 1;
	same(StringDecimal._strip_leading(a), b, "zerozero.zero to zero.zero");
});

test("_carry", function() {
	same(StringDecimal._carry([0]), [0], "zero");
	same(StringDecimal._carry([1]), [1], "one");
	same(StringDecimal._carry([9]), [9], "nine");
	same(StringDecimal._carry([1, 0]), [1, 0], "one zero");
	same(StringDecimal._carry([10]), [1, 0], "ten");
	same(StringDecimal._carry([1,-10]), [0, 0], "one negative ten");
	same(StringDecimal._carry([1,-9]), [0, 1], "one negative nine");
	same(StringDecimal._carry([1,-1]), [0, 9], "one negative one");
});

/* Copied directly from tests.json */
var operator_tests = [
	["add", "0", "0", "0"],
	["add", "0", "0.0", "0.0"],
	["add", "0.0", "0", "0.0"],
	["add", "0.0", "0.0", "0.0"],
	["add", "0.00", "0", "0.00"],
	["add", "0.00", "0.0", "0.00"],

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
	["add", "10", "-1", "9"],
	["add", "1", "-10", "-9"],

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
	["add", "-1", "2.0", "1.0"],
	["add", "-10", "1", "-9"],
	["add", "-1", "10", "9"],

	["add", "-1", "-1", "-2"],
	["add", "-10", "-1", "-11"],
	["add", "-1.0", "-1", "-2.0"],

	["add", "1", "10", "11"],
	["add", "1", "19", "20"],
	["add", "19", "9", "28"],

	["add", "3.1415926535898", "2.718281828", "5.8598744815898"],
	["add", "1000000000000000", "0.0000000000000001", "1000000000000000.0000000000000001"],
	["add", "1000000000000000", "-0.0000000000000001", "999999999999999.9999999999999999"],

	["subtract", "0", "0", "0"],
	["subtract", "0", "0.0", "0.0"],
	["subtract", "0.0", "0", "0.0"],
	["subtract", "0.0", "0.0", "0.0"],
	["subtract", "0.00", "0", "0.00"],
	["subtract", "0.00", "0.0", "0.00"],

	["subtract", "-0", "0", "-0"],
	["subtract", "0", "-0", "0"],
	["subtract", "-0", "-0", "0"],

	["subtract", "1", "0", "1"],
	["subtract", "0", "1", "-1"],
	["subtract", "1", "1", "0"],
	["subtract", "1.0", "1", "0.0"],
	["subtract", "1", "1.0", "0.0"],
	["subtract", "1.0", "1.0", "0.0"],
	["subtract", "1.00", "1.0", "0.00"],

	["subtract", "1", "-1", "2"],
	["subtract", "0", "-1", "1"],
	["subtract", "2", "-1", "3"],
	["subtract", "1", "-2", "3"],
	["subtract", "1.0", "-1", "2.0"],
	["subtract", "0.0", "-1", "1.0"],
	["subtract", "2.0", "-1", "3.0"],
	["subtract", "1.0", "-2", "3.0"],
	["subtract", "1", "-1.0", "2.0"],
	["subtract", "0", "-1.0", "1.0"],
	["subtract", "2", "-1.0", "3.0"],
	["subtract", "1", "-2.0", "3.0"],
	["subtract", "10", "-1", "11"],
	["subtract", "1", "-10", "11"],

	["subtract", "-1", "1", "-2"],
	["subtract", "-0", "1", "-1"],
	["subtract", "-2", "1", "-3"],
	["subtract", "-1", "2", "-3"],
	["subtract", "-1.0", "1", "-2.0"],
	["subtract", "-0.0", "1", "-1.0"],
	["subtract", "-2.0", "1", "-3.0"],
	["subtract", "-1.0", "2", "-3.0"],
	["subtract", "-1", "1.0", "-2.0"],
	["subtract", "-0", "1.0", "-1.0"],
	["subtract", "-2", "1.0", "-3.0"],
	["subtract", "-1", "2.0", "-3.0"],
	["subtract", "-10", "1", "-11"],
	["subtract", "-1", "10", "-11"],

	["subtract", "-1", "-1", "0"],
	["subtract", "-10", "-1", "-9"],
	["subtract", "-1.0", "-1", "0.0"],

	["subtract", "1", "10", "-9"],
	["subtract", "10", "1", "9"],
	["subtract", "1", "19", "-18"],
	["subtract", "19", "9", "10"],

	["subtract", "3.1415926535898", "2.718281828", "0.4233108255898"],
	["subtract", "1000000000000000", "0.0000000000000001", "999999999999999.9999999999999999"],
	["subtract", "1000000000000000", "-0.0000000000000001", "1000000000000000.0000000000000001"],

	["multiply", "0", "0", "0"],
	["multiply", "0", "0.0", "0.0"],
	["multiply", "0.0", "0", "0.0"],
	["multiply", "0.0", "0.0", "0.00"],
	["multiply", "0.00", "0", "0.00"],
	["multiply", "0.00", "0.0", "0.000"],

	["multiply", "-0", "0", "-0"],
	["multiply", "0", "-0", "-0"],
	["multiply", "-0", "-0", "0"],

	["multiply", "1", "0", "0"],
	["multiply", "0", "1", "0"],
	["multiply", "1", "1", "1"],
	["multiply", "1.0", "1", "1.0"],
	["multiply", "1", "1.0", "1.0"],
	["multiply", "1.0", "1.0", "1.00"],
	["multiply", "1.00", "1.0", "1.000"],

	["multiply", "1", "-1", "-1"],
	["multiply", "0", "-1", "-0"],
	["multiply", "2", "-1", "-2"],
	["multiply", "1", "-2", "-2"],
	["multiply", "1.0", "-1", "-1.0"],
	["multiply", "0.0", "-1", "-0.0"],
	["multiply", "2.0", "-1", "-2.0"],
	["multiply", "1.0", "-2", "-2.0"],
	["multiply", "1", "-1.0", "-1.0"],
	["multiply", "0", "-1.0", "-0.0"],
	["multiply", "2", "-1.0", "-2.0"],
	["multiply", "1", "-2.0", "-2.0"],
	["multiply", "10", "-1", "-10"],
	["multiply", "1", "-10", "-10"],

	["multiply", "-1", "1", "-1"],
	["multiply", "-0", "1", "-0"],
	["multiply", "-2", "1", "-2"],
	["multiply", "-1", "2", "-2"],
	["multiply", "-1.0", "1", "-1.0"],
	["multiply", "-0.0", "1", "-0.0"],
	["multiply", "-2.0", "1", "-2.0"],
	["multiply", "-1.0", "2", "-2.0"],
	["multiply", "-1", "1.0", "-1.0"],
	["multiply", "-0", "1.0", "-0.0"],
	["multiply", "-2", "1.0", "-2.0"],
	["multiply", "-1", "2.0", "-2.0"],
	["multiply", "-10", "1", "-10"],
	["multiply", "-1", "10", "-10"],

	["multiply", "-1", "-1", "1"],
	["multiply", "-10", "-1", "10"],
	["multiply", "-1.0", "-1", "1.0"],

	["multiply", "1", "10", "10"],
	["multiply", "10", "1", "10"],
	["multiply", "1", "19", "19"],
	["multiply", "19", "9", "171"],

	["multiply", "99", "9", "891"],
	["multiply", "3.1415926535898", "2.718281828", "8.5397342212314523061544"],
	["multiply", "1000000000000000", "0.0000000000000001", "0.1000000000000000"],
	["multiply", "1000000000000000", "-0.0000000000000001", "-0.1000000000000000"]
];

for (var i = 0; i < operator_tests.length; i++) {
	var testcase = operator_tests[i];
	var name = testcase[0]+"('"+testcase[1]+"', '"+testcase[2]+"')";
	test("operator_tests case "+name, 1, (
		function(testcase, name) {
			return function() {
				var actual = StringDecimal[testcase[0]](testcase[1], testcase[2]);
				same(actual, testcase[3], name);
			}
		}
	)(testcase, name));
}
