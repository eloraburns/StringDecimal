from decimal import Decimal
import json

with open('tests.json') as f:
    tests = json.loads(f.read())

for operation, op1, op2, expected in tests:
    if operation == 'add':
        actual = str(Decimal(op1) + Decimal(op2))
    elif operation == 'subtract':
        actual = str(Decimal(op1) - Decimal(op2))
    elif operation == 'multiply':
        actual = str(Decimal(op1) * Decimal(op2))
    else:
        print "'%s' NOT IMPLEMENTED" % operation

    try:
        assert expected == actual, "%s('%s', '%s') expected '%s', actual '%s'" % (operation, op1, op2, expected, actual)
    except AssertionError as e:
        print e
