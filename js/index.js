$( "#btnCreate" ).click(function() {
var DeckNM =prompt("Please enter a deck name.") ;

const newItem = $("<li>").text(DeckNM);
            $("#Decks").append(newItem);
});

$( "#btnTomorrow" ).click(function() {
var mytext = moment().add(1,'day').format("DD/MM/YYYY");
$("#iptNextReview").val(mytext);
});

$( "#btnDouble" ).click(function() {
var a = moment($("#iptPreviousReview").val(),"DD/MM/YYYY");
var b = moment($("#iptNextReview").val(),"DD/MM/YYYY");
var diff=b.diff(a, 'days');
var mytext = moment().add(diff*2,'day').format("DD/MM/YYYY");
$("#iptNextReview").val(mytext);
});

$( "#btnAdd1Day" ).click(function() {
var oldText = $("#iptNextReview").val();
if(oldText===''){
    var oldDate =moment();
}else{
    var oldDate = moment(oldText,"DD/MM/YYYY");
}
var newDate = oldDate.add(1,'day');
var newText = newDate.format("DD/MM/YYYY");
$("#iptNextReview").val(newText);
});

$( "#btnAnswer" ).click(function() {
    $("#answer").toggle();
});

$( "#btnLinkWindow" ).click(function() {
    var mytext = $("#text").val();
    $("#view").html(mytext);
    $("#view").toggle();
});

$( "#btnGotoLink" ).click(function() {
    var mytext = $("#text").val();
    window.open(mytext,'_blank');
});

$( "#btnSave" ).click(function() {
    saveUpdate();
});

$("#btnPrint").click(() => {
    print($("#text").val());
});

$("#btnPrintHelp").click(() => {
    print($("#divhelp").text());
});

$('body').on('click', '#AllList li', function () {
    const key=$(this).text();
    readObject(key);
});

$('body').on('click', '#Decks2 li', function () {
    const key=$(this).text();
    readObject(key);
});

$('body').on('dblclick', '#Decks li', function () {
    const DeckNM=$(this).text();
    updateCardList(DeckNM);
});

$('body').on('click', 'ul li', function () {
    $('ul li.selected').removeClass('selected');
    $(this).closest('li').addClass('selected');
})

function getCardsinDeck(DeckNM){
    var keysDeck = [];
    	Object.keys(localStorage).forEach(function(each){
    		var object = readObject(each);
    		var DesireDeck = object.DeckNM;
    		if (DesireDeck === DeckNM) {
    			keysDeck.push(each);
    		}
    	});
    	return keysDeck;
}

function saveObject(){
    // get deck
    var deck = $('ul li.selected').text();
    // get card name
    var CardNM = $("#iptCardNM").val();
    // get previous date
    var previousreview = moment().format('DD/MM/YYYY');
    // get next date
    var nextreview = $("#iptNextReview").val();
    // get text
    var mytext = $("#text").val();
    var myanswer = $("#answer").val();
    var object={DeckNM:deck,cardNM:CardNM,previousReview:previousreview, nextReview:nextreview, text:mytext, answer:myanswer};
    console.log(object);
    //turning the object to a string
    const string=JSON.stringify(object);
    //save the string
    console.log(string);
    localStorage.setItem(CardNM,string);
}
function readObject(key){
    const string=localStorage.getItem(key);
    const object=JSON.parse(string);
    $("#text").val(object.text);
    $("#answer").val(object.answer);
    $("#iptCardNM").val(object.title||object.cardNM);
    $("#iptPreviousReview").val(object.previousReview);
    $("#iptNextReview").val(object.nextReview);
    return object;
}
function saveUpdate(){
    var cardNM = $("#iptCardNM").val();
    saveObject();//save selection
    deleteAllList();
    updateAllList();
    deleteList2();
    updateList2();
    //reselect selection
}

function updateCardList(DeckNM){
    const CardNM = getCardsinDeck(DeckNM);
    deleteCard();
    CardNM.forEach(function(each) {
    		const newItem = $("<li>").text(each);
    		$("#cards").append(newItem);
    })
    $('#divcard').toggle();
}

