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

4) type __'grunt jasmine:headed:build'__ to create specRunner.html (requires [grunt](http://gruntjs.com/))

5) open __runner.html__ in a browser (tested with newest Chrome and FF)
__(NOTE: FF seems to allow running from the local filesystem.  Chrome requires running it from a web server)__


6) Look at the files in */specs* to see some of the possibilities

##Running a single test or a group of tests

To run a single test or a group of tests, simply add *?spec=some%20it%20or%20description* to the end of the url
the same way you would running Jamsine directly.

example:

to run 'should do something' use __?spec=should%20do%20something__ at the end of the url.

##Running tests in headless mode

To run tests in headless mode.  type __'grunt'__ or __'grunt jasmine:headless'__

If you need to run the tests from a server with dynamic content, simply add the host address in Gruntfile.js.
It is best to run the tests from the source directory the server is pointed to or a symlink.


##Basics

There are two ways to use the sparrow functions.  You can call them directly and provide a callback for the async functions,
or you can do things the easier way and use the sparrow async() monad.

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

####<a name="extend">.extend(obj)

Extend a window variable with new functions.

*NOTE: To add an async function, the final argument must be named 'done'*

```javascript
describe('extending windowVars', function() {

    it('should accept any function', function(done) {
        createTestWindow('extend');

        $extend.extend({
            write: function(selector, content) {
                $extend.find(selector).append(content);
            },
            waitForTesting: function(done) {
                $extend.waitForText('testing', done);
            }
        });

        $extend.async(done)
            .waitForTesting()
            .syncFn(function() {
                expect($extend.find('body').html()).toBe('testing');
            })
            .run();

        setTimeout(function() {
            $extend.write('body', 'testing');
        },500);
    });
});
```
