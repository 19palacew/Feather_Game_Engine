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
    console.log(vertices);
    console.log(texture);
    //triangles = [1, 2, 0, 1, 3, 2];
    for(let i=0;i<textCoordHolder.length;i+=2){
      //console.log(textCoordHolder[i] + ", " + textCoordHolder[i+1]);
    }

    let mesh = new Mesh(gl, vertices, texture, triangles);
    return mesh;
}