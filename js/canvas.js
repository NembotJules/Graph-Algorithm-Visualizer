
let width; 
let height; 
let originx = 0; 
let originy = 0; 
let scale = 1; 
let option = 0; 
let mouseX, mouseY; 
let fromx, fromy;
let tox, toy
let countVertex = 1; 
let counterIdVertexes = 1; 
let graph = null; 
let canvasMinX; 
let canvasMinY; 

class Vertex {
    constructor(value, posX, posY) {
        this.id = counterIdVertexes++ ; 
        this.value = this.id ; 
        if(value != null) this.value = value; 
        this.posX = posX; 
        this.posY = posY; 
        this.radius = 20; 
        this.fill = '#06D'; 
        this.fillText = "white"; 
    }

}

class DirectedEdge {
    constructor(start, end, value) {
        this.value = value; 
        this.start = start; 
        this.end = end; 
        this.fill = '#C5C5C5'; 
        this.fillText = "#2D2D2D"; 
    }
}

class Graph {
    constructor() {
        this.vertexSelected = null; 
        this.directedEdgeSelected = null; 
        this.vertices = []; 
        this.directedEdges = []; 

        this.addVertex = function (value, posX, posY ) {
            if(!this.searchByValue(value)) {
                var vertex = new Vertex(value, posX/scale, posY/scale); 
                this.vertices.push(vertex); 
                this.update(); 
                return vertex ; 
            }

            return null; 
        }

        this.addDirectedEdgeByValue = function (initialValue, finalValue, value) {
            var initialVertex = this.searchByValue(initialValue); 
            var finalVertex = this.searchByValue(finalValue); 

            if(initialVertex == null || finalVertex == null) {
                alert("Ces sommets n'existent pas");
                return; 
            }

            this.addDirectedEdge(initialVertex.id, finalVertex.id, value ); 

        }

        this.removeVertex = function(idVertex) {
            for(var i in this.vertices) {
                if(idVertex == this.vertices[i].id) {
                    this.vertices.splice(i, 1); 
                    this.removeDirectedEdges(idVertex); 
                    break; 
                }
            }
        }

        this.removeDirectedEdges = function(idVertex) {
            for(var i = 0; i< this.directedEdges.length; i++) {
                if(idVertex == this.directedEdges[i].start.id) {
                        this.directedEdges.splice(i, 1); 
                        i = 0; 
                }
            }

            for(var i = 0; i<this.directedEdges.length; i++ ) {
                if(idVertex == this.directedEdges[i].end.id) {
                    this.directedEdges.splice(i,1); 
                    i = 0; 
                }
            }
        };

        this.removeDirectedEdge = function(directedEdge) {
            for(var i in this.directedEdges) {
                if(directedEdge == this.directedEdges[i]) {
                    this.directedEdges.splice(i, 1); 
                   let inversedEdge = this.searchDirectedEdge(directedEdge.end, directedEdge.start); 
                    if(inversedEdge != null) 
                        this.removeDirectedEdge(inversedEdge);
                    break; 
                    

                }
            }
        };

        this.addDirectedEdge = function(initialVertexId, finalVertexId, value) {
            let initial = this.search(initialVertexId); 
            let final = this.search(finalVertexId); 

            if(initial == null || final == null) {
                alert('Sommet(s) non existant(s)'); 
                return; 
            }

            var directedEdge = new DirectedEdge(initial, final,value); 
            this.directedEdges.push(directedEdge); 
            this.update()

        }

        this.setPosX = function(vertex, posX){
            vertex.posX = posX; 
        }

        this.setPosY = function(vertex, posY){
            vertex.posY = posY; 
        }

        this.search = function(idVertex) {
            for (var i in this.vertices) {
                if(idVertex == this.vertices[i].id){
                  return   this.vertices[i]
                }
            }
            return null; 
        }; 

        this.searchByValue = function(vertexValue) {
            for(var i in this.vertices) {
                if(vertexValue == this.vertices[i].value) {
                    return this.vertices[i];
                }
            }
            return null; 
        }

        this.searchDirectedEdge = function(initialVertex, finalVertex) {
            for(var i = 0; i < this.directedEdges.length; i++) {
                if(this.directedEdges[i].start == initialVertex && this.directedEdges[i].end == finalVertex) {
                    return this.directedEdges[i]; 
                }
            }
            return null; 
        }

        // need to store all the edges coming from a certain point

        this.edgesComingOutFromVertex = function(vertex) {
            let edges = new Array(); 

            for(var i in this.directedEdges) {
                if(this.directedEdges[i].start == vertex) {
                    edges.push(this.directedEdges[i]);
                }
            }

            return edges; 
        }

        this.clickedVertex = function (posX, posY) {
            for(var i in graph.vertices) {
                let x = graph.vertices[i].posX*scale ; 
                let y = graph.vertices[i].posY*scale; 

                if(Math.pow( (posX -x), 2 ) + Math.pow((posY-y), 2) < 400*scale) {
                    return this.vertices[i]; 
                }
            }

            return null; 
        };

        this.clickedEdge = function (posX, posY) {
            let result = null; 
            let triangleArea = 99999999999999; 

            for(var i in this.directedEdges) {
                var x1 = this.directedEdges[i].start.posX; 
                var y1 = this.directedEdges[i].start.posY; 
                var x2 = this.directedEdges[i].end.posX; 
                var y2 = this.directedEdges[i].end.posY; 

                var a = (y2-y1) / (x2-x1) ; 
                var b = y2 - a*x2 ; 
                var d =  Math.abs( (a*posX+(-1)*posY+b))/(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)));

                // Calculate the traingle area by using the  half perimeter method...
                // https://byjus.com/maths/heron-formula/
                
                let aa = Math.sqrt(Math.pow((posX-x1),2)+Math.pow(posY-y1,2));
                let bb = Math.sqrt(Math.pow((posX-x2),2)+Math.pow(posY-y2,2));
                let cc =  Math.sqrt(Math.pow((x1-x2),2)+Math.pow(y1-y2,2));
                //aa, bb, cc(hypothenus) are the sides of the triangle...

                let s = (aa+bb+cc) / 2 ; 
                let area = Math.sqrt (s*(s-aa)*(s-bb)*(s-cc)); 

                if(d < 0.05 && area < triangleArea) {
                    triangleArea = area; 
                    result = this.directedEdges[i]; 
                }
            }

