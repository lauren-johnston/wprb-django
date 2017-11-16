"use strict";
// edit.js

console.log("edit included");

// Form validation for the add-entry form
var addEntry = function addEntry() {
	console.log('Plus button clicked!!');
	// Clone the entry form so we can add it back to the end after submission
	// this is super hacky and is definitely suggesting we should use react
	let $entryForm = $('#entry-add-form').clone();

	let entry = {
		title:  $('#entry-add-title').val(),
		artist: $('#entry-add-artist').val(),
		album:  $('#entry-add-album').val(),
		label:  $('#entry-add-label').val() || null,
	};

	$.post("entry/add/", entry, function(data) {
		if (data.success != null) {
			// Add the new spin
			$("#add-form").before(' \
				<div class="playlist-item"> \
					<div class="playlist-movetab"> </div> \
					<div class="playlist-numbering">' + data.index + '</div> \
					<div class="playlist-text-cell playlist-title">' + data.title + '</div> \
					<div class="playlist-text-cell playlist-artist"> \
						<span class="playlist-artist-name tagged-item">' + data.artist + '</span> \ \
					</div> \
					<div class="playlist-text-cell playlist-album">' + data.album + '</div> \
					<div class="playlist-text-cell playlist-recordlabel">' + data.label + '</div> \
					<div class="playlist-comment"> </div> \
				</div>'
				);

			// Clear the form values
			$("form#add-form input[type=text]").each(function() {
				$(this).val('');
			});

			// Update the submission number
			$("#new-entry-number").html(data.index+1);
		}
		else {
			alert("You got problems, buddy!");
		}
	});
}

/**
 * Document setup
 */
$(document).ready(function () {
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });

    $('#add-entry-button').click(addEntry);
});

