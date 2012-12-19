/*

(c) 2012 Justin Iso

*/


var e_count = 0;
var e_selectedId = 0;
var e_zIndex = 0;

var a_count = 0;
var a_selectedID = 0;

var e_properties = {};
var a_properties = {}; // Level 1: element ID, 2: animation ID & props, 3: animation css

// Selector declarations
var elements = $('.elements');

var activeSelection = 'canvas';

var animationScript = '';
var containerHtml = '';

var properties = [
	'opacity', 
	'font-family', 
	'font-size',
	'font-color',
	'width',
	'height',
	'left',
	'top',
	'background-color',
	'border-width',
	'border-size',
	'border-color',
	'z-index',
];

var defaultStyle = { 
		'position' : 'absolute',
		'border' : '1px dotted black', 
		'box-shadow' : '0 0 0px 0px #1a6be5',
		'-webkit-box-shadow' : '0 0 0px 0px #1a6be5',
		'-moz-box-shadow' : '0 0 0px 0px #1a6be5'
	};

var selectedStyle = {
		'border' : '1px dashed #0763f8',
		'box-shadow' : '0 0 5px 3px #1a6be5',
		'-webkit-box-shadow' : '0 0 5px 3px #1a6be5',
		'-moz-box-shadow' : '0 0 5px 3px #1a6be5'
	};
var hoverStyle = {
		'border' : '1px solid #1a6be5', 
		'box-shadow' : '0 0 5px 1px #1a6be5',
		'-webkit-box-shadow' : '0 0 5px 1px #1a6be5',
		'-moz-box-shadow' : '0 0 5px 1px #1a6be5'
	};



// Element Class
function Element(id) {
	this.id = id;
	this.type = 'rectangle';
	this.text = '';
	this.css = {
			'position': 'absolute',
			'opacity': 1,
			'text': '',
			'width': '50px',
			'height': '50px',
			'left': '50px',
			'top': '50px',
			'z-index': 1
		};
	this.animations = {};
}

Element.prototype.select = function() {	this.css = selectedStyle;	}
Element.prototype.hover = function() {	this.css = hoverStyle;		}
Element.prototype.default = function() {	this.css = defaultStyle;	}







// Animation Class
function Animation(id, elementId, duration) {
	this.id = id;
	this.elementId = elementId;
	this.duration = duration;
	this.displayCss = {};
	this.css = {
			'position': 'absolute',
			'opacity': 1,
			'width': '50px',
			'height': '50px',
			'left': '50px',
			'top': '50px',
			'background-color': 'transparent',
			'border-width': '1',
			'border-style': 'solid',
			'border-color': 'black',
			'z-index': 10};

}




function addElement()
{
	


	$('#content').dblclick(function (e) {

		var outerX = $('#outer').offset().left;
		var outerY = $('#outer').offset().top;

		// Get the mouse position relative to the canvas
		var mouseX = e.pageX - outerX - 25; //  
		var mouseY = e.pageY - outerY - 25; // 

		// TODO: add in a loop so it doesn't create multiple elements with the same #id
		// Increment the element ID and z-index by 1
		e_count++;
		e_zIndex++;

		// Add another entry in the properties array
		e_properties[e_count] = {
			'id': e_count,
			'position': 'absolute',
			'type': 'text',
			'visibility': 'visible',
			'opacity': 1,
			'text': '',
			'width': '50px',
			'height': '50px',
			'left': mouseX,
			'top': mouseY,
			'z-index': e_zIndex,
		};

		window["element_"+e_count] = new Element(e_count);
		


		// Create the div with appropriate classes and id's
		$(document.createElement('div'))
			.appendTo('#outer')
			.attr('id', e_count)
			.draggable({ drag: function () { getProperties(); }})
			.resizable({ resize: function () { getProperties(); }})
			.addClass('elements')
			.css(e_properties[e_count])
			.css(defaultStyle);

	});

}


// Sets the properties of e_properties to the current CSS of the element
// Updates the form to the new properties
function getProperties() {

	var selected = $('#' + String(e_selectedId));
	var selectedcss = e_properties[e_selectedId];

	if(typeof(selectedcss) != 'undefined') {

		// Loops through the css properties, sets each to properties in element array,
		// changes the values in the form
		for (i=0; i<(properties.length); i++) {
			var property = String(properties[i]);

			selectedcss[property] = selected.css(property);
			$('#e_'+property).val(selectedcss[property]);
		} 

		// Exceptions: Change all the properties that are not CSS
		selectedcss['text'] = selected.text();
		$('#e_text').text(selectedcss['text']);

	}
}

// Sets the properties of e_properties to the values input in the form
// Changes the CSS of the element to the 
function setProperties() {

	var selected = $('#' + String(e_selectedId));
	var selectedcss = e_properties[e_selectedId];

	if(typeof(selectedcss) != 'undefined') {

		// Loops through the css properties, sets each to properties in element array,
		// changes the values in the form
		for (i=0; i<(properties.length); i++) {
			var property = String(properties[i]);

			selectedcss[property] = $('#e_'+property).val();
			selected.css({property: selectedcss[property]});
		} 

		selectedcss['text'] = $('#e_text').val();
		selected.text(selectedcss['text']);
	}
}

