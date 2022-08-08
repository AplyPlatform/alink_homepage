
$(function(){ 
  InitARS();
});

function InitARS() {

    const sceneEl = document.querySelector('a-scene');
    const exampleTarget = document.querySelector('#card-object-target');
    // arReady event triggered when ready
    sceneEl.addEventListener("arReady", (event) => {

    });

    // arError event triggered when something went wrong. Mostly browser compatbility issue
    sceneEl.addEventListener("arError", (event) => {

    });

    // detect target found
    exampleTarget.addEventListener("targetFound", event => {
        console.log("target found");
    });

    // detect target lost
    exampleTarget.addEventListener("targetLost", event => {
        console.log("target lost");
    });
}
