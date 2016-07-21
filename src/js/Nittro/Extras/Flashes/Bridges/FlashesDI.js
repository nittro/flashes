_context.invoke('Nittro.Extras.Flashes.Bridges', function(Nittro) {

    if (!Nittro.DI) {
        return;
    }

    var FlashesDI = _context.extend('Nittro.DI.BuilderExtension', function(containerBuilder, config) {
        FlashesDI.Super.call(this, containerBuilder, config);

    }, {
        load: function() {
            var builder = this._getContainerBuilder(),
                config = this._getConfig();

            builder.addServiceDefinition('flashes', {
                factory: 'Nittro.Extras.Flashes.Service()',
                args: {
                    options: config
                }
            });
        }
    });

    _context.register(FlashesDI, 'FlashesDI');

});
