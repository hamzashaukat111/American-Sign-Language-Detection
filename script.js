$(document).ready(function () {
  var video = document.getElementById("videoElement");
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var captureButton = document.getElementById("captureButton");

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Could not access the camera: " + error);
    });

  $("#uploadForm").submit(function (event) {
    event.preventDefault();
    var fileInput = document.getElementById("imageInput");
    var formData = new FormData();
    formData.append("image", fileInput.files[0]);
    processImage(formData);
  });

  captureButton.addEventListener("click", function () {
    context.drawImage(video, 0, 0, 100, 100);
    // context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    canvas.toBlob(function (blob) {
      var formData = new FormData();
      formData.append("image", blob);
      processImage(formData);
    });
  });

  function processImage(formData) {
    $.ajax({
      url: "https://westeurope.api.cognitive.microsoft.com/customvision/v3.0/Prediction/57a290ce-ba19-459a-af93-f6fc73f4e609/classify/iterations/Iteration1/image",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        "Prediction-Key": "a96005bef1c34c4aa03d7481d4b4092b",
      },

      // succes code
      //   success: function (response) {
      //     var predictions = response.predictions;
      //     var resultContainer = document.getElementById("resultContainer");
      //     var resultHeading = document.getElementById("resultHeading");
      //     resultContainer.innerHTML = "";
      //     resultHeading.innerHTML = "";

      //     if (predictions.length > 0) {
      //       var maxProbability = 0;
      //       var predictedTag = "";
      //       for (var i = 0; i < predictions.length; i++) {
      //         var prediction = predictions[i];
      //         if (prediction.probability > maxProbability) {
      //           maxProbability = prediction.probability;
      //           predictedTag = prediction.tagName;
      //         }
      //       }

      //       var result = '<div class="result-container">';
      //       result += '<div class="prediction">';
      //       result += '<p class="tag-name">' + predictedTag + "</p>";
      //       result += '<div class="percentage-bar">';
      //       result +=
      //         '<div class="percentage" style="width: ' +
      //         maxProbability * 100 +
      //         '%;"></div>';
      //       result += "</div>";
      //       result +=
      //         '<p class="probability">' +
      //         (maxProbability * 100).toFixed(2) +
      //         "%</p>";
      //       result += "</div>";
      //       result += "</div>";

      //       resultContainer.innerHTML = result;

      //       resultHeading.innerHTML =
      //         '<h2 class="result-heading">This sign means the alphabet ' +
      //         predictedTag +
      //         "</h2>";
      //     } else {
      //       resultContainer.innerHTML = "<p>No predictions found.</p>";
      //     }
      //   },
      success: function (response) {
        var predictions = response.predictions;
        var resultContainer = document.getElementById("resultContainer");
        var resultHeading = document.getElementById("resultHeading");
        resultContainer.innerHTML = "";
        resultHeading.innerHTML = "";

        if (predictions.length > 0) {
          var maxProbability = 0;
          var predictedTag = "";
          for (var i = 0; i < predictions.length; i++) {
            var prediction = predictions[i];
            console.log(
              prediction.tagName +
                ": " +
                (prediction.probability * 100).toFixed(2) +
                "%"
            ); // Log tag name and its probability
            if (prediction.probability > maxProbability) {
              maxProbability = prediction.probability;
              predictedTag = prediction.tagName;
            }
          }

          var result = '<div class="result-container">';
          result += '<div class="prediction">';
          result += '<p class="tag-name">' + predictedTag + "</p>";
          result += '<div class="percentage-bar">';
          result +=
            '<div class="percentage" style="width: ' +
            maxProbability * 100 +
            '%;"></div>';
          result += "</div>";
          result +=
            '<p class="probability">' +
            (maxProbability * 100).toFixed(2) +
            "%</p>";
          result += "</div>";
          result += "</div>";

          resultContainer.innerHTML = result;

          resultHeading.innerHTML =
            '<h2 class="result-heading">This sign means the alphabet ' +
            predictedTag +
            "</h2>";
        } else {
          resultContainer.innerHTML = "<p>No predictions found.</p>";
        }
      },

      //   success: function (response) {
      //     var predictions = response.predictions;
      //     var resultContainer = document.getElementById("resultContainer");
      //     var resultHeading = document.getElementById("resultHeading");
      //     resultContainer.innerHTML = "";
      //     resultHeading.innerHTML = "";

      //     if (predictions.length > 0) {
      //       var aliveProbability = 0;
      //       var notAliveProbability = 0;
      //       for (var i = 0; i < predictions.length; i++) {
      //         var prediction = predictions[i];
      //         if (prediction.tagName === "Alive") {
      //           aliveProbability = prediction.probability;
      //         } else if (prediction.tagName === "notalive") {
      //           notAliveProbability = prediction.probability;
      //         }
      //       }

      //       var result = '<div class="result-container">';
      //       result += '<div class="prediction">';
      //       result += '<p class="tag-name">Alive</p>';
      //       result += '<div class="percentage-bar">';
      //       result +=
      //         '<div class="percentage" style="width: ' +
      //         aliveProbability * 100 +
      //         '%;"></div>';
      //       result += "</div>";
      //       result +=
      //         '<p class="probability">' +
      //         (aliveProbability * 100).toFixed(2) +
      //         "%</p>";
      //       result += "</div>";

      //       result += '<div class="prediction">';
      //       result += '<p class="tag-name">Not Alive</p>';
      //       result += '<div class="percentage-bar">';
      //       result +=
      //         '<div class="percentage" style="width: ' +
      //         notAliveProbability * 100 +
      //         '%;"></div>';
      //       result += "</div>";
      //       result +=
      //         '<p class="probability">' +
      //         (notAliveProbability * 100).toFixed(2) +
      //         "%</p>";
      //       result += "</div>";
      //       result += "</div>";

      //       resultContainer.innerHTML = result;

      //       if (aliveProbability > notAliveProbability) {
      //         resultHeading.innerHTML =
      //           '<h2 class="result-heading">This Video contains live person</h2>';
      //       } else {
      //         resultHeading.innerHTML =
      //           '<h2 class="result-heading">This Video fails liveness check</h2>';
      //       }
      //     } else {
      //       resultContainer.innerHTML = "<p>No predictions found.</p>";
      //     }
      //   },

      error: function () {
        var resultContainer = document.getElementById("resultContainer");
        var resultHeading = document.getElementById("resultHeading");
        resultContainer.innerHTML =
          "<p>An error occurred while processing the image.</p>";
        resultHeading.innerHTML = "";
      },
    });
  }
});
