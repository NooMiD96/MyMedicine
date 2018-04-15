import * as React from 'react';
import { Route } from 'react-router-dom';
import {MyLayout} from './src/MyLayout';
import { AsyncComponent } from 'core/AsyncComponent';

export const routes = <MyLayout>
    <Route exact path='/' component={ AsyncComponent(() => import(/* webpackChunkName: "Home" */ './src/components/home/Home')) } />
    <Route exact path='/Comp2' component={ AsyncComponent(() => import(/* webpackChunkName: "Comp2" */ './src/components/comp2/Comp2')) } />
</MyLayout>;
