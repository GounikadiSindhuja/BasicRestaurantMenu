let menuData = {};

// Function to handle image loading errors with multiple fallbacks
function handleImageError(img, fallback1, fallback2, fallback3) {
  if (!img.dataset.fallbackAttempted) {
    img.dataset.fallbackAttempted = '1';
    img.src = fallback1;
  } else if (img.dataset.fallbackAttempted === '1') {
    img.dataset.fallbackAttempted = '2';
    img.src = fallback2;
  } else if (img.dataset.fallbackAttempted === '2') {
    img.dataset.fallbackAttempted = '3';
    img.src = fallback3;
  } else {
    // All fallbacks failed, show the emoji fallback
    img.style.display = 'none';
    const fallback = img.nextElementSibling;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  }
}

fetch('menu.json')
  .then(response => response.json())
  .then(data => {
    menuData = data;
    // Load all menu sections
    loadMenuSection('appetizers', data['appetizers']);
    loadMenuSection('main-course', data['main-course']);
    loadMenuSection('beverages', data['beverages']);
    loadMenuSection('desserts', data['desserts']);
    
    // Set up navigation
    setupNavigation();
  })
  .catch(err => console.error('Error loading menu:', err));

function loadMenuSection(sectionId, items) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  section.innerHTML = '';
  
  items.forEach(item => {
    if(item.IsAvailable) {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';
      // Create fallback images array for better reliability
      const fallbackImages = [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3'
      ];
      
      menuItem.innerHTML = `
        <div class="item-image-container">
          <img src="${item.Image}" alt="${item.ItemName}" class="item-image" loading="lazy" 
               onerror="handleImageError(this, '${fallbackImages[0]}', '${fallbackImages[1]}', '${fallbackImages[2]}');">
          <div class="image-fallback" style="display: none; width: 100%; height: 100%; background: linear-gradient(135deg, #ff6b35, #ff8c42); align-items: center; justify-content: center; font-size: 3rem; color: white;">🍽️</div>
          <div class="image-overlay"></div>
        </div>
        <div class="item-content">
          <div class="item-header">
            <h3 class="item-name">${item.ItemName}</h3>
            <span class="item-price">$${item.Price}</span>
          </div>
          <p class="item-description">${item.Description}</p>
        </div>
      `;
      section.appendChild(menuItem);
    }
  });
}

function setupNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const menuSections = document.querySelectorAll('.menu-section');
  
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      navBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-category');
      showMenuCategory(category, menuSections);
    });
  });
}

function showMenuCategory(category, sections) {
  sections.forEach(section => {
    if (category === 'all') {
      section.classList.remove('hidden');
    } else {
      const sectionId = section.id.replace('-section', '');
      if (sectionId === category) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    }
  });
}
