var context, productImage, canvas;
var startX, startY, endX, endY;
var heatMap = new Array();
var parts = new Array();
var currentlyDrawingPanel = false;
var isEditing = false;
var partEditing = 1;

/*
 * TODO:
 * Add circle support
 * Add where you can remove/edit parts already created
 * Add a naming system so you can customize the name
 */

/*
 * Documentation:
	 * Formatting of heatMap array:
	 * Each array element will consist of 5 parts for rectangles, and 4 parts for circles
	 * ==Rectangles==
	 * 	['rect', topLeftX, topRightY, bottomRightX, bottomRightY]
	 * ==Circles==
	 * ['circ', centerX, centerY, radius]
	 * 
	 * To find the amount of parts inside of a heatmap, run a for loop adding a part each time str 'circ' or 'rect' is found
 */


function submit()
{
	// This called when product map is done and the user pushes the submit button.
	// 'parts' will be an array arranged like this:
	// 1st element:  Part number, written like this 'part_num:$part'
	// 2nd element:  An ARRAY of integers, marking the upper left, bottom right bounds of the parts
	// 		I.E.
	//		[100, 200, 400, 500] would mean 'This part starts at (100, 200) and ends at (400, 500)
	//		You can calculate the amount of parts highlighted in this heat map by heatMap.length/4.
	//		If the part is located in more than one location, the array will consist of multiple sets of these coordinates.
	//		I.E.
	//		[1,2,3,4,5,6,7,8] would indicate a heatmap with 2 parts.
	//		[1,2,3,4,5,6,7,8,9,10,11,12] would indicate 3 parts.
	//		etc...
	//	
	// This format will repeat for all of the parts.  You can figure out the total amount of parts located on the image by
	// calling parts.length/2 (Since there is string for the part number, and an embedded array for the heatmap per part)
	//
	// You can always call parts and heatMap on the console while editing a test product for more information.		
	
	setSystemMessage("Product Submitted.");
	
	$("#donePartButton").button("disable");
	$("#undoAction").button("disable");
	$('#submitFinished').button("disable");
	
	parts=new Array();
	$("#accordion").get(0).innerHTML = "";
	partEditing=1;
}

function init()
{
	$("#accordion").accordion({
    	active: false,
    	collapsible: true            
	});  
	
	$("#radio").buttonset();
	
	$("#donePartButton").button();
	$("#createPartButton").button();
	$('#setPartNameButton').button();
	$('#undoAction').button();
	$('#submitFinished').button();
	$('#partNameButton').button();

	$("#createPartButton").button("enable");
	$("#donePartButton").button("disable");
	$("#undoAction").button("disable");
	$('#submitFinished').button("disable");

	setSystemMessage('Begin by adding the first part.');

	$(function() {
		$("#dialog").dialog({
			autoOpen : false,
			show : {
				effect : "blind",
				duration : 300
			},
			hide : {
				effect : "explode",
				duration : 300
			},
			width:400
		});
	}); 

	buildCanvas();
	
	// Set position of buttons relative to the current image map on the canvas
	updateStyling();
	$('#outlineBorder').css('width', parseInt($("#canvas").attr('width')) + 100);
	$("label[for='radio1']").attr('aria-pressed', 'true');
	setPartNameOnUI(partEditing);

}

function setSystemMessage(_string)
{
	$("#systemMessage").get(0).innerHTML = 	'<p><span id="systemMessageHTML" class="ui-icon ui-icon-info" style="float: left; margin-right: .3em; margin-left: .3em;"></span>'+_string+'</p>';
}

function buildCanvas()
{
	// Grab canvas element
	canvas = $("#canvas").get(0);
	
	// Create canvas context
	context = canvas.getContext("2d");
	context.font = "24px Arial";
	
	// Create product image object
	productImage = $("#productImage").get(0);
	canvas.setAttribute('width', productImage.width);
	canvas.setAttribute('height', productImage.height);
	
	addListeners();
}

