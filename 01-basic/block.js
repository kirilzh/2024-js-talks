class BlockPainter {
  static get inputProperties() {
    return ['--color'];
  }

  paint(ctx, geom, properties) {
    const color = properties.get('--color');

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(0, 0, geom.width, geom.height);
    ctx.fill();
  }
}

registerPaint('block', BlockPainter);
