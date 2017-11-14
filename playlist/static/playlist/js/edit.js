// edit.js

console.log("edit included");

// Form validation for the add-entry form
function tryAddEntry() {
	try {
		var form   = document.forms["add-form"]
		var csrftoken = $("[name=csrfmiddlewaretoken]").val();
		if ((form['title'].value == '') || (form['artist'].value == ''))
			throw invalidFormException('Entries need titles and artists!')
		// $.post( "entry/add", $("#add-form").serialize(), function(data) {
		// 	console.log(data);
		// });
	}
	catch(e) {
		if(e.name == "invalidFormException")
			alert(e.message);
	}
	return false;
}