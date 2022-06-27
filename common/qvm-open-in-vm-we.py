#!/usr/bin/env python3
import sys
import json
import struct
import re
import os

def getMessage():
    msglen = sys.stdin.buffer.read(4)
    if len(msglen) == 0:
        sys.exit(1)
    msglen = struct.unpack("@I", msglen)[0]
    msg = sys.stdin.buffer.read(msglen).decode("utf-8")
    return json.loads(msg)

msg = getMessage()
if not re.match(".*://.*", msg["url"]):
    sys.exit(1)

#check msg["vmname"]
os.execvp("sudo", ["sudo", "-u", "user", "qvm-open-in-vm", msg["vmname"], msg["url"]]);
