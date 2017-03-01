// Created by baihuibo on 2017/2/8.

import {Injectable} from "../core/core";

@Injectable({
    name: 'HttpDevProxyService'
})
export class HttpDevProxyService {
    static $inject = ['$log'];

    constructor(private $log: angular.ILogService) {
        $log.debug('非开发环境，使用本地http代理模式');
    }

    request(request: angular.IRequestConfig) {
        request.method = 'get';// 不管是何种方式的访问请求，全部设置为 GET 方式
        request.url = `assets/api/${request.url}.json`; // 将资源地址指向本地的.json文件
        return request;
    }
}