$(document).ready(function () {

    const startDate = "2021-04-12";
    
    const elapsedDuration = calculateElapsedTime(startDate);
   
    
    setInterval(() => {
        const targetDay = 12;
        const targetMonth = 4; // Aprile
        const timeUntilTarget = calculateTimeUntilDate(targetDay, targetMonth);
        $("#timeToBirthday").text(timeUntilTarget);
      }, 1000);


    $("#timeElapsed").text(elapsedDuration);
  

    function calculateElapsedTime(startDate) {
        const initialDate = new Date(startDate);
        const currentDate = new Date();
        const timeDifferenceInMilliseconds = currentDate - initialDate;
        const millisecondsInADay = 1000 * 60 * 60 * 24;
        const daysElapsed = Math.floor(timeDifferenceInMilliseconds / millisecondsInADay);
        const yearsElapsed = Math.floor(daysElapsed / 365);
        const remainingDays = daysElapsed % 365;
        return `${yearsElapsed} years and ${remainingDays} days`;
    }

    function calculateTimeUntilDate(targetDay, targetMonth) {
        const currentYear = new Date().getFullYear();
        const targetDate = new Date(currentYear, targetMonth - 1, targetDay);
        const currentDate = new Date();

        if (targetDate < currentDate) {
            targetDate.setFullYear(currentYear + 1);
        }

        const timeDifferenceInMilliseconds = targetDate - currentDate;
        const millisecondsInASecond = 1000;
        const millisecondsInAMinute = millisecondsInASecond * 60;
        const millisecondsInAnHour = millisecondsInAMinute * 60;
        const millisecondsInADay = millisecondsInAnHour * 24;
        const daysUntil = Math.floor(timeDifferenceInMilliseconds / millisecondsInADay);
        const hoursUntil = Math.floor((timeDifferenceInMilliseconds % millisecondsInADay) / millisecondsInAnHour);
        const minutesUntil = Math.floor((timeDifferenceInMilliseconds % millisecondsInAnHour) / millisecondsInAMinute);
        const secondsUntil = Math.floor((timeDifferenceInMilliseconds % millisecondsInAMinute) / millisecondsInASecond);

        const formattedSeconds = secondsUntil < 10 ? `0${secondsUntil}` : secondsUntil;
  

        return `${daysUntil} days, ${hoursUntil} hours, ${minutesUntil} minutes and ${formattedSeconds} seconds`;
    }



    $(".switch").on('click', function() {

        $("html").toggleClass('grayscale-filter');
    });
});