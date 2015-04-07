#Sparrow functional testing

A functional website testing framework based on jasmine and JQuery.  Sparrow is designed to solve the problem
of async testing inherent in website testing by making async testing easier.

Sparrow:

* Makes async testing easier
* Allows testing multiple pages simultaneously so complex interactions can be tested
* Runs tests in a browser and headless
* Allows using the IntelliJ/Webstorm debugger with both test and page code
* Uses JQuery and Jasmine to reduce the learning curve
* Makes it easier to create independent tests that are not dependent on each other

##Quick Start

1) [Download](https://github.com/scottburch/sparrow/archive/latest.tar.gz) the latest sparrow

2) cd to installation directory

3) type __'npm install'__ (requires [node](http://nodejs.org/))

4) type __'grunt headed'__ to create specRunner.html (requires [grunt](http://gruntjs.com/))
<br>__NOTE: Make sure you run this command after creating new spec/helper files and after upgrading Sparrow__.
You can also run `grunt watch` to build specRunner.html automatically when spec/helper files change.

5) open __runner.html__ in a browser (tested with newest Chrome and FF)
<br>__(NOTE: FF seems to allow running from the local filesystem.  Chrome requires running it from a web server)__


6) Look at the files in */specs* to see some of the possibilities

##Running a single test or a group of tests

To run a single test or a group of tests, simply add *?spec=some%20it%20or%20description* to the end of the url
the same way you would running Jamsine directly.

example:

to run 'should do something' use __?spec=should%20do%20something__ at the end of the url.

##Running tests in headless mode

To run tests in headless/CI mode.  type __'grunt'__ or __'grunt headless'__

If you need to run the tests from a server with dynamic content, simply add the host address in Gruntfile.js.
It is best to run the tests from the source directory the server is pointed to or a symlink.


##Sparrow options

####sparrow.WAIT_TIME
The time to wait for the waitFor*, waitUntil*, waitWhile*

This can be set in a helper to make it a global setting for all tests

##Basics

__There are two ways to use the sparrow functions.__  You can call them directly and __provide a callback__ for the async functions,
or you can do things the easier way and __use the sparrow async() monad__.

#### Callback example

```javascript
    describe('block of tests', function() {
        it('should do something', function(done) {
            createTestWindow('win');

             // open the page
            $win.open('http://example.com', function() {
            $win.click('#some-link');

                // fill the form in the popup
                $win.waitForSelector('#some-popup', function() {
                    $win.fill('#some-form', {name:'me', ...};
                    $win.click('#sumit-button');

                    // Do something with the resulting page
                    $win.waitforText('new page loaded', function() {
                        $win.click('#another-link');
                        $win.waitWhileVisible('#some-modal', function() {
                            myAsyncFunction(function() {

                                // Test that we see 'finished'
                                expect($win.find('#result').html()).toBe('finished');
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
```

#### Async monad example (much cleaner and easier to refactor)
```javascript
    describe('block of tests', function() {
        it('should do something', function(done) {
            createTestWindow('win');
            $win.async(done)

                // open the page
                .open('http://example.com')
                .click('#some-link')

                // fill the form in the popup
                .waitForSelector('#some-popup')
                .fill('#some-form', {name: 'me', ...}
                .click('#submit-button')

                // Do something with the resulting page
                .waitForText('new page loaded')
                .click('#another-link')
                .waitWhileVisible('#some-modal')
                .fn(myAsyncFunction)

                // Test that we see 'finished'
                .syncFn(function() {
                    expect($win.find('#result').html()).toBe('finished')
                })

                .run();

        });

        function myAsyncFunction(done) {
            // do something async
            done();
        }

    });
```


__Sparrow is based on jasmine so tests are written in the same style.  See [jasmine docs](http://jasmine.github.io/2.1/introduction.html)
for more possibilities.__

##Using with Meteor

Unpack sparrow someplace in the /public directory.  I put it in /public/sparrow.  Sparrow tests will then be available
 at http://localhost:3000/sparrow/runner.html.

*NOTE: I have found that I must clear the cache in my browser to get updates after changing specs.*




##Documentation
--------------

* [create Test Window('name')](#createTestWindow)
* [.async(doneCB)](#async)

*NOTE: If you are using the async monad, ignore the doneCB argument on the following, this is handled for you.*

* [.run()](#run)
* [.open(url, doneCB)](#open)
* [.show()](#show)
* [.waitUntilTrue(testFn, doneCB)](#waitUntilTrue)
* [.waitForText(text, doneCB)](#waitForText)
* [.waitForSelector(selector, doneCB)](#waitForSelector)
* [.waitUntilVisible(selector, doneCB)](#waitUntilVisible)
* [.waitWhileVisible(selector, doneCB)](#waitWhileVisible)
* [.wait(ms, doneCB)](#wait)
* [.click(selector)](#click)
* [.log(message)](#log)
* [.fill(selector, formData)](#fill)
* [.close()](#close)
* [.fn(someFunction)](#fn)
* [.syncFn(someFunction)](#syncFn)
* [.extend(obj)](#extend)
* [.http.post(url, data, success, done)](#httpPost)

####<a name="createTestWindow">createTestWindow('name')

Opens a test window tab and creates *$name* variable in the test scope.
```javascript
    it('should do something', function() {
        createTestWindow('aTestWindow');
        ... creates $aTestWindow
    });
```

####<a name="async">.async(doneCB)

Creates an async monad to make async functions easier
```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a#link')
            .waitForText('something on new page')
            .run()
    });
```

####<a name="run">.run()

Starts a previously created async monad

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            // other instructions here
            .run();
    });
```

####<a name="open">.open(url, doneCB)

Opens a url in a window tab.

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .open('http://google.com'
            // other instructions here
            .run()
    });
```

####<a name="show">.show()

Show the tab for this window

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        createTestWindow('another');
        $win.async(done)
            .show() // This will show the $win window (tab)
            .run()

        $another.async(done)
            .show()    // This will show the $another window (tab)
            .run()
    });
```

####<a name="waitUntilTrue">.waitUntilTrue(testFn, doneCB)

Wait until the test function returns true

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
         $win.async(done)
            .click('#something')
            .waitUntilTrue(somethingHappening)
    });

    function somethingHappening() {
        return $j('#xxxx').html() === 'ready'
    }
```

waitUntilTrue can also takes an async function containing a "done" final argument.  
The passed async function will be called until it calls done() with a truthy value or sparrow.WAIT_TIME is reached.

```javascript
        it('should do something', function(done) {
            var count = 0;
            $waitFor.async(done)
                .waitUntilTrue(asyncFunc)
                .run();

            function asyncFunc(done) {
                setTimeout(function() {
                    ++count === 2 ? done(1) : done(0);
                },1);
            }
        })

    });
```

####<a name="waitForText">.waitForText(text, doneCB)

Wait until the text is visible on the webpage

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a')
            .waitForText('some text on the page')
            .run()
    });
```

####<a name="waitForSelector">.waitForSelector(selector, doneCB)

Wait until the selected element is in the dom

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a')
            .waitForSelector('a#my-link')
            .run()
    });
```

####<a name="waitUntilVisible">.waitUntilVisible(selector, doneCB)

Wait until the selected element is visible

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a')
            .waitUntilVisible('#myAsyncModal')
            .run()
    });
```

####<a name="waitWhileVisible">.waitWhileVisible(selector, doneCB)

Wait while the selected element is visible

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a')
            .waitWhileVisible('#loadingMessage')
            .run()
    });
```

####<a name="wait">.wait(ms, doneCB)

Wait for some period of milliseconds

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a')
            .wait(2000)
            .click('#something else')
            .run()
    });
```

####<a name="click">.click(selector)

Click on some selected element

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a')
            .wait(2000)
            .click('#something else')
            .run()
    });
```

####<a name="log">.log(message)

Send a log message to the console.

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a')
            .log('I clicked it')
            .run()
    });
```

####<a name="fill">.fill(selector, formData)

Fill in the selected form

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .fill('#my-form', {name: 'Scott', email:'me@mine.com'})
            .click('#submit')
            .run()
    });
```

####<a name="close">.close()

Close an open test window (tab)

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .fill('#my-form', {name: 'Scott', email:'me@mine.com'})
            .click('#submit')
            .close()
            .run()
    });
```

####<a name="fn">.fn(someFunction)

Call an async function

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a')
            .fn(myAsyncFunction)
            .run()
    });

    function myAsyncFunction(done) {
        // do something
        done();
    }
```

####<a name="syncFn">.syncFn(someFunction)

Call a function.  Currently this is the best way to add expects into your test code.

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a')
            .syncFn(function() {
                expect($win.find('#something').html()).toBe('my content');
            })
            .run()
    });
```

####<a name="extend">sparrow.extend(obj)

Add functions to sparrow. The first argument will be the test window variable.
For example, if you created a test window called "myWin", then called __$myWin.write()__.  winVar would be $myWin.

*NOTE: To add an async function, the final argument must be named 'done'*

```javascript
        sparrow.extend({
            write: function(winVar, selector, content) {
                winVar.find(selector).append(content);
            },
            waitForTesting: function(winVar, done) {
                winVar.waitForText('testing', done);
            }
        });
`
####<a name="httpPost">.http.post(url, data, success, done)

```javascript
        $tests.async(done)
            .fn(function(done) {
                $tests.http.post('/some/url', {some:'data'}, _.partial(checkReturn, done));
            })
            .run();

        function checkReturn(done, ret) {
            expect(ret).toBe('<some> <html>');
            done();
        }
`````

##Troubleshooting

### Accessing the window object in a tab
You can use the $window variable to access the window object inside of a tab from the debugging console.  
For example, if your tab is $page, then $page.$window will give you the window variable within that tab. 
From there you can access any global variables.

###Debugging in the middle of an async monad chain

The easiest way to debug in the middle of the async chain is to use syncFn. Add a temporary .syncFn() call
and put your debug code inside of the passed function.  The same technique works for setting breakpoints.

```javascript
    $win.async(done)
    .click('#something')
    .waitFor('#something-else')
    .syncFn(function() {
        console.log($win.find('#some-thing').html())
    })
    .run()
```

## Feedback

If you find Sparrow useful, please let me know.  If you have any questions or concerns,
please feel free to let me know at <a href="mailto:scott@bulldoginfo.com">scott@bulldoginfo.com</a>.

I created Sparrow because none of the other testing frameworks I found had the features I was looking
for.  I have found this framework very useful for testing production websites.

If you are looking for someone to setup functional testing for your web application or website, contact me.
