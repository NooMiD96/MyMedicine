import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import { createMemoryHistory } from 'history';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { routes } from './routes';
import configureStore from './configureStore';
import { ServerStyleSheet } from 'styled-components'
import * as AppState from "core/app/reducer";

export default createServerRenderer(params => {
    if (params.data.styleTags) {
        return new Promise<RenderResult>((resolve, reject) => {
            const store = configureStore(createMemoryHistory());
            store.dispatch(AppState.actionCreators.SetIsMobile(params.data.isMobile ? params.data.isMobile : false));

            const sheet = new ServerStyleSheet();
            sheet.collectStyles(<Provider store={store}>
                    {routes}
                </Provider>);

            params.domainTasks.then(() => {
                resolve({
                    html: sheet.getStyleTags()
                })
            }, reject); // Also propagate any errors back into the host application
        });
    } else {
        return new Promise<RenderResult>((resolve, reject) => {
            // Prepare Redux store with in-memory history, and dispatch a navigation event
            // corresponding to the incoming URL
            const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
            const urlAfterBasename = params.url.substring(basename.length);
            const store = configureStore(createMemoryHistory());

            //dispatch
            store.dispatch(replace(urlAfterBasename));
            // store.dispatch(AppState.actionCreators.SetIsMobile(params.data.isMobile ? params.data.isMobile : false));

            // Prepare an instance of the application and perform an inital render that will
            // cause any async tasks (e.g., data access) to begin
            const routerContext: any = {};

            //conect styled components in prerender
            const sheet = new ServerStyleSheet();
            const app = (
                <Provider store={store}>
                    <StaticRouter basename={basename} context={routerContext} location={params.location.path}>
                        {routes}
                    </StaticRouter>
                </Provider>
            );

            // If there's a redirection, just send this information back to the host application
            if (routerContext.url) {
                resolve({ redirectUrl: routerContext.url });
                return;
            }

            // Once any async tasks are done, we can perform the final render
            // We also send the redux store state, so the client can continue execution where the server left off
            params.domainTasks.then(() => {
                resolve({
                    html: renderToString(app),
                    globals: { initialReduxState: store.getState() }
                });
            }, reject); // Also propagate any errors back into the host application
        });
    }
});
