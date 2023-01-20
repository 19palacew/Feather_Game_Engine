import bpy
import json

me = bpy.context.object.data
uv_layer = me.uv_layers.active.data

print("\n\n\nStart")

vertices = []
textureCoordinates = []
triangles = []

for v in me.vertices:
    vertices.append([v.co.x, v.co.y, v.co.z])
    textureCoordinates.append(None)

for poly in me.polygons:
    #print("Polygon index: %d, length: %d" % (poly.index, poly.loop_total))

    # range is used here to show how the polygons reference loops,
    # for convenience 'poly.loop_indices' can be used instead.
    for loop_index in range(poly.loop_start, poly.loop_start + poly.loop_total):
        #print("    Vertex: %d" % me.loops[loop_index].vertex_index)
        #print("    UV: %r" % uv_layer[loop_index].uv)
        index = me.loops[loop_index].vertex_index
        triangles.append(index)
        textureCoordinates[index] = [uv_layer[loop_index].uv.x, uv_layer[loop_index].uv.y]

vertices = [item for sublist in vertices for item in sublist]
textureCoordinates = [item for sublist in textureCoordinates for item in sublist]

print("Vertices: ", vertices)
print("Texture Coordinates: ", textureCoordinates)
print("Triangles: ", triangles)
print("\n")

dump = {"vertices": vertices, "textureCoordinates": textureCoordinates, "triangles": triangles}
print(json.dumps(dump))

file = open("C:/Users/Winston/Desktop/BlenderOutput.txt", "w")
file.write(json.dumps(dump))