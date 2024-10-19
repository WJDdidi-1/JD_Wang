let map;

// 获取访客地理位置信息
async function getVisitorInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        document.getElementById('visitor-location').textContent = `${data.city}, ${data.country_name}`;
        document.getElementById('visitor-coordinates').textContent = `${data.latitude}, ${data.longitude}`;
        updateTotalVisits();
        initMap(data.latitude, data.longitude);
    } catch (error) {
        console.error('Error fetching visitor info:', error);
        document.getElementById('visitor-location').textContent = 'Unable to fetch location';
        document.getElementById('visitor-coordinates').textContent = 'N/A';
        initMap(0, 0); // 默认显示整个世界地图
    }
}

// 更新总访问次数
function updateTotalVisits() {
    let visits = localStorage.getItem('totalVisits');
    visits = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem('totalVisits', visits);
    document.getElementById('total-visits').textContent = visits;
}

// 初始化地图
function initMap(lat, lon) {
    map = L.map('visitor-map').setView([lat, lon], 3);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    L.marker([lat, lon]).addTo(map)
        .bindPopup('You are here')
        .openPopup();
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
    getVisitorInfo();
    handleContactForm();
});
