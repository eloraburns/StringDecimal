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

test("_all_zero", function() {
	same(StringDecimal._all_zero([]), true, "[]");
	same(StringDecimal._all_zero([0]), true, "[0]");
	same(StringDecimal._all_zero([1]), false, "[1]");
	same(StringDecimal._all_zero([0, 1]), false, "[0, 1]");
	same(StringDecimal._all_zero([1, 0]), false, "[1, 0]");
	same(StringDecimal._all_zero([0, 0]), true, "[0, 0]");
});

/* operator_tests is included via HTML wholsale (from tests.json) */

for (var i = 0; i < operator_tests.length; i++) {
	var testcase = operator_tests[i];
	var methodname = testcase[0];
	var testargs = testcase.slice(1,-1);
	var expected = testcase[testcase.length-1];
	var name = testcase[0]+"('" + testargs[0] + "'";
	for (var j = 1; j < testargs.length; j++) {
		name = name.concat(", '", testargs[j], "'");
	}
	name = name.concat(")");
	test("operator_tests case "+name, 1, (
		function(testcase, name, methodname, testargs, expected) {
			return function() {
				var actual = StringDecimal[methodname].apply(null, testargs);
				same(actual, expected, name);
			}
		}
	)(testcase, name, methodname, testargs, expected));
}
