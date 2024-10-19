// 获取访客地理位置信息
async function getVisitorInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        document.getElementById('visitor-location').textContent = `${data.city}, ${data.country_name}`;
        document.getElementById('visitor-latitude').textContent = data.latitude;
        document.getElementById('visitor-longitude').textContent = data.longitude;
        updateTotalVisits();
    } catch (error) {
        console.error('Error fetching visitor info:', error);
        document.getElementById('visitor-location').textContent = 'Unable to fetch location';
        document.getElementById('visitor-latitude').textContent = 'N/A';
        document.getElementById('visitor-longitude').textContent = 'N/A';
    }
}

// 更新总访问次数
function updateTotalVisits() {
    let visits = localStorage.getItem('totalVisits');
    if (visits === null) {
        visits = 0;
    } else {
        visits = parseInt(visits);
    }
    visits++;
    localStorage.setItem('totalVisits', visits);
    document.getElementById('total-visits').textContent = visits;
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
