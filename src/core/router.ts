// Created by baihuibo on 2017/3/1.

import {forEach} from "angular";
import "angular-ui-router";
import {NgModule, Names} from "./core";
import {IRouter, CanActivate, IComponentOptions} from "../typings";
// import "ng-ui-router-state-events"; // 暂时不启用此插件

export module RouterModule {
    export function forRoot(routers: IRouter[]) {
        return getModule(class {
            static $inject = ['$stateProvider'];

            constructor($stateProvider) {
                routers.forEach(item => {
                    if (Array.isArray(item)) {
                        (<Array>item).forEach(state => register(fromState(state), $stateProvider));
                    } else if (item.name) {
                        register(fromState(item), $stateProvider);
                    }
                })
            }
        });
    }

    export function forChild(routers: IRouter[]) {
        return forRoot(routers);
    }
}

function register(router: IRouter, $stateProvider) {
    if (router.canActivate) {
        router.onEnter = function ($injector) {
            let result;
            if (router.canActivate) {
                router.canActivate.forEach(function (guard) {
                    const instance: CanActivate = <any>$injector.instantiate(guard);
                    result = result || instance.canActivate();
                });
            }
            return result;
        };
        router.onEnter['$inject'] = ['$injector'];
    }
    $stateProvider.state(router.name, router);
}

function fromState(state: IRouter) {
    state.component && transformCompToString(state);

    if (state.views) {
        forEach(state.views, function (view: angular.ui.IState, key) {
            view.component && transformCompToString(view);
        });
    }

    return state;
}

function transformCompToString(state: IRouter) {
    const comp = state.component;
    const option: IComponentOptions = comp[Names.component];
    state.component = option.selector || comp;
}

function getModule(config) {
    class UiRouterDefaultErrorHandlerConfig {
        static $inject = ['$state'];

        constructor($state: angular.ui.IStateService) {
            $state['defaultErrorHandler'](() => {
            });
        }
    }

    @NgModule({
        imports: ['ui.router'],
        configs: [config]
    })
    class Module {
    }

    return Module;
}