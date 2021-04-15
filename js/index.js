$( "#btnCreate" ).click(function() {
var Decks =prompt("Please enter a deck name.") ;
const newItem = $("<li>").text(Decks);
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

$('body').on('click', '#Decks2 li', function () {
        const key=$(this).text();
        readObject(key);
});

$('body').on('click', 'ul li', function () {
    $('ul li.selected').removeClass('selected');
    $(this).closest('li').addClass('selected');
})

function saveObject(){
    // get decks
    var Decks = $('ul li.selected').text();
    // get cards
    var Cards = $("#iptCards").val();
    // get previous date
    var previousreview = moment().format('DD/MM/YYYY');
    // get next date
    var nextreview = $("#iptNextReview").val();
    // get text
    var mytext = $("#text").val();
    var myanswer = $("#answer").val();
    var object={decks:Decks,cards:Cards,previousReview:previousreview, nextReview:nextreview, text:mytext, answer:myanswer};
    console.log(object);
    //turning the object to a string
    const string=JSON.stringify(object);
    //save the string
    console.log(string);
    localStorage.setItem(Cards,string);
}
function readObject(key){
    const string=localStorage.getItem(key);
    const object=JSON.parse(string);
    $("#text").val(object.text);
    $("#answer").val(object.answer);
    $("#iptCards").val(object.title||object.cards);
    $("#iptPreviousReview").val(object.previousReview);
    $("#iptNextReview").val(object.nextReview);
    return object;
}
function saveUpdate(){
    var card = $("#iptCards").val();
    saveObject();//save selection
    deleteList2();
    updateList2();
    //reselect selection
}

function updateList2(){
    //get the key from all the localStorage
    const keys=keysDue().sort();
    //putting the keys into the list2
    keys.forEach(function(eachKey) {
    		const newItem = $("<li>").text(eachKey);
    		$("#Decks2").append(newItem);
    })
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

function deleteList2(){
    $('#Decks2').empty();
}
function deletekey(){
    var txt;
    if (confirm("Are you sure to delete it?")) {
        txt = "You pressed delete!";
        var title = $("#iptCards").val();
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
	deleteList2();
	updateList2();
})

function loadFileAsText(){
  var fileToLoad = document.getElementById("fileToLoad").files[0];

  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent){
      var textFromFileLoaded = fileLoadedEvent.target.result;
      document.getElementById("text").value = textFromFileLoaded;
  };

  fileReader.readAsText(fileToLoad, "UTF-8");
}