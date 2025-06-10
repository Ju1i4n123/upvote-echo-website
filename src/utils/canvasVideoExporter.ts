
export const canvasVideoExporter = {
  createBackgroundFrames: (
    videoType: 'minecraft' | 'subway-surfers',
    duration: number,
    width: number = 540,
    height: number = 960
  ): string[] => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    
    const frames: string[] = [];
    const fps = 30;
    const totalFrames = duration * fps;
    
    // Theme colors based on video type
    const themes = {
      minecraft: {
        colors: ['#8B4513', '#228B22', '#4169E1', '#32CD32'],
        name: 'Minecraft'
      },
      'subway-surfers': {
        colors: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5'],
        name: 'Subway Surfers'
      }
    };
    
    const theme = themes[videoType];
    
    for (let i = 0; i < totalFrames; i++) {
      const time = i / fps;
      
      // Create themed gradient
      const gradient = ctx.createLinearGradient(
        0, 
        Math.sin(time * 0.5) * 200 + 480, 
        width, 
        Math.cos(time * 0.3) * 200 + 480
      );
      
      const colorIndex = Math.floor(time * 2) % theme.colors.length;
      const nextColorIndex = (colorIndex + 1) % theme.colors.length;
      
      gradient.addColorStop(0, theme.colors[colorIndex]);
      gradient.addColorStop(0.5, theme.colors[nextColorIndex]);
      gradient.addColorStop(1, theme.colors[(colorIndex + 2) % theme.colors.length]);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add themed elements
      if (videoType === 'minecraft') {
        // Add block-like shapes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let j = 0; j < 6; j++) {
          const x = (j % 3) * 180 + Math.sin(time + j) * 50;
          const y = Math.floor(j / 3) * 400 + 200 + Math.cos(time * 0.5 + j) * 100;
          const size = 60 + Math.sin(time * 2 + j) * 20;
          ctx.fillRect(x - size/2, y - size/2, size, size);
        }
      } else {
        // Add rail-like lines and moving elements for subway surfers
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 8;
        for (let j = 0; j < 3; j++) {
          const x = 135 + j * 135;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        
        // Add moving circles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let j = 0; j < 5; j++) {
          const x = 270 + Math.sin(time * 3 + j * 1.2) * 200;
          const y = ((time * 200 + j * 200) % 1200) - 120;
          const size = 30 + Math.sin(time * 4 + j) * 10;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      frames.push(canvas.toDataURL('image/png'));
    }
    
    return frames;
  }
};
