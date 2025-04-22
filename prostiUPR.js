document.addEventListener("DOMContentLoaded", () => {
    const exercises = document.querySelectorAll(".exercise-card");
    let activeTimer = false;
    let balance = parseInt(localStorage.getItem("balance")) || 0;
    const today = new Date().toDateString();
    
    exercises.forEach((exercise, index) => {
        const button = document.createElement("button");
        button.textContent = "Start 2 min Timer";
        button.classList.add("start-timer");
        exercise.appendChild(button);
        
        button.addEventListener("click", () => {
            if (activeTimer) {
                alert("Another timer is already running!");
                return;
            }
            
            if (localStorage.getItem(`exercise_${index}_date`) === today) {
                alert("You have already completed this exercise today!");
                return;
            }
            
            activeTimer = true;
            button.disabled = true;
            let timeLeft = 120;
            
            const timerDisplay = document.createElement("p");
            timerDisplay.textContent = `Time left: ${timeLeft}s`;
            exercise.appendChild(timerDisplay);
            
            const timerInterval = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Time left: ${timeLeft}s`;
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    activeTimer = false;
                    balance += 5;
                    localStorage.setItem("balance", balance);
                    localStorage.setItem(`exercise_${index}_date`, today);
                    alert("Time's up! +5 points added to your balance.");
                    timerDisplay.textContent = "Completed! +5 points";
                }
            }, 1000);
        });
    });
});
