# Quiz

A simple browser-based quiz app built with plain HTML, CSS, and JavaScript.

## What it does

- Lets the player enter a name
- Lets the player choose a question category
- Fetches 5 multiple-choice questions from the Open Trivia Database API
- Shows a 15-second timer per question
- Highlights correct and incorrect answers
- Displays final score at the end
- Saves top scores in `localStorage`

## Files

- `index.html` - app structure and view sections for welcome, quiz, and results screens
- `style.css` - app layout, colors, buttons, and timer styling
- `script.js` - quiz logic, API requests, timer, answer handling, and leaderboard persistence

## How to run

1. Open `index.html` in your browser.
2. Enter your name.
3. Pick a category.
4. Click **Start Quiz**.
5. Answer each question before the timer runs out.

## Notes

- Questions are loaded from `https://opentdb.com/api_config.php`.
- The quiz uses 5 questions per session.
- The leaderboard shows the top 5 scores stored in your browser.

## Development

No build tools are required. The project runs directly in any modern browser.

## Improvements

Possible enhancements:

- Add more categories or question types
- Use a larger quiz question pool
- Improve UI/UX and mobile responsiveness
- Add restart and menu navigation without page reload
