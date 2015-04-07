describe('waitFor*, waitWhile* and waitUntil* tests', function () {

    beforeEach(function (done) {
        createTestWindow('waitFor');
        $waitFor.open('test-waitFor.html', done);
    });

    describe('waitUntilTrue', function () {
        it('should wait until function returns true', function (done) {
            var test = false;
            $waitFor.async(done)
                .waitUntilTrue(function () {
                    return test
                })
                .run();
            setTimeout(function () {
                test = true;
            }, 100);
        });

        it('should wait for async function to return true', function(done) {
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

    describe('waitForSelector', function () {
        it('should see the element after clicking', function (done) {
            $waitFor.async(done)
                .click('button')
                .waitForSelector('#waitForSelectorElement')
                .syncFn(function () {
                    expect($waitFor.find('#waitForSelectorElement').html()).toBe('Here it is')
                })
                .run();
        });
    });

    describe('waitForText', function () {
        it('should wait until the text is visible', function (done) {
            $waitFor.async(done)
                .click('button')
                .waitForText('Here it is')
                .run();
        });
    });

    describe('waitUntilVisible', function () {
        it('should wait while selector is hidden', function (done) {
            $waitFor.async(done)
                .waitUntilVisible('#hidden')
                .run();

            setTimeout(function () {
                $waitFor.find('#hidden').show();
            }, 100);
        });
    });

    describe('waitWhileVisisble', function () {
        it('should wait while selector is visible', function (done) {
            $waitFor.find('#hidden').show();
            $waitFor.async(done)
                .waitWhileVisible('#hidden')
                .run();

            setTimeout(function() {
                $waitFor.find('#hidden').hide();
            })
        });
    });

    describe('wait', function() {
        it('should wait a number of ms', function(done) {
            var start = new Date().getTime();
            $waitFor.async(done)
                .wait(100)
                .syncFn(function() {
                    expect(new Date().getTime() - start > 70).toBe(true);
                })
                .run();
        });
    });


});