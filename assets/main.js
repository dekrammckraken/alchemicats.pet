



$(document).ready(function () {

    const messages = [
        '"A cat is a puzzle for which there is no solution." - Walter Scott',
        '"A cat is a feline equation." - Louis J. Camuti',
        '"Civilization began when someone brought home a cat and insisted on living with it." - E. L. Agassiz',
        '"The cat is a lesson in delicacy." - Jules Champfleury'
      ];

  const startDate = "2021-04-12";
  const elapsedDuration = calculateElapsedTime(startDate);
  const targetDay = 12;
  const targetMonth = 4; // Aprile
  const timeUntilTarget = calculateTimeUntilDate(targetDay, targetMonth);

  $("#timeToBirthday").text(timeUntilTarget);
  $("#timeElapsed").text(elapsedDuration);


  motd();

  function calculateElapsedTime(startDate) {
    const initialDate = new Date(startDate);
    const currentDate = new Date();
    const timeDifferenceInMilliseconds = currentDate - initialDate;
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    const daysElapsed = Math.floor(
      timeDifferenceInMilliseconds / millisecondsInADay
    );
    const yearsElapsed = Math.floor(daysElapsed / 365);
    const remainingDays = daysElapsed % 365;
    return `${yearsElapsed}`;
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
    const daysUntil = Math.floor(
      timeDifferenceInMilliseconds / millisecondsInADay
    );
    const hoursUntil = Math.floor(
      (timeDifferenceInMilliseconds % millisecondsInADay) / millisecondsInAnHour
    );
    const minutesUntil = Math.floor(
      (timeDifferenceInMilliseconds % millisecondsInAnHour) /
        millisecondsInAMinute
    );
    const secondsUntil = Math.floor(
      (timeDifferenceInMilliseconds % millisecondsInAMinute) /
        millisecondsInASecond
    );

    const formattedSeconds =
      secondsUntil < 10 ? `0${secondsUntil}` : secondsUntil;

    return `${daysUntil}`;
  }

  $(".switch").on("click", function () {
    $("html").toggleClass("grayscale-filter");
  });



    function motd() {
        let idx = Math.floor(Math.random() * messages.length)
        $("#motd").text(messages[idx]);
    }
});
