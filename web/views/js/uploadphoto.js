
      jQuery(document).ready(function($) {
        function readURL(input) {
          if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
              $('#previsualizacion').css('background-image', 'url(' + e.target.result + ')');
              $('#previsualizacion').hide();
              $('#previsualizacion').fadeIn(650);
              $('#path').val(e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
          }
        }
        $("#imageUpload").change(function() {
          readURL(this);
        });
      });