import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';

import { routes } from './routes';
import configureStore from './configureStore';
import { ServerStyleSheet } from 'styled-components';
import * as PostsState from 'components/home/reducer';

export default createServerRenderer(params =>
    new Promise<RenderResult>((resolve, reject) => {
        // Prepare Redux store with in-memory history, and dispatch a navigation event
        // corresponding to the incoming URL
        const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
        const urlAfterBasename = params.url.substring(basename.length);
        const store = configureStore(createMemoryHistory());
        // dispatch
        store.dispatch(replace(urlAfterBasename));
        store.dispatch({ type: 'SET_IS_MOBILE', IsMobile: params.data.isMobile || false });
        store.dispatch({ type: 'SET_XPT', xpt: JSON.parse(params.data.xpt) || '' });
        if (params.data.user) {
            const user = JSON.parse(params.data.user);
            store.dispatch({
                type: 'GET_USER_INFO_SUCCESS',
                UserName: user.UserName,
                UserRole: user.UserRole,
            });
        }

        // Prepare an instance of the application and perform an inital render that will
        // cause any async tasks (e.g., data access) to begin

        // PostsState.actionCreators.GetPosts(1, 5)(store.dispatch, store.getState);

        const routerContext: any = {};
        const app = (
            <Provider store={store}>
                <StaticRouter basename={basename} context={routerContext} location={params.location.path} children={routes} />
            </Provider>
        );
        // If there's a redirection, just send this information back to the host application
        if (routerContext.url) {
            resolve({ redirectUrl: routerContext.url });
            return;
        }
        // Init styled component
        const sheet = new ServerStyleSheet();
        sheet.collectStyles(app);
        // Once any async tasks are done, we can perform the final render
        // We also send the redux store state, so the client can continue execution where the server left off
        params.domainTasks.then(() => {
            resolve({
                html: `<div id="react-app-styles">${sheet.getStyleTags()}</div><div id="react-app">${renderToString(app)}</div>`,
                globals: { initialReduxState: store.getState(), recaptchaOptions: { lang: 'en' } },
            });
        }, reject); // Also propagate any errors back into the host application
    })
);
