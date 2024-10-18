// 获取访客IP地址和地理位置
async function getVisitorInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        document.getElementById('visitor-ip').textContent = data.ip;
        addVisitorMarker(data.latitude, data.longitude, data.ip);
        saveVisitor(data);
    } catch (error) {
        console.error('Error fetching visitor info:', error);
        document.getElementById('visitor-ip').textContent = 'Unable to fetch IP';
    }
}

// 在地图上添加访客标记
function addVisitorMarker(lat, lon, ip) {
    if (map) {
        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`Visitor IP: ${ip}`);
        markers.push(marker);
    } else {
        console.error('Map not initialized');
    }
}

// 保存访客信息
function saveVisitor(data) {
    let visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    visitors.push({
        ip: data.ip,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('visitors', JSON.stringify(visitors));
    updateVisitCount(visitors.length);
}

// 更新访问计数
function updateVisitCount(count) {
    document.getElementById('visit-count').textContent = count;
}

// 加载所有访客标记
function loadAllVisitors() {
    let visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    visitors.forEach(visitor => {
        addVisitorMarker(visitor.latitude, visitor.longitude, visitor.ip);
    });
    updateVisitCount(visitors.length);
}

// 处理联系表单提交
function handleContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        alert(`Thank you for your message, ${name}!\nWe have received: ${message}`);
        form.reset();
    });
}

// 页面加载完成后执行
window.addEventListener('load', function() {
    initMap();
    getVisitorInfo();
    loadAllVisitors();
    handleContactForm();
});

let map;
let markers = [];

// 初始化地图
function initMap() {
    map = L.map('visitor-map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}
