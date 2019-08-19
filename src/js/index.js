// Global app controller
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';
import Search from './models/Search';
import * as searchView from './views/searchViews';
import * as recipeView from './views/recipeView';

/* Global state of the app
|* - Search object
|* - Current recipe object
|* - Shopping list object
|* - Liked recipes
|*/
const state = {};


/* 
|* - Search Conroller
|*/
const controlSearch = async () => {
// document.querySelector('.search_field').getInput();
// 1) Get query from view
	const query = searchView.getInput();
	//const query = 'coffee';
	//console.log(query);

	if(query){
		// 2) New search object and add to state
		state.search = new Search(query);
		// 3) Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try{
			// 4) Search for recipes
			await state.search.getResults();

			// 5) render result on UI
			clearLoader();
			//console.log(state.search.result);
			searchView.renderResults(state.search.result);

		}catch(err){
			alert('Something went wrong with the search')
			console.log(err)
			clearLoader();
		}
		
	}
	
}

elements.searchForm.addEventListener('submit', e =>{
	e.preventDefault();
	controlSearch();
	// var b = document.querySelector('.search_field')
	// console.log(b.value);
});


elements.searchResPages.addEventListener('click', e =>{
	const btn = e.target.closest('.btn-inline');
	if(btn){
		searchView.clearResults();
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.renderResults(state.search.result, goToPage);
		//console.log(goToPage);

	}
});


/* 
|* - Recipe Conroller
|*/

const controlRecipe = async () => {
	//Get ID from uril
	const id = window.location.hash.replace('#', '');

	 if(id){
	 	// Prepare UI for changes
	 	recipeView.clearRecipe();
	 	renderLoader(elements.recipe);

	 	//Highlight selected 
	 	if(state.search) searchView.highlightSelected(id);

	 	//Create new recipe object
		state.recipe = new Recipe(id);
		
		 try{
	 	//Get recipe data and parce ingredients
	 	await state.recipe.getRecipe();

	 	state.recipe.parseIngredients();
	 	//Calculate servings and time
	 	state.recipe.calcTime();
	 	state.recipe.calcServings();
	 	//Render recipe
	 	clearLoader();
	 	recipeView.renderRecipe(state.recipe);
	 	
	 	}catch(err){
	 		alert('error processing the recipe')
	 		console.log(err);
	 	}
	 	
	 }

}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
	//console.log(e.target);
	if (e.target.matches('.btn-decrease, .btn-decrease *')){
		if(state.recipe.servings > 1){
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	}else if(e.target.matches('.btn-increase, .btn-increase *')) {
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	}
	console.log(state.recipe);
})






