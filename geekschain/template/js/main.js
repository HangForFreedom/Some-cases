/**
 * Created by hades on 2018/6/29.
 */
var loading = weui.loading('正在加载');
var onlyWechat = false; //是否开启只在微信中打开
var batchId = getParma('batch_id');
var qrId = (getParma('qr_id') === null) ? '0' : Number(getParma('qr_id'));
var verify = (getParma('verify') === null) ? '' : getParma('verify');
var scan = 0;
var batchData = {};
var sourceList = [];
var imgWidth, imgHeight;
var random = {};

window.onload = function () {
    if (sessionStorage.getItem('timestamp') == null) {
        random = {
            'string': randomString(10),
            'count': false,
            'num': 0
        };
        sessionStorage.setItem('timestamp', JSON.stringify(random));
    } else {
        random = JSON.parse(sessionStorage.getItem('timestamp'));
    }

    if (onlyWechat) {
        var ua = window.navigator.userAgent.toLowerCase();
        if ((ua.match(/MicroMessenger/i) === 'micromessenger')) {
            getImgHeight();
            getBatchList();
            getScan();
        } else {
            loading.hide();
            $(".page").remove();
            weui.alert('请在微信中打开');
        }
    } else {
        // getImgHeight();
        getBatchList();
        getScan();
    }

};

// function getImgHeight() {
//     imgWidth = document.body.clientWidth;
//     imgHeight = imgWidth * 0.3355;
//     $(".aetos-hd").height(imgHeight);
// }


$("#show-hash").click(function () {
    weui.alert('全球唯一编号为(uuid)：<br>' + batchData.uuid + '<br>qrid:' + qrId);
});
$("#show-uuid").click(function () {
    weui.alert('区块链ID为：<br>' + batchData.block_hash);
});

function getBatchList() {
    $.ajax({
        type: "get",
        url: "https://show.geekschain.cn/trace_api/api/customer/get_batch",
        data: {
            'batch_id': batchId
        },
        jsonpCallback: 'bactlist',
        dataType: "jsonp",
        success: function (data) {
            if (data.status === 200) {
                if (typeof data.data != 'undefined') {
                    $('.page').show();
                    batchData = data.data;
                    sourceList = data.data.source;
                    $("#uuid").html(data.data.block_hash);
                    $("#hash").html(data.data.uuid);
                    $("#qr-num").html(parseInt(qrId) + 1024);
                    showTimeline(sourceList);
                    var lightbox = GLightbox();
                }
                loading.hide();

            } else {
                loading.hide();
                $(".page").remove();
                weui.alert('二维码参数错误');
            }
        },
        error: function (e) {
            weui.alert('网络连接异常');
        }
    });
}

function getScan() {
    if (!random.count) {
        $.ajax({
            type: "get",
            url: "https://show.geekschain.cn/trace_api/api/customer/scan",
            data: {
                'batch_id': batchId,
                'qr_id': qrId,
                'verify': verify,
                'openid': ''
            },
            jsonpCallback: 'scan',
            dataType: "jsonp",
            success: function (data) {
                console.log(data);
                if (data.status === 200) {
                    scan = data.data.id;
                    random.count = true;
                    // if (scan == 1) {
                    //     var scanHtml = '这是该瓶百年雨生第<span class="scan-num">1</span>次被扫码，已验证为正品';
                    // } else {
                    //     var scanHtml = '这是该瓶百年雨生第<span class="scan-num">' + data.data.id + '</span>次被扫码';
                    // }
                    $("#scan-num").html(scanHtml);
                    random.num = scanHtml;
                    sessionStorage.setItem('timestamp', JSON.stringify(random));
                } else {
                    weui.alert('数据有误，请检查二维码是否正确');
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
    } else {
        $("#scan-num").html(random.num);
    }
}

function getParma(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}

function showTimeline(data) {
    for (let i = 0; i < data.length; i++) {
        let date = sourceList[i].add_time.split(" ")[0];
        let tags = sourceList[i].tags.join(',');
        let str;
        if (sourceList[i].media_type === 0) {
            str = '<li><div class="time-point"></div><div class="aetos-timeline__content"> <div class="aetos-timeline__tools"> <span>' + tags + '</span> <div class="weui-flex aetos-info__flex filehash">文件哈希值：<div class="file-hash">' + sourceList[i].hash + '</div> </div> <p>创建日期：<span>' + date + '</span></p> </div> <div class="aetos-timeline__source"> <a href="' + sourceList[i].media_url + '" class="glightbox" data-glightbox="title: Hash; description:' + sourceList[i].hash + '"> <img src="' + sourceList[i].media_url + '?imageView2/2/w/300' + '" alt="gm1"></a> <div class="aetos-timeline__location"> <img src="images/loacation.png" alt="location" class="aetos-timeline__gps"> <span style="color: #fff;">' + sourceList[i].address + '</span> </div> </div> </div> </li>';
        } else {
            str = '<li><div class="time-point"></div><div class="aetos-timeline__content"> <div class="aetos-timeline__tools"> <span>' + tags + '</span> <div class="weui-flex aetos-info__flex filehash">文件哈希值：<div class="file-hash">' + sourceList[i].hash + '</div> </div> <p>创建日期：<span>' + date + '</span></p> </div> <div class="aetos-timeline__source"> <a href="' + sourceList[i].media_url + '" class="glightbox" data-glightbox="title: Hash; description:' + sourceList[i].hash + '"><div class="video-play"></div><img src="http://pic.geekschain.cn/4-%E5%88%B6%E6%9B%B2.png" alt="gm1"> </a><div class="aetos-timeline__lo> <img src="images/loacation.png" alt="location" class="aetos-timeline__gps"> <span style="color: #fff;">' + sourceList[i].address + '</span> </div> </div> </div> </li>';
        }
        $("#source-list").append(str);
        $(".filehash").click(function () {
            weui.alert('文件哈希值为：<br>' + sourceList[i].hash);
        });
    }

}

function navMap(index) {
    console.log(index);
    var gps = {
        'lat': sourceList[index]['latitude'],
        'lng': sourceList[index]['longitude']
    }
    localStorage.setItem("gps", JSON.stringify(gps));
    localStorage.setItem("source", JSON.stringify(sourceList[index]['info']));
    window.location.href = "map.html";
}

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}
