(function (global) {
    "use strict";
    var testWindows = {}, currentDone, extendWinHelpers = {};

    global.sparrow = {
        WAIT_TIME: 20000,
        extend: function (obj) {
            _.extend(extendWinHelpers, obj);
        }
    };

    var testsFrame = $j('iframe#tests');
    testsFrame = testsFrame.length ? testsFrame : false;

    addTestHelpers();
    testsFrame && startTests();

    function getTestsCtx() {
        return testsFrame ? testsFrame.get(0).contentDocument.defaultView : window;
    }

    function TestWin(id) {
        var frame, currentOpenDoneCB, winVar;

        addTestWin();
        show();

        return {
            frame: frame
        };

        function show() {
            setTimeout(function () {
                _.each(testWindows, function (win) {
                    win.frame.css('left', '-9999');
                });
                frame.css('left', '0');
                window.w2ui && w2ui.layout.get('main').tabs.select(id); // activate the new tab
            });
        }

        function addTestWin() {
            if (window.w2ui) {
                var tabs = w2ui.layout.get('main').tabs;
                tabs.add({
                    id: id,
                    caption: id,
                    onClick: show
                });
            }
            $j('#pagePanel').append('<iframe class="test-page" id="' + id + '"></iframe>');
            frame = $j('iframe#' + id);
            createWinVar();
            frame.bind('load', function () {
                createWinVar()
                var done = currentOpenDoneCB;
                currentOpenDoneCB = undefined;
                done && done();
            });
        }


        function createWinVar() {
            var contents = frame.contents();
            winVar = frame.contents();
            winVar.$window = frame.get(0).contentDocument.defaultView;


            testsFrame && (getTestsCtx()['$' + id] = winVar);
            window['$' + id] = winVar; // for headless mode

            addWinHelpers()


            function addWinHelpers() {
                _.extend(winVar, wrappedExtendHelpers(), winHelpers());
                addFunctional();
                addAsyncMonad();

                function wrappedExtendHelpers() {
                    return _.reduce(extendWinHelpers, function(memo, fn, name) {
                        memo[name] = _.partial(fn, winVar);
                        memo[name].hasDone = hasDone(fn);
                        return memo;
                    }, {});
                }
            }

            function addAsyncMonad() {
                winVar.async = function (done) {
                    var fnList = [];
                    var api = {
                        run: function () {
                            currentDone = done;
                            async.series(fnList, function () {
                                currentDone = undefined;
                                done();
                            });
                        },
                        fn: function (fn) {
                            fnList.push(fn);
                            return api;
                        },
                        syncFn: function (fn) {
                            fnList.push(function (done) {
                                fn();
                                done();
                            });
                            return api;
                        }
                    };
                    // Add a wrapper around methods in winVar
                    _.each(_.functions(winVar.fn), function (fnName) {
                        var fn = winVar.fn[fnName];
                        api[fnName] = function () {
                            var args = _.toArray(arguments);
                            api.fn(fn.apply(winVar.fn, arguments));
                            return api;
                        }
                    });
                    return api;
                };
            }


            function hasDone(fn) {
                if(fn.hasDone !== undefined) {
                    return fn.hasDone;
                }
                var fnSig = fn.toString().split('\n')[0].replace(/[^\(]*\(([^\)]*).*/, '$1').replace(/ /g, '').split(',');
                return   fn.hasDone = _.last(fnSig) === 'done';
            }

            function addFunctional() {
                winVar.fn = {};
                _.each(_.functions(winVar), function (fnName) {
                    var origFn = winVar[fnName];
                    winVar.fn[fnName] = function () {
                        var args = _.toArray(arguments);
                        return function (done) {
                            if (hasDone(origFn)) {
                                return origFn.apply(winVar, args.concat(done));
                            } else {
                                var ret = origFn.apply(winVar, args);
                                done();
                                return ret;
                            }
                        }
                    };
                });
            }
        }

        function winHelpers() {
            function whileNotTrue(test, done, timeoutMsg) {
                var start = new Date().getTime();
                loop();
                function loop() {
                    test() ? done() : setTimeout(function () {
                        if (new Date().getTime() - start > sparrow.WAIT_TIME) {
                            var ctx = testsFrame ? getTestsCtx() : window;
                            ctx.fail('TIMEOUT - ' + timeoutMsg);
                            testsFrame || winVar.capture('body', timeoutMsg.replace(' ', '_') + '.html');
                            if (currentDone) {
                                var tempDone = currentDone;
                                currentDone = undefined;
                                tempDone();
                            }
                        } else {
                            loop();
                        }
                    }, 100);
                }
            }

            return {
                waitForText: function waitForText(text, done) {
                    whileNotTrue(function () {
                        return winVar.find(':contains(' + text + ')').is(':visible');
                    }, done, 'waitForText: ' + text);
                },
                waitForSelector: function waitForSelector(selector, done) {
                    whileNotTrue(function () {
                        return winVar.find(selector).length
                    }, done, 'waitForSelector: ' + selector);
                },
                waitUntilVisible: function waitUntilVisible(selector, done) {
                    whileNotTrue(function () {
                        return winVar.find(selector).is(':visible')
                    }, done, 'waitUntilVisible: ' + selector);
                },
                waitWhileVisible: function waitWhileVisible(selector, done) {
                    whileNotTrue(function () {
                        return !winVar.find(selector).is(':visible');
                    }, done, 'waitWhileVisible: ' + selector);
                },
                waitUntilTrue: function (test, done) {
                    whileNotTrue(function () {
                        return test();
                    }, done, 'waitUntilTrue: ' + test.toString());
                },
                fill: function (selector, object) {
                    var form = winVar.find(selector);
                    _.each(object, function (value, name) {
                        var field = winVar.find('[name="' + name + '"]', form);
                        field.focus();
                        field.val(value);
                    });
                },
                log: function (message) {
                    console.log(message);
                },
                wait: function (ms, done) {
                    setTimeout(done, ms);
                },
                click: function (selector) {
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
                },
                dump: function (selector, filename) {
                    selector = selector || 'html';
                    var html = winVar(selector).html();
                    filename ? console.log(html) : alert(JSON.stringify(['writeFile', filename, html]));
                },
                capture: function (selector, filename) {
                    filename = filename || 'capture.png';
                    var el = winVar.find(selector).get(0);
                    html2canvas(el, {
                        onrendered: function (canvas) {
                            var s = '<img src="' + canvas.toDataURL('image/png') + '">'
                            alert(JSON.stringify(['writeFile', filename, s]));
                            console.log('captured: ' + selector);
                        }
                    });
                },
                http: {
                    post: function request(url, data, success, dataType) {
                        $j.post(url, data, success, dataType);
                    }
                },
                open: function (url, done) {
                    console.log('OPEN: (' + id + ') ' + url);
                    currentOpenDoneCB = done;
                    frame.get(0).src = url;
                },
                show: show,
                close: function () {
                    window.w2ui && w2ui.layout.get('main').tabs.remove(id);
                    frame.remove();
                }
            };
        }
    }


    function startTests() {
        // TODO: get this from the config
        var testUrl = 'specRunner.html';
        var specName = window.location.search.replace('?spec=', '');
        testsFrame.get(0).contentWindow.location.href = testUrl + '?spec=' + specName;
    }


    function addTestHelpers() {
        var context = testsFrame ? testsFrame.get(0) : window;
        _.extend(context, {
            createTestWindow: function (winId) {
                testWindows[winId] || (testWindows[winId] = TestWin(winId));
            },
            sparrow: global.sparrow

        });
    }
}(this));
