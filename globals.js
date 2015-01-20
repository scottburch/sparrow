(function(g) {
    "use strict";
    g.createTestWindow = g.createTestWindow || window.frameElement.createTestWindow;
    g.sparrow = g.sparrow || window.frameElement.sparrow;

    g.then = function(fn) {return function(done) {fn();done();}}

}(this));

