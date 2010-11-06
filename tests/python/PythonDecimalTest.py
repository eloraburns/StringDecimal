from decimal import Decimal, getcontext, DivisionByZero, ROUND_HALF_UP
import json

with open('tests.json') as f:
    # Toss the first line, it's just for JavaScript
    f.readline()
    tests = json.loads(f.read())

getcontext().prec = 100
getcontext().rounding = ROUND_HALF_UP

for test in tests:
    operation = test[0]
    ops = test[1:-1]
    expected = test[-1]
    if operation == 'add':
        actual = str(Decimal(ops[0]) + Decimal(ops[1]))
    elif operation == 'subtract':
        actual = str(Decimal(ops[0]) - Decimal(ops[1]))
    elif operation == 'multiply':
        actual = str(Decimal(ops[0]) * Decimal(ops[1]))
    elif operation == 'divide':
        oldprec = getcontext().prec
        newprec = int(ops[2])+len(ops[0])+len(ops[1])+5
        getcontext().prec = newprec
        try:
            quantizer = Decimal("1E-%s" % ops[2])
            dividend = Decimal(ops[0]) / Decimal(ops[1])
            actual = str(dividend.quantize(quantizer))
        except DivisionByZero:
            actual = "NaN";
        finally:
            getcontext().prec = oldprec
    elif operation == 'round':
        actual = str(Decimal(ops[0]).quantize(Decimal("1E-%s" % ops[1])))
    else:
        print "'%s' NOT IMPLEMENTED" % operation

    try:
        assert expected == actual, "%s(%s) expected '%s', actual '%s'" % (operation, ', '.join("'%s'" % o for o in ops), expected, actual)
    except AssertionError as e:
        print e
