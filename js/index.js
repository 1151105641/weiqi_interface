$( "#btnTomorrow" ).click(function() {
var mytext = moment().add(1,'day').format("DD/MM/YYYY");
$("#iptNextReview").val(mytext);
});

$( "#btnDayAfTomorrow" ).click(function() {
var mytext = moment().add(2,'day').format("DD/MM/YYYY");
$("#iptNextReview").val(mytext);
});

$( "#btnAdd1" ).click(function() {
debugger;
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

$( "#btnTest" ).click(function() {
    console.log(keysDue());
});

$( "#btnLinkWindow" ).click(function() {
    var mytext = $("#text").val();
    $("#view").html(mytext);
    $("#view").toggle();
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

$('body').on('click', 'li', function () {
        const key=$(this).text();
        readObject(key);
    });
function saveObject(){
    // get title
    var title = $("#iptTitle").val();
    // get previous date
    var previousreview = moment().format('DD/MM/YYYY');
    // get next date
    var nextreview = $("#iptNextReview").val();
    // get text
    var mytext = $("#text").val();
    var object={title:title,previousReview:previousreview, nextReview:nextreview, text:mytext};
    console.log(object);
    //turning the object to a string
    const string=JSON.stringify(object);
    //save the string
    console.log(string);
    localStorage.setItem(title,string);
}
function readObject(key){
    const string=localStorage.getItem(key);
    const object=JSON.parse(string);
    $("#text").val(object.text);
    $("#iptTitle").val(object.title);
    $("#iptPreviousReview").val(object.previousReview);
    $("#iptNextReview").val(object.nextReview);
    return object;
}
function saveUpdate(){
    var title = $("#iptTitle").val();
    saveObject();//save selection
    deleteList();
    deleteList2();
    updateList();
    updateList2();
    //reselect selection
}
function updateList(){
    //get the key from all the localStorage
    const keys=Object.keys(localStorage);
    //putting the keys into the list
    keys.forEach(function(eachKey) {
    		const newItem = $("<li>").text(eachKey);
    		$("#ulkeys").append(newItem);
    })
}
function updateList2(){
    //get the key from all the localStorage
    const keys=keysDue();
    //putting the keys into the list2
    keys.forEach(function(eachKey) {
    		const newItem = $("<li>").text(eachKey);
    		$("#ulkeys2").append(newItem);
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
function deleteList(){
    $('#ulkeys').empty();
}
function deleteList2(){
    $('#ulkeys2').empty();
}
function deletekey(){
    var txt;
    if (confirm("Are you sure to delete it?")) {
        txt = "You pressed delete!";
        var title = $("#iptTitle").val();
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
	deleteList();
	deleteList2();
	updateList();
	updateList2();
})