function updateAllList(){
    const keys=Object.keys(localStorage).sort();
    //putting the keys into the AllList
   keys.forEach(function(eachKey) {
        const newItem = $("<li>").text(eachKey);
        $("#AllList").append(newItem);
   })
}

function updateList(){
    const deckNames = getAllDeckNames();
    deckNames.forEach(function(each) {
    		const newItem = $("<li>").text(each);
    		$("#Decks").append(newItem);
    })
}

function updateList2(){
    const keys=keysDue().sort();
    //putting the keys into the list2
    keys.forEach(function(eachKey) {
    		const newItem = $("<li>").text(eachKey);
    		$("#Decks2").append(newItem);
    })
}

function getAllDeckNames(){
    var result =new Set();
    Object.keys(localStorage).forEach(function(each){
        var object = readObject(each);
        var deckName = object.DeckNM;
        if(deckName){
            result.add(deckName);
        }
    });
    return Array.from(result);
}
function keysDue() {
	var keysDue = [];
	Object.keys(localStorage).forEach(function(each){
		var object = readObject(each);
		var nextReview = moment(object.nextReview,'DD/MM/YYYY');
		var todayDate = moment();
		if (nextReview.isSameOrBefore(todayDate)) {
			keysDue.push(each);
		}
	});
	return keysDue;
}
function deleteCard(){
    $('#cards').empty();
}
function deleteAllList(){
    $('#AllList').empty();
}
function deleteList(){
    $('#Decks').empty();
}
function deleteList2(){
    $('#Decks2').empty();
}
function deletekey(){
    var txt;
    if (confirm("Are you sure to delete it?")) {
        txt = "You pressed delete!";
        var title = $("#iptCardNM").val();
        localStorage.removeItem(title);
        location.reload();
    }
    else {
        txt = "You pressed Cancel!";
    }
    document.getElementById("delete").innerHTML = txt;
}
function helpkey(){
    $('#divhelp').toggle();
}
function helpclose(){
     $('#divhelp').toggle();
}
function eventKeyDown(event) {
	if (event.ctrlKey) {
		if (event.key === "s") {
			const txa = event.target;
			console.log("Ctrl s");
			event.preventDefault();
			event.stopPropagation();
			saveUpdate();
		}
	}
}
function print(sText) {
	if (!sText) {
		alert("No text to print");
		return this;
	}
	const html = `
			<style>
				.plainText {
					white-space: pre-wrap;
				}
			</style>
			<div class="plainText">
			${sText}
			</div>`;
	const newWindow = window.open("", "PrintWindow", "width=500,height=500,top=200,left=200,menubar=no,toolbars=no,scrollbars=no,status=no,resizable=no");
	newWindow.document.writeln(html);
	newWindow.document.close();
	newWindow.focus();
	newWindow.onafterprint = function () {
		newWindow.close();
	};
	newWindow.print();
}

$("#text").on("keydown", eventKeyDown);
$(document).ready(function() {
    deleteAllList();
	updateAllList();
	deleteList2();
	updateList2();
	deleteList();
	updateList();
	initializeWgo();
	initializeVideo();
})

function loadFileAsText() {
   var fileToLoad = document.getElementById("fileToLoad").files[0];
   var fileReader = new FileReader();
   fileReader.onload = function (fileLoadedEvent) {
      var textFromFileLoaded = fileLoadedEvent.target.result;
      document.getElementById("text").value = textFromFileLoaded;
   };
   var text = fileReader.readAsText(fileToLoad, "UTF-8");
   $("#text").val(text);
}

let wgoPlayer;

function initializeWgo() {
   const element = document.getElementById("wgo");
   wgoPlayer = new WGo.BasicPlayer(element, {
      sgfFile: "wgo/1927-11-23.sgf",
   });
}
function initializeVideo(){
    tutorial.style.visibility = "visible";
    tutorial.style.opacity = 1;
}
$('#btnWgo').click(()=> {
   wgoPlayer.config.sgf = $("#text").val();
   delete wgoPlayer.config.sgfFile;
   wgoPlayer.initGame();
});