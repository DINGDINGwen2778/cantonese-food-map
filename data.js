// 农讲所粤韵美食推荐数据
// 基于你的Excel表格：喜喜豉油鸡专卖店、古方凉茶铺中山四路店、明记糖水

var voiceData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": 1,
                "name": "喜喜豉油鸡专卖店",
                "description": "地道粤语点单：'一份油鸡饭，打包带走'，感受老广烧腊风味",
                "audioUrl": "audio/chiyouji.mp3",
                "category": "烧腊",
                "icon": "fa-drumstick-bite"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [113.280, 23.125]  // [经度, 纬度]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 2,
                "name": "古方凉茶铺中山四路店",
                "description": "老板亲自教学正宗凉茶招牌读法，体验传统粤语叫卖",
                "audioUrl": "audio/liangchapu.mp3",
                "category": "凉茶",
                "icon": "fa-mug-hot"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [113.275, 23.128]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 3,
                "name": "明记糖水",
                "description": "点单与招牌糖水介绍，感受粤式甜品的甜蜜滋味",
                "audioUrl": "audio/mingjitangshui.mp3",
                "category": "糖水",
                "icon": "fa-ice-cream"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [113.272, 23.130]
            }
        }
    ]
};

// 农讲所位置作为中心参考点
var nongjiangsuoLocation = [23.127, 113.278];  // [纬度, 经度]