// بيانات النظام
const systemData = {
    currentAdmin: null,
    admins: [],
    tempData: null
};

// عند تحميل الصفحة
window.onload = function() {
    // التحقق من تسجيل الدخول
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if(!loggedIn && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
    
    // إذا كانت صفحة لوحة التحكم
    if(window.location.pathname.includes('admin-panel')) {
        loadAdmins();
        setupEventListeners();
    }
};

// تسجيل الدخول
function loginAdmin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    // هنا يجب التحقق من قاعدة البيانات
    // نستخدم بيانات افتراضية للتوضيح
    if(username === "admin" && password === "admin123") {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'admin-panel.html';
    } else {
        alert('بيانات الدخول غير صحيحة!');
    }
}

// تحميل بيانات الإداريين
function loadAdmins() {
    // جلب البيانات من localStorage أو استخدام بيانات افتراضية
    const savedAdmins = localStorage.getItem('adminsData');
    systemData.admins = savedAdmins ? JSON.parse(savedAdmins) : [];
    
    renderAdmins();
}

// عرض الإداريين
function renderAdmins() {
    const container = document.getElementById('adminsContainer');
    container.innerHTML = '';

    systemData.admins.forEach((admin, index) => {
        const adminCard = document.createElement('div');
        adminCard.className = 'admin-card';
        adminCard.innerHTML = `
            <div class="admin-image">
                <img src="${admin.image || 'default-avatar.png'}" alt="${admin.name}">
            </div>
            <h3>${admin.name}</h3>
            <p class="admin-rank">${admin.rank}</p>
            <div class="admin-actions">
                <button class="promote-btn" onclick="showPromoteModal(${index})">ترقية</button>
                <button class="delete-btn" onclick="showDeleteConfirm(${index})">فصل</button>
            </div>
        `;
        container.appendChild(adminCard);
    });
}

// إضافة إداري جديد
function addNewAdmin() {
    const name = document.getElementById('newAdminName').value;
    const rank = document.getElementById('customRank').value;
    const imageFile = document.getElementById('adminImage').files[0];

    if(!name || !rank) {
        alert('الرجاء إدخال جميع البيانات المطلوبة');
        return;
    }

    let imageUrl = 'default-avatar.png';
    if(imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }

    const newAdmin = {
        name,
        rank,
        image: imageUrl
    };

    systemData.admins.push(newAdmin);
    saveAdmins();
    hideAddAdminForm();
    renderAdmins();
}

// عرض نافذة الترقية
function showPromoteModal(index) {
    systemData.tempData = index;
    document.getElementById('promoteModal').style.display = 'block';
}

// تنفيذ الترقية
function performPromotion() {
    const newRank = document.getElementById('newRank').value;
    if(!newRank) {
        alert('الرجاء إدخال الرتبة الجديدة');
        return;
    }

    const index = systemData.tempData;
    systemData.admins[index].rank = newRank;
    saveAdmins();
    renderAdmins();
    hidePromoteModal();
}

// إخفاء نافذة الترقية
function hidePromoteModal() {
    document.getElementById('promoteModal').style.display = 'none';
    document.getElementById('newRank').value = '';
    systemData.tempData = null;
}

// تأكيد الفصل
function showDeleteConfirm(index) {
    systemData.tempData = index;
    document.getElementById('confirmMessage').textContent = `هل أنت متأكد من فصل ${systemData.admins[index].name}؟`;
    document.getElementById('confirmModal').style.display = 'block';
}

// تنفيذ الفصل
function confirmAction() {
    if(systemData.tempData !== null) {
        systemData.admins.splice(systemData.tempData, 1);
        saveAdmins();
        renderAdmins();
    }
    hideConfirmModal();
}

// إلغاء الإجراء
function cancelAction() {
    hideConfirmModal();
}

// حفظ البيانات
function saveAdmins() {
    localStorage.setItem('adminsData', JSON.stringify(systemData.admins));
}

// إظهار نموذج الإضافة
function showAddAdminForm() {
    document.getElementById('addAdminForm').style.display = 'block';
}

// إخفاء نموذج الإضافة
function hideAddAdminForm() {
    document.getElementById('addAdminForm').style.display = 'none';
    // مسح الحقول
    document.getElementById('newAdminName').value = '';
    document.getElementById('customRank').value = '';
    document.getElementById('adminImage').value = '';
}

// إخفاء نافذة التأكيد
function hideConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    systemData.tempData = null;
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // إغلاق النماذج عند النقر خارجها
    window.onclick = function(event) {
        const addForm = document.getElementById('addAdminForm');
        if(event.target == addForm) {
            hideAddAdminForm();
        }
        
        const confirmModal = document.getElementById('confirmModal');
        if(event.target == confirmModal) {
            hideConfirmModal();
        }
        
        const promoteModal = document.getElementById('promoteModal');
        if(event.target == promoteModal) {
            hidePromoteModal();
        }
    }
}
