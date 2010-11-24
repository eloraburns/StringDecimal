/* Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * Copyright (c) 2010 Taavi Burns <taavi@taaviburns.ca>
 */
var StringDecimal = {
	_precision: 30,

	_all_zero: function(a) {
		for (var i = 0; i < a.length; i++) {
			if (a[i] !== 0) {
				return false;
			}
		}
		return true;
	},

	_array_add: function(a, b) {
		if (a.length != b.length) {
			throw "Arrays of dissimilar length cannot be added";
		}
		var result = new Array(a.length);
		for (var i = 0; i < a.length; i++) {
			result[i] = a[i] + b[i];
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

	_array_multiply: function(arr, n) {
		var result = new Array(arr.length);
		for (var i = 0; i < arr.length; i++) {
			result[i] = arr[i] * n;
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

	_copy: function(sd) {
		return {
			'sign': sd.sign,
			'mantissa': sd.mantissa.slice(),
			'exponent': sd.exponent
		};
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

	_string_to_array: function(str) {
		var result = [];
		for (var i = 0; i < str.length; i++) {
			result.push(parseInt(str[i], 10));
		}
		return result;
	},

	_strip_leading: function(a) {
		while (a.mantissa.length-1 > a.exponent && a.mantissa[0] === 0) {
			a.mantissa.shift();
		}
		return a;
	},

	/*
	 * Parses a string into a sign, mantissa, and exponent.
	 * Note that the exponent is actually the _negative_ power
	 * of ten required to turn the raw mantissa into the real
	 * value.  e.g. {mantissa: [1, 0], exponent: 1} => '1.0'
	 */
	_parse: function(str) {
		var matches = str.match(/^(\+|-)?0*(\d+)(?:\.(\d+))?(?:e((?:\+|-)?\d+))?$/i);
		var sign = matches[1] || '+';
		var fractional = (undefined === matches[3]) ? "" : matches[3];
		var mantissa_as_a_string = matches[2] + fractional;
		var adjust = (undefined === matches[4]) ? 0 : parseInt(matches[4]);
		var exponent = fractional.length;
		var value = {
			'sign': sign,
			'mantissa': this._string_to_array(mantissa_as_a_string),
			'exponent': exponent
		};
		if (adjust > (this._precision * 2))  {
			throw "Number too big";
		}
		while (adjust > 0) {
			if (value.exponent > 0) {
				value.exponent--;
			} else {
				value.mantissa.push(0);
			}
			adjust--;
		}
		while (adjust < 0) {
			value.exponent++;
			if (value.exponent >= value.mantissa.length) {
				value.mantissa.unshift(0);
			}
			adjust++;
		}
		return this._strip_leading(value);
	},

	_format: function(obj) {
		var sign = (obj.sign == "-") ? "-" : "";
		var mantissa = this._array_to_string(obj.mantissa);
		var decimal_point = (obj.exponent > 0) ? "." : "";
		var decimal_point_offset = mantissa.length - obj.exponent;
		return sign +
			mantissa.substr(0, decimal_point_offset) +
			decimal_point + 
			mantissa.substr(decimal_point_offset);
	},

	add: function(raw_a, raw_b) {
		var a = this._parse(raw_a);
		var b = this._parse(raw_b);
		var sum;
		this._match_exponents(a, b);
		this._match_leading(a, b);
		if (a.sign == b.sign) {
			sum = {
				'sign': a.sign,
				'mantissa': this._carry(this._array_add(a.mantissa, b.mantissa)),
				'exponent': a.exponent
			};
		} else {
			// You, too, can run the tests to convince yourself that this is correct. :)
			if (a.mantissa > b.mantissa) {
				sum = {
					'sign': a.sign,
					'mantissa': this._carry(this._array_add(a.mantissa, this._array_multiply(b.mantissa, -1))),
					'exponent': a.exponent
				};
			} else if (a.mantissa < b.mantissa) {
				sum = {
					'sign': b.sign,
					'mantissa': this._carry(this._array_add(this._array_multiply(a.mantissa, -1), b.mantissa)),
					'exponent': a.exponent
				};
			} else {
				sum = {
					'sign': '+',
					'mantissa': this._array_fill(a.mantissa.length, 0),
					'exponent': a.exponent
				};
			}
		}
		return this._format(this._strip_leading(sum));
	},

	subtract: function(raw_a, raw_b) {
		var b = this._parse(raw_b);
		b.sign = (b.sign == "-") ? "+" : "-";
		return this.add(raw_a, this._format(b));
	},

	multiply: function(raw_a, raw_b) {
		var a = this._parse(raw_a);
		var b = this._parse(raw_b);
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
		var addend_width = a.mantissa.length + b.mantissa.length - 1;
		var acc = [];
		for (var i = 0; i < addend_width; i++) {
			acc[i] = 0;
		}
		for (var i = 0; i < b.mantissa.length; i++) {
			for (var j = 0; j < a.mantissa.length; j++) {
				acc[i+j] += a.mantissa[j] * b.mantissa[i];
			}
		}
		// _carry() happily takes very large values to carry, and we shouldn't ever need more than the one
		// extra digit _carry() will give us at the end.
		product.mantissa = this._carry(acc);
		product.exponent = a.exponent + b.exponent;
		return this._format(this._strip_leading(product));
	},

	divide: function(raw_a, raw_b, places) {
		// See http://en.wikipedia.org/wiki/Division_(digital)#Newton.E2.80.93Raphson_division
		var integer_places = parseInt(places, 10);
		if (integer_places > this._precision) {
			// Doesn't make sense to let someone round to more places than our precision
			throw "Places too big";
		}
		var a = this._parse(raw_a);
		var b = this._parse(raw_b);

		if (this._all_zero(b.mantissa)) {
			return "NaN";
		}
		if (this._all_zero(a.mantissa)) {
			return this.round((((a.sign == b.sign) ? '+' : '-') + "0"), integer_places);
		}

		var adjust = 0;
		while (b.mantissa[0] === 0) {
			adjust++;
			b.exponent--;
			b.mantissa.shift();
		}
		while (b.mantissa.length > b.exponent+1) {
			adjust--;
			b.exponent++;
		}
		// Now the divisor is within [1,10]

		var extra_factor = [1, 5, 3, 2, 2, 1, 1, 1, 1, 1][b.mantissa[0]];
		if (b.sign == '-') {
			extra_factor *= -1;
		}

		// Bring the divisor within [0,1]
		b.mantissa.unshift(0);
		b.exponent++;
		adjust--;

		var new_b = this._format(b);
		// Bring the divisor within [0.5,1]
		new_b = this.multiply(new_b, ""+extra_factor);
		// Magic numbers!  See the wikipedia article.
		var x = this.add("2.9142", this.multiply(new_b, "-2"));
		var old_x = "";
		var loop_limit = this._precision;
		while (loop_limit && old_x.substr(0,this._precision+2) != x.substr(0,this._precision+2)) {
			old_x = x;
			x = this.round(
				this.multiply(
					x,
					this.subtract(
						"2",
						this.multiply(new_b, x)
					)
				),
				this._precision*2
			);
			loop_limit--;
		}
		if (loop_limit <= 0) {
			throw ("Reciprocal failed to converge in " + this._precision + " iterations");
		}

		var new_a = this.multiply(this.multiply(x, raw_a), extra_factor+"e"+adjust);

		return this.round(new_a, integer_places);
	},

	round: function(raw_a, places) {
		var integer_places = parseInt(places, 10);
		if (integer_places > this._precision*2) {
			// Need to clamp somewhere, and the divide routine
			// needs us to be able to round to _precision*2.
			throw "Places too big";
		}
		var a = this._parse(raw_a);
		if (a.exponent > integer_places) {
			while (a.exponent > integer_places+1) {
				a.exponent--;
				a.mantissa.pop();
			}
			a.exponent--;
			var rounding_digit = a.mantissa.pop();
			if (rounding_digit >= 5) {
				a.mantissa[a.mantissa.length-1]++;
				a.mantissa = this._carry(a.mantissa);
			}
		} else {
			while (a.exponent < integer_places) {
				a.exponent++;
				a.mantissa.push(0);
			}
		}
		return this._format(a);
	}
};
