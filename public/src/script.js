// Quiz Data: Questions, Answers, and Team Mappings
const questions = [
    {
        question: "Where do you want your club to be located?",
        answers: [
            { text: "The North", teams: ["Liverpool", "Manchester City", "Newcastle United", "Manchester United", "Everton"] },
            { text: "The Midlands", teams: ["Nottingham Forest", "Aston Villa", "Leicester City", "Wolverhampton Wanderers"] },
            { text: "The South (not including London)", teams: ["Southampton", "Ipswich Town", "Brighton & Hove Albion", "Bournemouth"] },
            { text: "London", teams: ["Chelsea", "Arsenal", "Fulham", "Tottenham Hotspur", "Brentford", "West Ham United", "Crystal Palace"] },
            { text: "Anywhere but London", teams: ["Liverpool", "Manchester City", "Newcastle United", "Manchester United", "Everton", "Nottingham Forest", "Aston Villa", "Leicester City", "Wolverhampton Wanderers", "Southampton", "Ipswich Town", "Brighton & Hove Albion", "Bournemouth"] },
            { text: "I don’t care!", teams: ["Liverpool", "Manchester City", "Newcastle United", "Chelsea", "Arsenal", "Tottenham Hotspur", "Brighton & Hove Albion"] }
        ]
    },
    {
        question: "How much do you care about your club winning?",
        answers: [
            { text: "I need my team to win all the time", teams: ["Liverpool", "Arsenal", "Manchester City"] },
            { text: "I want my team to be good, but not necessarily winning the league", teams: ["Chelsea", "Tottenham Hotspur", "Manchester United", "Aston Villa", "Newcastle United"] },
            { text: "I don't care about glory, but I also don’t want a relegation scrap every year", teams: ["Brighton & Hove Albion", "Fulham", "Brentford", "West Ham United", "Nottingham Forest", "Bournemouth", "Crystal Palace"] },
            { text: "I love an underdog. Bring on a relegation battle", teams: ["Southampton", "Wolverhampton Wanderers", "Ipswich Town", "Leicester City", "Everton"] }
        ]
    },
    {
        question: "Do you care whether your club has an illustrious history?",
        answers: [
            { text: "We are nothing without history", teams: ["Liverpool", "Arsenal", "Nottingham Forest", "Aston Villa", "Manchester United", "Everton", "Newcastle United", "Tottenham Hotspur"] },
            { text: "Why should I care about the past?", teams: ["Chelsea", "Manchester City", "Bournemouth", "Brighton & Hove Albion", "Fulham", "Brentford", "West Ham United", "Crystal Palace", "Leicester City", "Ipswich Town", "Wolverhampton Wanderers", "Southampton"] }
        ]
    },
    {
        question: "How popular do you want your club to be?",
        answers: [
            { text: "I want to support a club that everyone will recognize", teams: ["Liverpool", "Arsenal", "Manchester City", "Manchester United", "Chelsea", "Tottenham Hotspur"] },
            { text: "I’m a hipster. I want to support a club that will surprise people", teams: ["Ipswich Town", "Southampton", "Brentford", "Bournemouth", "Leicester City", "Fulham", "Wolverhampton Wanderers"] },
            { text: "Give me something in the middle ", teams: ["Nottingham Forest", "Newcastle United", "Aston Villa", "Everton", "Crystal Palace", "Brighton & Hove Albion", "West Ham United"] }
        ]
    },
    {
        question: "What type of stadium do you prefer?",
        answers: [
            { text: "Old, iconic stadiums steeped in history", teams: ["Liverpool", "Manchester United", "Everton", "Newcastle United", "Aston Villa", "Chelsea", "Crystal Palace", "Wolverhampton Wanderers", "Nottingham Forest"] },
            { text: "Shiny modern stadiums with great facilities ", teams: ["Arsenal", "Manchester City", "Brighton & Hove Albion", "Tottenham Hotspur", "West Ham United"] },
            { text: "Smaller stadiums where the stands are almost on top of the pitch ", teams: ["Ipswich Town", "Brentford", "Fulham", "Southampton", "Bournemouth", "Leicester City"] }
        ]
    },
];

