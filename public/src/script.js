document.addEventListener("DOMContentLoaded", () => {
    const homeScreen = document.getElementById("home-screen");
    const quizContainer = document.getElementById("quiz-container");
    const progressContainer = document.getElementById("progress-container");
    const startButton = document.getElementById("start-quiz-button");

    // Start Quiz Button Click Handler
    startButton.addEventListener("click", () => {
        // Add fade-out class to home screen
        homeScreen.classList.add("fade-out");

        // Transition to quiz page
        setTimeout(() => {
            homeScreen.style.display = "none"; // Hide home screen
            quizContainer.style.display = "block"; // Show quiz container
            progressContainer.style.display = "block"; // Show progress bar
            document.body.classList.add("quiz-active"); // Trigger grey background

            // Add fade-in class to quiz container
            quizContainer.classList.add("fade-in");

            loadQuestion(0); // Load the first question
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


let currentQuestionIndex = 0;
let teamScores = {};
let eligibleTeams = [];
let selectedAnswers = {}; // Object to store user's selected answers for each question
let finalTeamVotes = {};

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
function updateProgress() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    const totalQuestions = questions.length + 3; // +3 for final three questions
    const progress = ((currentQuestionIndex / totalQuestions) * 100).toFixed(0);

    progressText.textContent = `${progress}% complete`;
    progressBar.style.width = `${progress}%`;
}

// Load a Question
function loadQuestion(index) {
    if (index >= questions.length) {
        displayFinalThreeQuestions();
        return;
    }

    currentQuestionIndex = index;
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    updateProgress();

    const questionData = questions[index];
    const questionElement = document.createElement("h2");
    questionElement.textContent = questionData.question;
    container.appendChild(questionElement);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options-container";
    questionData.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.className = "option-button";

        // Highlight previously selected answer if it exists
        if (selectedAnswers[index] && selectedAnswers[index].includes(answer.text)) {
            button.classList.add("selected");
        }

        button.onclick = () => {
            if (selectedAnswers[index] && selectedAnswers[index].includes(answer.text)) {
                selectedAnswers[index] = selectedAnswers[index].filter(a => a !== answer.text);
                button.classList.remove("selected");
            } else {
                if (!selectedAnswers[index]) selectedAnswers[index] = [];
                selectedAnswers[index].push(answer.text);
                button.classList.add("selected");
            }
        };

        optionsContainer.appendChild(button);
    });
    container.appendChild(optionsContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    // Back Button
    if (index > 0 && index < questions.length) {
        const backButton = document.createElement("button");
        backButton.textContent = "Back";
        backButton.className = "back-question-button";
        backButton.onclick = () => {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        };
        buttonContainer.appendChild(backButton);
    }

    // Next Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next Question";
    nextButton.className = "next-question-button";
    nextButton.onclick = () => {
        processAnswers(questionData);
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    };
    buttonContainer.appendChild(nextButton);

    container.appendChild(buttonContainer);
}

// Process Selected Answers
function processAnswers(questionData) {
    const selectedTeams = new Set();

    if (selectedAnswers[currentQuestionIndex]) {
        selectedAnswers[currentQuestionIndex].forEach(answerText => {
            const answer = questionData.answers.find(a => a.text === answerText);
            if (answer) {
                answer.teams.forEach(team => selectedTeams.add(team));
            }
        });
    }

    if (currentQuestionIndex === 0) {
        eligibleTeams = eligibleTeams.filter(team => selectedTeams.has(team));
    } else {
        selectedTeams.forEach(team => {
            if (eligibleTeams.includes(team)) {
                teamScores[team] = (teamScores[team] || 0) + 1;
            }
        });
    }
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

    currentQuestionIndex++;
    updateProgress();

    const questionElement = document.createElement("h2");
    questionElement.textContent = "Which of these kits do you prefer?";
    container.appendChild(questionElement);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "side-by-side-container";

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

    currentQuestionIndex++;
    updateProgress();

    const questionElement = document.createElement("h2");
    questionElement.textContent = "Which of these men do you trust more?";
    container.appendChild(questionElement);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "side-by-side-container";

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

    currentQuestionIndex++;
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

function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
        }, {});
    });
    return rows;
}

function displayResult(topTeams) {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    // Hide the progress bar when reaching the final screen
    const progressContainer = document.getElementById("progress-container");
    if (progressContainer) {
        progressContainer.style.display = "none";
    }

    const recommendedTeam = Object.keys(finalTeamVotes).reduce((a, b) =>
        finalTeamVotes[a] > finalTeamVotes[b] ? a : b
    );

    const resultElement = document.createElement("h2");
    resultElement.textContent = `Your Recommended Team: ${recommendedTeam}`;
    container.appendChild(resultElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = `Learn more about ${recommendedTeam}!`;
    container.appendChild(descriptionElement);

    const badgeImage = document.createElement("img");
    badgeImage.src = `/badges/${recommendedTeam.toLowerCase().replace(/ /g, '_')}.jpg`;
    badgeImage.alt = `${recommendedTeam} badge`;
    badgeImage.style.marginTop = "20px";
    badgeImage.style.width = "150px";
    badgeImage.style.height = "auto";
    badgeImage.style.display = "block";
    badgeImage.style.marginLeft = "auto";
    badgeImage.style.marginRight = "auto";
    container.appendChild(badgeImage);

    fetch('/src/club_bios.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('JSON file fetched successfully');
        return response.json();
    })
    .then(data => {
        console.log('JSON file content:', data);
        console.log('Type of JSON data:', typeof data);
        console.log('Is JSON data an array?', Array.isArray(data));
        
        // Log the entire JSON content to understand its structure
        console.log('Full JSON data:', JSON.stringify(data, null, 2));
        
        // Assuming the JSON data is an object with a property that contains the array of teams
        const teams = data.teams || data; // Adjust this based on the actual structure
        if (!Array.isArray(teams)) {
            throw new Error('Expected JSON data to be an array');
        }
        
        const teamData = teams.find(row => row.Club === recommendedTeam);
        console.log('Team data:', teamData);
        
        if (teamData) {
            const overviewElement = document.createElement("p");
            overviewElement.textContent = teamData.Overview;
            container.appendChild(overviewElement);
        } else {
            console.log('No data found for the recommended team');
        }

        if (teamData) {
            const historyElement = document.createElement("p");
            historyElement.textContent = teamData.History;
            container.appendChild(historyElement);
        } else {
            console.log('No history data found for the recommended team');
        }
    })
    .catch(error => console.error('Error fetching the JSON file:', error));
}