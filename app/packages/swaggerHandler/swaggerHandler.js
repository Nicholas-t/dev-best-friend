const { apiSchema, defaultHeadersSchema, defaultInputSchema } = require('../schema');
const { copySchema } = require('../util');
const SwaggerParser = require("swagger-parser");

require('dotenv').config();

class swaggerHandler {
	/**
	 * @constructor
	 */
	constructor() {
        this.description = 'Helper for operation dealing with swagger API Documentation';
        this.objectTypes = {
            string : "string",
            number : "number",
            integer : "number",
            boolean : "checkbox"
        }
    }   
    
    parseSwagger2_0(spec){
        const api = []
        let baseUrls = []
        spec.schemes.forEach(scheme => {
            baseUrls.push(`${scheme}://${spec.host}${spec.basePath}`)
        });
        const paths = Object.keys(spec.paths)
        baseUrls.forEach(baseUrl => {
            paths.forEach(path => {
                if (spec.paths[path].get){
                    let input = []
                    let pathParam = []
                    let header = []
                    spec.paths[path].get.parameters.forEach((parameterSpec) => {
                        if (parameterSpec.in === "path"){
                            pathParam.push({
                                name : parameterSpec.name,
                                label : parameterSpec.description
                            })
                        } else if (parameterSpec.in === "header"){
                            header.push({
                                key_header : parameterSpec.name
                            })
                        } else {
                            if (this.objectTypes[parameterSpec.type]){
                                input.push({
                                    name : parameterSpec.name,
                                    label : parameterSpec.description,
                                    type : this.objectTypes[parameterSpec.type]
                                })
                            } else {
                                input.push({
                                    name : parameterSpec.name,
                                    label : parameterSpec.description,
                                    type : "error"
                                })
                            }
                        }
                    })
                    api.push({
                        name : spec.paths[path].get.operationId ? spec.paths[path].get.operationId : spec.paths[path].get.summary,
                        endpoint : `${baseUrl}${path}`,
                        method : 'GET',
                        input, pathParam, header
                    })
                }
                if (spec.paths[path].post){
                    let input = []
                    let pathParam = []
                    let header = []
                    spec.paths[path].post.parameters.forEach((parameterSpec) => {
                        if (parameterSpec.in === "path"){
                            pathParam.push({
                                name : parameterSpec.name,
                                label : parameterSpec.description
                            })
                        } else if (parameterSpec.in === "header"){
                            header.push({
                                key_header : parameterSpec.name
                            })
                        } else {
                            if (this.objectTypes[parameterSpec.type]){
                                input.push({
                                    name : parameterSpec.name,
                                    label : parameterSpec.description,
                                    type : this.objectTypes[parameterSpec.type]
                                })
                            } else {
                                input.push({
                                    name : parameterSpec.name,
                                    label : parameterSpec.description,
                                    type : "error"
                                })
                            }
                        }
                    })
                    api.push({
                        name : spec.paths[path].post.operationId ? spec.paths[path].post.operationId : spec.paths[path].post.summary,
                        endpoint : `${baseUrl}${path}`,
                        method : 'POST',
                        input, pathParam, header
                    })
                }
            })
        })
        return api;
    }

    parseSwagger3_0(spec){
        const api = []
        let baseUrls = []
        spec.servers.forEach(scheme => {
            baseUrls.push(scheme.url)
        });
        const paths = Object.keys(spec.paths)
        baseUrls.forEach(baseUrl => {
            paths.forEach(path => {
                if (spec.paths[path].get){
                    let input = []
                    let pathParam = []
                    let header = []
                    if (spec.paths[path].get.parameters){
                        spec.paths[path].get.parameters.forEach((parameterSpec) => {
                            if (parameterSpec.in === "path"){
                                pathParam.push({
                                    name : parameterSpec.name,
                                    label : parameterSpec.description
                                })
                            } else if (parameterSpec.in === "header"){
                                header.push({
                                    key_header : parameterSpec.name
                                })
                            } else {
                                if (this.objectTypes[parameterSpec.schema.type]){
                                    input.push({
                                        name : parameterSpec.name,
                                        label : parameterSpec.description,
                                        type : this.objectTypes[parameterSpec.schema.type]
                                    })
                                } else {
                                    input.push({
                                        name : parameterSpec.name,
                                        label : parameterSpec.description,
                                        type : "error"
                                    })
                                }
                            }
                        })
                    }
                    api.push({
                        name : spec.paths[path].get.operationId ? spec.paths[path].get.operationId : spec.paths[path].get.summary,
                        endpoint : `${baseUrl}${path}`,
                        method : 'GET',
                        input, pathParam, header
                    })
                }
                if (spec.paths[path].post){
                    let input = []
                    let pathParam = []
                    let header = []
                    if (spec.paths[path].post.parameters) {
                        spec.paths[path].post.parameters.forEach((parameterSpec) => {
                            if (parameterSpec.in === "path"){
                                pathParam.push({
                                    name : parameterSpec.name,
                                    label : parameterSpec.description
                                })
                            } else if (parameterSpec.in === "header"){
                                header.push({
                                    key_header : parameterSpec.name
                                })
                            } else {
                                if (this.objectTypes[parameterSpec.schema.type]){
                                    input.push({
                                        name : parameterSpec.name,
                                        label : parameterSpec.description,
                                        type : this.objectTypes[parameterSpec.schema.type]
                                    })
                                } else {
                                    input.push({
                                        name : parameterSpec.name,
                                        label : parameterSpec.description,
                                        type : "error"
                                    })
                                }
                            }
                        })
                    }
                    api.push({
                        name : spec.paths[path].post.operationId ? spec.paths[path].post.operationId : spec.paths[path].post.summary,
                        endpoint : `${baseUrl}${path}`,
                        method : 'POST',
                        input, pathParam, header
                    })
                }
            })
        })
        return api;
    }
}

module.exports = swaggerHandler;
