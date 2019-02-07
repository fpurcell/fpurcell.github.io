#!/usr/bin/python2.4

print "Content-type: text/html\n\n"

module_name = 'MySQLdb'
head = '''Content-Type: text/html

%s is ''' % module_name

try:
    __import__(module_name)
    print head + 'installed'
except ImportError:
    print head + 'not installed'


"""

print "<html>Hello world!</html>"


#!/usr/bin/env python

import json

json.dumps([1,2,3,{'4': 5, '6': 7}], separators=(',',':'))
'[1,2,3,{"4":5,"6":7}]'
"""

