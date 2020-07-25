//http://paulbourke.net/geometry/toroidal/source1.c is used
//wiresphere code in the examples is used

var canvas;
var gl;

var numTimesToSubdivide = 3;
 
var index = 0;

var p = [];

var near = -10;
var far = 10;
var radius = 6.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function toroid(){

    var u = 10;
    var v = 10;
    var du = 10;
    var dv = 10;
    var r_outer = 0.75
    var r_inner = 0.40;
    var theta,phi;
    var DTOR  = 0.01745329252;

    var tVertex0;
    var tVertex1;
    var tVertex2;
    var tVertex3;

    for (u=0;u<360;u+=du) {
      for (v=0;v<360;v+=dv) {
         theta = (u) * DTOR;
         phi   = (v) * DTOR;
   
         tVertex0 = vec4(Math.cos(theta) * ( r_outer + r_inner * Math.cos(phi) ),  Math.sin(theta) * ( r_outer + r_inner * Math.cos(phi) ),  r_inner * Math.sin(phi),1.0);
         theta = (u+du) * DTOR;
         phi   = (v) * DTOR;

         p.push(tVertex0);
    
         tVertex1 = vec4(Math.cos(theta) * ( r_outer + r_inner * Math.cos(phi) ), Math.sin(theta) * ( r_outer + r_inner * Math.cos(phi) ), r_inner * Math.sin(phi),1.0);
         theta = (u+du) * DTOR;
         phi   = (v+dv) * DTOR;

         p.push(tVertex1);
   
         tVertex2 = vec4(Math.cos(theta) * ( r_outer + r_inner * Math.cos(phi) ), Math.sin(theta) * ( r_outer + r_inner * Math.cos(phi) ), r_inner * Math.sin(phi),1.0);
         
         theta = (u) * DTOR;
         phi   = (v+dv) * DTOR;

         p.push(tVertex2);
    
         tVertex3 = vec4(Math.cos(theta) * ( r_outer + r_inner * Math.cos(phi) ), Math.sin(theta) * ( r_outer + r_inner * Math.cos(phi) ),  r_inner * Math.sin(phi),1.0);

         p.push(tVertex3);

         index =  index + 4;
      }
   }

}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var va = vec4(0.0, 0.0, -1.0, 1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333, 1);
    
    //tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    toroid();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(p), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    document.getElementById("Button0").onclick = function(){theta += dr;};
    document.getElementById("Button1").onclick = function(){theta -= dr;};
    document.getElementById("Button2").onclick = function(){phi += dr;};
    document.getElementById("Button3").onclick = function(){phi -= dr;};
    
    document.getElementById("Button4").onclick = function(){
        numTimesToSubdivide++; 
        index = 0;
        pointsArray = []; 
        init();
    };

    document.getElementById("Button5").onclick = function(){
        if(numTimesToSubdivide) numTimesToSubdivide--;
        index = 0;
        pointsArray = []; 
        init();
    };
    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
            
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
        

    for( var i=0; i<index; i+=3) 
       gl.drawArrays( gl.LINE_LOOP, i, 3 );

    window.requestAnimFrame(render);


}




