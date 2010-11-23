<?php

require_once("../../StringDecimal.php");

class StringDecimalTest extends PHPUnit_Framework_TestCase {

	function setup() {
		$this->sd = new StringDecimal();
	}

	function test__string_to_array() {
		$this->assertEquals(array(0), $this->sd->_string_to_array("0"));
		$this->assertEquals(array(1), $this->sd->_string_to_array("1"));
		$this->assertEquals(array(9), $this->sd->_string_to_array("9"));
		$this->assertEquals(array(1, 0), $this->sd->_string_to_array("10"));
		$this->assertEquals(array(1, 9, 2, 8, 3, 7, 4, 6, 5, 0), $this->sd->_string_to_array("1928374650"));
	}

	function test__array_to_string() {
		$this->assertEquals("0", $this->sd->_array_to_string(array(0)));
		$this->assertEquals("1", $this->sd->_array_to_string(array(1)));
		$this->assertEquals("9", $this->sd->_array_to_string(array(9)));
		$this->assertEquals("10", $this->sd->_array_to_string(array(1, 0)));
		$this->assertEquals("1928374650", $this->sd->_array_to_string(array(1, 9, 2, 8, 3, 7, 4, 6, 5, 0)));
	}

	function test__array_add() {
		$this->assertEquals(array(0), $this->sd->_array_add(array(0), array(0)), "zero plus zero is zero");
		$this->assertEquals(array(2), $this->sd->_array_add(array(1), array(1)), "one plus one is two");
		$this->assertEquals(array(3, 4), $this->sd->_array_add(array(1, 0), array(2, 4)), "one zero plus two four is three four");
		$this->assertEquals(array(10), $this->sd->_array_add(array(9), array(1)), "nine plus one is ten");
	}

	function test__array_multiply() {
		$this->assertEquals(array(0), $this->sd->_array_multiply(array(0), -1), "negated zero is zero");
		$this->assertEquals(array(-1), $this->sd->_array_multiply(array(1), -1), "negated one is negative one");
		$this->assertEquals(array(-1, -2), $this->sd->_array_multiply(array(1, 2), -1), "negated one two is negative one negative two");
		$this->assertEquals(array(9, 18), $this->sd->_array_multiply(array(1, 2), 9), "one two times 9 is nine eightteen");
	}

	function test__strip_leading() {
		$base = array(
			'sign' => '+',
			'mantissa' => array(0),
			'exponent' => 0
		);

		$a = $this->sd->_copy($base);
		$b = $this->sd->_copy($base);
		$this->assertEquals($b, $this->sd->_strip_leading($a), "zero to zero");

		$a = $this->sd->_copy($base);
		$a['mantissa'] = array(0, 0);
		$b = $this->sd->_copy($base);
		$this->assertEquals($b, $this->sd->_strip_leading($a), "zerozero to zero");

		$a = $this->sd->_copy($base);
		$a['mantissa'] = array(0, 0);
		$a['exponent'] = 1;
		$b = $this->sd->_copy($base);
		$b['mantissa'] = array(0, 0);
		$b['exponent'] = 1;
		$this->assertEquals($b, $this->sd->_strip_leading($a), "zero.zero to zero.zero");

		$a = $this->sd->_copy($base);
		$a['mantissa'] = array(0, 1, 0);
		$a['exponent'] = 1;
		$b = $this->sd->_copy($base);
		$b['mantissa'] = array(1, 0);
		$b['exponent'] = 1;
		$this->assertEquals($b, $this->sd->_strip_leading($a), "zerozero.zero to zero.zero");
	}

	function test__carry() {
		$this->assertEquals(array(0), $this->sd->_carry(array(0)), "zero");
		$this->assertEquals(array(1), $this->sd->_carry(array(1)), "one");
		$this->assertEquals(array(9), $this->sd->_carry(array(9)), "nine");
		$this->assertEquals(array(1, 0), $this->sd->_carry(array(1, 0)), "one zero");
		$this->assertEquals(array(1, 0), $this->sd->_carry(array(10)), "ten");
		$this->assertEquals(array(0, 0), $this->sd->_carry(array(1, -10)), "one negative ten");
		$this->assertEquals(array(0, 1), $this->sd->_carry(array(1, -9)), "one negative nine");
		$this->assertEquals(array(0, 9), $this->sd->_carry(array(1,-1)), "one negative one");
	}

