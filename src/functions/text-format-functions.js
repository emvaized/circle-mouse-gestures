function formatSelectedTextForInput(textField, selection, type) {
    /// Supported types:
    /// bold
    /// italic
    /// underline
    /// strike

    let formattedText;

    let sel = selection.toString();
    switch(type) {
        case 'bold':
            formattedText = '<b>' + sel + '</b>';
            break;
        case 'italic':
            formattedText = '<i>' + sel + '</i>';
            break;
        case 'underline':
            formattedText = '<u>' + sel + '</u>';
            break;
        case 'strike':
            formattedText = '<s>' + sel + '</s>';
            break;
        default: return;
    }
    textField.focus();

    let textFieldValue;
    try {
        textFieldValue = textField.value;
    } catch (e) { }

    let isContentEditable = textFieldValue == null || textFieldValue == undefined;
    document.execCommand(isContentEditable ? "insertHTML" : "insertText", false, formattedText);
}