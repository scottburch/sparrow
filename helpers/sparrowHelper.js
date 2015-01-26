sparrow.extend({
    fill: function (winVar, selector, object) {
        var form = winVar.find(selector);
        _.each(object, function (value, name) {
            var field = winVar.find('[name="' + name + '"]', form);
            field.focus();
            field.val(value);
        });
    },
    log: function (winVar, message) {
        console.log(message);
    },
    wait: function (winVar, ms, done) {
        setTimeout(done, ms);
    },
    click: function (winVar, selector) {
        click();

        function click() {
            try {
                var elem = winVar.find(selector).get(0);
                var evt = winVar.get(0).createEvent("MouseEvents");
                var center_x = 1, center_y = 1;
                try {
                    var pos = elem.getBoundingClientRect();
                    center_x = Math.floor((pos.left + pos.right) / 2);
                    center_y = Math.floor((pos.top + pos.bottom) / 2);
                } catch (e) {
                }
                evt.initMouseEvent('click', true, true, winVar.$window, 1, 1, 1, center_x, center_y, false, false, false, false, 0, elem);
                // dispatchEvent return value is false if at least one of the event
                // handlers which handled this event called preventDefault;
                // so we cannot returns this results as it cannot accurately informs on the status
                // of the operation
                // let's assume the event has been sent ok it didn't raise any error
                elem.dispatchEvent(evt);
                return true;
            } catch (e) {
                console.log("Failed dispatching click event on " + selector + ": " + e, "error");
                return false;
            }
        }
    }
});