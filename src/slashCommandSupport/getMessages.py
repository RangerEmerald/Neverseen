import requests
from json import dumps
import sys

url = f"https://discord.com/api/v8/channels/{sys.argv[2]}/messages"

headers = {
    "Authorization": f"Bot {sys.argv[1]}"
}

r = requests.get(url, headers=headers)

try:
    print(dumps(r.json()))
except:
    print(dumps(False))