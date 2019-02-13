var gps = JSON.parse(localStorage.getItem('gps'));
var info = JSON.parse(localStorage.getItem('source'));
$(function () {
    if (gps.lat !== 0 && gps.lng !== 0) {
        $("#gps-image").attr('src',
            'https://apis.map.qq.com/ws/staticmap/v2/?center=' + gps.lat + ',' + gps.lng +
            '&zoom=16&size=900*600&maptype=roadmap&markers=size:small|color:red|' + gps.lat + ',' +
            gps.lng + '&key=SNRBZ-MKK36-OUDS4-ETJVX-RCROV-E4FRG'
        )
    }
    formatData();
});

function formatData() {
    $.each(info, function (index, item) {
        var labelName, labelContent, labelItem = '';
        if (index == 0) {
            labelName = '<div href="#tab' + index + '" class="weui-navbar__item weui-bar__item_on">' +
                item.label +
                '</div>';
        } else {
            labelName = '<div href="#tab' + index + '" class="weui-navbar__item">' + item.label +
                '</div>';
        }
        $.each(item.data, function (infoIndex, infoItem) {
            labelItem +=
                '<div class="weui-cell"><div class="weui-cell__bd"><p>' + infoItem.key +
                '</p></div><div class="weui-cell__ft">' + infoItem.value + '</div></div>';
        });
        labelContent =
            '<div id="tab' + index +
            '" class="weui-tab__content" style="display: block"><div class="weui-cells">' +
            labelItem + '</div></div>';
        $("#label-item").append(labelName);
        $("#label-content").append(labelContent);
    });
    $('.weui-navbar__item').on('click', function () {
        $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass(
            'weui-bar__item_on');
        $(jQuery(this).attr("href")).show().siblings('.weui-tab__content').hide();
    });
}