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

1) Download the latest sparrow from the dist directory

2) cd to installation directory

3) type __'npm install'__ (you must have npm/node installed)

4) type __'grunt jasmine:headed:build'__ to create specRunner.html

5) open __runner.html__ in a browser (tested with newest Chrome and FF)
__(NOTE: FF seems to allow running from the local filesystem.  Chrome requires running it from a web server)__


6) Look at the files in */specs* to see some of the possibilities


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



##Documentation


####createTestWindow('name')

Opens a test window tab and creates *$name* variable in the test scope.
```javascript
    it('should do something', function() {
        createTestWindow('aTestWindow');
        ... creates $aTestWindow
    });
```

####.async(doneCB)

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

####.run()

Starts a previously created async monad

```javascript
    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            // other instructions here
            .run();
    });
```

####.open(url, doneCB)

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

####.show()

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

####.waitUntilTrue(testFn, doneCB)

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

####.waitForText(text, doneCB)

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

####.waitForSelector(selector, doneCB)

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

####.waitUntilVisible(selector, doneCB)

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

####.waitWhileVisible(selector, doneCB)

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

####.wait(ms, doneCB)

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

####.click(selector)

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

####.log(message)

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

####.fill(selector, formData)

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

####.close()

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