// Initialize Variables
let currentQuestionIndex = 0;
let teamScores = {};
let eligibleTeams = []; // Whittled down teams after the first question
let selectedAnswers = new Set(); // Tracks selected answers for multi-selection

// Initialize Team Scores
function initializeTeams() {
    const allTeams = new Set(questions.flatMap(q => q.answers.flatMap(a => a.teams)));
    allTeams.forEach(team => (teamScores[team] = 0));
    eligibleTeams = [...allTeams]; // Start with all teams eligible
}

// Load a Question
function loadQuestion() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    // Check if we've reached the end of the regular questions
    if (currentQuestionIndex >= questions.length) {
        displayFinalQuestion();
        return;
    }

    const questionData = questions[currentQuestionIndex];
    const questionElement = document.createElement("h2");
    questionElement.textContent = questionData.question;
    container.appendChild(questionElement);

    // Display answers with selectable options
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options-container"; // Style group of options
    questionData.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.className = "option-button"; // Add a class for styling

        // Toggle highlight on selection
        button.onclick = () => {
            if (selectedAnswers.has(answer.text)) {
                selectedAnswers.delete(answer.text);
                button.classList.remove("selected"); // Remove highlight
            } else {
                selectedAnswers.add(answer.text);
                button.classList.add("selected"); // Add highlight
            }
        };

        optionsContainer.appendChild(button);
    });
    container.appendChild(optionsContainer);

    // Add Next Question button
    const nextButtonContainer = document.createElement("div");
    nextButtonContainer.className = "next-button-container"; // Separate container for button row

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next Question";
    nextButton.className = "next-question-button"; // Add class for styling
    nextButton.onclick = () => {
        processAnswers(questionData);
        currentQuestionIndex++;
        loadQuestion();
    };

    nextButtonContainer.appendChild(nextButton);
    container.appendChild(nextButtonContainer);
}

// Process Selected Answers
function processAnswers(questionData) {
    const selectedTeams = new Set();

    selectedAnswers.forEach(answerText => {
        const answer = questionData.answers.find(a => a.text === answerText);
        if (answer) {
            answer.teams.forEach(team => selectedTeams.add(team));
        }
    });

    if (currentQuestionIndex === 0) {
        // Whittling down process for the first question
        eligibleTeams = eligibleTeams.filter(team => selectedTeams.has(team));
    } else {
        // Score update for subsequent questions
        selectedTeams.forEach(team => {
            if (eligibleTeams.includes(team)) {
                teamScores[team] = (teamScores[team] || 0) + 1;
            }
        });
    }

    selectedAnswers.clear(); // Clear selections for the next question
}

// Display the Final Question (Kit Preference)
function displayFinalQuestion() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    // Find the two teams with the highest scores among eligible teams
    const sortedTeams = eligibleTeams.sort((a, b) => (teamScores[b] || 0) - (teamScores[a] || 0));
    const topTeams = sortedTeams.slice(0, 2);

    const questionElement = document.createElement("h2");
    questionElement.textContent = "Which of these kits do you prefer?";
    container.appendChild(questionElement);

    // Display the kits
    topTeams.forEach(team => {
        const kitImage = document.createElement("img");
        kitImage.src = `/kits/${team.toLowerCase().replace(/ /g, '_')}.jpg`; // Assuming kits are named in lowercase and spaces replaced with underscores
        kitImage.alt = `${team} kit`;
        kitImage.style.cursor = "pointer";
        kitImage.onclick = () => displayResult(team);
        container.appendChild(kitImage);
    });
}

// Display the Result
function displayResult(team) {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    const resultElement = document.createElement("h2");
    resultElement.textContent = `Your Recommended Team: ${team}`;
    container.appendChild(resultElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = `Learn more about ${team}!`;
    container.appendChild(descriptionElement);
}

// Start the Quiz
document.addEventListener("DOMContentLoaded", () => {
    initializeTeams();
    loadQuestion();
});