// Shared utility functions for exercise pages

// Function to update completion status
function updateCompletionStatus(exercise, pointsPerExercise, exerciseType) {
    const currentUser = localStorage.getItem('ttw_currentUser');
    if (!currentUser) {
        alert('Моля, влезте в системата, за да маркирате упражнения като завършени.');
        return;
    }

    const checkbox = document.getElementById(`${exercise}-complete`);
    const status = checkbox.checked ? 'complete' : 'incomplete';
    
    // Get current statuses
    let statuses = JSON.parse(localStorage.getItem('ttw_exercise_statuses') || '{}');
    if (!statuses[currentUser]) {
        statuses[currentUser] = {};
    }
    
    // Check if exercise was already completed
    if (status === 'complete' && statuses[currentUser][exercise] === 'complete') {
        alert('Вече сте завършили това упражнение!');
        checkbox.checked = true; // Keep checkbox checked
        return;
    }
    
    // Update status
    statuses[currentUser][exercise] = status;
    localStorage.setItem('ttw_exercise_statuses', JSON.stringify(statuses));
    
    // Update visual indicators
    const statusElement = document.getElementById(`${exercise}-status`);
    if (status === 'complete') {
        statusElement.textContent = 'Завършено';
        statusElement.classList.add('completed');
        statusElement.classList.remove('incomplete');
        awardPoints(pointsPerExercise, exercise);
    } else {
        statusElement.textContent = 'Незавършено';
        statusElement.classList.remove('completed');
        statusElement.classList.add('incomplete');
    }

    // Update progress if available
    if (typeof updateProgress === 'function') {
        updateProgress();
    }
}

// Function to check and reset exercises at midnight
function checkAndResetExercises(exercises, exerciseType) {
    const currentUser = localStorage.getItem('ttw_currentUser');
    if (!currentUser) return;

    const lastResetDate = localStorage.getItem(`${currentUser}-lastResetDate`);
    const today = new Date().toDateString();

    // If it's a new day or first time
    if (lastResetDate !== today) {
        // Reset all exercise statuses
        exercises.forEach(exercise => {
            localStorage.setItem(`${currentUser}-${exercise}-status`, 'incomplete');
            document.getElementById(`${exercise}-complete`).checked = false;
            document.getElementById(`${exercise}-status`).textContent = 'Незавършено';
            document.getElementById(`${exercise}-status`).classList.remove('completed');
            document.getElementById(`${exercise}-status`).classList.add('incomplete');
        });

        // Reset claimed exercises
        let users = JSON.parse(localStorage.getItem('ttw_users')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser);
        if (userIndex !== -1) {
            users[userIndex].claimedExercises = [];
            localStorage.setItem('ttw_users', JSON.stringify(users));
        }

        // Update last reset date
        localStorage.setItem(`${currentUser}-lastResetDate`, today);

        // Update points display
        updatePointsDisplay();
    }
}

// Function to award points and update leaderboard
function awardPoints(points, exercise) {
    const currentUser = localStorage.getItem('ttw_currentUser');
    if (!currentUser) {
        alert('Моля, влезте в системата, за да получавате точки!');
        return;
    }

    let users = JSON.parse(localStorage.getItem('ttw_users')) || [];
    const userIndex = users.findIndex(user => user.username === currentUser);
    
    if (userIndex !== -1) {
        if (!users[userIndex].claimedExercises) {
            users[userIndex].claimedExercises = [];
        }

        if (users[userIndex].claimedExercises.includes(exercise)) {
            alert('Вече сте получили точки за това упражнение!');
            return;
        }

        users[userIndex].points = (users[userIndex].points || 0) + points;
        users[userIndex].claimedExercises.push(exercise);
        
        localStorage.setItem('ttw_users', JSON.stringify(users));
        showPointsNotification(points);
        updatePointsDisplay();
    } else {
        alert('Грешка: Потребителят не е намерен!');
    }
}

// Function to show points notification
function showPointsNotification(points) {
    const notification = document.createElement('div');
    notification.className = 'points-notification';
    notification.innerHTML = `+${points} точки!`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to reset exercises at midnight
function resetExercisesAtMidnight(exerciseType) {
    const currentUser = localStorage.getItem('ttw_currentUser');
    if (!currentUser) return;

    const now = new Date();
    const lastResetKey = `${currentUser}_last_reset_date`;
    const lastResetDate = localStorage.getItem(lastResetKey);
    const today = now.toDateString();

    if (lastResetDate !== today && now.getHours() === 0 && now.getMinutes() === 0) {
        console.log('Resetting exercises at midnight...');
        
        const checkboxes = document.querySelectorAll('.exercise-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        const statusElements = document.querySelectorAll('.completion-status');
        statusElements.forEach(status => {
            status.textContent = 'Незавършено';
            status.classList.remove('completed');
            status.classList.add('incomplete');
        });

        if (document.getElementById('total-progress')) {
            document.getElementById('total-progress').style.width = '0%';
            document.getElementById('progress-text').textContent = '0% завършени';
        }

        localStorage.removeItem(`${currentUser}_${exerciseType}_progress`);
        localStorage.setItem(lastResetKey, today);
        showResetNotification();
    }
}

// Function to show reset notification
function showResetNotification() {
    const notification = document.createElement('div');
    notification.className = 'reset-notification';
    notification.innerHTML = 'Упражненията са нулирани за новия ден!';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #007bff;
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Export all functions
export {
    updateCompletionStatus,
    checkAndResetExercises,
    awardPoints,
    showPointsNotification,
    resetExercisesAtMidnight,
    showResetNotification
}; 