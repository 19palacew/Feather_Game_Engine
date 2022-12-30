export { createMeshFromOBJ };

function createMeshFromOBJ(gl, meshFileText) {
    const lines = meshFileText.split('\n');

    let vertices = [];
    let texture  = [];
    let triangles = [];

  // Meshes need to be triangulated

    let textCoordHolder = [];
    for (var i=0; i<lines.length; i++){
        const temp = lines[i].split(' ');
        if (temp[0] == 'v'){
            vertices.push(parseFloat(temp[1]));
            vertices.push(parseFloat(temp[2]));
            vertices.push(parseFloat(temp[3]));
        }
        if (temp[0] == 'vt'){
          //texture.push(parseFloat(temp[1]));
          //texture.push(parseFloat(temp[2]));
          texture.push(parseFloat(temp[1]));
          texture.push(parseFloat(temp[2]));
        }
        if (temp[0] == 'f'){
          // f 2/1/1 3/2/1 1/3/1
          // is equivalent to
          // f v/vt/vn v/vt/vn v/vt/vn
          // with v being vertex, vt vertex texture, vn vertex normal, also 1 base indexed
          for (let x=1; x<temp.length; x++){
            const faceData = temp[x].split('/');
            triangles.push(faceData[0]-1);
          }
        }
    }
    //for(let i=0; i<triangles.length;i++){
      //texture.push(textCoordHolder[triangles[i]]);
      //texture.push(textCoordHolder[triangles[i]+1]);
    //}
    //texture = [0,1,0,0,1,0,0,1,1,1,0,1];
    
    //texture = [1, 1, 0, 1, 1, 0, 0, 0];
    //texture = [0, 0, 0, 1, 1, 0, 1, 1];
    //texture = [0, 0, 0, 1, 1, 0, 1, 1];
    //triangles = [1, 2, 0, 1, 3, 2];
    for(let i=0;i<textCoordHolder.length;i+=2){
      //console.log(textCoordHolder[i] + ", " + textCoordHolder[i+1]);
    }

    vertices = [// Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,];
    texture = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Back
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Top
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Bottom
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Right
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Left
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,];
    triangles = [0,
      1,
      2,
      0,
      2,
      3, // front
      4,
      5,
      6,
      4,
      6,
      7, // back
      8,
      9,
      10,
      8,
      10,
      11, // top
      12,
      13,
      14,
      12,
      14,
      15, // bottom
      16,
      17,
      18,
      16,
      18,
      19, // right
      20,
      21,
      22,
      20,
      22,
      23, // left
    ];

    let mesh = new Mesh(gl, vertices, texture, triangles);
    return mesh;
}