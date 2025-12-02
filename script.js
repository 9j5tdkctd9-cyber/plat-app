// Stockage local
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
let mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
let currentCategory = '';

// Navigation
function showPage(pageId) {
    document.querySelectorAll('.page, .home-page').forEach(page => {
        page.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
    
    if (pageId === 'repasPrevusPage') {
        displayMealPlan();
    }
}

function showCategory(category) {
    currentCategory = category;
    const titles = {
        matin: '🌅 Recettes du Matin',
        repas: '🍽️ Recettes de Repas',
        brunch: '🥐 Recettes de Brunch',
        gourmandise: '🍰 Gourmandises'
    };
    
    document.getElementById('categoryTitle').textContent = titles[category];
    displayRecipes(category);
    showPage('categoryPage');
}

function backToCategory() {
    showCategory(currentCategory);
}

// Affichage des recettes
function displayRecipes(category) {
    const grid = document.getElementById('recipeGrid');
    const categoryRecipes = recipes.filter(r => r.category === category);
    
    grid.innerHTML = categoryRecipes.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetail(${recipe.id})">
            <img src="${recipe.image || 'https://via.placeholder.com/200x180/fab387/ffffff?text=Recette'}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
        </div>
    `).join('');
}

function showRecipeDetail(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    const detail = document.getElementById('recipeDetail');
    
    detail.innerHTML = `
        <img src="${recipe.image || 'https://via.placeholder.com/400/fab387/ffffff?text=' + recipe.name}" alt="${recipe.name}">
        <h2>${recipe.name}</h2>
        <h3>📝 Ingrédients</h3>
        <ul>
            ${recipe.ingredients.map(ing => `<li>• ${ing}</li>`).join('')}
        </ul>
        <h3>👩‍🍳 Préparation</h3>
        <p>${recipe.steps}</p>
        <button class="edit-btn" onclick="addToMealPlan(${recipe.id})">+ Ajouter aux Repas Prévus</button>
    `;
    
    showPage('recipeDetailPage');
}

// Gestion des recettes
function showAddRecipe() {
    document.getElementById('addRecipeModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('addRecipeModal').classList.add('hidden');
    document.getElementById('recipeForm').reset();
}

document.getElementById('recipeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newRecipe = {
        id: Date.now(),
        name: document.getElementById('recipeName').value,
        category: document.getElementById('recipeCategory').value,
        image: document.getElementById('recipeImage').value,
        ingredients: document.getElementById('recipeIngredients').value.split('\n').filter(i => i.trim()),
        steps: document.getElementById('recipeSteps').value
    };
    
    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    closeModal();
    alert('Recette ajoutée avec succès! 🎉');
});

// Planning des repas
function displayMealPlan() {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const meals = ['Petit-déj', 'Déjeuner', 'Dîner'];
    
    let table = '<table><thead><tr><th>Jour</th>';
    meals.forEach(meal => {
        table += `<th>${meal}</th>`;
    });
    table += '</tr></thead><tbody>';
    
    days.forEach(day => {
        table += `<tr><td><strong>${day}</strong></td>`;
        meals.forEach(meal => {
            const key = `${day}-${meal}`;
            const mealContent = mealPlan[key] || '';
            table += `<td onclick="selectMealSlot('${key}')">${mealContent ? `<div class="meal-item">${mealContent}</div>` : '+'}</td>`;
        });
        table += '</tr>';
    });
    
    table += '</tbody></table>';
    document.getElementById('mealPlanner').innerHTML = table;
}

let currentMealSlot = '';

function selectMealSlot(slot) {
    currentMealSlot = slot;
    const recipeName = prompt('Entrez le nom de la recette à ajouter:');
    if (recipeName) {
        mealPlan[slot] = recipeName;
        localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
        displayMealPlan();
    }
}

function addToMealPlan(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    alert(`Pour ajouter "${recipe.name}" à votre planning, rendez-vous dans Repas Prévus et cliquez sur le créneau souhaité! 📅`);
}

// Initialisation
window.onload = () => {
    console.log('Application chargée! 🍳');
};
