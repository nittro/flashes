_context.invoke('Nittro.Flashes.Bridges.FlashesDI', function() {

    var FlashesExtension = _context.extend('Nittro.DI.BuilderExtension', function(containerBuilder, config) {
        FlashesExtension.Super.call(this, containerBuilder, config);

    }, {
        load: function() {
            var builder = this._getContainerBuilder(),
                config = this._getConfig();

            builder.addServiceDefinition('flashes', {
                factory: 'Nittro.Flashes.Service()',
                args: {
                    options: config
                },
                run: true
            });
        }
    });

    _context.register(FlashesExtension, 'FlashesExtension');

});
