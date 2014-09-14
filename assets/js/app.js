function listObjectsHandler(err, data) {
    if (err) {
        $('.directory-index').prepend($('<p class="error">ERROR: ' + err + '</p>'));
        return;
    }

    var listing = getDirectoryMetadata(data);
    var requested_path = location.hash ? location.hash.split('#')[1] : '';
    var tree = getBranch(listing, requested_path);
    if(! tree){
        $('.directory-index').prepend($('<p class="error">ERROR: Path not found: ' + requested_path + '</p>'));
        return;
    }
    
    var sorted_keys = Object.keys(tree);
    sorted_keys.sort();
    sorted_keys.reverse();
    for(var index in sorted_keys){
        var key = sorted_keys[index];
        if(key == '') continue;
        
        var value = tree[sorted_keys[index]];
        if(value.Key){
            key = "<a href=\"/" + value.Key + "\">" + key + "</a>";
        }
        else {
            var subpath = requested_path + '/' + key;
            key = "<a href=\"#" + subpath + "\">" + key + "/</a>";
        }
        var row = $('<div class="row directory-item"><div class="col-xs-10">' + key + '</div><div class="col-xs-2"></div></div>');
        $('.directory-index').prepend(row);
    }
}

function getBranch(tree, location_hash){
    var path = location_hash.split('/');
    var node = tree;
    for(index in path){
        var segment = path[index];
        if(index == 0) continue;
        
        if(node[segment] === undefined){
            return null;
        }
        node = node[segment];
    }
    return node;
}

function detectBucketName(){
    var matches = location.hostname.match(/(.*?)\.s3-website-([-\w]*)\.amazonaws\.com/);
    if(matches){
        return matches[1];
    }
    return location.hostname;
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
                if(node[segment] === undefined){
                    node[segment] = {}
                }
                node = node[segment];
            }
        }
    });
    return tree;
}