// function loadJSON()
// {
	// json = jQuery.parseJSON("{ \"product\": { \"product_number\":\"DCB1\", \"parts\": [ { \"part\": { \"part_number\":\"B101584\", \"description\":\"Front Panel\", \"heatMap\":[ { \"map\": { \"start\":[260,179], \"end\":[351,339] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101642\", \"description\":\"Right Side Panel Assembly\", \"heatMap\":[ { \"map\": { \"start\":[506,172], \"end\":[552,317] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101641\", \"description\":\"Left Side Panel Assembly\", \"heatMap\":[ { \"map\": { \"start\":[183,129], \"end\":[221,227] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101582\", \"description\":\"Rear Brace\", \"heatMap\":[ { \"map\": { \"start\":[454,90], \"end\":[554,124] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101633\", \"description\":\"Cart shield stainless steel\", \"heatMap\":[ { \"map\": { \"start\":[335,159], \"end\":[427,183] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101473\", \"description\":\"Grease Cup (not used with Q Series grills)\", \"heatMap\":[ { \"map\": { \"start\":[423,137], \"end\":[447,157] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101414\", \"description\":\"Plastic Base\", \"heatMap\":[ { \"map\": { \"start\":[295,353], \"end\":[497,420] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101416\", \"description\":\"Caster with Brake\", \"heatMap\":[ { \"map\": { \"start\":[253,457], \"end\":[283,477] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101417\", \"description\":\"Caster without Brake\", \"heatMap\":[ { \"map\": { \"start\":[466,444], \"end\":[488,463] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B064791\", \"description\":\"Cylinder Retainer\", \"heatMap\":[ { \"map\": { \"start\":[221,167], \"end\":[253,182] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101565\", \"description\":\"Base Support Bracket - Right\", \"heatMap\":[ { \"map\": { \"start\":[178,87], \"end\":[231,120] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101495\", \"description\":\"Base Support Bracket - Left\", \"heatMap\":[ { \"map\": { \"start\":[497,137], \"end\":[547,161] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101635\", \"description\":\"Channel, Edge Protector\", \"heatMap\":[ { \"map\": { \"start\":[286,173], \"end\":[319,185] } }], \"product_link\":\"http://<link_to_product>\" } } ] } }");
// 	
	// $("#product_number").html(json.product.product_number);
	// $("#number_of_parts").html(json.product.parts.length);
// }

function confirmDialog()
{
	$('#dialog').dialog('open');
}

function writeMousePos(evt)
{
	//var mousePos = getMousePos(evt);
	
	// Clear Canvas
	context.beginPath();
	context.fillStyle = 'white';
	context.rect(0, 0,canvas.width, canvas.height);
	context.fill();
	
	// Draw the product image and mouse pos
	context.drawImage(productImage, 0, 0);
	//context.fillText("Mouse Pos: (" + x + ", " + y + ")", 505, 590);
}

function addItemToAccordian(_title, _description)
{
	// How to use accordion:  
  	// For new section:
  	// <h3>title_here</h3>
	// <div>
		// <p>
			// content
		// </p>
	// </div>	
	$('#submitFinished').button("enable");

	$("#accordion").append("<h3>"+_title+"</h3><div><p>"+_description+"</p></div>");
	
	$("#accordion").accordion("refresh");  
	

	updateStyling();
}

function updateStyling()
{
	// Set position of buttons relative to the current image map on the canvas
	$('#radio').css('left', (parseInt($('#canvas').attr('width')) + parseInt($('#canvas').get(0).offsetLeft) - $('#radio').width() - 6) + "px");
	$('#radio').css('top', (parseInt($('#canvas').get(0).offsetHeight) - $('#radio').height() + 18) + "px");
	$('#partNameButton').css('left', (parseInt($('#canvas').get(0).offsetLeft) + 7) + "px");	
	$('#partNameButton').css('top', (parseInt($('#canvas').get(0).offsetHeight) - parseInt($('#partNameButton').height() - 18) + "px"));
}
function fireStart()
{
	setSystemMessage("Click to begin selecting an area around part " + partEditing + ".");
	enableEditingButtons();
	isEditing = true;
}

function enableEditingButtons()
{
	$("#createPartButton").button("disable");
	$("#donePartButton").button("enable");
	$("#undoAction").button("enable");
}

function onClick(evt) {
	var mousePos = getMousePos(evt);
	if(isEditing)
	{
		if(!currentlyDrawingPanel)
		{
			if($("label[for='radio1']").attr('aria-pressed') == 'true') // If rectangle
			{
				heatMap[heatMap.length] = 'rect';
				startX=mousePos.x-1;startY=mousePos.y-1;
				currentlyDrawingPanel=true;
				setSystemMessage("Select an ending area around part " + partEditing + ".");
			} 
			else if ($("label[for='radio2']").attr('aria-pressed') == 'true') // If circle
			{
				heatMap[heatMap.length] = 'circ';
				startX=mousePos.x-1;startY=mousePos.y-1;
				currentlyDrawingPanel=true;
				setSystemMessage("Drag to the left or right to increase the circle area for part " + partEditing + ".");
			}
		} else {
			if($("label[for='radio1']").attr('aria-pressed') == 'true') // If rectangle
			{
				endX=mousePos.x;endY=mousePos.y;
				// Save the rect to the array heatMap
				heatMap[heatMap.length] = startX;
				heatMap[heatMap.length] = startY;
				heatMap[heatMap.length] = endX;
				heatMap[heatMap.length] = endY;
			}
			else if ($("label[for='radio2']").attr('aria-pressed') == 'true') // If circle
			{
				var radius = Math.abs(mousePos.x - startX)/2;
				// heatMap[heatMap.length] = startX + radius;
				// heatMap[heatMap.length]= startY + radius;
				// heatMap[heatMap.length]= radius;
				
				heatMap[heatMap.length] = parseInt((Math.abs(startX - mousePos.x)/2)+startX);
				heatMap[heatMap.length]= parseInt((Math.abs(startY - mousePos.y)/2)+startY);
				heatMap[heatMap.length]= parseInt((Math.abs(startX-mousePos.x)/2));
			}

			currentlyDrawingPanel=false;
			setSystemMessage("Select another area or push done to finish editing part " + partEditing + ".");
		}
	}
}

