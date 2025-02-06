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

    if (currentQuestionIndex === 1) {
        const winningTeams = ["Liverpool", "Arsenal", "Manchester City"];
        const underdogTeams = ["Southampton", "Wolverhampton Wanderers", "Ipswich Town", "Leicester City", "Everton"];

        if (selectedAnswers[1].includes("I love an underdog. Bring on a relegation battle")) {
            eligibleTeams = eligibleTeams.filter(team => !winningTeams.includes(team));
        }

        if (selectedAnswers[1].includes("I need my team to win all the time")) {
            eligibleTeams = eligibleTeams.filter(team => !underdogTeams.includes(team));
        }
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

function displayResult(topTeams) {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    const recommendedTeam = Object.keys(finalTeamVotes).reduce((a, b) =>
        finalTeamVotes[a] > finalTeamVotes[b] ? a : b
    );

    const resultElement = document.createElement("h2");
    resultElement.textContent = `Your Recommended Team: ${recommendedTeam}`;
    container.appendChild(resultElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = `Learn more about ${recommendedTeam}!`;
    container.appendChild(descriptionElement);

    const badgeContainer = document.createElement("div");
    badgeContainer.style.display = "flex";
    badgeContainer.style.justifyContent = "center";
    badgeContainer.style.alignItems = "center";
    badgeContainer.style.gap = "40px"; // Reduced gap for a tighter layout
    container.appendChild(badgeContainer);
    
    // Function to create kit image with caption
    function createKitSection(src, altText, captionText) {
        const kitSection = document.createElement("div");
        kitSection.style.display = "flex";
        kitSection.style.flexDirection = "column";
        kitSection.style.alignItems = "center";
    
        const kitImage = document.createElement("img");
        kitImage.src = src;
        kitImage.alt = altText;
        kitImage.style.width = "130px";
        kitImage.style.height = "130px";
        kitImage.style.marginBottom = "5px";
        kitImage.style.marginLeft = "40px";
        kitImage.style.marginRight = "40px";// Reduced gap between image and caption
    
        const caption = document.createElement("p");
        caption.textContent = captionText;
        caption.style.margin = "0"; // Remove extra margin for tight alignment
        caption.style.fontSize = "14px"; // Adjust font size for better fit
        caption.style.textAlign = "center";
    
        kitSection.appendChild(kitImage);
        kitSection.appendChild(caption);
    
        return kitSection;
    }
    
    // Add home kit, badge, and away kit with captions
    const homeKitSection = createKitSection(
        `/home_kits/${recommendedTeam.toLowerCase().replace(/ /g, '_')}.jpg`,
        `${recommendedTeam} home kit`,
        "Home Kit"
    );
    const badgeImage = document.createElement("img");
    badgeImage.src = `/badges/${recommendedTeam.toLowerCase().replace(/ /g, '_')}.jpg`;
    badgeImage.alt = `${recommendedTeam} badge`;
    badgeImage.style.width = "225px"; // 1.25 times the original size
    badgeImage.style.height = "auto";
<<<<<<< Updated upstream
    badgeImage.style.display = "block";
    badgeImage.style.marginLeft = "auto";
    badgeImage.style.marginRight = "auto";
    container.appendChild(badgeImage);
}
=======
    
    const awayKitSection = createKitSection(
        `/away_kits/${recommendedTeam.toLowerCase().replace(/ /g, '_')}.jpg`,
        `${recommendedTeam} away kit`,
        "Away Kit"
    );
    
    badgeContainer.appendChild(homeKitSection);
    badgeContainer.appendChild(badgeImage);
    badgeContainer.appendChild(awayKitSection);
    
    fetch('/src/club_bios.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('JSON file fetched successfully');
            return response.json();
        })
        .then(data => {
            console.log('Full JSON data:', JSON.stringify(data, null, 2));
            
            if (!Array.isArray(data)) {
                throw new Error('Expected JSON data to be an array');
            }
            
            const teamData = data.find(row => row.Club === recommendedTeam);
            console.log('Team data:', teamData);
            
            if (teamData) {
                const overviewElement = document.createElement("p");
                overviewElement.textContent = teamData.Overview;
                container.appendChild(overviewElement);

                // Create a button for the dropdown
                const historyButton = document.createElement("button");
                historyButton.textContent = "History";
                historyButton.className = "collapsible";
                container.appendChild(historyButton);

                // Create a container for the history text
                const historyContent = document.createElement("div");
                historyContent.className = "content";
                historyContent.style.display = "none"; // Hidden initially
                const historyElement = document.createElement("p");
                historyElement.textContent = teamData.History;
                historyContent.appendChild(historyElement);
                container.appendChild(historyContent);

                // Add event listener to toggle the dropdown
                historyButton.addEventListener("click", function() {
                    if (historyContent.style.display === "none") {
                        historyContent.style.display = "block";
                    } else {
                        historyContent.style.display = "none";
                    }
                });

                // Create a button for the Stadium dropdown
                const stadiumButton = document.createElement("button");
                stadiumButton.textContent = "Stadium";
                stadiumButton.className = "collapsible";
                container.appendChild(stadiumButton);

                // Create a container for the Stadium text and image
                const stadiumContent = document.createElement("div");
                stadiumContent.className = "content";
                stadiumContent.style.display = "none"; // Hidden initially
                const stadiumElement = document.createElement("p");
                stadiumElement.textContent = teamData.Stadium;
                const stadiumImage = document.createElement("img");
                stadiumImage.src = `/stadiums/${recommendedTeam.toLowerCase().replace(/ /g, '_')}.jpg`;
                stadiumImage.alt = `${recommendedTeam} stadium`;
                stadiumImage.className = "dropdown-image";
                stadiumContent.appendChild(stadiumImage);
                stadiumContent.appendChild(stadiumElement);
                container.appendChild(stadiumContent);

                // Add event listener to toggle the Stadium dropdown
                stadiumButton.addEventListener("click", function() {
                    if (stadiumContent.style.display === "none") {
                        stadiumContent.style.display = "block";
                    } else {
                        stadiumContent.style.display = "none";
                    }
                });

                // Create a button for the dropdown
                const rivalsButton = document.createElement("button");
                rivalsButton.textContent = "Rivalries";
                rivalsButton.className = "collapsible";
                container.appendChild(rivalsButton);

                // Create a container for the history text
                const rivalsContent = document.createElement("div");
                rivalsContent.className = "content";
                rivalsContent.style.display = "none"; // Hidden initially
                const rivalsElement = document.createElement("p");
                rivalsElement.textContent = teamData.Rivals;
                rivalsContent.appendChild(rivalsElement);
                container.appendChild(rivalsContent);

                // Add event listener to toggle the dropdown
                rivalsButton.addEventListener("click", function() {
                    if (rivalsContent.style.display === "none") {
                        rivalsContent.style.display = "block";
                    } else {
                        rivalsContent.style.display = "none";
                    }
                });

                // Create a button for the Manager dropdown
                const managerButton = document.createElement("button");
                managerButton.textContent = "Manager";
                managerButton.className = "collapsible";
                container.appendChild(managerButton);

                // Create a container for the Manager text and image
                const managerContent = document.createElement("div");
                managerContent.className = "content";
                managerContent.style.display = "none"; // Hidden initially
                const managerElement = document.createElement("p");
                managerElement.textContent = teamData.Manager;
                const managerImage = document.createElement("img");
                managerImage.src = `/managers/${recommendedTeam.toLowerCase().replace(/ /g, '_')}.jpg`;
                managerImage.alt = `${recommendedTeam} manager`;
                managerImage.className = "dropdown-image";
                managerContent.appendChild(managerImage);
                managerContent.appendChild(managerElement);
                container.appendChild(managerContent);

                // Add event listener to toggle the Manager dropdown
                managerButton.addEventListener("click", function() {
                    if (managerContent.style.display === "none") {
                        managerContent.style.display = "block";
                    } else {
                        managerContent.style.display = "none";
                    }
                });


            } else {
                console.log('No data found for the recommended team');
            }
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
}

>>>>>>> Stashed changes
