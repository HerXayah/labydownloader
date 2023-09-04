export function jsonHelp(file) {

    input = JSON.parse(file);

    inputOBJ = JSON.stringify(input);

    // get key assetIndex from inputOBJ
    let assetIndex = inputOBJ.assetIndex;


    // create a new json object
    let json = {
        "assetIndex": assetIndex,
        





}