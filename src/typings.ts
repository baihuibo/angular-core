// Created by baihuibo on 2017/3/1.
/**
 * 路由配置
 */
export interface IRouter {
    name?: string;
    template?: string | {(params: angular.ui.IStateParamsService): string};
    templateUrl?: string | {(params: angular.ui.IStateParamsService): string};
    templateProvider?: Function | Array<string | Function>;
    component?: string | Function;
    controller?: Function | string | Array<string | Function>;
    controllerAs?: string;
    controllerProvider?: Function | Array<string | Function>;
    parent?: string | IRouter;
    resolve?: {[name: string]: any};
    url?: string | angular.ui.IUrlMatcher;
    params?: any;
    views?: {[name: string]: IRouter};
    abstract?: boolean;

    canActivate?: Array<Function>;
    canActivateChild?: Function;
    CanDeactivate?: Function;

    onEnter?: Function | Array<string | Function>;
    onExit?: Function | Array<string | Function>;
    data?: any;
    reloadOnSearch?: boolean;
    cache?: boolean;
}

/**
 * 决定路由器是否允许激活
 */
export interface CanActivate {
    canActivate();
}

/**
 * 是否允许激活子路由
 */
export interface CanActivateChild {
    canActivateChild();
}

/**
 * 组件配置
 */
export interface IComponentOptions {
    selector?: string
    controller?: string | angular.Injectable<any>;
    controllerAs?: string;
    template?: string | angular.Injectable<(...args: any[]) => string>;
    templateUrl?: string | angular.Injectable<(...args: any[]) => string>;
    bindings?: {[boundProperty: string]: string};
    transclude?: boolean | {[slot: string]: string};
    require?: {[controller: string]: string};
}

/**
 * 指令配置
 */
export interface IDirectiveOption {
    selector: string
    compile?: angular.IDirectiveCompileFn;
    controller?: string | angular.Injectable<angular.IControllerConstructor>;
    controllerAs?: string;
    bindToController?: boolean | {[boundProperty: string]: string};
    link?: angular.IDirectiveLinkFn | angular.IDirectivePrePost;
    multiElement?: boolean;
    priority?: number;
    replace?: boolean;
    require?: string | string[] | {[controller: string]: string};
    restrict?: string;
    scope?: boolean | {[boundProperty: string]: string};
    template?: string | ((tElement: JQuery, tAttrs: angular.IAttributes) => string);
    templateNamespace?: string;
    templateUrl?: string | ((tElement: JQuery, tAttrs: angular.IAttributes) => string);
    terminal?: boolean;
    transclude?: boolean | 'element' | {[slot: string]: string};
}

/**
 * 模块配置
 */
export interface IModule {
    name?: string // 模块名称
    imports?: any[] // 导入模块,路由模块

    declarations?: any[]// 组件，指令，管道
    providers?: any[] // 服务提供

    configs?: any[] // 模块配置
    runs?: any[] // 运行时模块

    bootstrap?: any[]
}

/** 可允许注入的name参数 */
export interface InjectableOption {
    name: string
}

/**
 * 管道接口
 * @example
 *
 * ```ts
 * @Pipe({name : 'test'})
 * class TestPipe implements PipeTransform{
     *      transform(value){
     *          return value + '!!!';
     *      }
     * }
 * ```
 *
 * ```html
 * {{ 'hello word' | test}}
 * ```
 *
 */
export interface PipeTransform {
    transform(value: any, ...args: any[]): any
}