            return  result; 
        }

        this.updateEdge = () => {
            for(var i in this.directedEdges) {

                context.lineWidth = 1.5; 
                context.beginPath(); 
                fromx = this.directedEdges[i].start.posX ; 
                fromy = this.directedEdges[i].start.posY ; 

                tox = this.directedEdges[i].end.posX ; 
                toy = this.directedEdges[i].end.posY ; 

                let headLen = 10; 
                let angle = Math.atan2(toy-fromy, tox-fromx); 

                // the head of the edge must point to the border of the vertex , not to it's center...
                // so we need to remove the radius of 20 in our calculations...

                toy = toy -20*Math.sin(angle); 
                tox = tox - 20*Math.cos(angle); 

                context.strokeStyle = this.directedEdges[i].fill; 
                context.moveTo(fromx, fromy); 
                context.lineTo(tox, toy);

                if(this.searchDirectedEdge(this.directedEdges[i].end, this.directedEdges[i].start) == null)
                {
                    context.strokeStyle = this.directedEdges[i].fill;
                    
                    context.lineTo(tox-headLen*Math.cos(angle-Math.PI/6),toy-headLen*Math.sin(angle-Math.PI/6));
                    context.moveTo(tox, toy);
                    context.lineTo(tox-headLen*Math.cos(angle+Math.PI/6),toy-headLen*Math.sin(angle+Math.PI/6));
                }

                // Need to put the value of the edge on it
                // It must stay in place even if we move the edge...

                let xMedia = (this.directedEdges[i].start.posX - this.directedEdges[i].end.posX)/2 ; 
                let yMedia = (this.directedEdges[i].start.posY - this.directedEdges[i].end.posY)/2; 

                if(xMedia >= 0 || this.directedEdges[i].start.posX <= this.directedEdges[i].end.posX) 
				xMedia *= (-1);							
			if(yMedia >= 0 || this.directedEdges[i].start.posY <= this.directedEdges[i].end.posY)
				yMedia *=(-1);
                
                // because xMedia, yMedia are distances so they need to be positive...
                context.font = 'bold 15px Arial'; 
                context.fillStyle = this.directedEdges[i].fillText;
                //place the value at the center of the edge...
                context.fillText(this.directedEdges[i].value, this.directedEdges[i].start.posX+xMedia, this.directedEdges[i].start.posY + yMedia);
                context.stroke(); 
               context.closePath(); 
            }
        };

        this.updateVertices = function () {
            for(var i in this.vertices) {
                context.beginPath(); 
                context.fillStyle = this.vertices[i].fill; 
                context.arc(this.vertices[i].posX, this.vertices[i].posY, this.vertices[i].radius, 0, Math.PI*2, true); 
                context.fill(); 
                // Draw the vertex value 
                context.font = 'bold ' + (14*scale) + 'px Arial'; 
                context.fillStyle = this.vertices[i].fillText; 
                context.fillText(this.vertices[i].value, this.vertices[i].posX-7, this.vertices[i].posY + 3);
                context.closePath(); 
            }
        };

        this.update = function () {
            this.clear(); 
            this.updateEdge(); 
            this.updateVertices(); 
        }; 

        this.moveVertex = function (posX, posY, event) {
            let vertex = this.clickedVertex(posX, posY); 

            if(vertex != null) {
                document.onmousemove = function(e) {
                    graph.setPosX(vertex, mouseX/scale); 
                    graph.setPosY(vertex, mouseY/scale);
                    graph.update()
                };

                document.onmousemove(event)
            }
        }

        this.getAdjacencyMatrix = function () {
            let matrix = new Array(this.vertices.length); 

            for(var i =0; i< matrix.length; i++) {
                matrix[i] = new Array (this.vertices.length)
            }

            for(var i= 0; i<matrix.length; i++) {
                for(var j = 0; j < matrix.length; j++) {
                    matrix[i][j] = 0; // Filling the matrix with zeros...
                }
            }

            for(var i in this.directedEdges) {
                 matrix[this.directedEdges[i].start.id-1][this.directedEdges[i].end.id-1]  = this.directedEdges[i].value
            }

            return matrix; 
        }

        this.clear = function() {
            context.clearRect(0,0, width, height); 
        }

        this.reset = function() {
            for(var i in this.vertices) {
                this.vertices[i].fill = '#06D' ; 
                this.vertices[i].fillText = 'white' ; 
            }

            for(var i in this.directedEdges) {
                this.directedEdges[i].fill = '#C5C5C5'; 
                this.directedEdges[i].fillText = '#2D2D2D'; 
            }

            this.update(); 
        }

        this.empty = function() {return this.vertices.length == 0; }

        this.hasNegativeEdge = function()  {
            for(var i in this.directedEdges ) {
                if(this.directedEdges[i].value < 0) {
                    return true; 
                }
            }
            return false; 
        }

    }
}

