// common.js

// This comes straight from the docs, needed for post-forms 
// Check https://docs.djangoproject.com/en/1.11/ref/csrf/
//------------------------------------------------------------------

/** 
*   A helper function to transform String arrays
*   into arrays usable by the TagBox component.
*/
export function tagArrayFromArray(array) {
    if(!array) return [];

    let newArray = [];
    Array.from(array).forEach((entry, index) => 
        newArray.push({id: index, text:entry}));
    return newArray;
}

export function formDict(form) {
    let dict = {};
    Array.from(form.elements).forEach(el => dict[el.name] = el.value);
    return dict;
}

/** 
 * Return a cookie by name
 */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Check if a given HTTP method is exempt from csrf protection
 */
function csrfSafeMethod(method) {
   // these HTTP methods do not require CSRF protection
   return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}



//----------------------------------------------------------------------

// function invalidFormException(message) {
// 	return {
// 		name: "Invalid Form Error",
// 		message: message
// 	}
// };