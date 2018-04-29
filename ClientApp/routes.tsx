import * as React from 'react';
import { Route } from 'react-router-dom';
import MyLayout from './src/MyLayout';
import { AsyncComponent } from 'core/AsyncComponent';

export const routes = <MyLayout>
    <Route exact path='/' component={ AsyncComponent(() => import(/* webpackChunkName: "Home" */ 'components/home')) } />
    <Route path='/Post/:id' component={ AsyncComponent(() => import(/* webpackChunkName: "Post" */ 'components/home/post/view')) } />
    <Route path='/Edit/:id' component={ AsyncComponent(() => import(/* webpackChunkName: "Edit" */ 'components/home/post/edit')) } />
    <Route exact path='/Visitation' component={ AsyncComponent(() => import(/* webpackChunkName: "Visitation" */ 'components/visitation')) } />
    <Route exact path='/SearchDisease' component={ AsyncComponent(() => import(/* webpackChunkName: "SearchDisease" */ 'components/searchDisease')) } />
    <Route exact path='/Symptoms' component={ AsyncComponent(() => import(/* webpackChunkName: "Symptoms" */ 'components/symptoms')) } />
    <Route exact path='/Chat' component={ AsyncComponent(() => import(/* webpackChunkName: "Chat" */ 'components/chat')) } />
</MyLayout>;
