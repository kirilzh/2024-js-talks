function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function getEpitrochoidCoordinates(R, r, d) {
  const coordinates = [];

  for (let theta = 0; theta < Math.PI * 2 * r / gcd(R, r); theta += 0.01) {
    let x = (R - r) * Math.cos(theta) - d * Math.cos((R + r) / r * theta);
    let y = (R - r) * Math.sin(theta) - d * Math.sin((R + r) / r * theta);
    coordinates.push([x, y]);
  }

  return coordinates;
}

class CheckerboardPainter {
  static get inputProperties() {
    return ['--size'];
    // return ['--R', '--r', '--d'];
  }

  paint(ctx, geom, properties) {
    const size = Number(properties.get('--size').toString());
    // Use `ctx` as if it was a normal canvas
    const colors = ['red', 'green'];
    for(let y = 0; y < geom.height/size; y++) {
      for(let x = 0; x < geom.width/size; x++) {
        const color = colors[(x + y) % colors.length];
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(x * size, y * size, size, size);
        ctx.fill();
      }
    }


    // console.log('called');
    // // Spirograph parameters
    // let R = Number(properties.get('--R').toString());
    // let r = Number(properties.get('--r').toString());
    // let d = Number(properties.get('--d').toString());
    //
    // // Draw the spirograph
    // ctx.beginPath();
    // const coordinates = getEpitrochoidCoordinates(R, r, d);
    // // coordinates.forEach(([x, y]) => ctx.lineTo(x, y));
    //
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 1;
    // ctx.stroke();
  }
}

// Register our class under a specific name
registerPaint('checkerboard', CheckerboardPainter);
