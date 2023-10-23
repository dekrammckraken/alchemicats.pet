$(document).ready(function () {
  const messages = [
    "A cat is a mysterious book written in a secret language. - Walter Chandoha",
    "In the world of cats, everything revolves around them. - Marion C. Garretty",
    "A cat is not just a pet but a companion who fills you with affection. - Theophile Gautier",
    "The beauty of a cat lies in its ability to love unconditionally. - Alexandra Kleeman",
    "Cats choose us; we don't choose them. - Kirsten Alexander",
    "A cat teaches you that time spent playing is never wasted time. - S. Cheshire",
    "Cats are magical creatures: they fill every home they enter with warmth and love. - Susan Easterly",
    "A cat is a friend who will never judge you and will always be there for you. - Unknown",
    "In the company of a cat, even the grayest days become brighter. - Unknown",
  ];

  const startDate = "2021-04-12";
  const elapsedDuration = calculateElapsedTime(startDate);
  const targetDay = 12;
  const targetMonth = 4; // Aprile
  const timeUntilTarget = calculateTimeUntilDate(targetDay, targetMonth);

  $("#birthdayCount").text(elapsedDuration + " years old, " + timeUntilTarget + " days 'til next birthday. April 5th");
  

  

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
    let idx = Math.floor(Math.random() * messages.length);
    $("#motd").text(messages[idx]);
  }
});
