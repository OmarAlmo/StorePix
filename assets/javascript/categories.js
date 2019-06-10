function func() {
    var categories = document.getElementsByName('category');
    var selectedCategories = [];
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].type == 'checkbox' && categories[i].checked == true)
            selectedCategories.push(categories[i].value);
    }
    console.log(selectedCategories);
    console.log(selectedCategories.length);
}