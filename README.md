# GitHub User Search

A responsive React application built with Vite that lets you search GitHub users using the GitHub Search API. The app includes advanced search filters, paginated results, and a detail page for user profiles and repositories.

## Features

- Search GitHub users by keyword or username
- Filter results by location and minimum number of repositories
- Display user avatars, followers, and profile links
- Load more results using pagination
- View detailed profile pages with public repositories
- Built with React, React Router, Axios, Tailwind CSS, and Vite

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/github_user_search.git
   cd github_user_search
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (usually `http://localhost:5173`).

## Usage

1. Enter a search term in the `Keyword / Username` field.
2. Optionally add a `Location` and/or `Min Repositories` value.
3. Click `Search GitHub Users` to load matching results.
4. Click `Load More Users` to fetch additional results.
5. Click the profile link in a result card to view the GitHub profile page and repositories.

## Project Structure

- `src/App.jsx` — main app layout, routing, and search state
- `src/main.jsx` — React entry point
- `src/components/Search.jsx` — search result list and pagination
- `src/components/SearchForm.jsx` — advanced search form
- `src/components/UserCard.jsx` — user result card
- `src/components/UserDetailPage.jsx` — profile and repository detail page
- `src/components/ProfileCard.jsx` — profile summary display
- `src/components/RepoItem.jsx` — repository list item
- `src/services/githubService.js` — GitHub API integration

## Configuration

The app uses the GitHub API base URL from `VITE_GITHUB_BASE_URL`. By default, it uses the public GitHub API:

```env
VITE_GITHUB_BASE_URL=https://api.github.com
```

Create a `.env` file in the project root to override this value if needed.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build the production bundle
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint checks

## Dependencies

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `tailwindcss`
- `vite`

## Notes

- GitHub API rate limits apply for unauthenticated requests.
- The search form requires at least one input field to be filled before submitting.

## License

This project is available under the MIT License.
