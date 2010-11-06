<?php

class StringDecimal {

	function _copy($a) {
		return array(
			'sign' => $a['sign'],
			'mantissa' => array_slice($a['mantissa'], 0),
			'exponent' => $a['exponent']
		);
	}

	function _string_to_array($str) {
		return array_map('intval', str_split($str));
	}

	function _array_to_string($arr) {
		return join('', array_map('strval', $arr));
	}

	function _strip_leading($a) {
		while (count($a['mantissa'])-1 > $a['exponent'] && $a['mantissa'][0] === 0) {
			array_shift($a['mantissa']);
		}
		return $a;
	}

	function _parse($str) {
		preg_match("/^(\+|-)?0*(\d+)(?:\.(\d+))?(?:e((?:\+|-)?\d+))?$/i", $str, $matches);
		$sign = $matches[1] ? $matches[1] : '+';
		$fractional = strlen($matches[3]) == 0 ? "" : $matches[3];
		$mantissa_as_a_string = $matches[2] . $fractional;
		$adjust = strlen($matches[4]) == 0 ? 0 : intval($matches[4]);
		$exponent = strlen($fractional);
		$value = array(
			'sign' => $sign,
			'mantissa' => $this->_string_to_array($mantissa_as_a_string),
			'exponent' => $exponent
		);
		while ($adjust > 0) {
			if ($value['exponent'] > 0) {
				$value['exponent']--;
			} else {
				array_push($value['mantissa'], 0);
			}
			$adjust--;
		}
		while ($adjust < 0) {
			$value['exponent']++;
			if ($value['exponent'] >= count($value['mantissa'])) {
				array_unshift($value['mantissa'], 0);
			}
			$adjust++;
		}
		return $this->_strip_leading($value);
	}

	function _format($obj) {
		$sign = ($obj['sign'] == "-") ? "-" : "";
		$mantissa = $this->_array_to_string($obj['mantissa']);
		$decimal_point = ($obj['exponent'] > 0) ? "." : "";
		$decimal_point_offset = strlen($mantissa) - $obj['exponent'];
		return $sign .
			substr($mantissa, 0, $decimal_point_offset) .
			$decimal_point .
			substr($mantissa, $decimal_point_offset);
	}

}