function addAnimation() {
	
	var a;

	$('#content').on('click', '#addAnimationButton', function (){

		if(typeof(a_properties[a_count]) == 'undefined') {
			a_count = 0;
		}
		else { a_count++; }

		a_properties[a_count] = { 
			'animationId': a_count,
			'elementId' : e_selectedId, 
			'startTime': 0, 
			'duration': 1000, 
			'css': {
				'position': 'absolute',
				'opacity': 1,
				'width': '50px',
				'height': '50px',
				'left': '50px',
				'top': '50px',
				'background-color': 'transparent',
				'border-width': '1',
				'border-style': 'solid',
				'border-color': 'black',
				'z-index': 10}
		};

		a = a_properties[a_count];

		// Add the animation to the cumulative animation scripts
		animationScript = animationScript+'window.setTimeout(function() { $("#'+String(e_selectedId)+'").animate('+a['css']+', '+a['duration']+'); }, '+a['startTime']+')\n';

		// Get the animation
		getAnimation();

		// Add the div that represents an animation
		$('<div id="A'+a_count+'" class="animationIcons" style=" \
				width: 90px; \
				height: 20px; \
				margin-left: -93px; \
				border: 1px dotted blue; \
				font: 11px helvetica; \
				color: gray" >\
			<a href="#"><img src="images/remove.png" /></a>\
			<a href="#animation"><span>Animation</span></a>\
			</div>').appendTo('#'+e_selectedId);
	});

}

function getAnimation() {

	var selected = $('#' + String(e_selectedId));
	var selectedcss = a_properties[a_count]['css'];

	if(typeof(selectedcss) != 'undefined') {

		// Loops through the css properties, sets each to properties in element array,
		// changes the values in the form
		for (i=0; i<(properties.length); i++) {
			var property = String(properties[i]);

			selectedcss[property] = selected.css(property);
			$('#a_'+property).val(selectedcss[property]);
		} 

		// Exceptions
		$('#a_duration').val(selectedcss['duration']);


	}

}

function setAnimation() {

	a_properties[e_selectedId][a_selectedID]['width'] = $('#a_width').val();

}



function buildForm() {

	var selectedElementType;
	var openTabIndex;


	// Gives the form accordion functionality
	$('#accordion').accordion({
		collapsible: true
	});

	// Hides the inputs that appear after an element type is selected
	$('#textForm').hide();


	// When user selects element type, display appropriate form
	$('#e_type').change(function() {

		selectedElementType = $('#e_type').val();

		if (selectedElementType == 'element') {
			$('#textForm').hide();
		}

		else if (selectedElementType == 'shape') {
			$('#textForm').hide();
		}

		else if (selectedElementType == 'text') {
			$('#textForm').fadeIn(1100);
		}

		else if (selectedElementType == 'image') {
			$('#textForm').hide();
		}

	});

	




	// Clears the form when user clicks
	$('input.e_properties').click(function () {
		$(this).val('');
	});

	/*
	// Opens the tab on the sidebar

	openTabIndex = $( "#accordion" ).accordion( "option", "active" );
	
	switch(activeSelection) 
	{
		

		case 'canvas':
			if(openTabIndex!=0) {
				$('#accordion').accordion("activate", 0); }
		case 'element':
			if(openTabIndex!=1) {
				$('#accordion').accordion("activate", 1); }
		case 'animation':
			if(openTabIndex!=2) {
				$('#accordion').accordion("activate", 2); }
	}*/
}


// Rename to createUI()
function modifyElement() {
	
	// Selects the target element oun mousedown
	$('#content').on('mousedown', '.elements', function () {
		e_selectedId = $(this).attr('id');
		getProperties();

		$('#' + e_selectedId).css(selectedStyle);
		$('#e_displayID').html(e_selectedId);

		activeSelection = 'element';

	});

	// Highlights element background on mouseenter
	$('#content').on('mouseenter', '.elements', function () {
		e_hoverID = $(this).attr('id');

		if (e_hoverID == e_selectedId) { $(this).css(selectedStyle); }
		else { $(this).css(hoverStyle); }

		$(this).prepend('<a id="addAnimationButton" href="#"><img id="addAnimationImage" src="images/add.png" /></a>');
		$('#addAnimationButton')
			.css({
				'position': 'absolute',
				'width': '25',
				'height': '25',
				'top': '-14',
				'left': '-14' });

		$('.animationIcons').fadeIn();
	});

	// Returns element to default state on mouseleave
	$('#content').on('mouseleave', '.elements', function () {
		$(this).css(defaultStyle);

		$('a').remove('#addAnimationButton');
		$('.animationIcons').hide();
	});

	$('#e_propertiesForm').change(function() {
		setProperties();
	});

}

function modifyAnimation() { 

}


function deleteElement() {

	// Adds a delete button on hover
	$('#content').on('mouseenter', '.elements', function () {
		$(this).prepend('<a id="deleteButton" href="#"><img id="deleteImage" src="images/delete.png" /></a>');
		$('#deleteButton')
			.css({
				'position': 'absolute',
				'width': '25',
				'height': '25',
				'top': '-14',
				'right': '-14' })
			.click(function (){
				$('#' + e_hoverID).remove();
			});
	});

	$('#content').on('mouseleave', '.elements', function () {
		$('a').remove('#deleteButton');
	});

	// Clear the form
	document.forms['e_propertiesForm'].reset();

}





/*

// Animation Class
function Animation(id, elementId, duration) {
	this.id = id;
	this.elementId = elementId;
	this.duration = duration;
	this.css = {
			'position': 'absolute',
			'opacity': 1,
			'width': '50px',
			'height': '50px',
			'left': '50px',
			'top': '50px',
			'background-color': 'transparent',
			'border-width': '1',
			'border-style': 'solid',
			'border-color': 'black',
			'z-index': 10};

}

Animation.prototype.addToDOM = function() {
	
	
}

// Creating dynamic instances of Animation objects
window['animation_'+a_count] = new Animation(a_count, e_selectedId, 1000);

*/



// When the document loads, call all functions
$(document).ready(function () {

	buildForm();
	addElement();
	addAnimation();
	modifyElement();
	deleteElement();

});





