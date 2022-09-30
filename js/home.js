// API_URL is defined in config.js and loaded into the HTML before this file.

$.get(API_URL + "/users", (data) => {
    $("#loading").hide();
    data.forEach(user => {
        $("#all-gamers").append(`
        <tr>
            <td>${user.name}</td>
            <td>${user.xbox}</td>
            <td>${user.ps}</td>
            <td class="lesser-button"><details><summary>Bio & other Contact Info</summary><p>${user.note ? user.note : "N/A"}</p></details></td>
        </tr>
        `);
    });
}).fail((err) => {
    $("#loading").html(`<div class="error">An error occurred loading all players, please try again later.</div>`)
}
);

// Footer
$("#currentYear").text(new Date().getFullYear());
$("#reportBugWithRef").attr("href", "https://aidandigital.com/report-bug?ref=" + window.location.href);

$("#repo-link").attr("href", REPO_URL);

const manageDataBody = "I wish to have my data associated with the email above in the Player Matchup database <deleted OR updated> (please specify how your data should be updated, if you chose that option). I understand that you will first have to verify my identity via email before making any changes to my data, and that if I no longer have access to the email associated with my data, I do not respond within 48 hours, or I provide the wrong email, you will not be able to make any changes to my data.";
$("#manageDataWithRef").attr("href", "https://aidandigital.com/contact?ref=" + window.location.href + "&body=" + manageDataBody);