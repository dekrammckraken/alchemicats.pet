const startDate = "2021-04-12";
const elapsedDuration = calculateElapsedTime(startDate);
const targetDay = 12;
const targetMonth = 4; // Aprile
const timeUntilTarget = calculateTimeUntilDate(targetDay, targetMonth);

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

const messages = [
  "Soon, we will be adding a photo gallery of the best photos collected from our social media.",
  "They are " +
    elapsedDuration +
    " years old, and " +
    timeUntilTarget +
    " days old, and their birthday is on April 15th.",
  "Zelda is also called 'Orsetto'', did you know that?",
  "Ciri is also called 'Topolina', did you know that?",
  "Ciri and Zelda are sisters, but with completely different personalities",
  "Every 3/4 days, we post a new photo on Instagram, Reels, on the other hand, are posted when there's a fun idea or a special event."
];

let stopped = false;
let motIdx = 0;
let motdInterval;

function showMotd() {
  let msg = messages[motIdx];
  $("#motd").text(msg);
}

function motd(msg) {
  motdInterval = setInterval(nextMotd, 5000);
}

function prevMotd() {

  if (motIdx > 0) {
    motIdx--;
  }
  showMotd();
}

function nextMotd() {
  if (motIdx < messages.length - 1) {
    motIdx++;
  }
  showMotd();
}


function randMotd() {
  let newMotIdx = Math.floor(Math.random() * messages.length -1);

  while(newMotIdx == motIdx)
    randMotd();
  
  motIdx = newMotIdx;
  showMotd();
}

$(document).ready( function() {
  showMotd();
});


