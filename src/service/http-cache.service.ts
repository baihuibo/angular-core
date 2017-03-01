// Created by baihuibo on 2017/2/8.

import {Injectable} from "../core/core";

@Injectable({
    name: 'HttpCacheService'
})
export class HttpCacheService {
    static $inject = ['$log'];

    constructor(private $log: angular.ILogService) {
        $log.debug('不缓存任何请求');
    }

    request(request: angular.IRequestConfig) {
        if (/get|delete/i.test(request.method)) {
            request.params = request.params || {};
            request.params['no_cache'] = Date.now();
        }
        return request;
    }
}