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

	function _carry($arr) {
		$carry = 0;
		$result = array();
		for ($i = count($arr)-1; $i >= 0; $i--) {
			$current = $arr[$i] + $carry;
			$carry = (int)floor($current / 10);
			while ($current < 0) {
				$current += 10;
			}
			array_push($result, $current % 10);
		}
		if ($carry > 0) {
			array_push($result, $carry);
		}
		return array_reverse($result);
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

	function _array_add($a, $b) {
		if (count($a) != count($b)) {
			throw new Exception("Arrays of dissimilar length cannot be added");
		}
		$result = array();
		for ($i = 0; $i < count($a); $i++) {
			$result[$i] = $a[$i] + $b[$i];
		}
		return $result;
	}

	function _array_multiply($a, $n) {
		$result = array();
		for ($i = 0; $i < count($a); $i++) {
			$result[$i] = $a[$i] * $n;
		}
		return $result;
	}

	function _match_exponents(&$a, &$b) {
		while ($a['exponent'] > $b['exponent']) {
			$b['exponent']++;
			array_push($b['mantissa'], 0);
		}
		while ($b['exponent'] > $a['exponent']) {
			$a['exponent']++;
			array_push($a['mantissa'], 0);
		}
	}

	function _match_leading(&$a, &$b) {
		if ($a['exponent'] != $b['exponent']) {
			throw new Exception("Can't match leading with different exponents");
		}
		while (count($a['mantissa']) > count($b['mantissa'])) {
			array_unshift($b['mantissa'], 0);
		}
		while (count($b['mantissa']) > count($a['mantissa'])) {
			array_unshift($a['mantissa'], 0);
		}
	}

	function add($raw_a, $raw_b) {
		$a = $this->_parse($raw_a);
		$b = $this->_parse($raw_b);
		$this->_match_exponents($a, $b);
		$this->_match_leading($a, $b);
		if ($a['sign'] == $b['sign']) {
			$sum = array(
				'sign' => $a['sign'],
				'mantissa' => $this->_array_add($a['mantissa'], $b['mantissa']),
				'exponent' => $a['exponent']
			);
		} else {
			if ($a['mantissa'] > $b['mantissa']) {
				$sum = array(
					'sign' => $a['sign'],
					'mantissa' => $this->_array_add($a['mantissa'], $this->_array_multiply($b['mantissa'], -1)),
					'exponent' => $a['exponent']
				);
			} elseif ($a['mantissa'] < $b['mantissa']) {
				$sum = array(
					'sign' => $b['sign'],
					'mantissa' => $this->_array_add($this->_array_multiply($a['mantissa'], -1), $b['mantissa']),
					'exponent' => $a['exponent']
				);
			} else {
				$sum = array(
					'sign' => '+',
					'mantissa' => array_fill(0, count($a['mantissa']), 0),
					'exponent' => $a['exponent']
				);
			}
		}
		$sum['mantissa'] = $this->_carry($sum['mantissa']);
		return $this->_format($sum);
	}

}
