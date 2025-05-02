// بيانات النظام
const systemData = {
    currentAdmin: null,
    admins: [],
    tempData: null,
    
    // تسلسل الرتب الهرمي الثابت
    rankHierarchy: [
        "Admin",
        "Supervisor",
        "Admin Manager", 
        "General Manager",
        "Co Founder",
        "Founder",
        "Co Owner",
        "Owner"
    ]
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
        populateRankDropdown();
    }
};

// تعبئة قائمة الرتب
function populateRankDropdown() {
    const rankSelect = document.getElementById('adminRank');
    if(rankSelect) {
        rankSelect.innerHTML = '';
        systemData.rankHierarchy.forEach(rank => {
            const option = document.createElement('option');
            option.value = rank;
            option.textContent = rank;
            rankSelect.appendChild(option);
        });
    }
}

// تسجيل الدخول
function loginAdmin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if(username === "admin" && password === "admin123") {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'admin-panel.html';
    } else {
        alert('بيانات الدخول غير صحيحة!');
    }
}

// تحميل بيانات الإداريين
function loadAdmins() {
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
                <button class="promote-btn" onclick="promoteAdmin(${index})">ترقية</button>
                <button class="demote-btn" onclick="demoteAdmin(${index})">تنزيل</button>
                <button class="delete-btn" onclick="showDeleteConfirm(${index})">فصل</button>
            </div>
        `;
        container.appendChild(adminCard);
    });
}

// إضافة إداري جديد
function addNewAdmin() {
    const name = document.getElementById('newAdminName').value.trim();
    const rank = document.getElementById('adminRank').value;
    const imageFile = document.getElementById('adminImage').files[0];

    if(!name) {
        alert('الرجاء إدخال اسم الإداري');
        return;
    }

    let imageUrl = 'default-avatar.png';
    if(imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }

    const newAdmin = {
        name,
        rank,
        image: imageUrl,
        joinDate: new Date().toLocaleDateString()
    };

    systemData.admins.push(newAdmin);
    saveAdmins();
    hideAddAdminForm();
    renderAdmins();
    alert(`تم تسجيل الإداري ${name} برتبة ${rank} بنجاح`);
}

// ترقية إداري
function promoteAdmin(index) {
    const currentRank = systemData.admins[index].rank;
    const currentIndex = systemData.rankHierarchy.indexOf(currentRank);
    
    if (currentIndex === -1) {
        alert(`خطأ: الرتبة "${currentRank}" غير موجودة في النظام`);
        return;
    }
    
    if (currentIndex === systemData.rankHierarchy.length - 1) {
        alert("لا يمكن ترقية هذا الإداري لأنه في أعلى رتبة");
        return;
    }
    
    const newRank = systemData.rankHierarchy[currentIndex + 1];
    systemData.admins[index].rank = newRank;
    saveAdmins();
    renderAdmins();
    alert(`تم ترقية ${systemData.admins[index].name} إلى ${newRank}`);
}

// تنزيل رتبة إداري
function demoteAdmin(index) {
    const currentRank = systemData.admins[index].rank;
    const currentIndex = systemData.rankHierarchy.indexOf(currentRank);
    
    if (currentIndex === -1) {
        alert(`خطأ: الرتبة "${currentRank}" غير موجودة في النظام`);
        return;
    }
    
    if (currentIndex === 0) {
        alert("لا يمكن تنزيل هذا الإداري لأنه في أدنى رتبة");
        return;
    }
    
    const newRank = systemData.rankHierarchy[currentIndex - 1];
    systemData.admins[index].rank = newRank;
    saveAdmins();
    renderAdmins();
    alert(`تم تنزيل رتبة ${systemData.admins[index].name} إلى ${newRank}`);
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

// عرض نموذج الإضافة
function showAddAdminForm() {
    document.getElementById('addAdminForm').style.display = 'block';
}

// إخفاء نموذج الإضافة
function hideAddAdminForm() {
    document.getElementById('addAdminForm').style.display = 'none';
    document.getElementById('newAdminName').value = '';
    document.getElementById('adminImage').value = '';
}

// إخفاء نافذة التأكيد
function hideConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    systemData.tempData = null;
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    window.onclick = function(event) {
        const addForm = document.getElementById('addAdminForm');
        if(event.target == addForm) hideAddAdminForm();
        
        const confirmModal = document.getElementById('confirmModal');
        if(event.target == confirmModal) hideConfirmModal();
    }
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}
