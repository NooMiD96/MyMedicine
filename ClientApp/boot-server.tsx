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
import * as UserState from "components/authorization/reducer";

export default createServerRenderer(params => {
    return new Promise<RenderResult>((resolve, reject) => {
        // Prepare Redux store with in-memory history, and dispatch a navigation event
        // corresponding to the incoming URL
        const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
        const urlAfterBasename = params.url.substring(basename.length);
        const store = configureStore(createMemoryHistory());
        //dispatch
        store.dispatch(replace(urlAfterBasename));
        store.dispatch(AppState.actionCreators.SetIsMobile(params.data.isMobile ? params.data.isMobile : false));
        if (params.data.user) {
            const user = JSON.parse(params.data.user);
            store.getState().user.UserName = user.UserName;
            store.getState().user.UserRole = user.UserRole;
        }
        store.getState().posts.Posts = [
            {
                Author: 'Admin',
                PostId: 0,
                Header: 'Head',
                Context: 'Context',
                Date: new Date(),
                ImgUrl: 'ImgUrl',
                LikesCount: 5,
                CommentsCount: 15
            }, {
                Author: 'Admin',
                PostId: 1,
                Header: 'Head',
                Context: 'Context',
                Date: new Date(),
                ImgUrl: 'ImgUrl',
                LikesCount: 5,
                CommentsCount: 15
            }, {
                Author: 'Admin',
                PostId: 2,
                Header: 'Head',
                Context: 'Context',
                Date: new Date(),
                ImgUrl: 'ImgUrl',
                LikesCount: 5,
                CommentsCount: 15
            }, {
                Author: 'Admin',
                PostId: 3,
                Header: 'Head',
                Context: 'Context',
                Date: new Date(),
                ImgUrl: 'ImgUrl',
                LikesCount: 5,
                CommentsCount: 15
            },
        ];
        store.getState().posts.TotalCount = store.getState().posts.Posts.length;
        // Prepare an instance of the application and perform an inital render that will
        // cause any async tasks (e.g., data access) to begin
        const routerContext: any = {};
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
        //Init styled component
        const sheet = new ServerStyleSheet();
        sheet.collectStyles(app);
        // Once any async tasks are done, we can perform the final render
        // We also send the redux store state, so the client can continue execution where the server left off
        params.domainTasks.then(() => {
            resolve({
                html: `<div id="react-app-styles">${sheet.getStyleTags()}</div><div id="react-app">${renderToString(app)}</div>`,
                globals: { initialReduxState: store.getState(), user: params.data.user }
            });
        }, reject); // Also propagate any errors back into the host application
    });
});
