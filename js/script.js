$(document).ready(()=>{
    $("#canvas").append("<h2 class='text-center' style='margin: 200px'>Click for Start Game</h2>");
    $("#canvas").click(startGame);
});

var targets = {target: []};
var totalScore = 0;
var totalTargets = 0;
var targetColor = ["target-red", "target-yellow", "target-green"];
var setIntervalMoveTargets;
var setIntervalCheckTargets;
var gamePlay = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}   

const startGame =()=>{
    $("#canvas").html("");
    $("#canvas").css("cursor","crosshair");
    $("#canvas").unbind("click");
    gamePlay = true;
    showStarterTarget();
    setIntervalMoveTargets = setInterval(moveTargets, 50);
}

const showStarterTarget = async()=>{
    for(let i = 0; i<5 && gamePlay; i++){
        totalTargets+=1;
        let randomColor = parseInt(Math.random()*3);
        let cursorWidth = $("#canvas").width();
        let left = parseInt(Math.random()*((cursorWidth-60)))+"px";
        $("#canvas").append("<div id='target-"+totalTargets+
                            "' class='ballon "+targetColor[randomColor]+
                            "' style='bottom: 0px; left: "+left+
                            "'></div>");
        $("#target-"+totalTargets).bind("click", {id: totalTargets}, destroy);
        targets["target-"+totalTargets]={speed: parseInt(Math.random()*10+1), bottom: 10};
        targets.target.push(totalTargets);
        await sleep(1000);
    }
    checkTargets()
    if(gamePlay)
        setIntervalCheckTargets = setInterval(checkTargets, 2000);
}

const checkTargets = async ()=>{
    for(let i=0; i<5 && gamePlay;i++){
        if(targets.target[i]==undefined){
            totalTargets+=1;
            let randomColor = parseInt(Math.random()*3);
            let cursorWidth = $("#canvas").width();
            let left = parseInt(Math.random()*((cursorWidth-60)))+"px";
            $("#canvas").append("<div id='target-"+(i+1)+
                                "' class='ballon "+targetColor[randomColor]+
                                "' style='bottom: 0px; left: "+left+
                                "'></div>");
            $("#target-"+(i+1)).bind("click", {id: i+1}, destroy);
            targets["target-"+(i+1)]={speed: parseInt(Math.random()*10+1), bottom: 10};
            targets.target[i] = i+1;
            await sleep(1000)
        }
    }
}

function moveTargets() {
    try {
        targets.target.forEach(s=>{
            if(gamePlay) {
                let currentPos = $("#target-"+s).css("bottom");
                let bottom = parseInt(currentPos);
                bottom += targets["target-"+s].speed;
                $("#target-"+s).css("bottom", bottom+"px");
                targets["target-"+s].bottom = bottom;
                if(bottom>400){
                    window.clearInterval(setIntervalCheckTargets);
                    window.clearInterval(setIntervalMoveTargets);
                    gamePlay = false;
                    alert("Your score: "+totalScore);
                    targets = {target: []};
                    totalScore = 0;
                    totalTargets = 0;
                    $("#canvas").html("");
                    $("#canvas").append("<h2 class='text-center' style='margin: 200px'>Click for Restart Game</h2>");
                    $("#canvas").click(startGame);
                }        
            }
        });
    } catch (error) {}
}

const destroy = async (event)=> {
    $("#target-"+event.data.id).remove();
    delete targets.target[event.data.id-1];
    delete targets["target-"+event.data.id];
    
    // Pontszám növelése
    totalScore += 1;
    
    // Frissítjük a kijelzőt az HTML-ben
    $("#score-display").text("Pontszám: " + totalScore);
}