function undoAction()
{
	heatMap.splice(heatMap.length-4, 4);
	writeMousePos();
    drawActiveRects();
    if(heatMap.length < 1)
    {
		$('#submitFinished').button("disable");
    }
}

function addPart()
{
	isEditing=false;
	$("#createPartButton").button("enable");
	$("#donePartButton").button("disable");
	$("#undoAction").button("disable");
	parts[parts.length] = "part_num:" + ($('#partNameText').val());
	parts[parts.length] = heatMap;
	
	var description = "Part Locations:<br/>";
	for(var i = 0; i < heatMap.length; i=i+5)
	{
		if(heatMap[i] == 'rect') // If rectangle
		{
			description+="Rectangle: {"+heatMap[i+1]+", "+heatMap[i+2]+", "+heatMap[i+3]+", "+heatMap[i+4]+"}<br/>";
		}
		else if (heatMap[i] == 'circ') // If circle
		{
			description+="Circle: {centerX: "+heatMap[i+1]+", centerY: "+heatMap[i+2]+", radius: "+heatMap[i+3]+"}<br/>";
			i--;
		}
	}
	
	addItemToAccordian("Part Name: " + ($('#partNameText').val()), description);
	
	heatMap = new Array();
	partEditing++;
	setPartNameOnUI(partEditing);
	setSystemMessage("Add part " + partEditing + " or push submit to complete this product map.");
	writeMousePos();
    drawActiveRects();
}

function setPartNameOnUI(_string)
{
	$('#partNameText').val(_string);
}

function getMousePos(evt) 
{
	var rect = canvas.getBoundingClientRect();
	return {
	  x: parseInt(evt.clientX - rect.left),
	  y: parseInt(evt.clientY - rect.top)
	};
}

function addListeners()
{	
	writeMousePos(0,0);
	canvas.addEventListener('mousemove', function(evt) {
        writeMousePos(evt);
        drawActiveRects(evt);
      }, false);
      
	canvas.addEventListener('mousedown', function(evt) {
        onClick(evt);
      }, false);
}

function drawActiveRects(evt)
{
	var mousePos = getMousePos(evt);

	if (isEditing) {
		if (currentlyDrawingPanel) {
			if($("label[for='radio1']").attr('aria-pressed') == 'true') // If rectangle
			{
				context.fillStyle = "rgba(51, 153, 255, 0.5)";
				context.fillRect(startX, startY, mousePos.x - startX, mousePos.y - startY);
				context.stroke();
			} 
			else if ($("label[for='radio2']").attr('aria-pressed') == 'true') // If circle
			{
			    context.beginPath();
				context.fillStyle = "rgba(51, 153, 255, 0.5)";
				context.lineWidth = 0;
				context.arc(parseInt((Math.abs(startX - mousePos.x)/2)+startX), parseInt((Math.abs(startY - mousePos.y)/2)+startY), parseInt(Math.abs(startX-mousePos.x)/2), 0, 2 * Math.PI, false);
				context.fill();
				context.stroke();
			}
		}

		// Draw the already made maps
		for (var i = 0; i < heatMap.length; i = i + 5) 
		{
			if(heatMap[i] == 'rect')
			{
				context.fillStyle = "rgba(51, 153, 255, 0.5)";
				context.fillRect(heatMap[i+1], heatMap[i + 2], heatMap[i + 3] - heatMap[i+1], heatMap[i + 4] - heatMap[i + 2]);
				context.stroke();
			} else if(heatMap[i] == 'circ') {
			    context.beginPath();
				context.fillStyle = "rgba(51, 153, 255, 0.5)";
				context.lineWidth = 0;
				context.arc(heatMap[i+1], heatMap[i + 2], heatMap[i + 3], 2 * Math.PI, false);
				context.fill();
				context.stroke();
				i--;
			}
		}
	}
}

// function checkProductHover(x, y)
// {
	// for(var i = 0; i < json.product.parts.length; i++)
	// {
		// if((x >= json.product.parts[i].part.heatMap[0].map.start[0]) && 
		   // (x <= json.product.parts[i].part.heatMap[0].map.end[0]) &&
		   // (y >= json.product.parts[i].part.heatMap[0].map.start[1]) &&
		   // (y <= json.product.parts[i].part.heatMap[0].map.end[1]))
		// {
			// $("#product_selected").html(i+1);
			// $("#product_details").html( "&nbsp;&nbsp;&nbsp;&nbsp;Description:  " + json.product.parts[i].part.description + "</br>" +
										// "&nbsp;&nbsp;&nbsp;&nbsp;Part number:  " + json.product.parts[i].part.part_number + "</br>" +
										// "&nbsp;&nbsp;&nbsp;&nbsp;Product link:  <a href=\"" + json.product.parts[i].part.product_link + "\">Part " + json.product.parts[i].part.part_number + "</a>");
			// foundProduct = true;
		// }
	// }
// }
