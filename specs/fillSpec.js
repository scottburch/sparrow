describe('fill', function() {

    beforeEach(function(done) {
        createTestWindow('form');
        $form.open('test-fill.html', done);

    });

    it('should fill out the fields in a form', function() {
        $form.fill('#form', {
            name: 'Test Tester',
            options: 'two'
        });
        expect($form.find('[name=name]').val()).toBe('Test Tester');
        expect($form.find('[name=options]').val()).toBe('two');
    });
});