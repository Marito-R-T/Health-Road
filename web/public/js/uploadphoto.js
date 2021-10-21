
      jQuery(document).ready(function($) {
        function readURL(input) {
          if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
              $('#previsualizacion-profile').css('background-image', 'url(' + e.target.result + ')');
              $('#previsualizacion-profile').hide();
              $('#previsualizacion-profile').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
          }
        }
        $("#imageUpload-profile").change(function() {
          readURL(this);
        });
      });
      jQuery(document).ready(function($) {
        function readURL(input) {
          if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
              $('#previsualizacion-cover').css('background-image', 'url(' + e.target.result + ')');
              $('#previsualizacion-cover').hide();
              $('#previsualizacion-cover').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
          }
        }
        $("#imageUpload-cover").change(function() {
          readURL(this);
        });
      });
      jQuery(document).ready(function($) {
        function readURL(input) {
          if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
              $('#previsualizacion-photo').css('background-image', 'url(' + e.target.result + ')');
              $('#previsualizacion-photo').hide();
              $('#previsualizacion-photo').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
          }
        }
        $("#photo").change(function() {
          readURL(this);
        });
      });