function onMouseDown (event)  {
    this.style.cursor = 'move' ; 

    if(event.button == 0) {
        if(option == 1) {
            graph.addVertex(null, mouseX, mouseY)
        }
        else if(option ==2) {
            graph.moveVertex(mouseX, mouseY, event)
        }
        else if (option == 3 || option == 4) {
            graph.vertexSelected = graph.clickedVertex(mouseX, mouseY); 
        }
    }

    else if(event.button == 2 ) {
        let menu = document.getElementById("context_menu"); 
        graph.vertexSelected = graph.clickedVertex(mouseX, mouseY); 

        if(graph.vertexSelected != null) {
            // This is for when an user click on a vertex
            showMenu(event); 
            menu.onmouseout = function(e) {
                let mouseEvent = e; 
                let element = mouseEvent.relatedTarget || mouseEvent.toElement ; 
                if(element.nodeName != 'LI') hideContextMenu();
            };
        }
        else {
            //This is for when a user click on an edge...
            graph.directedEdgeSelected = graph.clickedEdge(mouseX, mouseY); 
            
            if(graph.directedEdgeSelected != null) {
                showMenu(event); 
                menu.onmouseout = function(e) {
                    var mouseEvent = e; 
                    let element = mouseEvent.relatedTarget || mouseEvent.toElement; 
                    if(element.nodeName != "LI") hideContextMenu()
                }
            }
        }
    }
    if(event.button == 0 || event.button == 1) hideContextMenu();
}

