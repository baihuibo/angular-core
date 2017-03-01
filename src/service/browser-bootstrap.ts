// Created by baihuibo on 2017/1/10.
import {bootstrap} from "angular";
import {Names} from "../core/core";

export function bootstrapModule(module) {
    bootstrap(document, [module[Names.module]]);
}