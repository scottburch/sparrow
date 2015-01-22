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