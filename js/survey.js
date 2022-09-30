// Important Elements
const question = $("#survey-question");

// Data
var info = {};
var answers = [];
var i = 0;
var questions = [
  "You enjoy playing games involving building things and management.",
  "You enjoy shooter games.",
  "Your favorite console is Xbox.",
  "You play way more video games than you probably should.",
  "You enjoy staying up late gaming.",
  "You enjoy exploring a wide range of games rather than a few that you stick to.",
  "You only play when other people are on.",
  "You enjoy games involving sports.",
  "You often turn on open mics and chat with strangers you meet in game.",
  "You believe E-sports are dumb.",
];

$("#survey-main").hide(); // Hide at first
$("#survey-result").hide();

$("#begin").on("click", () => {
  $("#survey-intro").hide();
  $("#survey-main").show();
  $(document).on("click", checkResponse);
  // Questions Init:
  question.text(questions[i]);
});

function checkResponse(e) {
  const possible = ["1", "2", "3", "4", "5"];
  const answer = e.target.id;
  if (possible.indexOf(answer) !== -1) {
    answers.push(answer);
    i++;
    if (i < questions.length) {
      setTimeout(nextQ, 250); // Delay for questions animation
      function nextQ() {
        question.text(questions[i]);
      }
      // Animation:
      $("#survey-main").addClass("fade");
      $("#survey-main").on(
        "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
        function () {
          $(this).removeClass("fade");
        }
      );
    } else {
      question.text("One more thing before you finish");
      $("#survey-responses").html(`
        <input type="checkbox" id="add-me"><span class="input-label">Add me to the public list of gamers (optional)</span>
        <div id="add-info">
          <input type="text" name="name" id="name" placeholder="Your Name">
          <div class="gt-cont"><input type="text" id="xbox" placeholder="Xbox GT"></div>
          <div class="gt-cont"><input type="text" id="ps" placeholder="PS GT"></div>
          <textarea id="more-notes" placeholder="Additional Notes or Contact Info"></textarea>
          <div class="input-label">* Must fill out at least 1 form of contact info (Xbox, PS, or a Note)</div>
          <input type="email" id="email" name="email" placeholder="Your Email (not publicly displayed)">
        </div>
        <input type="submit" value="submit" id="submit" class="button" disabled="disabled">
      `);
      // Checkbox On: Show Email Input
      $(document).on("click keydown", checkAddMe);
      checkAddMe(); // Call once
      function checkAddMe() {
        if ($("#add-me:checked").length) {
          $("#add-info").show();
        } else {
          $("#add-info").hide();
        }
      }
      // Front End *Convenience Only* Validation
      $(document).on("keydown mousemove click", checkFields);

      checkFields(); // Call once
      function checkFields() {
        const emailRgx =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (
          ($("#add-me:checked").length && $("#name").val() == "") ||
          ($("#add-me:checked").length &&
            !emailRgx.test($("#email").val())) ||
          ($("#add-me:checked").length &&
            $("#xbox").val() == "" &&
            $("#ps").val() == "" &&
            $("#more-notes").val() == "")
        ) {
          $("#submit").attr("disabled", "disabled");
        } else {
          $("#submit").removeAttr("disabled");
        }
      }
      $("#submit").on("click", finishSurvey);
    }
  }
}

function finishSurvey() {
  const info = {
    name: $("#name").val(),
    xbox: $("#xbox").val(),
    ps: $("#ps").val(),
    note: $("#more-notes").val(),
    add: $("#add-me:checked").length,
    email: $("#email").val(),
  };

  // Switch to Loading Screen and remove form/info to prevent repeated submissions
  $("#survey-main").remove();
  $("#survey-result").show();
  $("#modal").hide(); // Hide modal until successful results come in

  // POST
  // API_URL is defined in config.js and loaded into the HTML before this file.

  $.post(API_URL + "/survey", {
    info: info,
    answers: answers,
  })
    .then(function (data) {
      console.log("working");
      $("#loading").hide();

      if (data.success === true) {
        let notice = "";
        // Switch to all ternary operators in .html method here:
        if (data.addMsg != "") {
          notice = `<div class="error">${data.addMsg}</div>`;
        }
        $("#modal").show().html(`
      <button id="close-modal">X</button>
      ${notice}
      <h3 class="survey-question modal-title">You matched with:<br>${
        data.name
      }</h3>
      <div class="modal-body">
        <div class="gt-cont"><h6>Xbox GT:</h6> ${
          data.xbox != "" ? data.xbox : "N/A"
        }</div>
        <div class="gt-cont"><h6>PS GT:</h6> ${
          data.ps != "" ? data.ps : "N/A"
        }</div>
        <div class="gt-cont"><h6>Additional Bio/Contact Info:</h6> ${
          data.note != "" ? data.note : "N/A"
        }</div>
      </div>`);
      } else {
        $("#modal").show().html(`<div class="error">${data.msg}</div>`);
      }
    })
    .fail((err) => {
      $("#loading").hide();

      $("#modal")
        .show()
        .html("<div class='error'>An error occurred, please try again later.</div>");
    });
}

$(document).on("click", (e) => {
  if (e.target.id == "close-modal") {
    $("#modal").hide();
  }
});