function prototype() {

    //collection-list.html.twig
    // set these values with your own
    // {% set myCollectionId = 'collection-list' %}
    // {% set myCollectionName = '__name1__' %}
    // {% set collectionForm = form.collectionListName %}
    // then use the markup as below //your can use any container you want //here it are divs
    // this is your collection holder
    // <div class="collection {{ myCollectionId }}"
    //     data-collection-id="{{ myCollectionId }}"
    //     data-collection-name="{{ myCollectionName }}"
    //     data-prototype="
    //     {% filter escape %}
    //     {{ include('@bundle/collection-items.html.twig', {
    //         'collection': collectionForm.vars.prototype
    //     }) }}
    //     {% endfilter %}
    //     ">
    //     // your existing items
    //     {% for collectionId in collectionForm %}
    //     {{ include('@bundle/collection-items.html.twig', {
    //         'collection': collectionId
    //     }) }}
    //     {% endfor %}
    //     holder for your new items
    //     <div class="append-{{ myCollectionId }}"></div>
    //     your add button
    //     <div class="add-{{ myCollectionId}} add-collection-item" data-collection-id="{{ myCollectionId }}"></div>
    // </div>

    //collection-items.html.twig'
    // <div class="item {{ myCollectionId }}-collection-item">
    //     widgets
    //     {{ form_widget(collection.fieldname1) }}
    //     {{ form_widget(collection.fieldname2) }}
    //     etc.
    //     remove button for your collection
    //     <div class="remove-collection-item"></div>

    // if you have a sub collection repeat the whole proces here
    // set your unique vars
    // {% set mySubCollectionId = 'sub-collection-list' %}
    // {% set mySubCollectionName = '__name2__' %}
    // {% set collectionSubForm = collection.subCollectionListName %}
    // the subcollection holder
    // <div class="collection {{ mySubCollectionId }}"
    //     data-collection-id="{{ mySubCollectionId }}"
    //     data-collection-name="{{ mySubCollectionName }}"
    //     data-prototype="
    //     {% filter escape %}
    //     {{ include('@bundle/sub-collection-items.html.twig', {
    //         'collection': collectionSubForm.vars.prototype
    //     }) }}
    //     {% endfilter %}
    //     ">
    //     existing items
    //     {% for subCollectionId in collectionSubForm %}
    //     {{ include('@bundle/sub-collection-items.html.twig', {
    //         'collection': subCollectionId
    //     }) }}
    //     {% endfor %}
    //      holder for new items
    //     <div class="append-{{ mySubCollectionId }} append-new-collection"></div>
    //      add button for the sub collection
    //     <div class="add-{{ mySubCollectionId}} add-collection-item" data-collection-id="{{ mySubCollectionId }}"></div>
    // </div>
    //</div>

    //sub-collection-items.html.twig'
    // <div class="item {{ mySubCollectionId }}-collection-item">
    //      widgets // use any html markup you need
    //     {{ form_widget(collection.fieldname1) }}
    //     {{ form_widget(collection.fieldname2) }}
    //     etc.
    //      remove button for the subcollection
    //     <div class="remove-collection-item "></div>
    // if you have a sub sub collection repeat the whole proces here
    // </div>

    //set index on every collection
    function setIndex() {

        let c = $(document).find(':input').length + 1;
        $('.collection').each(function () {

            let $collectionHolder = $(this);
            let collectionId = $(this).data('collection-id');
            let parentItem = $collectionHolder.parents('.item:first').length;
            let parentIndex = $collectionHolder.parents('.item:first').data('index');

            //define the index of the collections
            c++;
            let collectionMainIndex = c;
            if (parentItem === 1) {
                collectionMainIndex = parentIndex;
            }

            $(this).data('index', collectionMainIndex);

            let i = 0;
            $collectionHolder.find('.' + collectionId + '-collection-item').each(function () {
                i++;
                $(this).data('index', collectionMainIndex + '' + i);
            });

            let newI = i + 1;
            $collectionHolder.find('.append-' + collectionId).each(function () {
                $(this).data('index', collectionMainIndex + '' + newI);
            });
            $collectionHolder.find('.add-' + collectionId).each(function () {
                $(this).data('index', collectionMainIndex + '' + newI);
            });

            //optional callback function for every collection
            if (typeof prototypeCallback === 'function') {
                prototypeCallback($collectionHolder);
            }

        });

    }

    //add a new collection
    function addCollection($addBtn) {

        //get the collection and the vars from this add button
        let collectionId = $addBtn.data('collection-id');

        let index = $addBtn.data('index');

        let $collectionHolder = $addBtn.parents('.' + collectionId + ':first');
        let prototype = $collectionHolder.data('prototype');
        let name = $collectionHolder.data('collection-name');
        let prototypeName = new RegExp(name, 'g');

        //create a new form and append it to the collection
        let newFormData = prototype
            .replace(prototypeName, index);

        let $newForm = $(newFormData).hide();

        $collectionHolder.find('.append-' + collectionId).append($newForm);

        $newForm.slideDown('slow');

        setIndex();

        //optional callback function for every added input
        if (typeof prototypeAddCallback === 'function') {
            prototypeAddCallback($collectionHolder, index);
        }

    }

    //add button
    $(document).on('click', '.add-collection-item', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        let $this = $(this);
        addCollection($this);
    });

    //remove button
    $(document).on('click', '.remove-collection-item', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        //optional callback function for every collection
        let $thisBtn = $(this);
        let $thisItem = $thisBtn.closest('.item');
        // var confirmRemove = true;
        if (typeof prototypeRemoveCallback === 'function') {
            prototypeRemoveCallback($thisBtn, $thisItem).then(function(answer) {
                if(answer === true || answer === 'true') {
                    setIndex();
                }
            });
        } else {
            $thisItem.slideUp('slow', function () {
                $(this).remove();
                setIndex();
            });
        }
    });

    //init //set the index on the collections
    setIndex();

}

// function prototypeCallback($collectionHolder) {
////
//     $collectionHolder.find('.select').functionForMySelectBoxes();
//
// }

// function prototypeAddCallback($collectionHolder, index) {

//     get an input of your collection with collectionName
//     var inputId = '_collectionName_' + index + '_fieldnamePosition';
//     var $inputPosition = $('input[id*="' + inputId + '"');

//      get the next position number for a new position field
//     var collectionIndex = $collectionHolder.data('index');
//     var newPostionValue = index.replace(collectionIndex, '');
//      set the value for the new postion field
//     $inputPosition.val(newPostionValue);

//      trigger for sub collection add button
//     if($collectionHolder.hasClass('collectionName')) {
//         $collectionHolder.find('.add-subCollectionName').each(function () {
//             if($(this).data('index') === index + '1') {
//                 $(this).trigger('click');
//             }
//         });
//     }
// }

// function prototypeRemoveCallback($btn, $item) {
//
//  this callback has to return false or true
//
//     var defer = $.Deferred();
//
//         $item.slideUp('slow', function () {
//             $(this).remove();
//             defer.resolve("true");
//         });
//
//
//     return defer.promise();
// }

module.exports = {
    prototype: prototype
};