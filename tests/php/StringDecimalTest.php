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
