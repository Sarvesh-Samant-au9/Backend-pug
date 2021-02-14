$(document).ready(function () {
  $(".delete-article").on("click", function (e) {
    $target = $(e.target);
    console.log($target.attr("data-id"));
    const getId = $target.attr("data-id");
    $.ajax({
      type: "DELETE",
      url: "/articles/" + getId,
      success: function (response) {
        // alert(getId, "Got It");
        window.location.href = "/";
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
});