function onMouseUp(event) {
    this.style.cursor = 'default' ; 
    document.onmousemove = null; 

    if(event.button == 0) {
        if(option == 3) {
            let finalVertex = graph.clickedVertex(mouseX, mouseY); 

            if(finalVertex == null) {graph.update()}  
            else {
                if(graph.vertexSelected != finalVertex) {

                   /* check if the first vertex is different from the second vertex*/  
                 /* check if there is no edge between vertexSelected and finalVertex*/   
                 
                 if(graph.searchDirectedEdge(graph.vertexSelected, finalVertex) == null) {

                        let Existe = graph.searchDirectedEdge(finalVertex, graph.vertexSelected);
                        if(Existe == null) {
                            //there's no edge at all between the two points, so we need to create one...
                            let edgeValue = prompt('Valeur de l"arrete', '2'); // for the value of the edge...
                            if(edgeValue!= null) {
                                graph.addDirectedEdge(graph.vertexSelected.id, finalVertex.id, edgeValue );
                                // Creating the edge between the two with the value given by the user...
                            }
                        }

                        else {
                            graph.addDirectedEdge(graph.vertexSelected.id, finalVertex.id, Existe.value)
                        }
                    }

                    else {
                        alert("Cette arrete existe deja!"); 
                    }

                    graph.update(); 
                }
            }
            graph.vertexSelected = null; 

        }

        else if (option == 4) {
            let finalVertex = graph.clickedVertex(mouseX, mouseY); 

            if(finalVertex == null) {
                graph.update(); 
            }

            else {
                if(graph.vertexSelected != finalVertex) {
                    if(graph.searchDirectedEdge(graph.vertexSelected, finalVertex) == null) {
                        let edgeValue = prompt('Valeur de l"arrete', '2'); 
                        if(edgeValue != null) {
                            graph.addDirectedEdge(graph.vertexSelected.id, finalVertex.id, edgeValue); 
                            graph.addDirectedEdge(finalVertex.id, graph.vertexSelected.id, edgeValue); 
                        }
                    }
                }else {
                        alert("Cette arrete existe deja"); 
                    }
                    graph.update()
                
            }
        }

        graph.vertexSelected = null; 
    }
}

function onMouseMove(event) {

    if(event.offsetX) {
        mouseX = event.offsetX; 
        mouseY = event.offsetY; 
    }

    else if(event.layerX) {
        mouseX = event.layerX - canvasMinX; 
        mouseY = event.layerY;
    }

    if(option == 3 || option == 4) {
        if(graph.vertexSelected !=null) {
            graph.clear(); 
            context.beginPath(); 
            context.moveTo(graph.vertexSelected.posX, graph.vertexSelected.posY);
            context.lineTo(mouseX/scale, mouseY/scale); 
            context.stroke(); 

            graph.updateEdge(); 
            graph.updateVertices();
        }
    }
}

function init() {
    canvas =  document.getElementById('canvas'); 

    if(!canvas.getContext) {
        alert('Context canvas absent'); 
        return; 
    }

    context = canvas.getContext("2d"); 

    canvasMinX = canvas.offsetLeft; 
    canvasMinY = canvas.offsetTop; 

    canvas.onmousedown = onMouseDown; 
    canvas.onmouseup = onMouseUp; 

    context.canvas.height = window.innerHeight; 
    context.canvas.width = window.innerWidth - canvasMinX;
    
    width = canvas.width ; 
    height = canvas.height; 

    createGraph(); 
}

