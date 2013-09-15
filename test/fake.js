module.exports.Logger = function() {
    return {
        create: function() {
            return {
                debug: function() {},
                error: function() {},
            };
        }
    };
};

module.exports.Helper = function() {
    return {
        merge: function(dist) {
            var slice = Array.prototype.slice;
            slice.call(arguments, 1).forEach(function(obj) {
                Object.keys(obj).forEach(function(key) {
                    dist[key] = obj[key];
                });
            });
            return dist;
        },
        _: {
            clone: function(obj) {
                return obj;
            }
        }
    };
};
