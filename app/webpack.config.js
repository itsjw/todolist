const Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('web/build/')
    .setPublicPath('/build')
    .cleanupOutputBeforeBuild()
    .addEntry('vendor', ['jquery', 'popper.js', 'bootstrap'])
    .addEntry('tools', [
        './web/assets/js/tools/prototype.js'
    ])
    .addEntry('app', [
        './web/assets/js/init.js'
    ])
    .addStyleEntry('fonts', './web/assets/css/fonts.scss')
    .addStyleEntry('bootstrap-vars', './web/assets/css/bsvars.scss')
    .addStyleEntry('bootstrap-core', 'bootstrap/scss/bootstrap.scss')
    .addStyleEntry('styles', './web/assets/css/body.scss')
    .enableSassLoader(function (sassOptions) {
    }, {resolveUrlLoader: false})
    .enablePostCssLoader((options) => {
        options.config = {
            path: 'postcss.config.js'
        };
    })
    .autoProvidejQuery()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .autoProvideVariables({
                              $: 'jquery',
                              jQuery: 'jquery',
                              'window.jQuery': 'jquery',
                              Popper: ['popper.js', 'default'],
                              Routing: 'Routing'
                          })
;

let config = Encore.getWebpackConfig();

module.exports = config;