	function test__all_zero() {
		$this->assertTrue($this->sd->_all_zero(array()), "array()");
		$this->assertTrue($this->sd->_all_zero(array(0)), "array(0)");
		$this->assertFalse($this->sd->_all_zero(array(1)), "array(1)");
		$this->assertFalse($this->sd->_all_zero(array(0, 1)), "array(0, 1)");
		$this->assertFalse($this->sd->_all_zero(array(1, 0)), "array(1, 0)");
		$this->assertTrue($this->sd->_all_zero(array(0, 0)), "array(0, 0)");
	}

	function test__parse() {
		$this->assertEquals($this->sd->_parse("0"), array(
			'sign' => '+',
			'mantissa' => array(0),
			'exponent' => 0
		), "zero");
		$this->assertEquals($this->sd->_parse("-0"), array(
			'sign' => '-',
			'mantissa' => array(0),
			'exponent' => 0
		), "negative zero");
		$this->assertEquals($this->sd->_parse("1"), array(
			'sign' => '+',
			'mantissa' => array(1),
			'exponent' => 0
		), "one");
		$this->assertEquals($this->sd->_parse("+1"), array(
			'sign' => '+',
			'mantissa' => array(1),
			'exponent' => 0
		), "positive one");
		$this->assertEquals($this->sd->_parse("-1"), array(
			'sign' => '-',
			'mantissa' => array(1),
			'exponent' => 0
		), "negative one");
		$this->assertEquals($this->sd->_parse("10"), array(
			'sign' => '+',
			'mantissa' => array(1, 0),
			'exponent' => 0
		), "ten");
		$this->assertEquals(array(
			'sign' => '+',
			'mantissa' => array(1, 0),
			'exponent' => 1
		), $this->sd->_parse("1.0"), "one point aught");
		$this->assertEquals($this->sd->_parse("-1.0"), array(
			'sign' => '-',
			'mantissa' => array(1, 0),
			'exponent' => 1
		), "negative one point aught");
		$this->assertEquals($this->sd->_parse("0e-1"), array(
			'sign' => '+',
			'mantissa' => array(0, 0),
			'exponent' => 1
		), "0e-1");
		$this->assertEquals($this->sd->_parse("1e-1"), array(
			'sign' => '+',
			'mantissa' => array(0, 1),
			'exponent' => 1
		), "1e-1");
		$this->assertEquals($this->sd->_parse("1e+1"), array(
			'sign' => '+',
			'mantissa' => array(1, 0),
			'exponent' => 0
		), "1e+1");
		$this->assertEquals($this->sd->_parse("1e1"), array(
			'sign' => '+',
			'mantissa' => array(1, 0),
			'exponent' => 0
		), "1e1");
	}

	function test__parse__toobig() {
		$this->sd->_parse("1e" . $this->sd->_precision*2);
		$caught = False;
		try {
			$biggie = "1e" . ($this->sd->_precision*2 + 1);
			$this->sd->_parse($biggie);
		} catch (Exception $e) {
			$caught = True;
			$this->assertEquals("Number too big", $e->getMessage());
		}
		$this->assertTrue($caught, "Shouldn't parse over _precision*2: $biggie");
	}

	function test__format() {
		$this->assertEquals($this->sd->_format(array(
			'sign' => '+',
			'mantissa' => array(0),
			'exponent' => 0
		)), "0", "zero");
		$this->assertEquals($this->sd->_format(array(
			'sign' => '-',
			'mantissa' => array(0),
			'exponent' => 0
		)), "-0", "negative zero");
		$this->assertEquals($this->sd->_format(array(
			'sign' => '+',
			'mantissa' => array(1),
			'exponent' => 0
		)), "1", "one");
		$this->assertEquals($this->sd->_format(array(
			'sign' => '+',
			'mantissa' => array(1),
			'exponent' => 0
		)), "1", "positive one");
		$this->assertEquals($this->sd->_format(array(
			'sign' => '-',
			'mantissa' => array(1),
			'exponent' => 0
		)), "-1", "negative one");
		$this->assertEquals($this->sd->_format(array(
			'sign' => '+',
			'mantissa' => array(1, 0),
			'exponent' => 0
		)), "10", "ten");
		$this->assertEquals($this->sd->_format(array(
			'sign' => '+',
			'mantissa' => array(1, 0),
			'exponent' => 1
		)), "1.0", "one point aught");
		$this->assertEquals($this->sd->_format(array(
			'sign' => '-',
			'mantissa' => array(1, 0),
			'exponent' => 1
		)), "-1.0", "negative one point aught");
	}

