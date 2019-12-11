'use strict';

const $mainPart = document.getElementById('main_part');
const $content = document.getElementById('content');
const $listPart = document.getElementById('list_part');
const $pages = document.getElementById('pages');
const $loader = document.getElementById('loader');
const $searchForm = document.getElementById('search');
const $setting = document.getElementById('setting_panel');
const $lang = document.getElementById('language');
const $sort = document.getElementById('sort');

let searchValue = '';
let totalCount = 0;
let pageCount = 1;
let results = [];


let search = () => {
	searchValue = document.getElementById('search-input').value;
	
	if (searchValue === '') {
		alert("Please enter a search term in the search box");
	} else {
		$setting.style.display = 'flex';
		$searchForm.style.position = 'relative';
		fetchResult();
	} 
};

let fetchResult = () => {
	fetch(`https://api.github.com/search/repositories?q=${searchValue}+language:${$lang.value}&sort=${$sort.value}&order=desc&page=${pageCount}&per_page=12`)
		.then(res => res.json())
		.then(data => {
			if (data.items) {
				location.hash = `#search/text=${searchValue}&p=${pageCount}`;
				totalCount = data.total_count;
				results = data.items;
				print(results);
			} else {
				alert(data.message);
			}
		});
};

let print = (arr) => {
	$loader.style.display = 'none';
	if (arr.length === 0) {
		$pages.innerText = `No results =(`;
	} else {
		$pages.innerText = `Page ${pageCount} of ${Math.ceil(totalCount/12)}`;
		$listPart.innerHTML = '';
		arr.forEach((e) => {
			$content.style.display = 'flex';
			printCard(e);
		});
	}
};

let printCard = (reposetory) => {
	let newRepo = document.createElement('li');
	newRepo.className = 'card';
	$listPart.appendChild(newRepo);

	newRepo.innerHTML = `<div class="flip-card">
												<div class="flip-card-inner">
													<div class="flip-card-front">
														<h2>${reposetory.name}</h2>
														<p>From ${reposetory.owner.login}</p>
														<img src="${reposetory.owner.avatar_url}" alt="Avatar">
													</div>
													<div class="flip-card-back">
														<p>Language: ${reposetory.language}</p> 
														<p>Watch: ${reposetory.watchers}</p>
														<p>Stars: ${reposetory.stargazers_count}</p>
														<p>Forks: ${reposetory.forks}</p>
														<p><a href="${reposetory.html_url}" target="_blank">Go to the reposetory</a></p>
													</div>
												</div>
											</div>`;
};

$searchForm.addEventListener('submit', () => {
	event.preventDefault();
	pageCount = 1;
	$loader.style.display = 'block';
	$content.style.display = 'none';
	search();
});

$mainPart.addEventListener('click', ({target: element}) => {

	if (element.id === 'left_arrow' && searchValue !== '' && pageCount > 1) {
		event.preventDefault();
		pageCount--;
		search();
	}

	if (element.id === 'right_arrow' && searchValue !== '' && pageCount < (totalCount / 12)) {
		event.preventDefault();
		pageCount++;
		search();
	}
});

$setting.addEventListener('change', ({target: element}) => {
	if (element.id === 'language' || element.id === 'sort') {
		event.preventDefault();
		pageCount = 1;
		$content.style.display = 'flex';
		search();
	}
});