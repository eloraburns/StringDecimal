#!/usr/bin/env python
"""Create new divide() testcases by picking two random numbers and dividing them.

We trust that Python Decimal()s do the right thing. ;)"""

from decimal import Decimal, getcontext, ROUND_HALF_UP
getcontext().prec = 100
getcontext().rounding = ROUND_HALF_UP

from random import random

ROUND_DIGITS = 30
quantizer = Decimal("1E-%s" % ROUND_DIGITS)

for x in range(100):
   a = Decimal(str(random()))
   b = Decimal(str(random()))
   c = a/b
   print '\t["divide", "%s", "%s", "%d", "%s"],' % (a, b, ROUND_DIGITS, (a/b).quantize(quantizer))
