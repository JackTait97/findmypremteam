document.addEventListener("DOMContentLoaded", () => {
    const homeScreen = document.getElementById("home-screen");
    const quizContainer = document.getElementById("quiz-container");
    const progressContainer = document.getElementById("progress-container");
    const startButton = document.getElementById("start-quiz-button");

    // Start Quiz Button Click Handler
    startButton.addEventListener("click", () => {
        // Hide the home screen
        homeScreen.classList.add("hidden");

        // Show the quiz container and progress bar
        setTimeout(() => {
            homeScreen.style.display = "none"; // Completely hide the home screen
            quizContainer.style.display = "block"; // Display the quiz
            progressContainer.style.display = "block"; // Display the progress bar
            document.body.classList.add("quiz-active"); // Trigger grey background
            loadQuestion(); // Start the quiz
        }, 500); // Match the fade-out transition duration
    });

    initializeTeams(); // Initialize team data
});



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
            { text: "We are nothing without history", teams: ["Liverpool", "Arsenal", "Nottingham Forest", "Aston Villa", "Manchester United", "Everton", "Newcastle United", "Tottenham Hotspur",  "Wolverhampton Wanderers"] },
            { text: "Why should I care about the past?", teams: ["Chelsea", "Manchester City", "Bournemouth", "Brighton & Hove Albion", "Fulham", "Brentford", "West Ham United", "Crystal Palace", "Leicester City", "Ipswich Town", "Southampton"] }
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
            { text: "Shiny modern stadiums with great facilities", teams: ["Arsenal", "Manchester City", "Brighton & Hove Albion", "Tottenham Hotspur", "West Ham United"] },
            { text: "Smaller stadiums where the stands are almost on top of the pitch", teams: ["Ipswich Town", "Brentford", "Fulham", "Southampton", "Bournemouth", "Leicester City"] }
        ]
    },
];

// Initialize Variables
let currentQuestionIndex = 0;
let teamScores = {};
let eligibleTeams = [];
let selectedAnswers = new Set();
let finalTeamVotes = {};

// Nicknames for teams (example data structure)
const teamNicknames = {
    "Arsenal": "The Gunners",
    "Aston Villa": "The Villans",
    "Bournemouth": "The Cherries",
    "Brentford": "The Bees",
    "Brighton & Hove Albion": "The Seagulls",
    "Chelsea": "The Blues",
    "Crystal Palace": "The Eagles",
    "Everton": "The Toffees",
    "Fulham": "The Cottagers",
    "Ipswich Town": "The Tractor Boys",
    "Leicester City": "The Foxes",
    "Liverpool": "The Reds",
    "Manchester City": "The Cityzens",
    "Manchester United": "The Red Devils",
    "Newcastle United": "The Magpies",
    "Nottingham Forest": "The Garibaldis",
    "Southampton": "The Saints",
    "Tottenham Hotspur": "The Lilywhites",
    "West Ham United": "The Hammers",
    "Wolverhampton Wanderers": "Wolves"
};

// Initialize Team Scores
function initializeTeams() {
    const allTeams = new Set(questions.flatMap(q => q.answers.flatMap(a => a.teams)));
    allTeams.forEach(team => (teamScores[team] = 0));
    eligibleTeams = [...allTeams];
}


// Update Progress
// Update Progress
function updateProgress() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    // Total number of questions (regular + final three)
    const totalQuestions = questions.length + 3; // +3 for final three questions
    const progress = ((currentQuestionIndex / totalQuestions) * 100).toFixed(0);

    // Update text
    progressText.textContent = `${progress}% complete`;

    // Update progress bar width (revealing gradient from left to right)
    progressBar.style.width = `${progress}%`;
}



// Load a Question
function loadQuestion() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    if (currentQuestionIndex >= questions.length) {
        displayFinalThreeQuestions();
        return;
    }

    updateProgress();

    const questionData = questions[currentQuestionIndex];
    const questionElement = document.createElement("h2");
    questionElement.textContent = questionData.question;
    container.appendChild(questionElement);

    const subheading = document.createElement("p");
    subheading.id = "subheading";
    subheading.textContent = "Select multiple options for all questions";
    container.appendChild(subheading);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options-container";
    questionData.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.className = "option-button";

        button.onclick = () => {
            if (selectedAnswers.has(answer.text)) {
                selectedAnswers.delete(answer.text);
                button.classList.remove("selected");
            } else {
                selectedAnswers.add(answer.text);
                button.classList.add("selected");
            }
        };

        optionsContainer.appendChild(button);
    });
    container.appendChild(optionsContainer);

    const nextButtonContainer = document.createElement("div");
    nextButtonContainer.className = "next-button-container";

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next Question";
    nextButton.className = "next-question-button";
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
        eligibleTeams = eligibleTeams.filter(team => selectedTeams.has(team));
    } else {
        selectedTeams.forEach(team => {
            if (eligibleTeams.includes(team)) {
                teamScores[team] = (teamScores[team] || 0) + 1;
            }
        });
    }

    selectedAnswers.clear();
}

