hangout
=====

  A secured peer to peer video application in your browser.

  Hangout is based on **[peer](http://github.com/bredele/peer)** and is still experimental.

## Installation

with [nodejs](http://nodejs.org):

	$ npm install hangout -g

Hangout works only with the latest versions of Google chrome and Mozilla Firefox.

## Usage

  Use hangout to start a peer to peer video chat: 

```
$ hangout
```

Thats it! Hangout will setup a tunnel and generates a uniq url you can share with the person you want to hangout. This url remains active for the duration of your video session.


```
Usage: hangout

Examples:

  # create a hangout:
  $ hangout

  # create a hangout with specific port:
  $ hangout -p 8080
```

## Note


  About 20% of peer to peer connections need a turn server. A turn server is higly requested if you are behing a NAT.

  Every hangout session has turn metadata (see [sturn](http://github.com/bredele/sturn)). However it's possible the turn server is not available.

  If you see a black screen you should probably start a new hangout session which request a new turn server.

## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
