class BlockPainter {
  static get inputProperties() {
    return ['--color', '--width'];
  }

  paint(ctx, geom, properties) {
    const color = properties.get('--color');
    const width = Number(properties.get('--width').toString());

    const colors = [color, 'blue'];

    for (let x = 0; x < geom.height / width; x += 1) {
      for (let y = 0; y < geom.width / width; y += 1) {
        ctx.beginPath();
        ctx.fillStyle = colors[(x + y) % colors.length]
        ctx.rect(x * width, y * width, width, geom.height);
        ctx.fill();
      }
    }
  }
}

registerPaint('block', BlockPainter);
