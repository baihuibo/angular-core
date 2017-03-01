// Created by baihuibo on 16/8/30.
import {module, forEach, merge} from "angular";
import {IModule, InjectableOption, IComponentOptions, IDirectiveOption, PipeTransform} from "../typings";

export enum Names {
    component = 1,
    directive = 2,
    module = 3,
    injectable = 4,
    pipe = 5
}

let globalTimer: number;
function globalDigest() {// 触发全局的值检查
    clearTimeout(globalTimer);
    globalTimer = setTimeout(function () {
        $(document)['scope']().$digest();
    }, 1);
}

export function Component(option: IComponentOptions): any {
    return function (classes) {
        option.selector = option.selector ? strandToCamel(option.selector.trim()) : 'component' + nextId();
        option.controller = classes;
        let {prototype} = classes;
        if (prototype.$onInit) {
            let old = prototype.$onInit;
            prototype.$onInit = function () {
                setImmediate(() => {
                    old.call(this);
                    globalDigest();
                });
            };
        }
        setMetaData(classes, option, Names.component);
    }
}

export function Directive(option: IDirectiveOption) {
    return function (classes) {
        let selector = option.selector.trim();

        const first = selector[0];

        if (first == '[' && selector.slice(-1) == ']') {// attr
            selector = selector.slice(1, -1);
            option.restrict = 'A';
        } else if (first == '.') {// class
            selector = selector.slice(1);
            option.restrict = 'C';
        }
        selector = strandToCamel(selector);

        option.controller = classes;
        setMetaData(classes, {
            [selector](){
                return option
            }
        }, Names.directive);
    }
}

export function Injectable(option: InjectableOption) {
    return function (classes) {
        setMetaData(classes, {
            [option.name]: classes
        }, Names.injectable);
    }
}

export function Pipe(option: InjectableOption) {
    return function (classes) {
        classes[Names.pipe] = option;
    }
}

export function NgModule(option: IModule) {
    return function (classes) {
        classes[Names.module] = option.name || "module" + nextId();
        const mod = module(classes[Names.module], transformImports(option.imports || []));

        registerProviders(option.providers, 'service', Names.injectable);
        registerProviders(option.configs, 'config');
        registerProviders(option.runs, 'run');

        registerDeclarations(option.declarations);

        function registerDeclarations(list: any[]) {
            list && list.forEach(item => {
                const pipe = item[Names.pipe];
                const component: IComponentOptions = item[Names.component];
                const directive = item[Names.directive];
                if (pipe) {
                    mod.filter(pipe.name, ['$injector', function ($injector) {
                        const instance: PipeTransform = $injector.instantiate(item);
                        return function (value, ...args) {
                            return instance.transform(value, ...args);
                        }
                    }]);
                } else {
                    component && mod.component(component.selector, component);
                    directive && mod.directive(directive);
                }
            });
        }

        function transformImports(imports: any[]) {
            return imports.filter(i => !!i).map(module => {
                if (typeof module === 'string') {
                    return module;
                }
                return module[Names.module] || module.name || 'ng';
            });
        }

        function registerProviders(items: any[], method: string, names?: Names) {
            items && items.forEach(item => mod[method](names ? item[names] : item));
        }
    }
}

export function Input(name?: string, optional?: boolean) {
    return bindings_proxy(name, optional ? '<?' : '<');
}
export function InputOnly(name?: string, optional?: boolean) {
    return bindings_proxy(name, optional ? '@?' : '@');
}
export function Bindings(name?: string, optional?: boolean) {
    return bindings_proxy(name, optional ? '=?' : '=');
}
export function Output(name?: string) {
    return bindings_proxy(name, '&');
}

export function ViewParent(comp: Function) {
    return function (target, key) {
        const compOption: IComponentOptions = comp[Names.component];
        setMetaData(target.constructor, {
            require: {[key]: '?^' + compOption.selector}
        }, Names.component);
    }
}

function bindings_proxy(name, symbol) {
    return function (target, key) {
        setMetaData(target.constructor, {
            bindings: {[name || key]: symbol}
        }, Names.component);
    }
}

function setMetaData(classes, option, names: Names) {
    classes[names] = merge(classes[names] || {}, option);
}

// 串转驼峰 (aaa-test) => (aaaTest)
export function strandToCamel(name: string) {
    return name.replace(/-([a-z])/g, fnCamelCaseReplace);
}

function fnCamelCaseReplace(all, letter) {
    return letter.toUpperCase();
}

let id = 0;
function nextId() {
    return ++id;
}