const menuAddVertex = document.getElementById('menuAddVertex'); 
const menuAddUndirectedEdge = document.getElementById('menuAddUndirectedEdge'); 
const menuAddDirectedEdge = document.getElementById('menuAddDirectedEdge'); 
const menuMover = document.getElementById('menuMover'); 
const menuNewGraph = document.getElementById('menuNewGraph'); 
const edit = document.getElementById('edit'); 
const remove = document.getElementById('remove');  
const executeAlgorithmMenu= document.getElementById('executeAlgorithm'); 
const resetGraph = document.getElementById('resetGraph')
const selectAlgorithm = document.getElementById('selectAlgorithm')


function selectItem(element, opt) {
    menuAddVertex.classList.remove('Menu-Item-Selected'); 
    menuAddDirectedEdge.classList.remove('Menu-Item-Selected');
    menuAddUndirectedEdge.classList.remove('Menu-Item-Selected');
    menuMover.classList.remove('Menu-Item-Selected');
    
   element.classList.add('Menu-Item-Selected'); 
    option = opt ; 
}

function createGraph() {
    graph = new Graph(); 
    counterIdVertexes = 1; 
}

document.addEventListener('DOMContentLoaded', ()=> {
    
    init(); 
    menuAddVertex.addEventListener('click', () =>selectItem(menuAddVertex, 1)); 
    menuAddDirectedEdge.addEventListener('click', () =>selectItem(menuAddDirectedEdge, 3)); 
    menuAddUndirectedEdge.addEventListener('click',()=> selectItem(menuAddUndirectedEdge, 4)); 
    menuMover.addEventListener('click', ()=>selectItem(menuMover, 2));


    menuNewGraph.addEventListener('click', ()=> {
        if(confirm('Voulez-vous vraiment creer un nouveau graphe?')) {
            createGraph(); 
            graph.update(); 
        }
    })

    console.log(edit)
    console.log(remove)
    
    edit.addEventListener('click', ()=>{
        hideContextMenu(); 

        if(graph.vertexSelected != null) {
            value = prompt('Valeur: ', graph.vertexSelected.value); 
            if(value != null) {
                graph.vertexSelected.value = value; 
            }

        }

        else if(graph.directedEdgeSelected != null) {
            value = prompt('poids de l"aret: ', graph.directedEdgeSelected.value)
            if(value != null) {
                graph.directedEdgeSelected.value = value; 
                let inversedEdge = graph.searchDirectedEdge(graph.directedEdgeSelected.end, graph.directedEdgeSelected.start); 
                if(inversedEdge != null) {
                    inversedEdge.value = value; 
                }

            }
        }

        graph.vertexSelected = null; 
        graph.directedEdgeSelected = null; 
        graph.update(); 
    })

    remove.addEventListener('click', ()=>{
        hideContextMenu(); 

        if(graph.vertexSelected != null) {
            if(confirm("Voulez-vous vraiment supprimer ce sommet")) {
                graph.removeVertex(graph.vertexSelected.id); 
            }
        }

        else if(graph.directedEdgeSelected != null) {
             if(confirm('Voulez-vous vraiment supprimer cette arrete?')) {
                graph.removeDirectedEdge(graph.directedEdgeSelected); 
             }
        }

        graph.directedEdgeSelected = null; 
        graph.vertexSelected = null; 
        graph.update(); 

        hideContextMenu(); 
    })

    executeAlgorithmMenu.addEventListener('click', ()=>{
        if(graph.empty()) {
            alert("Impossible d'executer un algorithme quand le graph est vide "); 
            return; 
        }

        executeAlgorithm(graph, selectAlgorithm.value);

    })

    resetGraph.addEventListener('click', ()=> {
        if(graph.empty()) {
            alert('Le graphe doit etre creer avant de pouvoir etre reinitialiser!')
            return; 
        }

        graph.reset();
    })


})

// Block the access to context menu on the canvas when somebody right click...
document.oncontextmenu = () => {
    return false; 
}





const showMenu = (e) => {
    let contextMenu = document.getElementById('context_menu'); 
    contextMenu.style.display = "block"; 
    contextMenu.style.top = e.clientY + 5 + "px"; 
    contextMenu.style.left = e.clientX + 5 + "px"; 
}

const hideContextMenu = () => {
    document.getElementById('context_menu').style.display = 'none';
}
