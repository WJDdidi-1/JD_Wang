let map;
let markers = [];

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyBKacaN5c1jU_JJacBR4pnMg_Y89M9poJQ",
    authDomain: "jd-web-d27ca.firebaseapp.com",
    databaseURL: "https://jd-web-d27ca-default-rtdb.firebaseio.com",
    projectId: "jd-web-d27ca",
    storageBucket: "jd-web-d27ca.appspot.com",
    messagingSenderId: "424324284177",
    appId: "1:424324284177:web:fc1eceadb60f60abbd96b0",
    measurementId: "G-FRJZY2KQKS"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 获取访客地理位置信息
async function getVisitorInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        document.getElementById('visitor-location').textContent = `${data.city}, ${data.country_name}`;
        document.getElementById('visitor-coordinates').textContent = `${data.latitude}, ${data.longitude}`;
        saveVisitor(data);
        initMap();
    } catch (error) {
        console.error('Error fetching visitor info:', error);
        document.getElementById('visitor-location').textContent = 'Unable to fetch location';
        document.getElementById('visitor-coordinates').textContent = 'N/A';
        initMap();
    }
}

// 保存访客信息到 Firebase
function saveVisitor(data) {
    const visitorRef = database.ref('visitors').push();
    visitorRef.set({
        ip: data.ip,
        city: data.city,
        country: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

// 初始化地图
function initMap() {
    map = L.map('visitor-map').setView([0, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    loadVisitors();
}

// 从 Firebase 加载所有访客并在地图上标注
function loadVisitors() {
    database.ref('visitors').on('value', (snapshot) => {
        const visitors = snapshot.val();
        updateTotalVisits(Object.keys(visitors).length);
        
        // 清除现有标记
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        // 添加新标记
        for (let id in visitors) {
            const visitor = visitors[id];
            const marker = L.marker([visitor.latitude, visitor.longitude]).addTo(map);
            marker.bindPopup(`Visitor from ${visitor.city}, ${visitor.country}`);
            markers.push(marker);
        }
    });
}

// 更新总访问次数
function updateTotalVisits(count) {
    document.getElementById('total-visits').textContent = count;
}

// 处理联系表单提交
function handleContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert('Thank you for your message. It has been sent successfully!');
                form.reset();
            } else {
                alert('Oops! There was a problem sending your message. Please try again later.');
            }
        }).catch(error => {
            alert('Oops! There was a problem sending your message. Please try again later.');
            console.error('Error:', error);
        });
    });
}

// 页面加载完成后执行
window.addEventListener('load', function() {
    getVisitorInfo();
    handleContactForm();
});