	function test__match_exponents() {
		$base = array(
			'sign' => '+',
			'mantissa' => array(0),
			'exponent' => 0
		);

		$a = $this->sd->_copy($base);
		$b = $this->sd->_copy($base);
		$this->sd->_match_exponents($a, $b);
		$this->assertEquals(array(0), $a['mantissa']);
		$this->assertEquals(0, $a['exponent']);
		$this->assertEquals($b['mantissa'], $a['mantissa']);
		$this->assertEquals($b['exponent'], $a['exponent']);

		$a = $this->sd->_copy($base);
		$b = $this->sd->_copy($base);
		$a['mantissa'] = array(0, 0);
		$a['exponent'] = 1;
		$this->sd->_match_exponents($a, $b);
		$this->assertEquals(array(0, 0), $a['mantissa']);
		$this->assertEquals(1, $a['exponent']);
		$this->assertEquals($b['mantissa'], $a['mantissa']);
		$this->assertEquals($b['exponent'], $a['exponent']);

		$a = $this->sd->_copy($base);
		$b = $this->sd->_copy($base);
		$b['mantissa'] = array(0, 0);
		$b['exponent'] = 1;
		$this->sd->_match_exponents($a, $b);
		$this->assertEquals(array(0, 0), $a['mantissa']);
		$this->assertEquals(1, $a['exponent']);
		$this->assertEquals($b['mantissa'], $a['mantissa']);
		$this->assertEquals($b['exponent'], $a['exponent']);
	}

	function test__match_leading() {
		$base = array(
			'sign' => '+',
			'mantissa' => array(0),
			'exponent' => 0
		);

		$a = $this->sd->_copy($base);
		$b = $this->sd->_copy($base);
		$this->sd->_match_leading($a, $b);
		$this->assertEquals(array(0), $a['mantissa']);
		$this->assertEquals(0, $a['exponent']);
		$this->assertEquals($b['mantissa'], $a['mantissa']);
		$this->assertEquals($b['exponent'], $a['exponent']);

		$a = $this->sd->_copy($base);
		$b = $this->sd->_copy($base);
		$a['mantissa'] = array(0, 0);
		$this->sd->_match_leading($a, $b);
		$this->assertEquals(array(0, 0), $a['mantissa']);
		$this->assertEquals(0, $a['exponent']);
		$this->assertEquals($b['mantissa'], $a['mantissa']);
		$this->assertEquals($b['exponent'], $a['exponent']);

		$a = $this->sd->_copy($base);
		$b = $this->sd->_copy($base);
		$b['mantissa'] = array(0, 0);
		$this->sd->_match_leading($a, $b);
		$this->assertEquals(array(0, 0), $a['mantissa']);
		$this->assertEquals(0, $a['exponent']);
		$this->assertEquals($b['mantissa'], $a['mantissa']);
		$this->assertEquals($b['exponent'], $a['exponent']);
	}

	function test_divide_tiny_by_huge() {
		// This test is here and not in tests.json because Python's Decimal class
		// will smash the result into scientific notation.
		$this->assertEquals(
			"0.000000000000000000000000000100",
			$this->sd->divide("0.00000000000001", "100000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000010",
			$this->sd->divide("0.000000000000001", "100000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000010",
			$this->sd->divide("0.00000000000001", "1000000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000001",
			$this->sd->divide("0.000000000000001", "1000000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000000",
			$this->sd->divide("0.0000000000000001", "1000000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000000",
			$this->sd->divide("0.000000000000001", "10000000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000000",
			$this->sd->divide("0.0000000000000001", "10000000000000000", "30")
		);

		$this->assertEquals(
			"0.000000000000000000000000000050",
			$this->sd->divide("0.00000000000001", "200000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000005",
			$this->sd->divide("0.000000000000001", "200000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000005",
			$this->sd->divide("0.00000000000001", "2000000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000001",
			$this->sd->divide("0.000000000000001", "2000000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000000",
			$this->sd->divide("0.0000000000000001", "2000000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000000",
			$this->sd->divide("0.000000000000001", "20000000000000000", "30")
		);
		$this->assertEquals(
			"0.000000000000000000000000000000",
			$this->sd->divide("0.0000000000000001", "20000000000000000", "30")
		);
	}

	static function shared_testcases() {
		$f = fopen("../tests.json", "r");
		fseek($f, 21);
		$json = "";
		while ($chunk = fread($f, 8192)) {
			$json .= $chunk;
		}
		$testcases = json_decode($json);
		if ($testcases === NULL) {
			throw new Exception("Problem decoding ../test.json");
		}
		return $testcases;
	}

	/**
	 * @dataProvider shared_testcases
	 */
	function test_cases($a) {
		$args = func_get_args();
		$method = array_shift($args);
		$expected = array_pop($args);
		$this->assertEquals($expected, call_user_func_array(array($this->sd, $method), $args));
	}

}
