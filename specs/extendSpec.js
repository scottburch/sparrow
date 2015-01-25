describe('extending windowVars', function() {

    it('should accept any function', function(done) {
        sparrow.extend({
            write: function(winVar, selector, content) {
                winVar.find(selector).append(content);
            },
            waitForTesting: function(winVar, done) {
                winVar.waitForText('testing', done);
            }
        });
        createTestWindow('extend');


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