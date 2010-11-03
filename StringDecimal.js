var StringDecimal = (function(){
	var o = {};

	o._string_to_array = function(str) {
		var result = [];
		for (var i = 0; i < str.length; i++) {
			result.push(parseInt(str[i]));
		}
		return result;
	}

	o._array_to_string = function(arr) {
		var result = "";
		for (var i = 0; i < arr.length; i++) {
			result += arr[i];
		}
		return result;
	}

	/*
	 * Parses a string into a sign, mantissa, and exponent.
	 * Note that the exponent is actually the _negative_ power
	 * of ten required to turn the raw mantissa into the real
	 * value.  e.g. {mantissa: [1, 0], exponent: 1} => '1.0'
	 */
	o._parse = function(str) {
		var matches = str.match(/^(\+|-)?0*(\d+)(?:\.(\d+))?$/);
		var sign = matches[1] || '+';
		var fractional = (undefined == matches[3]) ? "" : matches[3];
		var mantissa_as_a_string = matches[2] + fractional;
		var exponent = fractional.length;
		return {
			'sign': sign,
			'mantissa': o._string_to_array(mantissa_as_a_string),
			'exponent': exponent
		};
	}

	o._format = function(obj) {
		var sign = (obj.sign == "-") ? "-" : "";
		var mantissa = o._array_to_string(obj.mantissa);
		var decimal_point = (obj.exponent > 0) ? "." : "";
		var decimal_point_offset = mantissa.length - obj.exponent;
		return sign +
			mantissa.substr(0, decimal_point_offset) +
			decimal_point + 
			mantissa.substr(decimal_point_offset);
	}

	o._array_add = function(a, b) {
		if (a.length != b.length) {
			throw "Arrays of dissimilar length cannot be added";
		}
		var result = [];
		for (var i = 0; i < a.length; i++) {
			result.push(a[i] + b[i]);
		}
		return result;
	}

	o._match_exponents = function(a, b) {
		while (a.exponent > b.exponent) {
			b.exponent++;
			b.mantissa.push(0);
		}
		while (b.exponent > a.exponent) {
			a.exponent++;
			a.mantissa.push(0);
		}
	}

	o.add = function(raw_a, raw_b) {
		var a = o._parse(raw_a);
		var b = o._parse(raw_b);
		o._match_exponents(a, b);
		var c = {
			'sign': '+',
			'mantissa': o._array_add(a.mantissa, b.mantissa),
			'exponent': a.exponent
		}
		return o._format(c);
	};

	

	return o;
})();
