$(function() {
    var userAccount;
    var userPrivateKey;
    $("#LoginWindow").modal();

    $(".Login").on("click", function() {
        userAccount = $("#userAcc").val();
        userPrivateKey = $("#PrivateKey").val();

        config = {
            chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
            keyProvider: [userPrivateKey],
            httpEndpoint: 'http://127.0.0.1:8888',
            expireInSeconds: 60,
            broadcast: true,
            verbose: false, // API activity
            sign: true
        }
        eos = Eos(config);


        eos.getAccount(userAccount).then(result => {
            console.log(result);
            alert("欢迎回来，" + userAccount);
            $(".userName span:nth-child(2)").html("账户：" + userAccount);

        }).catch(err => {
            console.log(err);
            alert("错误：账户不存在！");
        });



        $(".close_win").click();
        getTaskList();
    });





    //新建证书
    $(".Createcard").on("click", function() {
        console.log("新建证书");
        console.log(userPrivateKey);
        $("#ReleaseCard").modal();
        getTaskList();
    });
    //确认颁发证书
    $(".ConfirmRelease").on("click", function() {

        var student  = $("#GetStudent").val();
        var sex   = $("#GetSex").val();
        var subject   = $("#GetSubject").val();
        var score   = $("#GetScore").val();
        var comment   = $("#GetComment").val();
        console.log(student,sex,subject,score,comment);
        $(".close_win").click();

        eos.transaction({
            actions: [
                {
                    account: 'pdjeducard',
                    name:    'create',
                    authorization: [{
                        actor:      userAccount,
                        permission: 'active'
                    }],

                    data: {
                        admin:    userAccount,
                        studentname:     student,
                        subject:  subject,
                        score:       score,
                        comment: comment
                    }
                }
            ]
        }).then(result => {
            console.log(result);
            alert("发布成功！");
            getTaskList();
        })
            .catch(error => {console.error(error);alert("发生错误！" + error)});
    });


    //修改证书
    $(".Changecard").on("click", function() {
        console.log("修改证书");
        console.log(userPrivateKey);
        $("#Modifycard").modal();
        getTaskList();
    });

    //确认修改证书
    $(".ConfirmChange").on("click", function() {
        var cardid  = $("#GetId").val();
        var student  = $("#GetStudent").val();
        var sex   = $("#GetSex").val();
        var subject   = $("#GetSubject").val();
        var score   = $("#GetScore").val();
        var comment   = $("#GetComment").val();
        console.log(cardid,student,sex,subject,score,comment);
        $(".close_win").click();

        eos.transaction({
            actions: [
                {
                    account: 'pdjeducard',
                    name:    'change',
                    authorization: [{
                        actor:      userAccount,
                        permission: 'active'
                    }],

                    data: {
                        cardid: cardid,
                        admin:    userAccount,
                        studentname:     student,
                        subject:  subject,
                        score:       score,
                        comment: comment
                    }
                }
            ]
        }).then(result => {
            console.log(result);
            alert("发布成功！");
            getTaskList();
        })
            .catch(error => {console.error(error);alert("发生错误！" + error)});
    });





    //查询证书
    $(".Findcard").on("click", function() {
        console.log("修改证书");
        console.log(userPrivateKey);
        $("#FindIdcard").modal();
        getTaskList();
    });

    //确认查找证书
    $(".ConfirmFind").on("click", function() {
        var id  = $("#GetId").val();

        console.log(cardid);
        $(".close_win").click();

        eos.getTableRows({
            scope:  'pdjeducard',
            code:   'pdjeducard',
            table:  'educards',
            json:   true,
            lower_bound: 0,
            upper_bound: -1,
            limit:  20
        })
            .then(function(result){
                console.log(result.rows);

                for(var i = 0; i < result.rows.length; i++){

                    if(result.rows[i].cardid == id){


                        tr += '<tr>';
                        tr += '<td class="active">'+result.rows[i].studentname+'</td>';
                        tr += '<td class="success">'+result.rows[i].sex+'</td>';
                        tr += '<td class="warning">'+result.rows[i].admin+'</td>';
                        tr += '<td class="danger">'+result.rows[i].cardid+'</td>';

                        tr += '<td class="active">'+result.rows[i].subject+'</td>';
                        tr += '<td class="success">'+result.rows[i].comment+'</td>';
                        tr += '</tr>';

                        break;
                    }

                }
                //console.log(tr);
                $("#list").html(tr);

            })
            .catch(error => console.error(error));

    });









    //证书列表
    function getTaskList(){
        eos.getTableRows({
            scope:  'pdjeducard',
            code:   'pdjeducard',
            table:  'educards',
            json:   true,
            lower_bound: 0,
            upper_bound: -1,
            limit:  20
        })
            .then(function(result){
                console.log(result.rows);
                var tr;
                var tkStatus = "";
                for(var i = 0; i < result.rows.length; i++){

                    if(result.rows[i].status == 0)
                        tkStatus = "未领取";
                    else if(result.rows[i].status == 1)
                        tkStatus = "已领取";
                    else if(result.rows[i].status == 2)
                        tkStatus = "已提交";
                    else
                        tkStatus = "已结束";

                    tr += '<tr>';
                    tr += '<td class="active">'+result.rows[i].studentname+'</td>';
                    tr += '<td class="success">'+result.rows[i].sex+'</td>';
                    tr += '<td class="warning">'+result.rows[i].admin+'</td>';
                    tr += '<td class="danger">'+result.rows[i].cardid+'</td>';

                    tr += '<td class="active">'+result.rows[i].subject+'</td>';
                    tr += '<td class="success">'+result.rows[i].comment+'</td>';
                    tr += '</tr>';

                }
                //console.log(tr);
                $("#list").html(tr);

            })
            .catch(error => console.error(error));
    }

});