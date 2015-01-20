describe('fn and syncFN', function() {

    beforeEach(function() {
        createTestWindow('fnTest');
    });

    describe('fn()', function() {
        it('should wait for an async function', function(done) {
            var test = false;
            $fnTest.async(done)
                .fn(myAsyncFn)
                .syncFn(function() {
                    expect(test).toBe(true);
                })
                .run();

            function myAsyncFn(done) {
                test = true;
                done();
            }
        });
    });

    describe('syncFn()', function() {
        it('should run sync function in order', function(done) {
            var result = false;

            $fnTest.async(done)
                .syncFn(_.partial(testResult, false))
                .syncFn(_.partial(setResult, true))
                .syncFn(_.partial(testResult, true))
                .run();

            function testResult(value) {
                expect(result).toBe(value);
            }

            function setResult(value) {
                result = value;
            }
        });
    });

});