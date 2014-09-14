function listObjectsHandler(err, data) {
    if (err) {
        $('.directory-index').prepend($('<p class="error">ERROR: ' + err + '</p>'));
    } else {
        var tree = getDirectoryMetadata(data);
        var sorted_keys = Object.keys(tree);
        sorted_keys.sort();
        for(var index in sorted_keys){
            var key = sorted_keys[index];
            var value = tree[sorted_keys[index]];
            if(value.Key){
                key = "<a href=\"/" + value.Key + "\">" + key + "</a>";
            }
            else {
                key += "/";
            }
            var row = $('<div class="row"><div class="col-xs-10">' + key + '</div><div class="col-xs-2"></div></div>');
            $('.directory-index').prepend(row);
        }
    }
}

function getDirectoryMetadata(data){
    var tree = {};
    data.Contents.forEach(function (obj) {
        var path = obj.Key.split('/');
        var node = tree;
        for(index in path){
            var segment = path[index];
            if(index == path.length - 1){
                node[segment] = obj;
            }
            else {
                if(tree[segment] === undefined){
                    node[segment] = {}
                }
                node = node[segment];
            }
        }
    });
    return tree;
}