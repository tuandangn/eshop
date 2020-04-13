function promiseModelAdapter(Model) {
    function adaptQuery(query) {
        return function (...args) {
            return query.apply(Model, args).exec();
        }
    }

    function adaptCallback(callback) {
        return function (...args) {
            return new Promise((resolve, reject) => {
                const promiseCb = function (error, ...rest) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        switch (rest.length) {
                            case 0:
                                resolve();
                                break;
                            case 1:
                                resolve(rest[0]);
                                break;
                            default:
                                resolve(rest);
                                break;
                        }
                    }
                };
                args.push(promiseCb);
                callback.apply(Model, args);
            });
        }
    }

    return Object.assign({}, Model, {
        find: adaptQuery(Model.find),
        findById: adaptQuery(Model.findById),
        create: adaptCallback(Model.create),
        deleteOne: adaptCallback(Model.deleteOne),
        count: adaptQuery(Model.countDocuments)
    });
}

module.exports = promiseModelAdapter;