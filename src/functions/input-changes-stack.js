/// Buggy, disabled for now

var undoStack = [{
    value: '',
    selectionStart: 0,
    selectionEnd: 0
}];
var undoPosition = 0;
var listenedInput;

function addInputChangesListener(input) {
    if (listenedInput == input) return;
    console.log('adding listener to input...');
    undoStack = [];
    undoPosition = 0;
    listenedInput = input;
    input.addEventListener("change", function () {
        console.log('listened input field changed value');
        var undoItem = {
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd
        };
        undoStack.length = ++undoPosition;
        undoStack.push(undoItem);
    });
}

function restoreUndoItem(item) {
    listenedInput.value = item.value ?? '';
    listenedInput.selectionStart = item.selectionStart;
    listenedInput.selectionEnd = item.selectionEnd;
}

function doUndo(input) {
    console.log('trying to do undo...');
    console.log('undoPosition:');
    console.log(undoPosition);
    console.log('undoStack')
    try {
        if (undoPosition > 0) {
            restoreUndoItem(undoStack[--undoPosition], listenedInput);
        }
        listenedInput.focus();
    } catch (e) { console.log(e); }

}

function doRedo() {
    if (undoPosition < undoStack.length - 1) {
        restoreUndoItem(undoStack[++undoPosition], listenedInput);
    }
    listenedInput.focus();
}

function checkIfCanUndo() {
    return undoStack.length > 0;
}

function checkIfCanRedo() {
    return undoPosition < undoStack.length - 1;
}