// Display Final Three Questions
function displayFinalThreeQuestions() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    const sortedTeams = eligibleTeams.sort((a, b) => (teamScores[b] || 0) - (teamScores[a] || 0));
    const topTeams = sortedTeams.slice(0, 2);

    finalTeamVotes = { [topTeams[0]]: 0, [topTeams[1]]: 0 };

    askKitPreference(topTeams);
}

function askKitPreference(topTeams) {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    // Update progress bar
    currentQuestionIndex++; // Increment the question index for progress
    updateProgress();

    const questionElement = document.createElement("h2");
    questionElement.textContent = "Which of these kits do you prefer?";
    container.appendChild(questionElement);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "side-by-side-container"; // Add this class for flexbox styling

    topTeams.forEach(team => {
        const kitImage = document.createElement("img");
        kitImage.src = `/kits/${team.toLowerCase().replace(/ /g, '_')}.jpg`;
        kitImage.alt = `${team} kit`;
        kitImage.style.cursor = "pointer";
        kitImage.onclick = () => {
            finalTeamVotes[team]++;
            askManagerPreference(topTeams);
        };
        optionsContainer.appendChild(kitImage);
    });

    container.appendChild(optionsContainer);
}

function askManagerPreference(topTeams) {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    // Update progress bar
    currentQuestionIndex++; // Increment the question index for progress
    updateProgress();

    const questionElement = document.createElement("h2");
    questionElement.textContent = "Which of these men do you trust more?";
    container.appendChild(questionElement);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "side-by-side-container"; // Add this class for flexbox styling

    topTeams.forEach(team => {
        const managerImage = document.createElement("img");
        managerImage.src = `/managers/${team.toLowerCase().replace(/ /g, '_')}.jpg`;
        managerImage.alt = `${team} manager`;
        managerImage.style.cursor = "pointer";
        managerImage.onclick = () => {
            finalTeamVotes[team]++;
            askNicknamePreference(topTeams);
        };
        optionsContainer.appendChild(managerImage);
    });

    container.appendChild(optionsContainer);
}


function askNicknamePreference(topTeams) {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    // Update progress bar
    currentQuestionIndex++; // Increment the question index for progress
    updateProgress();

    const questionElement = document.createElement("h2");
    questionElement.textContent = "Choose one of these club nicknames?";
    container.appendChild(questionElement);

    topTeams.forEach(team => {
        const button = document.createElement("button");
        button.textContent = teamNicknames[team];
        button.className = "option-button";
        button.onclick = () => {
            finalTeamVotes[team]++;
            displayResult(topTeams);
        };
        container.appendChild(button);
    });
}

function displayResult(topTeams) {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    // Determine the recommended team based on the majority of votes
    const recommendedTeam = Object.keys(finalTeamVotes).reduce((a, b) =>
        finalTeamVotes[a] > finalTeamVotes[b] ? a : b
    );

    // Display the recommended team
    const resultElement = document.createElement("h2");
    resultElement.textContent = `Your Recommended Team: ${recommendedTeam}`;
    container.appendChild(resultElement);

    // Add a brief description or call to action
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = `Learn more about ${recommendedTeam}!`;
    container.appendChild(descriptionElement);

    // Display the team's badge
    const badgeImage = document.createElement("img");
    badgeImage.src = `/badges/${recommendedTeam.toLowerCase().replace(/ /g, '_')}.jpg`; // Ensure filenames match this format
    badgeImage.alt = `${recommendedTeam} badge`;
    badgeImage.style.marginTop = "20px";
    badgeImage.style.width = "150px"; // Adjust size as needed
    badgeImage.style.height = "auto";
    badgeImage.style.display = "block";
    badgeImage.style.marginLeft = "auto";
    badgeImage.style.marginRight = "auto";
    badgeImage.style.border = "0px solid #ccc";
    badgeImage.style.borderRadius = "0px";
    container.appendChild(badgeImage);
}


// Start the Quiz
document.addEventListener("DOMContentLoaded", () => {
    initializeTeams();
    loadQuestion();
});