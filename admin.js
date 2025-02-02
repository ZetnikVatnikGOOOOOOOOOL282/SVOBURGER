document.addEventListener('DOMContentLoaded', () => {
    // =====================
    // Инициализация Firebase
    // =====================
    const firebaseConfig = {
        apiKey: "AIzaSyD76m80D_TEYZ3cQO6qRr7QUv_KlhqCgXo",
        authDomain: "tanks-24afb.firebaseapp.com",
        projectId: "tanks-24afb",
        storageBucket: "tanks-24afb.appspot.com",
        messagingSenderId: "670820738006",
        appId: "670820738006"
    };

    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    } catch (error) {
        console.error('Ошибка инициализации Firebase:', error);
        return;
    }

    const db = firebase.firestore();
    const auth = firebase.auth();

    // ======================
    // Константы и DOM-элементы
    // ======================
    const elements = {
        loginBtn: document.getElementById('loginBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        tankForm: document.getElementById('tankForm'),
        adminPanel: document.getElementById('adminPanel'),
        tanksContainer: document.getElementById('tanksContainer'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        authBox: document.getElementById('authBox')
    };

    // ======================
    // Валидация DOM-элементов
    // ======================
    const requiredElements = [
        'loginBtn', 
        'tankForm', 
        'adminPanel', 
        'tanksContainer',
        'authBox'
    ];

    let missingElements = [];
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            missingElements.push(id);
        }
    });

    if (missingElements.length > 0) {
        console.error('Отсутствуют элементы:', missingElements.join(', '));
        alert('Ошибка конфигурации: отсутствуют необходимые элементы');
        return;
    }

    // =================
    // Функция загрузки
    // =================
    const loadTanks = async () => {
        try {
            const snapshot = await db.collection("tanks")
                .orderBy("createdAt", "desc")
                .get();

            if (snapshot.empty) {
                elements.tanksContainer.innerHTML = '<p>Танков не найдено</p>';
                return;
            }

            renderTanks(snapshot);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Ошибка загрузки данных: ' + error.message);
        }
    };

    // =====================
    // Функция рендеринга
    // =====================
// Обновленная функция renderTanks
const renderTanks = (snapshot) => {
    const grouped = groupByCountry(snapshot);
    elements.tanksContainer.innerHTML = '';

    Object.entries(grouped).forEach(([countryCode, tanks]) => {
        if (!tanks.length) return;

        const section = document.createElement('section');
        section.className = 'tanks-list';
        section.innerHTML = `
            <h2 style="color: #1e3c72; border-bottom: 2px solid; padding-bottom: 0.5rem; margin: 2rem 0;">
                ${countries[countryCode]}
            </h2>
            <div class="country-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
                ${tanks.map(tank => createTankCard(tank)).join('')}
            </div>
        `;
        elements.tanksContainer.appendChild(section);
    });
};

    // ========================
    // Вспомогательные функции
    // ========================
    const countries = {
        ussr: 'СССР',
        germany: 'Германия',
        usa: 'США',
        britain: 'Великобритания'
    };

    const groupByCountry = (snapshot) => {
        return Object.keys(countries).reduce((acc, countryCode) => {
            acc[countryCode] = snapshot.docs
                .filter(doc => doc.data().country === countryCode)
                .map(doc => ({ id: doc.id, ...doc.data() }));
            return acc;
        }, {});
    };

    const createTankCard = (tank) => `
    <div class="tanks-list-item">
        <img src="${tank.image}" alt="${tank.title}" class="tank-thumbnail">
        <h3>${tank.title}</h3>
        <div class="tooltip-content">
            <table>
                ${Object.entries(tank.specs)
                    .filter(([key]) => 
                        key.includes('Броня') || 
                        key.includes('Скорость') || 
                        key.includes('Масса') || 
                        key.includes('Годы') || 
                        key.includes('Вооружение') || 
                        key.includes('Экипаж') || 
                        key.includes('Двигатель')
                    )
                    .map(([key, value]) => `
                        <tr>
                            <th>${key}</th>
                            <td>${value}</td>
                        </tr>`)
                    .join('')}
            </table>
        </div>
    </div>
`;

    // Добавьте обработчик для кнопки сворачивания
    document.getElementById('toggleAdminPanel').addEventListener('click', () => {
        const panel = document.getElementById('adminPanel');
        panel.classList.toggle('collapsed');
        
        // Анимация иконки
        const button = document.getElementById('toggleAdminPanel');
        button.style.transform = panel.classList.contains('collapsed') 
            ? 'rotate(180deg)' 
            : 'rotate(0deg)';
    });

    // =====================
    // Обработчики событий
    // =====================
    elements.tankForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const specs = {
            "Годы производства": formData.get('years'),
            "Масса": formData.get('weight') + ' тонн',
            "Экипаж": formData.get('crew') + ' чел',
            "Вооружение": formData.get('armament'),
            "Броня": formData.get('armor') + ' мм',
            "Двигатель": formData.get('engine'),
            "Скорость": formData.get('speed') + ' км/ч'
        };

        try {
            await db.collection("tanks").add({
                title: formData.get('title'),
                country: formData.get('country'),
                type: formData.get('type'),
                description: formData.get('description'),
                image: formData.get('image'),
                link: formData.get('link'),
                specs: specs,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            loadTanks();
            e.target.reset();
        } catch (error) {
            alert('Ошибка сохранения: ' + error.message);
        }
    });

    elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            
            const country = btn.dataset.country;
            document.querySelectorAll('.tanks-list').forEach(section => {
                section.style.display = 
                    country === 'all' || 
                    section.querySelector('.country-list').classList.contains(country) 
                    ? 'block' 
                    : 'none';
            });
        });
    });

    elements.loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            alert('Ошибка входа: ' + error.message);
        }
    });

    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', () => {
            auth.signOut();
        });
    }

    // =====================
    // Отслеживание статуса
    // =====================
    auth.onAuthStateChanged(user => {
        elements.adminPanel.style.display = user ? 'block' : 'none';
        elements.authBox.style.display = 'flex'; // Всегда показываем authBox
        elements.logoutBtn.style.display = user ? 'inline-block' : 'none';
        if (user) loadTanks();
    });

    // =====================
    // Инициализация
    // =====================
    loadTanks();
});