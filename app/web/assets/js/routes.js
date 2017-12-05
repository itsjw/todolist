function getRouteParams(url) {

    let routeParams = [];

    if (url) {
        let routeUrl = url.replace(window.location.host + '/app_dev.php', '');
        routeUrl = routeUrl.replace(window.location.host + '/menu', '');
        routeUrl = routeUrl.replace(window.location.host + '/content', '');

        let urlpart = routeUrl.split('/');

        routeParams.hm = urlpart[3];
        routeParams.tab = urlpart[4] ? urlpart[4] : null;
        routeParams.page = urlpart[5] ? urlpart[5] : null;
        routeParams.id = urlpart[6] ? urlpart[6] : null;

    }

    return routeParams;

}

function getMenuRoute(url) {

    let routeParams = getRouteParams(url);

    let menuRoutePath = routeParams.hm + '/' + routeParams.tab;
    if (routeParams.page) {
        menuRoutePath = menuRoutePath + '/' + routeParams.page;
    }
    if (routeParams.id) {
        menuRoutePath = menuRoutePath + '/' + routeParams.id;
    }

    let menuName = menuRoutePath.replace(/\//g, '-');

    let menuRoute = menuRoutePath;

    console.log(menuRoute, menuName);

    $('.menu').removeClass('active');
    $('.menu[data-menu="' + menuName + '"]').addClass('active');

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

        todolist: {

            menu: Routing.generate('menu_todolist', {
                slug1: routeParams.tab,
                slug2: routeParams.page,
                slug3: routeParams.id
            }),

            //todolist/{tab}/{category}
            base_todolist_category: Routing.generate('base_todolist_category', {
                tab: routeParams.tab,
                category: routeParams.page
            }),
            content_todolist_category: Routing.generate('content_todolist_category', {
                tab: routeParams.tab,
                category: routeParams.page
            }),

            //todolist/{category}/edit/{id}
            base_todolist_edit: Routing.generate('base_todolist_edit', {
                category: routeParams.tab, id: routeParams.id
            }),
            content_todolist_edit: Routing.generate('content_todolist_edit', {
                category: routeParams.tab, id: routeParams.id
            }),
            content_todolist_remove: Routing.generate('content_todolist_remove', {
                category: routeParams.page, id: routeParams.id
            }),

            //todolist/categories
            base_todolist_categories: Routing.generate('base_todolist_categories'),
            content_todolist_categories: Routing.generate('content_todolist_categories'),

        }
    };

    let x = 0;

    for (let routeName in routes) {

        if (routes.hasOwnProperty(routeName)) {

            for (let routeKey in routes[routeName]) {

                if (routes[routeName].hasOwnProperty(routeKey)) {

                    let routeUrl = decodeURIComponent(routes[routeName][routeKey]);

                    if (routeUrl && routeUrl === testUrl) {

                        x++;

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