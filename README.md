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
            $win.open('http://example.com', function() {
            $win.click('#some-link');
                $win.waitForSelector('#some-popup', function() {
                    $win.fill('#some-form', {name:'me', ...};
                    $win.click('#sumit-button');
                    $win.waitforText('new page loaded', function() {
                        $win.click('#another-link');
                        $win.waitWhileVisible('#some-modal', function() {
                            expect($win.find('#result').html()).toBe('finished');
                            done();
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

Most of the functions below will show two possible ways to run them.
One is running the function directly and the other is using the async monad. (see .async())

####createTestWindow('name')

Opens a test window tab and creates $name variable in the test scope.

    it('should do something', function() {
        createTestWindow('aTestWindow');
        ... creates $aTestWindow
    });


####.async(doneCB)

Creates an async monad to make async functions easier

    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            .click('a#link')
            .waitForText('something on new page')
            .run()
    });

####.run()

Starts a previously created async monad

    it('should do something', function(done) {
        createTestWindow('win');
        $win.async(done)
            // other instructions here
            .run();
    });

####.open(url, doneCB)

Opens a url in a window tab.

    // Calling function directly
    it('should do something', function(done) {
        createTestWindow('win');
        $win.open('http://google.com', function() {
            // page is open
            done();
        });
    });

    // Using with async monad
    it('should do something', function(done) {
        createTestWindow('win')
        $win.async(done)
            .open('http://google.com')
            // other instructions here
            .run();
    });

