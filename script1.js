let currentFilter = 'all';
let currentTypeFilter = 'all';
let searchTimeout;


document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeSearch();
    loadTankData();
    initializeTooltips();
    initializeResetButton();
});

function initializeResetButton() {
    const resetButton = document.getElementById('resetFilters');
    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

function resetFilters() {
    currentFilter = 'all';
    currentTypeFilter = 'all';
    
    document.querySelectorAll('.filter-buttons button').forEach(button => {
        button.classList.remove('active');
    });
    
    const allButton = document.querySelector('[data-filter-type="country"][data-filter="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    applyFilters();
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter-type');
            const filterValue = this.getAttribute('data-filter');
            
            if (filterType === 'country') {
                currentFilter = filterValue || 'all';
                document.querySelectorAll('[data-filter-type="country"]').forEach(btn => btn.classList.remove('active'));
            } else if (filterType === 'type') {
                currentTypeFilter = filterValue || 'all';
                document.querySelectorAll('[data-filter-type="type"]').forEach(btn => btn.classList.remove('active'));
            }
            
            this.classList.add('active');
            applyFilters();
        });
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchTanks(this.value);
        }, 300);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchTanks(this.value);
        }
    });
}

function filterTanks(country) {
    const tankItems = document.querySelectorAll('.tank-item');
    const countryLists = document.querySelectorAll('.country-list');

    if (country === 'all') {
        tankItems.forEach(item => item.style.display = '');
        countryLists.forEach(list => list.style.display = '');
    } else {
        tankItems.forEach(item => {
            if (item.classList.contains(country)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });

        countryLists.forEach(list => {
            if (list.classList.contains(country)) {
                list.style.display = '';
            } else {
                list.style.display = 'none';
            }
        });
    }

    updateVisibleCount();
}

function searchTanks(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    const tankItems = document.querySelectorAll('.searchable');
    let hasResults = false;

    tankItems.forEach(item => {
        const tankName = item.querySelector('h3')?.textContent.toLowerCase() || 
                         item.textContent.toLowerCase();
        const tankDesc = item.querySelector('p')?.textContent.toLowerCase() || '';

        const matchesSearch = (tankName + ' ' + tankDesc).includes(searchTerm);
        const matchesFilter = (currentFilter === 'all' || item.classList.contains(currentFilter)) &&
                              (currentTypeFilter === 'all' || item.classList.contains(currentTypeFilter));

        if (matchesSearch && matchesFilter) {
            item.style.display = '';
            hasResults = true;
        } else {
            item.style.display = 'none';
        }
    });

    updateNoResultsMessage(hasResults);
    updateVisibleCount();
}

function applyFilters() {
    const tankItems = document.querySelectorAll('.tank-item, .tanks-list-item');
    const countryLists = document.querySelectorAll('.country-list');

    tankItems.forEach(item => {
        const countryMatch = currentFilter === 'all' || item.classList.contains(currentFilter);
        const typeMatch = currentTypeFilter === 'all' || item.classList.contains(currentTypeFilter);
        
        if (countryMatch && typeMatch) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });

    countryLists.forEach(list => {
        if (currentFilter === 'all' || list.classList.contains(currentFilter)) {
            list.style.display = '';
        } else {
            list.style.display = 'none';
        }
    });

    updateVisibleCount();
    updateNoResultsMessage(document.querySelectorAll('.tank-item:not([style*="display: none"])').length > 0);
}

function updateNoResultsMessage(hasResults) {
    let messageElement = document.getElementById('noResultsMessage');
    
    if (!hasResults) {
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'noResultsMessage';
            messageElement.className = 'no-results-message';
            messageElement.textContent = 'По вашему запросу ничего не найдено';
            document.querySelector('main').appendChild(messageElement);
        }
        messageElement.style.display = 'block';
    } else if (messageElement) {
        messageElement.style.display = 'none';
    }
}

function updateVisibleCount() {
    const visibleTanks = document.querySelectorAll('.tank-item:not([style*="display: none"])').length;
    const countElement = document.getElementById('visibleCount');
    
    if (!countElement) {
        const count = document.createElement('div');
        count.id = 'visibleCount';
        count.className = 'visible-count';
        count.textContent = `Показано танков: ${visibleTanks}`;
        document.querySelector('.filter-buttons').after(count);
    } else {
        countElement.textContent = `Показано танков: ${visibleTanks}`;
    }
}

function loadTankData() {
    console.log('Loading tank data...');
}

//function handleImageError(img) {
//    img.src = 'images/placeholder.jpg';
//    img.alt = 'Изображение недоступно';
//}

document.querySelectorAll('.tank-item img').forEach(img => {
    img.addEventListener('error', () => handleImageError(img));
});

function scrollToElement(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

document.querySelectorAll('.tank-item').forEach(item => {
    item.addEventListener('click', function(e) {
        if (!e.target.closest('a')) {
            const tankId = this.dataset.tankId;
            window.location.href = `tanks/${tankId}.html`;
        }
    });
});

function initializeTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        const img = tooltip.querySelector('img');
        if (img) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }

        tooltip.addEventListener('mousemove', function(e) {
            const tooltipContent = this.querySelector('.tooltip-content');
            if (!tooltipContent) return;

            const rect = tooltipContent.getBoundingClientRect();
            const offset = 20;

            if (rect.right > window.innerWidth) {
                tooltipContent.style.left = 'auto';
                tooltipContent.style.right = '0';
                tooltipContent.style.transform = 'translateX(0)';
            } else if (rect.left < 0) {
                tooltipContent.style.left = '0';
                tooltipContent.style.right = 'auto';
                tooltipContent.style.transform = 'translateX(0)';
            }

            if (rect.top < 0) {
                tooltipContent.style.bottom = 'auto';
                tooltipContent.style.top = '100%';
                tooltipContent.querySelector('::after').style.top = 'auto';
                tooltipContent.querySelector('::after').style.bottom = '100%';
                tooltipContent.querySelector('::after').style.borderColor = 'transparent transparent var(--dark-gray) transparent';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
});