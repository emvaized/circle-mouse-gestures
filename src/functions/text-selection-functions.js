function isCoordinateWithinTextSelection(dx, dy) {
    let textSelectionData = getSelectionRectDimensions();

    if (dx > textSelectionData.dx && dx < textSelectionData.dx + textSelectionData.width
        && dy > textSelectionData.dy && dy < textSelectionData.dy + textSelectionData.height) {
        return true;
    } else {
        return false;
    }

}

/// Returns data for text selection rect
function getSelectionRectDimensions() {
    var sel = document.selection, range;
    var width = 0, height = 0;
    var dx = 0, dy = 0;
    if (sel) {
        if (sel.type != "Control") {
            range = sel.createRange();
            var rect = range.getBoundingClientRect();
            width = range.boundingWidth;
            height = range.boundingHeight;
            dx = rect.left;
            dy = rect.top;
        }
    } else if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            if (range.getBoundingClientRect) {
                var rect = range.getBoundingClientRect();
                width = rect.right - rect.left;
                height = rect.bottom - rect.top;
                dx = rect.left;
                dy = rect.top;
            }
        }
    }
    return { width: width, height: height, dx: dx, dy: dy };
}


/// Used for both "select all" and "select more" actions
function selectAllText(el) {
    var doc = document, range, selection;

    if (doc.body.createTextRange) { //ms
        range = doc.body.createTextRange();
        if (el) {
            range.moveToElementText(el);
        } else {
            // let parentNode = selection.anchorNode.parentNode;
            let parentNode = selection.anchorNode !== selection.focusNode ? selection.anchorNode.parentNode.parentNode : selection.anchorNode.parentNode;
            range.moveToElementText(parentNode);
        }
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();
        range = doc.createRange();
        if (el) {
            range.selectNodeContents(el);
        } else {
            console.log(selection.anchorNode !== selection.focusNode);
            // let parentNode = selection.anchorNode.parentNode;
            let parentNode = selection.anchorNode !== selection.focusNode ? selection.anchorNode.parentNode.parentNode : selection.anchorNode.parentNode;
            range.selectNodeContents(parentNode);
        }
        selection.removeAllRanges();
        selection.addRange(range);
    }
}