/**
 * Created by raviteja on 9/25/16.
 */

function getDataFromServer(param) {
    if (param && param.local) {
        var uriLink = "/learninghub/json/data.json";
    } else {
        uriLink = "https://hackerearth.0x10.info/api/learning-paths?type=json&query=list_paths";
    }
    $.ajax({
        method: "GET",
        url: uriLink,
        success: function (data) {
            $.jStorage.set("courseData", data);
        }
    })
}

function grabNavBarPaths() {
    var data = $.jStorage.get("courseData");
    if (data && data.paths) {
        var coursePaths = data.paths;
        var NavBarPaths = coursePaths.map(function (obj) {
            var nObj = {};
            nObj['id'] = obj.id;
            nObj['name'] = obj.name;
            return nObj;
        });

        return NavBarPaths;
    } else {

        return null;
    }

}

function updatePathsNavBar() {
    var Npaths = grabNavBarPaths();
    if (Npaths) {
        var nlistSource = $("#lpathsNavBar-template").html();
        var template = Handlebars.compile(nlistSource);
        var nlisthtml = template(Npaths);
        $('#pathsNameList').empty().html(nlisthtml);

    } else {
        alert("unable to fetch data");
    }

}

function fetchAllpaths() {
    var data = $.jStorage.get("courseData");
    return data.paths;
}

function updatePathDetailsList(pathsObj) {
    if(pathsObj){
        var cCardSource = $("#courseCard-template").html();
        var template = Handlebars.compile(cCardSource);
        var cCardhtml = template(pathsObj);
        $('#courseList').empty().html(cCardhtml);
    }else{
        alert("unable to fetch data");
    }
}


function bindEvents(){
    $('#pathsNameList a').on('click',function(){

        var _this = $(this)[0].id;
        var pathList = fetchAllpaths();
        if(_this=="prev" || _this =="next"){

                $(this).parent('li').addClass('active').siblings().removeClass('active');
                updatePathDetailsList(pathList);

        }else{
            $(this).parent('li').addClass('active').siblings().removeClass('active');
            var rpath = [];
            pathList.forEach(function(obj){

                if(_this && _this == obj.id){
                    rpath.push(obj);
                }

            })
            updatePathDetailsList(rpath);

        }


    })
}

$(document).ready(function () {
    var params = {
        local: false
    };
    getDataFromServer(params);
    updatePathsNavBar();
    var paths = fetchAllpaths();
    updatePathDetailsList(paths);
    bindEvents();

});