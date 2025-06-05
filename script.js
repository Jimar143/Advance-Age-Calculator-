document.addEventListener('DOMContentLoaded', function() {
    // Populate days dropdown
    const daySelect = document.getElementById('day');
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggle.textContent = isDarkMode ? '🌞' : '🌓';
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '🌞';
    }

    // Calculate age
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateAge);

    // Reset form
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', function() {
        document.getElementById('day').value = '';
        document.getElementById('month').value = '';
        document.getElementById('year').value = '';
        document.getElementById('resultSection').classList.remove('active');
    });

    function calculateAge() {
        const day = parseInt(document.getElementById('day').value);
        const month = parseInt(document.getElementById('month').value);
        const year = parseInt(document.getElementById('year').value);

        if (!day || !month || !year) {
            alert('Please fill in all fields');
            return;
        }

        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        if (birthDate > today) {
            alert('Birth date cannot be in the future');
            return;
        }

        // Calculate age
        let ageInMilliseconds = today - birthDate;
        let ageInSeconds = ageInMilliseconds / 1000;
        let ageInMinutes = ageInSeconds / 60;
        let ageInHours = ageInMinutes / 60;
        let ageInDays = ageInHours / 24;
        let ageInYears = ageInDays / 365.25;

        const years = Math.floor(ageInYears);
        const months = Math.floor((ageInYears - years) * 12);
        const days = Math.floor(ageInDays % 30.44); // Approximate days in a month
        const hours = Math.floor(ageInHours % 24);

        // Display results
        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;

        // Calculate next birthday
        const nextBirthday = new Date(today.getFullYear(), month - 1, day);
        if (nextBirthday < today) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('nextBirthday').textContent = nextBirthday.toLocaleDateString('en-US', options);

        // Calculate day of birth
        const birthDay = birthDate.toLocaleDateString('en-US', { weekday: 'long' });
        document.getElementById('birthDay').textContent = `${birthDay}, ${birthDate.toLocaleDateString('en-US', options)}`;

        // Calculate life progress (assuming average lifespan of 80 years)
        const lifeProgress = (ageInYears / 80) * 100;
        document.getElementById('lifeProgress').textContent = `${lifeProgress.toFixed(1)}% of average lifespan`;

        // Determine generation
        let generation = '';
        if (year >= 1997 && year <= 2012) {
            generation = 'Generation Z';
        } else if (year >= 1981 && year <= 1996) {
            generation = 'Millennial';
        } else if (year >= 1965 && year <= 1980) {
            generation = 'Generation X';
        } else if (year >= 1946 && year <= 1964) {
            generation = 'Baby Boomer';
        } else if (year >= 1928 && year <= 1945) {
            generation = 'Silent Generation';
        } else if (year >= 1901 && year <= 1927) {
            generation = 'Greatest Generation';
        } else if (year >= 2013) {
            generation = 'Generation Alpha';
        } else {
            generation = 'Unknown Generation';
        }
        document.getElementById('generation').textContent = generation;

        // Determine zodiac sign
        const zodiacSign = getZodiacSign(day, month);
        document.getElementById('zodiacSign').innerHTML = `
            <span style="background: #${getZodiacColor(zodiacSign)}; color: white; padding: 5px 10px; border-radius: 20px; font-size: 14px;">
                ${zodiacSign}
            </span>
        `;

        // Generate milestones
        generateMilestones(birthDate, years);

        // Show results
        document.getElementById('resultSection').classList.add('active');
    }

    function getZodiacSign(day, month) {
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
        return 'Pisces';
    }

    function getZodiacColor(sign) {
        const colors = {
            'Aries': 'FF6B6B',
            'Taurus': '4ECDC4',
            'Gemini': '45B7D1',
            'Cancer': 'A5D8DD',
            'Leo': 'FFD166',
            'Virgo': '06D6A0',
            'Libra': 'A78AFF',
            'Scorpio': '8338EC',
            'Sagittarius': 'FF9E00',
            'Capricorn': '8A817C',
            'Aquarius': '3A86FF',
            'Pisces': '5887FF'
        };
        return colors[sign] || '4361ee';
    }

    function generateMilestones(birthDate, currentAge) {
        const milestonesGrid = document.getElementById('milestonesGrid');
        milestonesGrid.innerHTML = '';

       const milestones = [
    { age: 0, title: 'Birth', description: 'Welcome to the world!' },
    { age: 1, title: 'First Birthday', description: 'Your first big celebration!' },
    { age: 5, title: 'Start School', description: 'Time to learn and make new friends!' },
    { age: 7, title: 'First Communion', description: 'A special day in many families' },
    { age: 12, title: 'Elementary Graduation', description: 'Great job finishing grade school!' },
    { age: 13, title: 'Becoming a Teen', description: 'Welcome to your teenage years!' },
    { age: 16, title: 'Prom Night', description: 'A night full of memories and fun!' },
    { age: 18, title: 'Legal Adult', description: 'You can now vote and make big decisions!' },
    { age: 21, title: 'Adult Milestone', description: 'You can now drink and celebrate responsibly!' },
    { age: 25, title: 'Young Adult', description: 'Time to chase your dreams!' },
    { age: 30, title: 'Thirties', description: 'A new chapter of growth and success!' },
    { age: 40, title: 'Forty', description: 'Life really begins at forty!' },
    { age: 50, title: 'Half Century', description: 'Half a hundred years of experience!' },
    { age: 60, title: 'Senior Citizen', description: 'Enjoy your well-earned benefits!' },
    { age: 65, title: 'Retirement', description: 'Time to relax and enjoy life!' },
    { age: 75, title: 'Golden Years', description: 'Full of wisdom and stories to share!' },
    { age: 80, title: 'Eighty', description: 'A wonderful milestone of life!' },
    { age: 90, title: 'Ninety', description: 'Almost a century of memories!' },
    { age: 100, title: 'Century', description: 'One hundred years young!' }
];


        milestones.forEach(milestone => {
            const milestoneDate = new Date(birthDate);
            milestoneDate.setFullYear(milestoneDate.getFullYear() + milestone.age);

            const milestoneCard = document.createElement('div');
            milestoneCard.className = `milestone-card ${milestone.age < currentAge ? 'past' : 'future'}`;
            
            const milestoneYear = birthDate.getFullYear() + milestone.age;
            const isPast = milestone.age < currentAge;
            const status = isPast ? 'Completed' : 'Upcoming';
            const statusClass = isPast ? 'text-success' : 'text-primary';

            milestoneCard.innerHTML = `
                <h3>${milestone.title}</h3>
                <p>${milestone.description}</p>
                <p class="milestone-date">${milestoneYear} (Age ${milestone.age})</p>
            `;

            milestonesGrid.appendChild(milestoneCard);
        });
    }
});

