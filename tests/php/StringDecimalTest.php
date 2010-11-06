<?php

require_once("../../StringDecimal.php");

class StringDecimalTest extends PHPUnit_Framework_TestCase {
	function setup() {
		$this->sd = new StringDecimal();
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
