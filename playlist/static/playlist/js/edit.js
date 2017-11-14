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
		console.log(data);
	});

	// Convert the submitted data to static page data
	// TODO

	// Add a new submit section
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

