drawLayout();

function drawLayout() {
    $j('body').w2layout({
        name: 'layout',
        panels: [
            {type: 'main', content: '<div id="pagePanel"></div>', tabs: []},
            {type: 'bottom', resizable: true, content: '<iframe id="tests" src="about:blank"></iframe>'}
        ]
    });
}
