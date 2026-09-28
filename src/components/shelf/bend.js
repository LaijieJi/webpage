// A page bend as vertex displacement, injected into three's own materials rather
// than written as a ShaderMaterial - a ShaderMaterial would mean reimplementing
// the whole lighting model by hand.
//
// In the leaf's own frame the plane lies face-up (+z), hinged on its x = -w/2
// edge. A turn lifts it toward +z - toward whoever is looking at the page - and
// lands it face-down on the far side of the hinge.
//
//   u      = normalised distance from the spine, 0..1
//   A(t)   = uBow * sin(PI * t)   zero at t=0 and t=1, peak at t=0.5
//   z     -= A(t) * sin(PI * u)   the belly trails the fore-edge, the way a page
//                                 bows when it is turned by its edge
//
// A(t) vanishing at both ends is what makes it read as paper: flat before, bowed
// in flight, flat on landing.

export function makeBendUniforms(width) {
  return {
    uTurn: { value: 0 },
    uBow: { value: width * 0.16 },
    uWidth: { value: width }
  };
}

const VERTEX_HEAD = `
#include <common>
uniform float uTurn;
uniform float uBow;
uniform float uWidth;
#define LJ_PI 3.141592653589793

// Turn a direction about the y axis, carrying +x over through +z to -x.
vec3 ljTurnY(vec3 v, float theta) {
  float c = cos(theta);
  float s = sin(theta);
  return vec3(v.x * c - v.z * s, v.y, v.x * s + v.z * c);
}

// Turn a point about the spine, which sits at x = -w/2.
vec3 ljTurnAboutSpine(vec3 p, float theta, float w) {
  vec3 hinge = vec3(-w * 0.5, 0.0, 0.0);
  return hinge + ljTurnY(p - hinge, theta);
}

float ljBowAmp() {
  return uBow * sin(LJ_PI * uTurn);
}
`;

// Normals must be recomputed or the page is visibly curved and flat-shaded - the
// eye catches that instantly without knowing why. For z = -A*sin(PI*u):
// dz/dx = -A*PI*cos(PI*u)/w, so the in-plane normal is (A*PI*cos(PI*u)/w, 0, 1).
const NORMAL = `
#include <beginnormal_vertex>
{
  float u = clamp((position.x + uWidth * 0.5) / uWidth, 0.0, 1.0);
  float slope = ljBowAmp() * LJ_PI * cos(LJ_PI * u) / uWidth;
  objectNormal = normalize(ljTurnY(normalize(vec3(slope, 0.0, 1.0)), uTurn * LJ_PI));
}
`;

const VERTEX = `
#include <begin_vertex>
{
  float u = clamp((transformed.x + uWidth * 0.5) / uWidth, 0.0, 1.0);
  transformed.z -= ljBowAmp() * sin(LJ_PI * u);
  transformed = ljTurnAboutSpine(transformed, uTurn * LJ_PI, uWidth);
}
`;

const FRAGMENT_HEAD = `
#include <common>
uniform float uTurn;
`;

// The underside of a lifting leaf darkens, as journal__shade does in the CSS
// turn, and clears again once the leaf lies flat.
const FRAGMENT_COLOR = `
#include <color_fragment>
if (!gl_FrontFacing) diffuseColor.rgb *= 1.0 - 0.18 * sin(3.141592653589793 * uTurn);
`;

// Apply to the leaf's surface material, and - with { shade: false } - to the
// MeshDepthMaterial it casts its shadow with. Without the second, the shadow is
// of an unturned, unbent page.
export function applyBend(material, uniforms, { shade = true } = {}) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', VERTEX_HEAD)
      .replace('#include <beginnormal_vertex>', NORMAL)
      .replace('#include <begin_vertex>', VERTEX);
    if (shade) {
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', FRAGMENT_HEAD)
        .replace('#include <color_fragment>', FRAGMENT_COLOR);
    }
  };
  // Without this three reuses a cached program compiled without the injection,
  // and the bend silently does nothing.
  material.customProgramCacheKey = () => (shade ? 'lj-bend-v2' : 'lj-bend-v2-depth');
}
