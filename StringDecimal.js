/* Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php */
var StringDecimal = {
	_copy: function(a) {
		return {
			'sign': a.sign,
			'mantissa': a.mantissa.slice(),
			'exponent': a.exponent
		};
	},

	_string_to_array: function(str) {
		var result = [];
		for (var i = 0; i < str.length; i++) {
			result.push(parseInt(str[i], 10));
		}
		return result;
	},

	_array_to_string: function(arr) {
		var result = "";
		for (var i = 0; i < arr.length; i++) {
			result += arr[i];
		}
		return result;
	},

	_array_fill: function(length, value) {
		var result = [];
		while (length--) {
			result.push(value);
		}
		return result;
	},

	/*
	 * Parses a string into a sign, mantissa, and exponent.
	 * Note that the exponent is actually the _negative_ power
	 * of ten required to turn the raw mantissa into the real
	 * value.  e.g. {mantissa: [1, 0], exponent: 1} => '1.0'
	 */
	_parse: function(str) {
		var matches = str.match(/^(\+|-)?0*(\d+)(?:\.(\d+))?$/);
		var sign = matches[1] || '+';
		var fractional = (undefined === matches[3]) ? "" : matches[3];
		var mantissa_as_a_string = matches[2] + fractional;
		var exponent = fractional.length;
		return {
			'sign': sign,
			'mantissa': StringDecimal._string_to_array(mantissa_as_a_string),
			'exponent': exponent
		};
	},

	_format: function(obj) {
		var sign = (obj.sign == "-") ? "-" : "";
		var mantissa = StringDecimal._array_to_string(obj.mantissa);
		var decimal_point = (obj.exponent > 0) ? "." : "";
		var decimal_point_offset = mantissa.length - obj.exponent;
		return sign +
			mantissa.substr(0, decimal_point_offset) +
			decimal_point + 
			mantissa.substr(decimal_point_offset);
	},

	_array_add: function(a, b) {
		if (a.length != b.length) {
			throw "Arrays of dissimilar length cannot be added";
		}
		var result = [];
		for (var i = 0; i < a.length; i++) {
			result.push(a[i] + b[i]);
		}
		return result;
	},

	_array_multiply: function(arr, n) {
		var result = [];
		for (var i = 0; i < arr.length; i++) {
			result.push(arr[i] * n);
		}
		return result;
	},

	_match_exponents: function(a, b) {
		while (a.exponent > b.exponent) {
			b.exponent++;
			b.mantissa.push(0);
		}
		while (b.exponent > a.exponent) {
			a.exponent++;
			a.mantissa.push(0);
		}
	},

	_match_leading: function(a, b) {
		if (a.exponent != b.exponent) {
			throw "Can't match leading with different exponents";
		}
		while (a.mantissa.length > b.mantissa.length) {
			b.mantissa.unshift(0);
		}
		while (b.mantissa.length > a.mantissa.length) {
			a.mantissa.unshift(0);
		}
	},

	_strip_leading: function(a) {
		while (a.mantissa.length-1 > a.exponent && a.mantissa[0] === 0) {
			a.mantissa.shift();
		}
		return a;
	},

	_carry: function(arr) {
		var carry = 0;
		var result = [];
		var current = 0;
		for (var i = arr.length-1; i >= 0; i--) {
			current = arr[i] + carry;
			carry = Math.floor(current / 10);
			while (current < 0) {
				current += 10;
			}
			result.push(Math.round(current % 10));
		}
		if (carry > 0) {
			result.push(carry);
		}
		result.reverse();
		return result;
	},

	add: function(raw_a, raw_b) {
		var a = StringDecimal._parse(raw_a);
		var b = StringDecimal._parse(raw_b);
		var sum;
		StringDecimal._match_exponents(a, b);
		StringDecimal._match_leading(a, b);
		if (a.sign == b.sign) {
			sum = {
				'sign': a.sign,
				'mantissa': StringDecimal._carry(StringDecimal._array_add(a.mantissa, b.mantissa)),
				'exponent': a.exponent
			};
		} else {
			// You, too, can run the tests to convince yourself that this is correct. :)
			if (a.mantissa > b.mantissa) {
				sum = {
					'sign': a.sign,
					'mantissa': StringDecimal._carry(StringDecimal._array_add(a.mantissa, StringDecimal._array_multiply(b.mantissa, -1))),
					'exponent': a.exponent
				};
			} else if (a.mantissa < b.mantissa) {
				sum = {
					'sign': b.sign,
					'mantissa': StringDecimal._carry(StringDecimal._array_add(StringDecimal._array_multiply(a.mantissa, -1), b.mantissa)),
					'exponent': a.exponent
				};
			} else {
				sum = {
					'sign': '+',
					'mantissa': StringDecimal._array_fill(a.mantissa.length, 0),
					'exponent': a.exponent
				};
			}
		}
		return StringDecimal._format(StringDecimal._strip_leading(sum));
	},

	subtract: function(raw_a, raw_b) {
		var b = StringDecimal._parse(raw_b);
		b.sign = (b.sign == "-") ? "+" : "-";
		return StringDecimal.add(raw_a, StringDecimal._format(b));
	},

	multiply: function(raw_a, raw_b) {
		var a = StringDecimal._parse(raw_a);
		var b = StringDecimal._parse(raw_b);
		var product = {};
		if (a.sign == b.sign) {
			product.sign = '+';
		} else {
			product.sign = '-';
		}
		// This is just like in elementary school
		//   1 2
		// * 3 4
		// -----
		//   4 8
		// 3 6
		// -----
		// 4 0 8
		// Except that rfiller and lfiller put zeros in the spaces so we can just add everything together.
		// _carry() happily takes very large values to carry, and we shouldn't ever need more than the one
		// extra digit _carry() will give us at the end.
		var rfiller = StringDecimal._array_fill(b.mantissa.length-1, 0);
		var lfiller = [];
		var addends = [];
		for (var i = 0; i < b.mantissa.length; i++) {
			addends.push(lfiller.concat(StringDecimal._array_multiply(a.mantissa, b.mantissa[i]).concat(rfiller)));
			lfiller.push(rfiller.pop());
		}
		var acc = addends.pop();
		while (addends.length) {
			acc = StringDecimal._array_add(acc, addends.pop());
		}
		product.mantissa = StringDecimal._carry(acc);
		product.exponent = a.exponent + b.exponent;
		return StringDecimal._format(StringDecimal._strip_leading(product));
	},

	round: function(raw_a, places) {
		var a = StringDecimal._parse(raw_a);
		if (a.exponent > places) {
			while (a.exponent > places+1) {
				a.exponent--;
				a.mantissa.pop();
			}
			a.exponent--;
			var rounding_digit = a.mantissa.pop();
			if (rounding_digit >= 5) {
				a.mantissa[a.mantissa.length-1]++;
				a.mantissa = StringDecimal._carry(a.mantissa);
			}
		} else {
			while (a.exponent < places) {
				a.exponent++;
				a.mantissa.push(0);
			}
		}
		return StringDecimal._format(a);
	},

	_all_zero: function(a) {
		for (var i = 0; i < a.length; i++) {
			if (a[i] !== 0) {
				return false;
			}
		}
		return true;
	},

	o.divide = function(raw_a, raw_b, places) {
		return raw_a;
	}

	return o;
})();
};
