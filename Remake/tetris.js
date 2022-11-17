//dom
import BLOCKS from "./blocks.js"

const playground = document.querySelector(".playground > ul");
const gametext = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");
//setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

//variables
let score = 0;
let duration = 500; //블럭이 떨어지는 시간
let downInterval; //떨어지는 인터벌
let tempMovingItem; // moving실행전 잠깐 담아두는 것



const movingItem={
    //블록의 타입과 정보를 가지고있다
    type :"",
    direction :1, // 블록 돌리는 축의 기준
    top :0, // 어디까지 내려가야하는지
    left : 3, // 좌우 어디까지 가야하는지
}

init();

//function
function init(){
    //시작화면
   
    tempMovingItem={...movingItem};//스프레이드 오퍼레이터 값만 가져와 넣는다
    for(let i=0;i<GAME_ROWS;i++){
        prependNewLine();
    } 
    generateNewBlock();
}

function prependNewLine(){
        const li = document.createElement("li");
        const ul = document.createElement("ul");
          for(let j=0;j<GAME_COLS;j++){
              const matrix=document.createElement("li");
              ul.prepend(matrix);
          }
          li.prepend(ul)
          playground.prepend(li)
      
      
}

function renderBlocks(moveType=""){
    const {type,direction,top,left}=tempMovingItem;//디스트럭션
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type,"moving");
    });
    
    BLOCKS[type][direction].some(block=>{  
        const x = block[0]+ left;
        const y = block[1] + top;
                                            //chilidNOde의 0번이 ul 맨위 한줄이 된다
        
        const target = playground.childNodes[y]?playground.childNodes[y].childNodes[0].childNodes[x]:null;
        const isAvaliable = checkEmpty(target);        
        if(isAvaliable){
        target.classList.add(type,"moving");
        }else{
            tempMovingItem = {...movingItem}
            if(moveType==='retry'){
                clearInterval(downInterval);
                showGameOverText()
            }
            setTimeout(()=>{
                renderBlocks('retry');    
                if(moveType === "top"){
                    seizeBlock();
                }
            },0)
        //renderBlocks();
        return true;
        }
    })
   movingItem.left=left;
   movingItem.top=top;
   movingItem.direction=direction;
}

function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    });
    checkMatch();
  
}
function checkMatch(){
    
    const childNodes = playground.childNodes;
    childNodes.forEach(child =>{
        let matched = true;
        child.childNodes[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched=false;
            }
        });
        if(matched){
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerText = score;
        }
    });
    
    
    generateNewBlock()

}
function generateNewBlock(){

    clearInterval(downInterval);
    downInterval =setInterval(() => {
        moveBlock("top",1)
    }, duration);


    const blockArray =Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random()*blockArray.length);
    
    movingItem.type=blockArray[randomIndex][0]
   movingItem.top = 0;
   movingItem.left = 3;
   movingItem.direction = 0;
   tempMovingItem ={...movingItem};
   renderBlocks()

}



function checkEmpty(target){
    if(!target||target.classList.contains("seized")){
        return false;
    }
    return true;
}





function moveBlock(moveType,amount){
    tempMovingItem[moveType] += amount; // left는 
    renderBlocks(moveType)
}
function changeDirection(){
    const direction = tempMovingItem.direction;
    direction ===3? tempMovingItem.direction=0 : tempMovingItem.direction+=1
    renderBlocks()

}
function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top",1)
    }, 10);
}

function showGameOverText(){
    gametext.style.display ="flex";
}

//event handling
document.addEventListener("keydown",e=>{
    switch(e.keyCode){
        case 39:
            moveBlock("left",1);
            break;
        case 37:
            moveBlock("left",-1);
            break;
        case 40:
            moveBlock("top",1);
            break;
         case 38:
            changeDirection();
            break;
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
})


restartButton.addEventListener("click",()=>{
    playground.innerHTML ="";
    gametext.style.display ="none";
    init()
})