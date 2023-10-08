const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const reposList = document.getElementById('repos-list');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        alert('Please enter a GitHub username.');
        return;
    }

    // User Search Endpoint URL
    const userSearchUrl = `https://api.github.com/search/users?q=${searchTerm}`;

    // Clear previous search results and repositories
    searchResults.innerHTML = '';
    reposList.innerHTML = '';

    // Fetch user search results
    fetch(userSearchUrl, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const users = data.items;
        users.forEach(user => {
            // Display user information
            const userDiv = document.createElement('div');
            userDiv.innerHTML = `<p><strong>${user.login}</strong></p>
                                 <img src="${user.avatar_url}" alt="User Avatar">
                                 <a href="${user.html_url}" target="_blank">View Profile</a>`;
            searchResults.appendChild(userDiv);

            // Add click event to fetch user repositories
            userDiv.addEventListener('click', function() {
                const reposUrl = `https://api.github.com/users/${user.login}/repos`;

                // Fetch user repositories
                fetch(reposUrl, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                })
                .then(response => response.json())
                .then(repos => {
                    // Display user repositories
                    reposList.innerHTML = '';
                    repos.forEach(repo => {
                        const repoItem = document.createElement('div');
                        repoItem.className = 'repo-item';
                        repoItem.textContent = repo.full_name;
                        reposList.appendChild(repoItem);
                    });
                })
                .catch(error => console.error('Error fetching repositories:', error));
            });
        });
    })
    .catch(error => console.error('Error fetching users:', error));
});
