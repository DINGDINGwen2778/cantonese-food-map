// 等待页面完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化地图...');
    
    // 初始化地图 - 以农讲所为中心
    var map = L.map('map').setView(nongjiangsuoLocation, 15);
    
    // 添加高德地图底图（更适合中国地区）
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
        subdomains: ['1', '2', '3', '4'],
        attribution: '&copy; 高德地图 | 农讲所粤韵美食推荐',
        maxZoom: 18
    }).addTo(map);
    
    // 为不同分类设置颜色
    var categoryColors = {
        "烧腊": "#d32f2f",
        "凉茶": "#2e7d32", 
        "糖水": "#f57c00"
    };
    
    // 创建自定义图标函数
    function createIcon(iconName, color) {
        return L.divIcon({
            html: `<div style="
                background-color: ${color}; 
                width: 42px; 
                height: 42px; 
                border-radius: 50%; 
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
            "><i class="fas ${iconName}"></i></div>`,
            iconSize: [42, 42],
            iconAnchor: [21, 42],
            popupAnchor: [0, -42],
            className: 'food-marker'
        });
    }
    
    // 添加农讲所中心标记
    var nongIcon = createIcon('fa-subway', '#5d4037');
    L.marker(nongjiangsuoLocation, { icon: nongIcon })
        .addTo(map)
        .bindPopup(`
            <div class="popup-header">
                <h3><i class="fas fa-subway"></i> 农讲所地铁站</h3>
            </div>
            <div class="popup-body">
                <div class="description">
                    <strong>广州农民运动讲习所旧址</strong><br>
                    这里是广州美食文化的汇聚点，周边隐藏着许多地道粤语美食店铺。
                </div>
                <div style="text-align:center; margin:10px 0;">
                    <i class="fas fa-utensils" style="color:#d32f2f; margin-right:5px;"></i>
                    <span style="color:#d32f2f; font-weight:bold;">点击周边标记聆听粤语点单</span>
                </div>
            </div>
        `);
    
    // 将美食数据添加到地图
    L.geoJSON(voiceData, {
        pointToLayer: function (feature, latlng) {
            var color = categoryColors[feature.properties.category] || "#3498db";
            
            return L.marker(latlng, { 
                icon: createIcon(feature.properties.icon, color)
            });
        },
        onEachFeature: function (feature, layer) {
            var color = categoryColors[feature.properties.category] || "#3498db";
            
            var popupContent = `
                <div class="popup-header">
                    <h3><i class="fas ${feature.properties.icon}"></i> ${feature.properties.name}</h3>
                </div>
                <div class="popup-body">
                    <div class="description">
                        ${feature.properties.description}
                    </div>
                    
                    <div class="category-tag" style="background: ${color}">
                        <i class="fas fa-tag"></i> ${feature.properties.category}
                    </div>
                    
                    <audio class="audio-player" controls preload="metadata">
                        <source src="${feature.properties.audioUrl}" type="audio/mpeg">
                        您的浏览器不支持音频播放
                    </audio>
                    
                    <div class="popup-footer">
                        <i class="fas fa-info-circle"></i> 点击地图其他地方关闭窗口
                    </div>
                </div>
            `;
            
            layer.bindPopup(popupContent, {
                maxWidth: 350,
                minWidth: 280,
                closeOnClick: true,
                autoClose: true
            });
            
            // 点击事件
            layer.on('click', function(e) {
                console.log('正在播放：' + feature.properties.name);
                
                // 延迟播放音频，等待弹窗完全打开
                setTimeout(function() {
                    var popup = layer.getPopup();
                    if (popup && popup.isOpen()) {
                        var audio = popup.getElement().querySelector('.audio-player');
                        if (audio) {
                            audio.play().catch(function(e) {
                                console.log('自动播放被阻止，请手动点击播放按钮');
                                // 显示提示
                                var errorMsg = document.createElement('div');
                                errorMsg.className = 'popup-footer';
                                errorMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 请手动点击播放按钮';
                                popup.getElement().querySelector('.popup-body').appendChild(errorMsg);
                            });
                        }
                    }
                }, 500);
            });
            
            // 鼠标悬停效果
            layer.on('mouseover', function() {
                layer.setZIndexOffset(1000);
            });
            
            layer.on('mouseout', function() {
                layer.setZIndexOffset(0);
            });
        }
    }).addTo(map);
    
    // 添加比例尺
    L.control.scale({
        position: 'bottomleft',
        imperial: false,
        metric: true
    }).addTo(map);
    
    // 添加自定义图例
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML = '<h4><i class="fas fa-filter"></i> 美食分类</h4>';
        
        // 添加图例项
        for (var category in categoryColors) {
            div.innerHTML += `
                <div class="legend-item">
                    <div class="legend-color" style="background:${categoryColors[category]};"></div>
                    <span class="legend-label">${category}</span>
                </div>
            `;
        }
        
        // 添加农讲所图例
        div.innerHTML += `
            <hr style="margin:10px 0; border:none; border-top:1px dashed #ddd;">
            <div class="legend-item">
                <div class="legend-color" style="background:#5d4037;"></div>
                <span class="legend-label">农讲所地铁站</span>
            </div>
        `;
        
        return div;
    };
    legend.addTo(map);
    
    // 地图加载完成后的提示
    map.whenReady(function() {
        console.log('地图初始化完成！');
        console.log('加载了 ' + voiceData.features.length + ' 个美食点');
        
        // 显示欢迎消息
        setTimeout(function() {
            L.popup()
                .setLatLng([nongjiangsuoLocation[0] + 0.002, nongjiangsuoLocation[1]])
                .setContent(`
                    <div style="text-align:center; padding:10px;">
                        <h3 style="color:#d32f2f; margin-bottom:10px;">
                            <i class="fas fa-utensils"></i> 欢迎使用农讲所粤韵美食地图
                        </h3>
                        <p>点击地图上的美食标记，聆听地道粤语点单！</p>
                        <p style="font-size:0.9em; color:#666; margin-top:8px;">
                            共收录 ${voiceData.features.length} 家特色店铺
                        </p>
                    </div>
                `)
                .openOn(map);
                
            // 3秒后自动关闭欢迎消息
            setTimeout(function() {
                map.closePopup();
            }, 3000);
        }, 1000);
    });
    
    // 添加点击地图任意位置关闭所有弹窗的功能
    map.on('click', function(e) {
        map.closePopup();
    });
});