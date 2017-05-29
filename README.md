# Sharing cookies across applications

This code is a demo of sharing applications "login sessions" across servers. `writer` is our "auth" server (just sets a cookie) and `reader` is our "application server" (reads that cookie, bars non-logged-in users from access).

This demo follows a blog post here: https://sequoia.makes.software/session-management-with-microservices/

## Running the Demo

0. Setup a redis server (free instance on https://redislabs.com works)
1. Clone this repository
2. Copy `.env.example` to `.env`
3. Update `.env` to point to your redis instance
4. Deploy the `writer` server to now *with environment variable set*:
   ```no-highlight
   $ cd writer
   $ now --dotenv=../.env
   > Deploying ~/projects/demos/sharing-cookies/writer under sequoia
   > Using Node.js 7.10.0 (default)
   > Ready! https://writer-XXXX.now.sh (copied to clipboard) [1s]
   ```
   **Note the URL** (`https://writer-XXXX.now.sh` above, yours will be different)
5. Deploy the `reader` server to now *with environment variable set*:
   ```no-highlight
   $ cd ../reader
   $ now --dotenv=../.env
   > Deploying ~/projects/demos/sharing-cookies/reader under sequoia
   > Using Node.js 7.10.0 (default)
   > Ready! https://reader-XXXX.now.sh (copied to clipboard) [1s]
   ```
   **Note the URL** (`https://reader-XXXX.now.sh` above, yours will be different)
6. Edit the `now-aliases.json` file to match your reader & writer URLs
7. Pick an alias subdomain and set up aliases on `now`:
   ```no-highlight
   $ cd [to the root of this repo]
   $ now alias your-alias-subdomain.now.sh  -r ./now-aliases.json
   > Success! 4 rules configured for your-alias-subdomain.now.sh [1s]
   ```

The application is now deployed and running on the alias. Try the following URLs (edited to match your alias):

1. https://your-alias-subdomain.now.sh/
1. https://your-alias-subdomain.now.sh/login
1. https://your-alias-subdomain.now.sh/increment
1. https://your-alias-subdomain.now.sh/increment
1. https://your-alias-subdomain.now.sh/
1. https://your-alias-subdomain.now.sh/logout
1. https://your-alias-subdomain.now.sh/

For more info, see this blog post: https://sequoia.makes.software/session-management-with-microservices/

## More

### Check your deployments

```
$ now ls
> 2 deployments found under sequoia [614ms]

writer (1 of 1 total)
 url                                                inst #    state                 age
 writer-XXX.now.sh                                       1    READY                  2h

reader (1 of 1 total)
 url                                                inst #    state                 age
 reader-XXX.now.sh                                       1    READY                 45m
```

### Check your aliases

```
$ now alias ls
> 1 aliases found [848ms] under sequoia

  source                                               url                                  age
  [4 custom rules]                                     https://your-subdomain-alias.now.sh   5m

$ now alias ls https://your-subdomain-alias.now.sh
  pathname    method  dest
  /login      *       writer-XXX.now.sh
  /increment  *       writer-XXX.now.sh
  /logout     *       writer-XXX.now.sh
              *       reader-XXX.now.sh
```

### Scale up the reader

Try scaling your `reader` server up & verify that it is still working across two instances:

```no-highlight
$ now scale reader-XXX.now.sh 2
> Success! Configured scaling rules [2s]

reader-XXX.now.sh (1 current)
   min 2
   max 2
  auto ✖

> Scaled to 2 instances: [7s]
- reader-XXX-45e62b9c5a1a378318dfe809.now.sh
- reader-XXX-8e054dd39c6bcd4bba19c196.now.sh
```

Your alias URL should work as before!