drawLayout();

function drawLayout() {
    $j('body').w2layout({
        name: 'layout',
        panels: [{
            type: 'main',

            content: '<div id="sparrow"><h1>Sparrow</h1>Find docs <a href="https://github.com/scottburch/sparrow">here</a></div><div id="pagePanel"></div>',
            tabs: [{
                id: 'sparrow',
                caption: 'Sparrow'
            }]},
            {type: 'bottom', resizable: true, content: '<iframe id="tests" src="about:blank"></iframe>'}
        ]
    });
    w2ui.layout.get('main').tabs.on('refresh', function() {
        if(this.tabs.length > 1) {
            $j('#sparrow').remove();
            w2ui.layout.get('main').tabs.hide('sparrow');
        }
    });
}
