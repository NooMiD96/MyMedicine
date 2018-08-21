import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer, StoreEnhancerStoreCreator, ReducersMapObject } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import * as StoreModule from './src/reducer';
import { ApplicationState, reducers } from './src/reducer';
import { History } from 'history';

export default function configureStore(history: History, initialState?: ApplicationState) {
  // Build middleware. These are functions that can process the actions before they reach the store.
  const windowIfDefined = typeof window === 'undefined' ? null : window as any;
  // If devTools is installed, connect to it
  const devToolsExtension = windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__ as () => GenericStoreEnhancer;

  // const createStoreWithMiddleware = compose(
  //     applyMiddleware(thunk, routerMiddleware(history)),
  //     devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next
  // )(createStore);
  // Combine all reducers and instantiate the app-wide store instance
  // const allReducers = buildRootReducer(reducers);
  // const store = createStoreWithMiddleware(allReducers, initialState) as Store<ApplicationState>;
  let store = initialState
    ? createStore(
      connectRouter(history)(buildRootReducer(reducers)),
      initialState,
      compose(
        applyMiddleware(thunk, routerMiddleware(history)),
        devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next
      )
    )
    : createStore(
      connectRouter(history)(buildRootReducer(reducers)),
      compose(
        applyMiddleware(thunk, routerMiddleware(history)),
        devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next
      )
    );

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('./src/reducer', () => {
      // tslint:disable-next-line
      const nextRootReducer = require<typeof StoreModule>('./src/reducer');
      store.replaceReducer(
        connectRouter(history)(
          buildRootReducer(nextRootReducer.reducers)
        )
      );
    });
  }

  return store;
}

function buildRootReducer(allReducers: ReducersMapObject) {
  return combineReducers<ApplicationState>(Object.assign({}, allReducers));
}
