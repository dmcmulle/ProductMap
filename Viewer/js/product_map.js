var context, productImage, canvas, json;
var heat_map = new Array();

function init()
{
	buildCanvas();
}

function buildCanvas()
{
	// Grab canvas element
	canvas = $("#canvas").get(0);
	
	// Create canvas context
	context = canvas.getContext("2d");
	context.font = "24px Arial";
	
	// Create product image object
	productImage = new Image();
	productImage.src = 'img/example_product.png';

	productImage.onload = function()
	{
		loadJSON();
		addListener();
	}
}

function loadJSON()
{
	json = jQuery.parseJSON("{ \"product\": { \"product_number\":\"DCB1\", \"parts\": [ { \"part\": { \"part_number\":\"B101584\", \"description\":\"Front Panel\", \"heat_map\":[ { \"map\": { \"start\":[260,179], \"end\":[351,339] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101642\", \"description\":\"Right Side Panel Assembly\", \"heat_map\":[ { \"map\": { \"start\":[506,172], \"end\":[552,317] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101641\", \"description\":\"Left Side Panel Assembly\", \"heat_map\":[ { \"map\": { \"start\":[183,129], \"end\":[221,227] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101582\", \"description\":\"Rear Brace\", \"heat_map\":[ { \"map\": { \"start\":[454,90], \"end\":[554,124] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101633\", \"description\":\"Cart shield stainless steel\", \"heat_map\":[ { \"map\": { \"start\":[335,159], \"end\":[427,183] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101473\", \"description\":\"Grease Cup (not used with Q Series grills)\", \"heat_map\":[ { \"map\": { \"start\":[423,137], \"end\":[447,157] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101414\", \"description\":\"Plastic Base\", \"heat_map\":[ { \"map\": { \"start\":[295,353], \"end\":[497,420] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101416\", \"description\":\"Caster with Brake\", \"heat_map\":[ { \"map\": { \"start\":[253,457], \"end\":[283,477] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101417\", \"description\":\"Caster without Brake\", \"heat_map\":[ { \"map\": { \"start\":[466,444], \"end\":[488,463] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B064791\", \"description\":\"Cylinder Retainer\", \"heat_map\":[ { \"map\": { \"start\":[221,167], \"end\":[253,182] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101565\", \"description\":\"Base Support Bracket - Right\", \"heat_map\":[ { \"map\": { \"start\":[178,87], \"end\":[231,120] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101495\", \"description\":\"Base Support Bracket - Left\", \"heat_map\":[ { \"map\": { \"start\":[497,137], \"end\":[547,161] } }], \"product_link\":\"http://<link_to_product>\" } }, { \"part\": { \"part_number\":\"B101635\", \"description\":\"Channel, Edge Protector\", \"heat_map\":[ { \"map\": { \"start\":[286,173], \"end\":[319,185] } }], \"product_link\":\"http://<link_to_product>\" } } ] } }");
	
	$("#product_number").html(json.product.product_number);
	$("#number_of_parts").html(json.product.parts.length);
}

function writeMousePos(x, y)
{
	// When mouse move is detected, this is the first method called.  Edit this in 'addListener()'
	context.drawImage(productImage, 0, 0);
	context.fillText("Mouse Pos: (" + x + ", " + y + ")", 505, 590);
}

function getMousePos(evt) 
{
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}

function addListener()
{	
	writeMousePos(0,0);
	canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(evt);
        writeMousePos(mousePos.x, mousePos.y)
		checkProductHover(mousePos.x, mousePos.y)
      }, false);
}

function checkProductHover(x, y)
{
	for(var i = 0; i < json.product.parts.length; i++)
	{
		if((x >= json.product.parts[i].part.heat_map[0].map.start[0]) && 
		   (x <= json.product.parts[i].part.heat_map[0].map.end[0]) &&
		   (y >= json.product.parts[i].part.heat_map[0].map.start[1]) &&
		   (y <= json.product.parts[i].part.heat_map[0].map.end[1]))
		{
			$("#product_selected").html(i+1);
			$("#product_details").html( "&nbsp;&nbsp;&nbsp;&nbsp;Description:  " + json.product.parts[i].part.description + "</br>" +
										"&nbsp;&nbsp;&nbsp;&nbsp;Part number:  " + json.product.parts[i].part.part_number + "</br>" +
										"&nbsp;&nbsp;&nbsp;&nbsp;Product link:  <a href=\"" + json.product.parts[i].part.product_link + "\">Part " + json.product.parts[i].part.part_number + "</a>");
			foundProduct = true;
		}
	}

}
