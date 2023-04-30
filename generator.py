import random
import requests
import json
from supabase import create_client, Client
from random_username.generate import generate_username

url = "https://dpjxeujgrsnsqygvxwag.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwanhldWpncnNuc3F5Z3Z4d2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExODE5NjgsImV4cCI6MTk5Njc1Nzk2OH0.XDGbcz5_XcABlLVtVlH2TLrOwgEtn2iBkoKZ5-qhv3U"
supabase = create_client(url, key)

prefixes = [
    'this cat is',
    'omg',
    'OMG',
    'aaaaa',
    'he is so',
    'she is so',
    'they are so',
    'they are',
    'he is',
    'she is',
    "she's",
    "he's",
    "they're",
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'i think that this cat is',
    'i think that he is',
    'i think that she is',
    'i think that she is',
    'omg SO',
    'OMG SO',
]

copulas = [
    'and',
    'AND',
]

with open('Positive-Adjective-List.txt') as f:
    adjs = [line.rstrip('\n') for line in f]

def generate_comments(n):
    comments = []
    for i in range(n):
        sentence = ""
        sentence += random.choice(prefixes) + ' '

        sentence += random.choice(adjs)

        for j in range(random.randint(0, 4)):
            sentence += ' ' + random.choice(copulas) + ' ' + random.choice(adjs)

        comments.append(sentence.strip())
    return comments

# generate 200 unique users
usernames = generate_username(200)

iters_per_batch = 100
batches = 330

count = 0
for x in range(batches):
    comments = generate_comments(iters_per_batch)

    res = requests.get(f'http://shibe.online/api/cats?count={iters_per_batch}')

    for url, comment in zip(res.json(), comments):
        username = random.choice(usernames)
        print(count, url, username, comment)
        supabase.table('cat_comments').insert({"url": url, "comment": comment, "username": username}).execute()
        count += 1