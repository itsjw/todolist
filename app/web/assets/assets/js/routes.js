function getRouteParams(url) {

    let routeParams = [];

    if (url) {
        let routeUrl = url.replace(window.location.host + '/app_dev.php', '');
        routeUrl = routeUrl.replace(window.location.host + '/menu', '');
        routeUrl = routeUrl.replace(window.location.host + '/content', '');

        let urlpart = routeUrl.split('/');

        routeParams.lng = null;
        routeParams.hm = urlpart[3];
        routeParams.sm = urlpart[4] ? urlpart[4] : null;
        routeParams.tab = urlpart[5] ? urlpart[5] : null;
        routeParams.token = urlpart[6] ? urlpart[6] : null;

        if (urlpart[3] === 'nl' || urlpart[3] === 'en') {
            routeParams.lng = urlpart[3];
            routeParams.hm = urlpart[4];
            routeParams.sm = urlpart[5] ? urlpart[5] : null;
            routeParams.tab = urlpart[6] ? urlpart[6] : null;
            routeParams.token = urlpart[7] ? urlpart[7] : null;
        }

        // console.log(url, routeParams);
    }

    return routeParams;

}

function getMenuRoute(url) {

    let routeParams = getRouteParams(url);

    let menuRoutePath = routeParams.hm;
    if (routeParams.tab) {
        menuRoutePath = routeParams.hm + '/' + routeParams.sm + '/' + routeParams.tab;
        if (routeParams.tab === 'error') {
            menuRoutePath = routeParams.hm + '/' + routeParams.sm;
        }
    }
    else if (routeParams.sm) {
        menuRoutePath = routeParams.hm + '/' + routeParams.sm;
    }

    let menuName = menuRoutePath.replace(/\//g, '-');

    let lngPath = routeParams.lng ? routeParams.lng + '/' : '';
    let menuRoute = lngPath + menuRoutePath;

    $('.menu').removeClass('active');
    $('.menu[data-menu="' + routeParams.hm + '"]').addClass('active');
    $('.menu[data-menu="' + menuName + '"]').addClass('active');

    if (!routeParams.sm) {
        $('.menu[data-menu="' + routeParams.hm + '-init"]').addClass('active');
    }

    return {routeParams: routeParams, menuRoute: menuRoute};

}

function getRouteUrls(url) {

    let routeVars = getMenuRoute(url);
    let routeParams = routeVars.routeParams;
    let menuRoute = routeVars.menuRoute;

    let ajaxContentUrl = null;
    let ajaxMenuUrl = null;

    let testUrl = url.replace(window.location.protocol + '//' + window.location.host, '');

    const routes = {

        home: {

            menu_home: Routing.generate('menu_home', {_locale: routeParams.lng}),

            base_home: Routing.generate('base_home', {_locale: routeParams.lng, error: routeParams.tab}),
            content_home: Routing.generate('content_home', {_locale: routeParams.lng})

        },

        login: {

            menu_login: Routing.generate('menu_login', {_locale: routeParams.lng}),

            base_login: Routing.generate('base_login', {_locale: routeParams.lng, error: routeParams.sm}),
            content_login: Routing.generate('content_login', {_locale: routeParams.lng}),

            base_login_account: Routing.generate('base_login_account', {
                _locale: routeParams.lng,
                tab: routeParams.tab,
                token: routeParams.token
            }),
            content_login_account: Routing.generate('content_login_account', {
                _locale: routeParams.lng,
                tab: routeParams.tab,
                token: routeParams.token
            }),

            base_login_pass: Routing.generate('base_login_pass', {
                _locale: routeParams.lng,
                tab: routeParams.tab,
            }),
            content_login_pass: Routing.generate('content_login_pass', {
                _locale: routeParams.lng,
                tab: routeParams.tab,
            }),

            logout: Routing.generate('logout'),
            logout_redirect: Routing.generate('logout_redirect')

        },


        language: {

            menu: Routing.generate('menu_language'),

            translate_category: Routing.generate('language_translate_category', {category: routeParams.tab}),
            content_translate_category: Routing.generate('content_language_translate_category',
                                                         {category: routeParams.tab}),

            'export': Routing.generate('language_export'),
            content_export: Routing.generate('content_language_export'),

            category: Routing.generate('language_category'),
            content_category: Routing.generate('content_language_category'),
        }
    };

    let x = 0;

    for (let routeName in routes) {

        if (routes.hasOwnProperty(routeName)) {

            for (let routeKey in routes[routeName]) {

                if (routes[routeName].hasOwnProperty(routeKey)) {

                    let routeUrl = decodeURIComponent(routes[routeName][routeKey]);

                    // console.log(routeUrl);

                    if (routeUrl && routeUrl === testUrl) {

                        x++;

                        // console.log(routeUrl, testUrl);

                        if (x === 1) {

                            ajaxContentUrl = window.location.protocol
                                + '//'
                                + window.location.host
                                + '/content'
                                + routeUrl
                            ;

                            ajaxMenuUrl = window.location.protocol
                                + '//'
                                + window.location.host
                                + '/menu/'
                                + menuRoute
                            ;
                        }

                    }

                }

            }

        }

    }

    console.log(url, ajaxContentUrl, routeParams);

    return {ajaxContentUrl: ajaxContentUrl, ajaxMenuUrl: ajaxMenuUrl}
}

function getRoute(url) {

    let urls = getRouteUrls(url);
    let ajaxContentUrl = urls.ajaxContentUrl;
    let ajaxMenuUrl = urls.ajaxMenuUrl;

    return {ajaxContentUrl: ajaxContentUrl, ajaxMenuUrl: ajaxMenuUrl}

}

module.exports = {
    getRoute: getRoute
};