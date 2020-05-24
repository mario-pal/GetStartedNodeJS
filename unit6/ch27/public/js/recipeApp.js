$(document).ready(() => {
  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get(/*"/courses?format=json"*/ "/api/courses", (
      /*data*/ results = {}
    ) => {
      let data = results.data; //27.1
      if (!data || !data.courses) return; //27.1
      data.courses.forEach((course) => {
        $(".modal-body").append(
          `<div>
                        <span class="course-title">
                            ${course.title}
                        </span>
                        <div class="course-description">
                            ${course.description}
                        </div>
                    </div>
                    <button class='${
                      course.joined ? "joined-button" : "join-button"
                    }' data-id="${course._id}">
                    ${course.joined ? "Joined" : "Join"}
                    </button>
                    `
        );
      });
    }).then(() => {
      addJoinButtonListener(); //Note: AJAX functions use promises. You can chain "then"...
    }); //...and "catch" blocks to the end of requests to run code after you get a response.
  });
});

let addJoinButtonListener = () => {
  $(".join-button").click((event) => {
    let $button = $(event.target), //the target of the click AKA the button//$ is in $button to indicate it's a jQuery object, but it is not required
      courseId = $button.data("id");
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      //the /api/courses/:id/join route and action returns the JSON value success. success: true if youre able to add the user to the course
      let data = results.data;
      if (data && data.success) {
        $button
          .text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        $button.text("Try Again");
      }
    });
  });
};
